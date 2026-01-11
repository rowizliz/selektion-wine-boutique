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
            prose-headings:font-serif prose-headings:font-normal prose-headings:text-foreground
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-primary
            prose-p:text-foreground/85 prose-p:leading-[1.85] prose-p:mb-5 prose-p:text-base
            prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-primary/80
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
            prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-foreground/85 prose-li:mb-2 prose-li:leading-relaxed
            prose-table:my-8 prose-table:border-collapse prose-table:w-full
            prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:font-medium
            prose-td:border prose-td:border-border prose-td:p-3
            prose-img:rounded-lg prose-img:my-8
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground
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
