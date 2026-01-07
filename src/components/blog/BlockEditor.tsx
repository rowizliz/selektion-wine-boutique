import { useState, useRef } from "react";
import { Plus, Type, Image, Images, Trash2, GripVertical, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface TextBlock {
  type: "text";
  content: string;
}

export interface ImageBlock {
  type: "image";
  url: string;
  caption?: string;
}

export interface GalleryBlock {
  type: "gallery";
  images: Array<{ url: string; caption?: string }>;
}

export type ContentBlock = TextBlock | ImageBlock | GalleryBlock;

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const BlockEditor = ({ blocks, onChange }: BlockEditorProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingBlockType, setPendingBlockType] = useState<"image" | "gallery" | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addBlock = (type: "text" | "image" | "gallery") => {
    if (type === "text") {
      onChange([...blocks, { type: "text", content: "" }]);
    } else if (type === "image") {
      setPendingBlockType("image");
      fileInputRef.current?.click();
    } else if (type === "gallery") {
      onChange([...blocks, { type: "gallery", images: [] }]);
    }
  };

  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const updateTextBlock = (index: number, content: string) => {
    const newBlocks = [...blocks];
    if (newBlocks[index].type === "text") {
      (newBlocks[index] as TextBlock).content = content;
      onChange(newBlocks);
    }
  };

  const updateImageCaption = (index: number, caption: string) => {
    const newBlocks = [...blocks];
    if (newBlocks[index].type === "image") {
      (newBlocks[index] as ImageBlock).caption = caption;
      onChange(newBlocks);
    }
  };

  const updateGalleryImageCaption = (blockIndex: number, imageIndex: number, caption: string) => {
    const newBlocks = [...blocks];
    if (newBlocks[blockIndex].type === "gallery") {
      (newBlocks[blockIndex] as GalleryBlock).images[imageIndex].caption = caption;
      onChange(newBlocks);
    }
  };

  const removeGalleryImage = (blockIndex: number, imageIndex: number) => {
    const newBlocks = [...blocks];
    if (newBlocks[blockIndex].type === "gallery") {
      (newBlocks[blockIndex] as GalleryBlock).images.splice(imageIndex, 1);
      onChange(newBlocks);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `articles/${fileName}`;

    const { error } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file);

    if (error) {
      toast({ title: "Lỗi tải ảnh", description: error.message, variant: "destructive" });
      return null;
    }

    const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, blockIndex?: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(blockIndex !== undefined ? `gallery-${blockIndex}` : "new");

    try {
      if (pendingBlockType === "image" || (blockIndex === undefined && !pendingBlockType)) {
        // Single image for new image block
        const url = await uploadImage(files[0]);
        if (url) {
          onChange([...blocks, { type: "image", url, caption: "" }]);
        }
      } else if (blockIndex !== undefined) {
        // Adding to existing gallery
        const newImages: Array<{ url: string; caption?: string }> = [];
        for (const file of Array.from(files)) {
          const url = await uploadImage(file);
          if (url) {
            newImages.push({ url, caption: "" });
          }
        }
        
        const newBlocks = [...blocks];
        if (newBlocks[blockIndex].type === "gallery") {
          (newBlocks[blockIndex] as GalleryBlock).images.push(...newImages);
          onChange(newBlocks);
        }
      }
    } finally {
      setUploading(null);
      setPendingBlockType(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    
    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[dragIndex];
    newBlocks.splice(dragIndex, 1);
    newBlocks.splice(index, 0, draggedBlock);
    onChange(newBlocks);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple={pendingBlockType === "gallery"}
        onChange={(e) => handleFileSelect(e)}
      />

      {/* Blocks */}
      {blocks.map((block, index) => (
        <div
          key={index}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`relative border border-border rounded-sm p-4 bg-card ${
            dragIndex === index ? "opacity-50" : ""
          }`}
        >
          {/* Block Header */}
          <div className="flex items-center gap-2 mb-3">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {block.type === "text" ? "Văn bản" : block.type === "image" ? "Hình ảnh" : "Slide ảnh"}
            </span>
            <div className="flex-1" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeBlock(index)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Text Block */}
          {block.type === "text" && (
            <Textarea
              value={block.content}
              onChange={(e) => updateTextBlock(index, e.target.value)}
              placeholder="Nhập nội dung văn bản..."
              rows={4}
            />
          )}

          {/* Image Block */}
          {block.type === "image" && (
            <div className="space-y-3">
              <div className="relative aspect-video bg-muted rounded-sm overflow-hidden">
                <img
                  src={block.url}
                  alt={block.caption || ""}
                  className="w-full h-full object-cover"
                />
              </div>
              <Input
                value={block.caption || ""}
                onChange={(e) => updateImageCaption(index, e.target.value)}
                placeholder="Chú thích hình ảnh (tùy chọn)"
              />
            </div>
          )}

          {/* Gallery Block */}
          {block.type === "gallery" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {block.images.map((img, imgIndex) => (
                  <div key={imgIndex} className="relative group">
                    <div className="aspect-square bg-muted rounded-sm overflow-hidden">
                      <img
                        src={img.url}
                        alt={img.caption || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeGalleryImage(index, imgIndex)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <Input
                      value={img.caption || ""}
                      onChange={(e) => updateGalleryImageCaption(index, imgIndex, e.target.value)}
                      placeholder="Chú thích"
                      className="mt-1 text-xs"
                    />
                  </div>
                ))}
                
                {/* Add more images button */}
                <label className="aspect-square border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, index)}
                    disabled={uploading === `gallery-${index}`}
                  />
                  {uploading === `gallery-${index}` ? (
                    <span className="text-xs text-muted-foreground">Đang tải...</span>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Thêm ảnh</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Block Buttons */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock("text")}
          className="gap-2"
        >
          <Type className="h-4 w-4" />
          Thêm Văn Bản
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock("image")}
          disabled={uploading === "new"}
          className="gap-2"
        >
          <Image className="h-4 w-4" />
          {uploading === "new" ? "Đang tải..." : "Thêm Ảnh"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock("gallery")}
          className="gap-2"
        >
          <Images className="h-4 w-4" />
          Thêm Slide Ảnh
        </Button>
      </div>
    </div>
  );
};

export default BlockEditor;
