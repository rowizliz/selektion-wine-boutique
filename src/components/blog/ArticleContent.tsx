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
          className="prose prose-lg max-w-none 
            prose-headings:font-serif prose-headings:font-normal
            prose-p:text-foreground/90 prose-p:leading-relaxed
            prose-a:text-foreground prose-a:underline
            prose-strong:text-foreground prose-strong:font-medium
            prose-img:rounded-none
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-foreground/90
            prose-table:border-collapse prose-th:border prose-th:p-2 prose-td:border prose-td:p-2
            dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: content }}
        />
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
