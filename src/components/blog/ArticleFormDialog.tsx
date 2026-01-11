import { useState, useEffect, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBlogCategories, BlogCategory } from "@/hooks/useBlogCategories";
import { useArticleMutations, BlogArticle } from "@/hooks/useBlogArticles";
import BlockEditor, { ContentBlock } from "./BlockEditor";

interface ArticleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: BlogArticle;
  isAdmin?: boolean;
}

const ArticleFormDialog = ({ open, onOpenChange, article, isAdmin = false }: ArticleFormDialogProps) => {
  const { toast } = useToast();
  const { data: categories } = useBlogCategories();
  const { createArticle, updateArticle } = useArticleMutations();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    category_id: "",
    cover_image_url: "",
    author_name: "",
  });
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [coverUploading, setCoverUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog opens/closes or article changes
  useEffect(() => {
    if (open) {
      if (article) {
        setForm({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || "",
          category_id: article.category_id || "",
          cover_image_url: article.cover_image_url || "",
          author_name: article.author?.display_name || "",
        });

        // Parse content blocks
        try {
          const parsed = JSON.parse(article.content);
          if (parsed.blocks) {
            setBlocks(parsed.blocks);
          } else {
            setBlocks([{ type: "text", content: article.content }]);
          }
        } catch {
          // Legacy HTML content - strip tags and convert to plain text
          const stripHtml = (html: string): string => {
            // Remove HTML tags and convert common elements to readable text
            return html
              .replace(/<h[1-6][^>]*>/gi, '\n\n## ')
              .replace(/<\/h[1-6]>/gi, '\n')
              .replace(/<li[^>]*>/gi, '\n• ')
              .replace(/<\/li>/gi, '')
              .replace(/<p[^>]*>/gi, '\n')
              .replace(/<\/p>/gi, '\n')
              .replace(/<br\s*\/?>/gi, '\n')
              .replace(/<ul[^>]*>|<\/ul>|<ol[^>]*>|<\/ol>/gi, '')
              .replace(/<strong[^>]*>|<\/strong>/gi, '')
              .replace(/<em[^>]*>|<\/em>/gi, '')
              .replace(/<[^>]+>/g, '') // Remove remaining tags
              .replace(/&nbsp;/g, ' ')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
              .trim();
          };
          const plainText = stripHtml(article.content);
          setBlocks([{ type: "text", content: plainText }]);
        }
      } else {
        // Load current user's display name for new articles
        (async () => {
          const { data: user } = await supabase.auth.getUser();
          if (user.user) {
            const { data: profile } = await supabase
              .from("user_profiles")
              .select("display_name")
              .eq("user_id", user.user.id)
              .single();
            if (profile?.display_name) {
              setForm(prev => ({ ...prev, author_name: profile.display_name || "" }));
            }
          }
        })();

        setForm({
          title: "",
          slug: "",
          excerpt: "",
          category_id: "",
          cover_image_url: "",
          author_name: "",
        });
        setBlocks([]);
      }
    }
  }, [open, article]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `covers/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage.from("blog-images").getPublicUrl(fileName);
      setForm((prev) => ({ ...prev, cover_image_url: data.publicUrl }));
      toast({ title: "Đã tải ảnh bìa lên" });
    } catch (error: any) {
      toast({ title: "Lỗi tải ảnh", description: error.message, variant: "destructive" });
    } finally {
      setCoverUploading(false);
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
  };

  const handleSave = async (status: "draft" | "pending" | "published") => {
    if (!form.title.trim()) {
      toast({ title: "Vui lòng nhập tiêu đề", variant: "destructive" });
      return;
    }

    if (!form.slug.trim()) {
      toast({ title: "Vui lòng nhập slug", variant: "destructive" });
      return;
    }

    if (!form.author_name.trim()) {
      toast({ title: "Vui lòng nhập tên tác giả", variant: "destructive" });
      return;
    }

    const content = JSON.stringify({ blocks });

    setSaving(true);
    try {
      // Update author display name in user_profiles
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        await supabase
          .from("user_profiles")
          .update({ display_name: form.author_name.trim() })
          .eq("user_id", user.user.id);
      }

      if (article) {
        await updateArticle.mutateAsync({
          id: article.id,
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt || null,
          content,
          category_id: form.category_id || null,
          cover_image_url: form.cover_image_url || null,
          status,
          published_at: status === "published" ? new Date().toISOString() : article.published_at,
        });
        toast({ title: "Đã cập nhật bài viết" });
      } else {
        await createArticle.mutateAsync({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt || undefined,
          content,
          category_id: form.category_id || undefined,
          cover_image_url: form.cover_image_url || undefined,
          status: status === "published" ? "pending" : status, // Non-admin: published -> pending
        });
        toast({ title: status === "draft" ? "Đã lưu nháp" : "Đã gửi bài viết để duyệt" });
      }
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="font-serif text-xl">
            {article ? "Chỉnh Sửa Bài Viết" : "Viết Bài Mới"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author_name">Tên tác giả *</Label>
                <Input
                  id="author_name"
                  value={form.author_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, author_name: e.target.value }))}
                  placeholder="Nhập tên hiển thị của bạn"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="tieu-de-bai-viet"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <Select
                  value={form.category_id}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ảnh bìa</Label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={coverInputRef}
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={coverUploading}
                    className="flex-1"
                  >
                    {coverUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {form.cover_image_url ? "Thay đổi" : "Tải lên"}
                  </Button>
                  {form.cover_image_url && (
                    <div className="w-16 h-10 bg-muted rounded-sm overflow-hidden">
                      <img
                        src={form.cover_image_url}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Mô tả ngắn</Label>
              <Textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Tóm tắt nội dung bài viết..."
                rows={2}
              />
            </div>

            {/* Content Blocks */}
            <div className="space-y-2">
              <Label>Nội dung bài viết</Label>
              <BlockEditor blocks={blocks} onChange={setBlocks} />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Hủy
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSave("draft")}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Lưu Nháp
          </Button>
          <Button onClick={() => handleSave(isAdmin ? "published" : "pending")} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isAdmin ? "Xuất Bản" : "Gửi Duyệt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleFormDialog;
