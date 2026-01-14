import { useParams, Link } from "react-router-dom";

import { ArrowLeft, Eye, Calendar, User } from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogLikeButton from "@/components/blog/BlogLikeButton";
import BlogComments from "@/components/blog/BlogComments";
import ArticleContent from "@/components/blog/ArticleContent";
import { useBlogArticle } from "@/hooks/useBlogArticles";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = useBlogArticle(slug || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 lg:pt-24">
          <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
            Đang tải bài viết...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 lg:pt-24">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-serif mb-4">Không tìm thấy bài viết</h1>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground underline">
              Quay lại Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${article.title} | SÉLECTION Blog`}
        description={article.excerpt || article.title}
        image={article.cover_image_url || undefined}
        type="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "image": article.cover_image_url ? [article.cover_image_url] : [],
          "datePublished": article.published_at,
          "dateModified": article.updated_at,
          "author": {
            "@type": "Person",
            "name": article.author?.display_name || "SÉLECTION Wine"
          },
          "publisher": {
            "@type": "Organization",
            "name": "SÉLECTION Wine Boutique",
            "logo": {
              "@type": "ImageObject",
              "url": "https://selection.com.vn/favicon.png"
            }
          },
          "description": article.excerpt || article.title
        }}
      />

      <Header />

      <main className="min-h-screen pt-20 lg:pt-24">
        {/* Hero Image */}
        {article.cover_image_url && (
          <div className="relative h-[40vh] lg:h-[60vh] bg-muted">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Content */}
        <article className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-3xl mx-auto">
            {/* Back link & Category */}
            <div className="flex items-center gap-4 mb-8">
              <Link
                to="/blog"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                aria-label="Quay lại Blog"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              {article.category && (
                <span className="px-3 py-1 text-xs font-sans tracking-widest uppercase bg-muted text-foreground">
                  {article.category.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-5xl font-serif mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              {article.author?.display_name && (
                <div className="flex items-center gap-2">
                  {article.author.avatar_url ? (
                    <img
                      src={article.author.avatar_url}
                      alt={article.author.display_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span>{article.author.display_name}</span>
                </div>
              )}
              {article.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(article.published_at), "dd MMMM yyyy", { locale: vi })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{article.view_count} lượt xem</span>
              </div>
            </div>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg lg:text-xl text-muted-foreground mb-8 font-serif italic">
                {article.excerpt}
              </p>
            )}

            {/* Content */}
            <ArticleContent content={article.content} />

            {/* Like Button */}
            <div className="mt-12 pt-8 border-t border-border flex justify-center">
              <BlogLikeButton articleId={article.id} />
            </div>

            {/* Comments */}
            <div className="mt-12 pt-8 border-t border-border">
              <BlogComments articleId={article.id} isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
};

export default BlogDetail;
