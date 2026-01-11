import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useBlogArticles } from "@/hooks/useBlogArticles";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import { Button } from "@/components/ui/button";

const LatestBlogPosts = () => {
    const { data: articles, isLoading } = useBlogArticles();

    // Only show first 3 articles
    const latestArticles = articles?.slice(0, 3);

    if (isLoading) {
        return null;
    }

    if (!latestArticles?.length) {
        return null;
    }

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-serif mb-4 text-primary">
                            Góc Chia Sẻ & Kiến Thức
                        </h2>
                        <p className="text-muted-foreground max-w-2xl">
                            Khám phá thế giới rượu vang, văn hóa tặng quà và những bí quyết thưởng thức
                            đẳng cấp từ chuyên gia Selection Wine.
                        </p>
                    </div>

                    <Button variant="outline" asChild className="hidden md:flex group">
                        <Link to="/blog">
                            Xem tất cả bài viết
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestArticles.map((article) => (
                        <BlogArticleCard key={article.id} article={article} />
                    ))}
                </div>

                <div className="mt-10 text-center md:hidden">
                    <Button variant="outline" asChild className="group">
                        <Link to="/blog">
                            Xem tất cả bài viết
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default LatestBlogPosts;
