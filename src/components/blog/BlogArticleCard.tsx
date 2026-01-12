import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import { BlogArticle } from "@/hooks/useBlogArticles";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface BlogArticleCardProps {
  article: BlogArticle;
  variant?: "default" | "featured";
}

const BlogArticleCard = ({ article, variant = "default" }: BlogArticleCardProps) => {
  const isFeatured = variant === "featured";

  return (
    <Link
      to={`/blog/${article.slug}`}
      className={`group block ${isFeatured ? "col-span-full lg:col-span-2" : ""}`}
    >
      <article className={`relative overflow-hidden ${isFeatured ? "aspect-[4/3] lg:aspect-[21/9]" : "aspect-[4/3]"}`}>
        {/* Cover Image */}
        <div className="absolute inset-0 bg-muted">
          {article.cover_image_url ? (
            <img
              src={article.cover_image_url}
              alt={`${article.title} - Kiến thức rượu vang Selection Wine`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8">
          {/* Category */}
          {article.category && (
            <span className="inline-block self-start px-2.5 py-1 mb-2 text-[10px] sm:text-xs font-sans tracking-widest uppercase bg-background/90 text-foreground">
              {article.category.name}
            </span>
          )}

          {/* Title */}
          <h2
            className={`font-sans font-medium text-background mb-2  group-hover:underline underline-offset-4 break-words ${isFeatured ? "text-2xl sm:text-3xl lg:text-4xl" : "text-lg sm:text-xl lg:text-2xl"
              }`}
          >
            {article.title}
          </h2>

          {/* Excerpt - only on featured */}
          {isFeatured && article.excerpt && (
            <p className="text-background/80 text-xs sm:text-sm mb-3 sm:mb-4  max-w-2xl">
              {article.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-background/70 font-sans flex-wrap">
            <span className="truncate">{article.author?.display_name || "Tác giả"}</span>
            {article.published_at && (
              <span className="shrink-0">
                {format(new Date(article.published_at), "dd MMM yyyy", { locale: vi })}
              </span>
            )}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {article.view_count}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {article.likes_count || 0}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogArticleCard;
