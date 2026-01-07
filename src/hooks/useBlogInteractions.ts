import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BlogComment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export const useBlogComments = (articleId: string) => {
  return useQuery({
    queryKey: ["blog-comments", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_comments")
        .select(`
          *,
          user:user_profiles!blog_comments_user_id_fkey(id, display_name, avatar_url)
        `)
        .eq("article_id", articleId)
        .eq("is_approved", true)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as BlogComment[];
    },
    enabled: !!articleId,
  });
};

export const useUserLike = (articleId: string) => {
  return useQuery({
    queryKey: ["user-like", articleId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", user.user.id)
        .single();

      if (!profile) return null;

      const { data, error } = await supabase
        .from("blog_likes")
        .select("id")
        .eq("article_id", articleId)
        .eq("user_id", profile.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!articleId,
  });
};

export const useLikesCount = (articleId: string) => {
  return useQuery({
    queryKey: ["likes-count", articleId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("blog_likes")
        .select("*", { count: "exact", head: true })
        .eq("article_id", articleId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!articleId,
  });
};

export const useBlogInteractions = () => {
  const queryClient = useQueryClient();

  const toggleLike = useMutation({
    mutationFn: async ({ articleId, isLiked }: { articleId: string; isLiked: boolean }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Vui lòng đăng nhập để thích bài viết");

      // Get or create user profile
      let { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", user.user.id)
        .single();

      if (!profile) {
        const { data: newProfile, error: profileError } = await supabase
          .from("user_profiles")
          .insert({ user_id: user.user.id, display_name: user.user.email })
          .select("id")
          .single();
        
        if (profileError) throw profileError;
        profile = newProfile;
      }

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from("blog_likes")
          .delete()
          .eq("article_id", articleId)
          .eq("user_id", profile.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from("blog_likes")
          .insert({ article_id: articleId, user_id: profile.id });

        if (error) throw error;
      }
    },
    onSuccess: (_, { articleId }) => {
      queryClient.invalidateQueries({ queryKey: ["user-like", articleId] });
      queryClient.invalidateQueries({ queryKey: ["likes-count", articleId] });
    },
  });

  const addComment = useMutation({
    mutationFn: async ({ articleId, content }: { articleId: string; content: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Vui lòng đăng nhập để bình luận");

      // Get or create user profile
      let { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", user.user.id)
        .single();

      if (!profile) {
        const { data: newProfile, error: profileError } = await supabase
          .from("user_profiles")
          .insert({ user_id: user.user.id, display_name: user.user.email })
          .select("id")
          .single();
        
        if (profileError) throw profileError;
        profile = newProfile;
      }

      const { data, error } = await supabase
        .from("blog_comments")
        .insert({ article_id: articleId, user_id: profile.id, content })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { articleId }) => {
      queryClient.invalidateQueries({ queryKey: ["blog-comments", articleId] });
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("blog_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-comments"] });
    },
  });

  return { toggleLike, addComment, deleteComment };
};
