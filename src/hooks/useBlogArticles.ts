import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BlogArticle {
  id: string;
  author_id: string;
  category_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  status: "draft" | "pending" | "published" | "rejected";
  view_count: number;
  admin_notes: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  likes_count?: number;
}

export const useBlogArticles = (categorySlug?: string, limit?: number) => {
  return useQuery({
    queryKey: ["blog-articles", categorySlug, limit],
    queryFn: async () => {
      let query = supabase
        .from("blog_articles")
        .select(`
          *,
          author:user_profiles!blog_articles_author_id_fkey(id, display_name, avatar_url),
          category:blog_categories!blog_articles_category_id_fkey(id, name, slug)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (categorySlug) {
        query = query.eq("category.slug", categorySlug);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter out articles that don't match category (due to left join behavior)
      const filteredData = categorySlug
        ? data?.filter(article => article.category?.slug === categorySlug)
        : data;

      return filteredData as BlogArticle[];
    },
  });
};

export const useBlogArticle = (slug: string) => {
  return useQuery({
    queryKey: ["blog-article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_articles")
        .select(`
          *,
          author:user_profiles!blog_articles_author_id_fkey(id, display_name, avatar_url),
          category:blog_categories!blog_articles_category_id_fkey(id, name, slug)
        `)
        .eq("slug", slug)
        .single();

      if (error) throw error;

      // Get likes count
      const { count } = await supabase
        .from("blog_likes")
        .select("*", { count: "exact", head: true })
        .eq("article_id", data.id);

      // Increment view count
      await supabase
        .from("blog_articles")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", data.id);

      return { ...data, likes_count: count || 0 } as BlogArticle;
    },
    enabled: !!slug,
  });
};

export const useMyArticles = () => {
  return useQuery({
    queryKey: ["my-articles"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      // Get user profile
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", user.user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      const { data, error } = await supabase
        .from("blog_articles")
        .select(`
          id,
          author_id,
          category_id,
          title,
          slug,
          excerpt,
          content,
          cover_image_url,
          status,
          view_count,
          published_at,
          created_at,
          updated_at,
          author:user_profiles!blog_articles_author_id_fkey(id, display_name, avatar_url),
          category:blog_categories!blog_articles_category_id_fkey(id, name, slug)
        `)
        .eq("author_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BlogArticle[];
    },
  });
};

export const useAllArticles = () => {
  return useQuery({
    queryKey: ["all-articles-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_articles")
        .select(`
          *,
          category:blog_categories!blog_articles_category_id_fkey(id, name, slug)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map data to include author as null (bypasses RLS on user_profiles)
      return (data || []).map(article => ({
        ...article,
        author: null
      })) as BlogArticle[];
    },
  });
};

export const useArticleMutations = () => {
  const queryClient = useQueryClient();

  const createArticle = useMutation({
    mutationFn: async (article: {
      title: string;
      slug: string;
      excerpt?: string;
      content: string;
      cover_image_url?: string;
      category_id?: string;
      status: "draft" | "pending";
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      // Get or create user profile
      let { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", user.user.id)
        .single();

      if (!profile) {
        const { data: newProfile, error: profileError } = await supabase
          .from("user_profiles")
          .insert({ user_id: user.user.id })
          .select("id")
          .single();

        if (profileError) throw profileError;
        profile = newProfile;
      }

      const { data, error } = await supabase
        .from("blog_articles")
        .insert({ ...article, author_id: profile.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-articles"] });
      queryClient.invalidateQueries({ queryKey: ["all-articles-admin"] });
    },
  });

  const updateArticle = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BlogArticle> & { id: string }) => {
      const { data, error } = await supabase
        .from("blog_articles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-articles"] });
      queryClient.invalidateQueries({ queryKey: ["all-articles-admin"] });
      queryClient.invalidateQueries({ queryKey: ["blog-articles"] });
    },
  });

  const deleteArticle = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_articles")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-articles"] });
      queryClient.invalidateQueries({ queryKey: ["all-articles-admin"] });
      queryClient.invalidateQueries({ queryKey: ["blog-articles"] });
    },
  });

  return { createArticle, updateArticle, deleteArticle };
};
