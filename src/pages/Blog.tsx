import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import BlogCategoryTabs from "@/components/blog/BlogCategoryTabs";
import { Input } from "@/components/ui/input";
import { useBlogArticles } from "@/hooks/useBlogArticles";
import { useBlogCategories } from "@/hooks/useBlogCategories";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: categories, isLoading: isLoadingCategories } = useBlogCategories();
  const { data: articles, isLoading: isLoadingArticles } = useBlogArticles(activeCategory || undefined);

  // Filter articles by search query
  const filteredArticles = articles?.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredArticle = filteredArticles?.[0];
  const otherArticles = filteredArticles?.slice(1);

  return (
    <>
      <Helmet>
        <title>Blog | SÉLECTION - Tin Tức & Kiến Thức Rượu Vang</title>
        <meta
          name="description"
          content="Khám phá thế giới rượu vang qua các bài viết chuyên sâu về vang Pháp, vang Ý, ẩm thực và cách thưởng thức."
        />
      </Helmet>

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
          {!isLoadingCategories && categories && (
            <BlogCategoryTabs
              categories={categories.filter(c => c.is_active)}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          )}
        </section>

        {/* Articles Grid */}
        <section className="container mx-auto px-4 pb-16 lg:pb-24">
          {isLoadingArticles ? (
            <div className="text-center text-muted-foreground py-12">
              Đang tải bài viết...
            </div>
          ) : !filteredArticles?.length ? (
            <div className="text-center text-muted-foreground py-12">
              {searchQuery
                ? "Không tìm thấy bài viết phù hợp"
                : "Chưa có bài viết nào trong danh mục này"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Featured Article */}
              {featuredArticle && (
                <BlogArticleCard article={featuredArticle} variant="featured" />
              )}

              {/* Other Articles */}
              {otherArticles?.map((article) => (
                <BlogArticleCard key={article.id} article={article} />
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
