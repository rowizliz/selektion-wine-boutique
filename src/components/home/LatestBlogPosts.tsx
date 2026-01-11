import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SAMPLE_BLOG_POSTS } from "@/data/sample-blogs";
import { Button } from "@/components/ui/button";

const LatestBlogPosts = () => {
    // Use first 3 static blog posts
    const articles = SAMPLE_BLOG_POSTS.slice(0, 3).map((post, index) => ({
        id: `static-${index}`,
        ...post,
        author: { display_name: "SÉLECTION Wine" },
    }));

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
                    {articles.map((article) => (
                        <Link
                            key={article.id}
                            to={`/blog/${article.slug}`}
                            className="group block"
                        >
                            <article className="relative overflow-hidden aspect-[4/3] rounded-lg">
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
                                    <h3 className="font-serif text-background mb-2 text-xl line-clamp-2 group-hover:underline underline-offset-4">
                                        {article.title}
                                    </h3>
                                    <p className="text-background/70 text-sm line-clamp-2">
                                        {article.excerpt}
                                    </p>
                                </div>
                            </article>
                        </Link>
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
