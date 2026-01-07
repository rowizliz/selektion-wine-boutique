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

  // Render plain text content
  if (!isBlockContent) {
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
            <figure key={index} className="my-8">
              <img
                src={block.url}
                alt={block.caption || ""}
                className="w-full h-auto rounded-none"
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
            <div key={index} className="my-8">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {block.images.map((img, imgIndex) => (
                    <CarouselItem key={imgIndex}>
                      <figure>
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={img.url}
                            alt={img.caption || ""}
                            className="w-full h-full object-cover"
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
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
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
