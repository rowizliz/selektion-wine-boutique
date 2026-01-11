import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { SAMPLE_BLOG_POSTS } from "@/data/sample-blogs";
import { Link } from "react-router-dom";

// Static categories for filtering
const STATIC_CATEGORIES = [
  { slug: "all", name: "Tất Cả" },
  { slug: "huong-dan", name: "Hướng Dẫn" },
  { slug: "qua-tang", name: "Quà Tặng" },
  { slug: "kien-thuc", name: "Kiến Thức" },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Transform static data to match expected format
  const articles = useMemo(() => {
    return SAMPLE_BLOG_POSTS.map((post, index) => ({
      id: `static-${index}`,
      ...post,
      author: { display_name: "SÉLECTION Wine", avatar_url: null },
      category: null,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes_count: Math.floor(Math.random() * 50) + 10,
    }));
  }, []);

  // Filter articles by search query
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredArticle = filteredArticles[0];
  const otherArticles = filteredArticles.slice(1);

  return (
    <>
      <SEO
        title="Blog Rượu Vang | Kiến Thức & Tin Tức Selection Wine"
        description="Khám phá kiến thức rượu vang: cách thưởng thức, food pairing, vùng vang nổi tiếng. Blog chia sẻ từ SÉLECTION Wine Thủ Đức. Bài viết chuyên sâu về vang Pháp, vang Ý."
        keywords={[
          "kiến thức rượu vang", "cách uống rượu vang", "blog rượu vang",
          "tin tức rượu vang", "food pairing rượu vang", "cách thưởng thức vang"
        ]}
      />

      <Header />

      <main className="min-h-screen pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-serif mb-4">Blog</h1>
            <p className="text-muted-foreground">
              Khám phá thế giới rượu vang qua những câu chuyện, kiến thức và trải nghiệm
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {STATIC_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 text-sm font-sans tracking-wider uppercase border transition-colors ${activeCategory === cat.slug
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-foreground border-border hover:border-foreground"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Articles Grid */}
        <section className="container mx-auto px-4 pb-16 lg:pb-24">
          {!filteredArticles.length ? (
            <div className="text-center text-muted-foreground py-12">
              {searchQuery
                ? "Không tìm thấy bài viết phù hợp"
                : "Chưa có bài viết nào trong danh mục này"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Featured Article */}
              {featuredArticle && (
                <Link
                  to={`/blog/${featuredArticle.slug}`}
                  className="group block col-span-full lg:col-span-2"
                >
                  <article className="relative overflow-hidden aspect-[21/9]">
                    <div className="absolute inset-0 bg-muted">
                      {featuredArticle.cover_image_url ? (
                        <img
                          src={featuredArticle.cover_image_url}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                      <h2 className="font-serif text-background mb-2 text-3xl lg:text-4xl line-clamp-2 group-hover:underline underline-offset-4">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-background/80 text-sm mb-4 line-clamp-2 max-w-2xl">
                        {featuredArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-background/70 font-sans">
                        <span>{featuredArticle.author?.display_name}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Other Articles */}
              {otherArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="group block"
                >
                  <article className="relative overflow-hidden aspect-[4/3]">
                    <div className="absolute inset-0 bg-muted">
                      {article.cover_image_url ? (
                        <img
                          src={article.cover_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h2 className="font-serif text-background mb-2 text-xl lg:text-2xl line-clamp-2 group-hover:underline underline-offset-4">
                        {article.title}
                      </h2>
                      <div className="flex items-center gap-4 text-xs text-background/70 font-sans">
                        <span>{article.author?.display_name}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
