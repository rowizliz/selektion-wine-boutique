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
    // Not JSON, treat as plain text
    isBlockContent = false;
  }

  // Render plain text or HTML content
  if (!isBlockContent) {
    // Check if content looks like HTML (starts with < or contains common HTML tags)
    const isHTML = content.trim().startsWith('<') || /<[a-z][\s\S]*>/i.test(content);

    if (isHTML) {
      return (
        <div
          className="max-w-[680px] mx-auto"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          <style>{`
            .nyt-content h2 {
              font-family: ui-sans-serif, system-ui, sans-serif;
              font-weight: 700;
              font-size: 1.75rem;
              line-height: 1.3;
              margin-top: 3rem;
              margin-bottom: 1.25rem;
              color: hsl(var(--foreground));
              letter-spacing: -0.02em;
            }
            .nyt-content h3 {
              font-family: ui-sans-serif, system-ui, sans-serif;
              font-weight: 600;
              font-size: 1.35rem;
              line-height: 1.35;
              margin-top: 2.5rem;
              margin-bottom: 1rem;
              color: hsl(var(--foreground));
            }
            .nyt-content p {
              font-size: 1.25rem;
              line-height: 1.75;
              margin-bottom: 1.5rem;
              color: hsl(var(--foreground) / 0.9);
            }
            .nyt-content strong {
              font-weight: 700;
              color: hsl(var(--foreground));
            }
            .nyt-content ul, .nyt-content ol {
              margin: 1.5rem 0;
              padding-left: 1.5rem;
            }
            .nyt-content li {
              font-size: 1.2rem;
              line-height: 1.7;
              margin-bottom: 0.75rem;
              color: hsl(var(--foreground) / 0.9);
            }
            .nyt-content a {
              color: hsl(var(--primary));
              text-decoration: underline;
              text-underline-offset: 3px;
            }
            .nyt-content a:hover {
              opacity: 0.8;
            }
            .nyt-content table {
              width: 100%;
              margin: 2rem 0;
              border-collapse: collapse;
            }
            .nyt-content th, .nyt-content td {
              padding: 0.75rem;
              border: 1px solid hsl(var(--border));
              text-align: left;
              font-size: 1rem;
              font-family: ui-sans-serif, system-ui, sans-serif;
            }
            .nyt-content th {
              background: hsl(var(--muted));
              font-weight: 600;
            }
            .nyt-content img {
              max-width: 100%;
              margin: 2rem 0;
              border-radius: 4px;
            }
          `}</style>
          <div
            className="nyt-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      );
    }

    return (
      <div
        className="prose prose-lg max-w-none 
          prose-headings:font-serif prose-headings:font-normal
          prose-p:text-foreground/90 prose-p:leading-relaxed
          prose-a:text-foreground prose-a:underline
          prose-strong:text-foreground prose-strong:font-medium
          prose-img:rounded-none
          dark:prose-invert"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {content}
      </div>
    );
  }

  // Render block content
  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        if (block.type === "text") {
          return (
            <div
              key={index}
              className="prose prose-lg max-w-none 
                prose-headings:font-serif prose-headings:font-normal
                prose-p:text-foreground/90 prose-p:leading-relaxed
                prose-a:text-foreground prose-a:underline
                prose-strong:text-foreground prose-strong:font-medium
                dark:prose-invert"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {block.content}
            </div>
          );
        }

        if (block.type === "image") {
          return (
            <figure key={index} className="my-8 flex flex-col items-center">
              <img
                src={block.url}
                alt={block.caption || ""}
                className="max-w-2xl w-full h-auto rounded-none object-contain"
              />
              {block.caption && (
                <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === "gallery" && block.images.length > 0) {
          return (
            <div key={index} className="my-8 max-w-2xl mx-auto">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {block.images.map((img, imgIndex) => (
                    <CarouselItem key={imgIndex}>
                      <figure>
                        <div className="aspect-[4/3] overflow-hidden flex items-center justify-center bg-muted/30">
                          <img
                            src={img.url}
                            alt={img.caption || ""}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        {img.caption && (
                          <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
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
              <div className="text-center text-xs text-muted-foreground mt-2">
                {block.images.length} ảnh
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default ArticleContent;
