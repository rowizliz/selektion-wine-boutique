import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Trash2, Upload, AlertTriangle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SAMPLE_BLOG_POSTS } from "@/data/sample-blogs";
import { supabase } from "@/integrations/supabase/client";

const DELETED_DEMOS_KEY = "selection_deleted_demos";

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
    const [isDeleting, setIsDeleting] = useState(false);
    const [mode, setMode] = useState<"import" | "delete">("import");
    const [deletedSlugs, setDeletedSlugs] = useState<string[]>([]);

    // Load deleted demos from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(DELETED_DEMOS_KEY);
        if (stored) {
            try {
                setDeletedSlugs(JSON.parse(stored));
            } catch {
                setDeletedSlugs([]);
            }
        }
    }, []);

    // Load demo articles
    useEffect(() => {
        if (open) {
            const availablePosts = SAMPLE_BLOG_POSTS.filter(
                (post) => !deletedSlugs.includes(post.slug)
            );
            setDemoArticles(
                availablePosts.map((post) => ({
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt,
                    cover_image_url: post.cover_image_url,
                    selected: false,
                }))
            );
            setMode("import");
        }
    }, [open, deletedSlugs]);

    const selectedCount = demoArticles.filter((a) => a.selected).length;
    const deletedCount = deletedSlugs.length;

    const handleSelectAll = () => {
        const allSelected = demoArticles.every((a) => a.selected);
        setDemoArticles(demoArticles.map((a) => ({ ...a, selected: !allSelected })));
    };

    const handleToggle = (index: number) => {
        setDemoArticles(
            demoArticles.map((a, i) => (i === index ? { ...a, selected: !a.selected } : a))
        );
    };

    const handleDeleteSelected = () => {
        if (selectedCount === 0) {
            toast({ title: "Vui lòng chọn ít nhất 1 bài để xóa", variant: "destructive" });
            return;
        }

        setIsDeleting(true);
        const selectedSlugs = demoArticles.filter((a) => a.selected).map((a) => a.slug);
        const newDeletedSlugs = [...deletedSlugs, ...selectedSlugs];

        localStorage.setItem(DELETED_DEMOS_KEY, JSON.stringify(newDeletedSlugs));
        setDeletedSlugs(newDeletedSlugs);

        toast({ title: `Đã xóa ${selectedCount} bài demo` });
        setIsDeleting(false);
        setMode("import");
    };

    const handleRestoreAll = () => {
        localStorage.removeItem(DELETED_DEMOS_KEY);
        setDeletedSlugs([]);
        toast({ title: "Đã khôi phục tất cả bài demo" });
    };

    const handleImportSelected = async () => {
        if (selectedCount === 0) {
            toast({ title: "Vui lòng chọn ít nhất 1 bài viết", variant: "destructive" });
            return;
        }

        setIsImporting(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) {
                toast({ title: "Vui lòng đăng nhập", variant: "destructive" });
                return;
            }

            const { data: profileData, error: profileError } = await supabase
                .from("user_profiles")
                .select("id")
                .eq("user_id", userData.user.id)
                .single();

            if (profileError || !profileData) {
                toast({ title: "Không tìm thấy profile.", variant: "destructive" });
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
                if (!error) successCount++;
            }

            if (successCount > 0) {
                toast({ title: `Đã import ${successCount} bài` });
                onOpenChange(false);
                onImportComplete();
            }
        } catch (error: any) {
            toast({ title: "Lỗi", description: error.message, variant: "destructive" });
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {mode === "import" ? <Upload className="h-5 w-5" /> : <Trash2 className="h-5 w-5 text-destructive" />}
                        {mode === "import" ? "Import Bài Viết Demo" : "Xóa Bài Demo"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "import"
                            ? `Chọn bài demo để import. Còn ${demoArticles.length} bài (đã xóa ${deletedCount}).`
                            : "Chọn các bài demo để xóa vĩnh viễn khỏi danh sách."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                            {demoArticles.every((a) => a.selected) && demoArticles.length > 0 ? "Bỏ chọn" : "Chọn tất cả"}
                        </Button>
                        {deletedCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={handleRestoreAll} className="text-blue-600">
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Khôi phục ({deletedCount})
                            </Button>
                        )}
                    </div>
                    <Badge variant="secondary">
                        Đã chọn: {selectedCount}/{demoArticles.length}
                    </Badge>
                </div>

                <ScrollArea className="h-[350px] pr-4">
                    {demoArticles.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                            <p>Không còn bài demo nào.</p>
                            <Button variant="link" onClick={handleRestoreAll}>Khôi phục tất cả</Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {demoArticles.map((article, index) => (
                                <div
                                    key={article.slug}
                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${article.selected
                                            ? mode === "delete"
                                                ? "bg-destructive/10 border-destructive/30"
                                                : "bg-primary/5 border-primary/30"
                                            : "hover:bg-muted/50"
                                        }`}
                                    onClick={() => handleToggle(index)}
                                >
                                    <Checkbox checked={article.selected} className="mt-1" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm line-clamp-1">{article.title}</h4>
                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{article.excerpt}</p>
                                    </div>
                                    {article.cover_image_url && (
                                        <img src={article.cover_image_url} alt="" className="w-14 h-10 object-cover rounded" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    {mode === "import" ? (
                        <>
                            <Button
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setMode("delete")}
                                disabled={demoArticles.length === 0}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa Demo
                            </Button>
                            <div className="flex-1" />
                            <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                            <Button onClick={handleImportSelected} disabled={isImporting || selectedCount === 0}>
                                {isImporting ? "Đang import..." : `Import ${selectedCount} bài`}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => setMode("import")}>Quay lại</Button>
                            <div className="flex-1" />
                            <Button
                                variant="destructive"
                                onClick={handleDeleteSelected}
                                disabled={isDeleting || selectedCount === 0}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa {selectedCount} bài
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ImportDemoDialog;
