import { ContentBlock } from "./BlockEditor";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ArticleContentProps {
  content: string;
}

// Professional magazine-style CSS
const articleStyles = `
  .article-prose {
    font-family: 'Georgia', 'Times New Roman', serif;
    max-width: 720px;
    margin: 0 auto;
  }
  
  .article-prose h2 {
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    font-weight: 700;
    font-size: 1.875rem;
    line-height: 1.25;
    margin-top: 3rem;
    margin-bottom: 1.25rem;
    color: hsl(var(--foreground));
    letter-spacing: -0.025em;
    border-bottom: 2px solid hsl(var(--border));
    padding-bottom: 0.75rem;
  }
  
  .article-prose h3 {
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    font-weight: 600;
    font-size: 1.375rem;
    line-height: 1.35;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    color: hsl(var(--foreground));
    letter-spacing: -0.01em;
  }
  
  .article-prose h4 {
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    font-weight: 600;
    font-size: 1.125rem;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    color: hsl(var(--foreground));
  }
  
  .article-prose p {
    font-size: 1.1875rem;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    color: hsl(var(--foreground) / 0.88);
  }
  
  .article-prose p:first-of-type {
    font-size: 1.25rem;
  }
  
  .article-prose strong, .article-prose b {
    font-weight: 700;
    color: hsl(var(--foreground));
  }
  
  .article-prose ul, .article-prose ol {
    margin: 1.75rem 0;
    padding-left: 0;
    list-style: none;
  }
  
  .article-prose ul li, .article-prose ol li {
    font-size: 1.125rem;
    line-height: 1.75;
    margin-bottom: 0.875rem;
    color: hsl(var(--foreground) / 0.88);
    padding-left: 1.75rem;
    position: relative;
  }
  
  .article-prose ul li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.65em;
    width: 6px;
    height: 6px;
    background: hsl(var(--primary));
    border-radius: 50%;
  }
  
  .article-prose ol {
    counter-reset: ol-counter;
  }
  
  .article-prose ol li {
    counter-increment: ol-counter;
  }
  
  .article-prose ol li::before {
    content: counter(ol-counter) ".";
    position: absolute;
    left: 0;
    font-weight: 600;
    color: hsl(var(--primary));
    font-family: ui-sans-serif, system-ui, sans-serif;
  }
  
  .article-prose a {
    color: hsl(var(--primary));
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: opacity 0.2s;
  }
  
  .article-prose a:hover {
    opacity: 0.7;
  }
  
  .article-prose blockquote {
    margin: 2.5rem 0;
    padding: 1.5rem 2rem;
    border-left: 4px solid hsl(var(--primary));
    background: hsl(var(--muted) / 0.5);
    font-style: italic;
    font-size: 1.25rem;
    line-height: 1.7;
  }
  
  .article-prose table {
    width: 100%;
    margin: 2rem 0;
    border-collapse: collapse;
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: 0.95rem;
  }
  
  .article-prose th, .article-prose td {
    padding: 0.875rem 1rem;
    border: 1px solid hsl(var(--border));
    text-align: left;
  }
  
  .article-prose th {
    background: hsl(var(--muted));
    font-weight: 600;
    color: hsl(var(--foreground));
  }
  
  .article-prose img {
    max-width: 100%;
    height: auto;
    margin: 2.5rem auto;
    border-radius: 8px;
    display: block;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
  
  .article-prose hr {
    border: none;
    border-top: 1px solid hsl(var(--border));
    margin: 3rem 0;
  }
  
  .article-prose .blog-content {
    all: unset;
    display: block;
  }
  
  /* Info box style */
  .article-prose .info-box {
    background: hsl(var(--muted));
    padding: 1.5rem;
    border-radius: 8px;
    margin: 2rem 0;
  }
  
  /* Rating stars */
  .article-prose .rating {
    font-size: 1.5rem;
    color: #f59e0b;
  }
`;

const ArticleContent = ({ content }: ArticleContentProps) => {
  // Try to parse as JSON blocks
  let blocks: ContentBlock[] = [];
  let isBlockContent = false;

  try {
    const parsed = JSON.parse(content);
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      blocks = parsed.blocks;
      isBlockContent = true;
    }
  } catch {
    // Not JSON, treat as plain text or HTML
    isBlockContent = false;
  }

  // Render plain text or HTML content
  if (!isBlockContent) {
    // Better HTML detection - check for common tags
    const hasHTMLTags = /<(div|p|h[1-6]|ul|ol|li|strong|em|a|table|img|blockquote|br|span)[^>]*>/i.test(content);

    if (hasHTMLTags) {
      // Clean up the content - remove outer blog-content div if exists
      let cleanContent = content;

      return (
        <>
          <style>{articleStyles}</style>
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        </>
      );
    }

    // Plain text - render with pre-wrap
    return (
      <>
        <style>{articleStyles}</style>
        <div className="article-prose">
          <div style={{ whiteSpace: "pre-wrap" }}>
            {content}
          </div>
        </div>
      </>
    );
  }

  // Render block content
  return (
    <>
      <style>{articleStyles}</style>
      <div className="article-prose space-y-8">
        {blocks.map((block, index) => {
          if (block.type === "text") {
            // Check if the text block contains HTML
            const hasHTML = /<[^>]+>/.test(block.content);

            if (hasHTML) {
              return (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              );
            }

            return (
              <div key={index} style={{ whiteSpace: "pre-wrap" }}>
                {block.content}
              </div>
            );
          }

          if (block.type === "image") {
            return (
              <figure key={index} className="my-10 flex flex-col items-center">
                <img
                  src={block.url}
                  alt={block.caption || ""}
                  className="max-w-2xl w-full h-auto rounded-lg object-contain shadow-lg"
                />
                {block.caption && (
                  <figcaption className="text-center text-sm text-muted-foreground mt-4 italic font-sans">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          if (block.type === "gallery" && block.images.length > 0) {
            return (
              <div key={index} className="my-10 max-w-2xl mx-auto">
                <Carousel className="w-full" opts={{ loop: true }}>
                  <CarouselContent>
                    {block.images.map((img, imgIndex) => (
                      <CarouselItem key={imgIndex}>
                        <figure>
                          <div className="aspect-[4/3] overflow-hidden flex items-center justify-center bg-muted/30 rounded-lg">
                            <img
                              src={img.url}
                              alt={img.caption || ""}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          {img.caption && (
                            <figcaption className="text-center text-sm text-muted-foreground mt-4 italic font-sans">
                              {img.caption}
                            </figcaption>
                          )}
                        </figure>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {block.images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
                <div className="text-center text-xs text-muted-foreground mt-3 font-sans">
                  {block.images.length} ảnh
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </>
  );
};

export default ArticleContent;

