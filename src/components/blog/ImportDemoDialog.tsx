import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Trash2, Upload, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SAMPLE_BLOG_POSTS } from "@/data/sample-blogs";
import { supabase } from "@/integrations/supabase/client";

interface ImportDemoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onImportComplete: () => void;
}

interface DemoArticle {
    title: string;
    slug: string;
    excerpt: string;
    cover_image_url: string;
    selected: boolean;
}

const ImportDemoDialog = ({ open, onOpenChange, onImportComplete }: ImportDemoDialogProps) => {
    const { toast } = useToast();
    const [demoArticles, setDemoArticles] = useState<DemoArticle[]>([]);
    const [isImporting, setIsImporting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Load demo articles from SAMPLE_BLOG_POSTS
    useEffect(() => {
        if (open) {
            setDemoArticles(
                SAMPLE_BLOG_POSTS.map((post) => ({
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt,
                    cover_image_url: post.cover_image_url,
                    selected: false,
                }))
            );
            setShowDeleteConfirm(false);
        }
    }, [open]);

    const selectedCount = demoArticles.filter((a) => a.selected).length;

    const handleSelectAll = () => {
        const allSelected = demoArticles.every((a) => a.selected);
        setDemoArticles(demoArticles.map((a) => ({ ...a, selected: !allSelected })));
    };

    const handleToggle = (index: number) => {
        setDemoArticles(
            demoArticles.map((a, i) => (i === index ? { ...a, selected: !a.selected } : a))
        );
    };

    const handleImportSelected = async () => {
        if (selectedCount === 0) {
            toast({ title: "Vui lòng chọn ít nhất 1 bài viết", variant: "destructive" });
            return;
        }

        setIsImporting(true);
        try {
            // Get current user
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) {
                toast({ title: "Vui lòng đăng nhập", variant: "destructive" });
                return;
            }

            // Get user profile ID
            const { data: profileData, error: profileError } = await supabase
                .from("user_profiles")
                .select("id")
                .eq("user_id", userData.user.id)
                .single();

            if (profileError || !profileData) {
                toast({ title: "Không tìm thấy profile. Vui lòng đăng nhập lại.", variant: "destructive" });
                return;
            }

            const authorId = profileData.id;
            const timestamp = Date.now();
            let successCount = 0;

            const selectedArticles = demoArticles.filter((a) => a.selected);
            const originalPosts = SAMPLE_BLOG_POSTS.filter((post) =>
                selectedArticles.some((a) => a.slug === post.slug)
            );

            for (const post of originalPosts) {
                const newSlug = `${post.slug}-${timestamp}`;

                const { error } = await supabase.from("blog_articles").insert({
                    title: post.title,
                    slug: newSlug,
                    excerpt: post.excerpt,
                    content: post.content,
                    cover_image_url: post.cover_image_url,
                    status: "draft",
                    author_id: authorId,
                    category_id: null,
                    published_at: null,
                });

                if (!error) {
                    successCount++;
                } else {
                    console.error("Insert error:", error);
                }
            }

            if (successCount > 0) {
                toast({ title: `Đã import ${successCount} bài viết vào mục Nháp` });
                onOpenChange(false);
                onImportComplete();
            } else {
                toast({ title: "Không thể import. Kiểm tra console.", variant: "destructive" });
            }
        } catch (error: any) {
            toast({ title: "Lỗi import", description: error.message, variant: "destructive" });
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Import Bài Viết Demo
                    </DialogTitle>
                    <DialogDescription>
                        Chọn các bài viết demo để import vào mục Nháp. Có {SAMPLE_BLOG_POSTS.length} bài viết sẵn có.
                    </DialogDescription>
                </DialogHeader>

                {showDeleteConfirm ? (
                    <div className="py-8 text-center">
                        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Tính năng đang phát triển</h3>
                        <p className="text-muted-foreground mb-4">
                            Để xóa vĩnh viễn demo data, bạn cần chỉnh sửa file <code className="bg-muted px-1 rounded">src/data/sample-blogs.ts</code> trực tiếp.
                        </p>
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                            Quay lại
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between py-2 border-b">
                            <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                                {demoArticles.every((a) => a.selected) ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                            </Button>
                            <Badge variant="secondary">
                                Đã chọn: {selectedCount}/{demoArticles.length}
                            </Badge>
                        </div>

                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-2">
                                {demoArticles.map((article, index) => (
                                    <div
                                        key={article.slug}
                                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${article.selected ? "bg-primary/5 border-primary/30" : "hover:bg-muted/50"
                                            }`}
                                        onClick={() => handleToggle(index)}
                                    >
                                        <Checkbox
                                            checked={article.selected}
                                            onCheckedChange={() => handleToggle(index)}
                                            className="mt-1"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm line-clamp-1">{article.title}</h4>
                                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                {article.excerpt}
                                            </p>
                                        </div>
                                        {article.cover_image_url && (
                                            <img
                                                src={article.cover_image_url}
                                                alt=""
                                                className="w-16 h-12 object-cover rounded"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa Demo Data
                            </Button>
                            <div className="flex-1" />
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handleImportSelected} disabled={isImporting || selectedCount === 0}>
                                {isImporting ? "Đang import..." : `Import ${selectedCount} bài`}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ImportDemoDialog;
