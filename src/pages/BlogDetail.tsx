import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, Calendar, User, Heart } from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArticleContent from "@/components/blog/ArticleContent";
import { SAMPLE_BLOG_POSTS } from "@/data/sample-blogs";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10);

  // Find article from static data
  const article = useMemo(() => {
    const found = SAMPLE_BLOG_POSTS.find((post) => post.slug === slug);
    if (!found) return null;

    return {
      ...found,
      id: `static-${slug}`,
      author: { display_name: "SÉLECTION Wine", avatar_url: null },
      category: null,
      published_at: new Date().toISOString(),
      view_count: Math.floor(Math.random() * 500) + 100,
    };
  }, [slug]);

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  if (!article) {
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
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          </div>
        )}

        {/* Content */}
        <article className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <div className="flex items-center gap-4 mb-8">
              <Link
                to="/blog"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                aria-label="Quay lại Blog"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-5xl font-serif mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author?.display_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(article.published_at), "dd MMMM yyyy", { locale: vi })}
                </span>
              </div>
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
              <Button
                variant={liked ? "default" : "outline"}
                onClick={handleLike}
                className="flex items-center gap-2"
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                <span>{likeCount} Yêu thích</span>
              </Button>
            </div>

            {/* Share & Related */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-serif mb-6">Bài viết liên quan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_BLOG_POSTS.filter((p) => p.slug !== slug)
                  .slice(0, 2)
                  .map((post) => (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      className="group flex gap-4 p-4 border border-border rounded-lg hover:border-foreground transition-colors"
                    >
                      {post.cover_image_url && (
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm group-hover:underline line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
};

export default BlogDetail;
