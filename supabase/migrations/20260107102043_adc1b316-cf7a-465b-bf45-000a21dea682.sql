-- Create user_profiles table for storing display names and avatars
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Anyone can view user profiles"
ON public.user_profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
ON public.user_profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Create blog_categories table
CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on blog_categories
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for blog_categories
CREATE POLICY "Anyone can view active categories"
ON public.blog_categories FOR SELECT
USING (is_active = true OR is_admin());

CREATE POLICY "Only admin can insert categories"
ON public.blog_categories FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Only admin can update categories"
ON public.blog_categories FOR UPDATE
USING (is_admin());

CREATE POLICY "Only admin can delete categories"
ON public.blog_categories FOR DELETE
USING (is_admin());

-- Create blog_articles table
CREATE TABLE public.blog_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  cover_image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'rejected')),
  view_count integer NOT NULL DEFAULT 0,
  admin_notes text,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on blog_articles
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

-- RLS policies for blog_articles
CREATE POLICY "Anyone can view published articles"
ON public.blog_articles FOR SELECT
USING (
  status = 'published' 
  OR is_admin() 
  OR author_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Authenticated users can insert articles"
ON public.blog_articles FOR INSERT
WITH CHECK (
  author_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid())
  AND status IN ('draft', 'pending')
);

CREATE POLICY "Authors can update own draft/pending/rejected articles"
ON public.blog_articles FOR UPDATE
USING (
  is_admin() 
  OR (
    author_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid())
    AND status IN ('draft', 'pending', 'rejected')
  )
);

CREATE POLICY "Only admin can delete articles"
ON public.blog_articles FOR DELETE
USING (is_admin());

-- Create blog_comments table
CREATE TABLE public.blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES public.blog_articles(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_approved boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on blog_comments
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for blog_comments
CREATE POLICY "Anyone can view approved comments"
ON public.blog_comments FOR SELECT
USING (is_approved = true OR is_admin() OR user_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authenticated users can insert comments"
ON public.blog_comments FOR INSERT
WITH CHECK (user_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own comments"
ON public.blog_comments FOR UPDATE
USING (is_admin() OR user_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admin can delete any comment, users can delete own"
ON public.blog_comments FOR DELETE
USING (is_admin() OR user_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid()));

-- Create blog_likes table
CREATE TABLE public.blog_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES public.blog_articles(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(article_id, user_id)
);

-- Enable RLS on blog_likes
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies for blog_likes
CREATE POLICY "Anyone can view likes"
ON public.blog_likes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert likes"
ON public.blog_likes FOR INSERT
WITH CHECK (user_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own likes"
ON public.blog_likes FOR DELETE
USING (user_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid()));

-- Create function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create profile
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- Create updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_articles_updated_at
  BEFORE UPDATE ON public.blog_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON public.blog_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.blog_categories (name, slug, description, display_order) VALUES
  ('Vang Pháp', 'vang-phap', 'Các bài viết về rượu vang Pháp', 1),
  ('Vang Ý', 'vang-y', 'Các bài viết về rượu vang Ý', 2),
  ('Ẩm Thực', 'am-thuc', 'Ẩm thực và cách kết hợp với rượu vang', 3),
  ('Kiến Thức Rượu', 'kien-thuc-ruou', 'Kiến thức cơ bản về rượu vang', 4),
  ('Tin Tức', 'tin-tuc', 'Tin tức và sự kiện', 5);

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Storage policies for blog-images bucket
CREATE POLICY "Anyone can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);