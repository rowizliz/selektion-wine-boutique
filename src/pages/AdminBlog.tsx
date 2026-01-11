import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Check, X, Eye, FolderOpen, FileEdit } from "lucide-react";
import ArticleFormDialog from "@/components/blog/ArticleFormDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useBlogCategories, useAdminBlogCategories, BlogCategory } from "@/hooks/useBlogCategories";
import { useAllArticles, useArticleMutations, BlogArticle } from "@/hooks/useBlogArticles";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { SAMPLE_BLOG_POSTS } from "@/data/sample-blogs";
import { supabase } from "@/integrations/supabase/client";

const AdminBlog = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");

  // Categories
  const { data: categories, isLoading: isLoadingCategories } = useBlogCategories();
  const { createCategory, updateCategory, deleteCategory } = useAdminBlogCategories();
  const [categoryDialog, setCategoryDialog] = useState<{ open: boolean; category?: BlogCategory }>({ open: false });
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", description: "", display_order: 0, is_active: true });

  // Articles
  const { data: articles, isLoading: isLoadingArticles } = useAllArticles();
  const { updateArticle, deleteArticle, createArticle } = useArticleMutations();
  const [articleDialog, setArticleDialog] = useState<{ open: boolean; article?: BlogArticle; action?: "approve" | "reject" }>({ open: false });
  const [adminNotes, setAdminNotes] = useState("");
  const [articleFormDialog, setArticleFormDialog] = useState<{ open: boolean; article?: BlogArticle }>({ open: false });

  // Filter articles by status
  const pendingArticles = articles?.filter(a => a.status === "pending") || [];
  const publishedArticles = articles?.filter(a => a.status === "published") || [];
  const rejectedArticles = articles?.filter(a => a.status === "rejected") || [];
  const draftArticles = articles?.filter(a => a.status === "draft") || [];

  const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const statusLabels: Record<string, string> = {
    draft: "Nháp",
    pending: "Chờ duyệt",
    published: "Đã xuất bản",
    rejected: "Từ chối",
  };

  // Category handlers
  const openCategoryDialog = (category?: BlogCategory) => {
    if (category) {
      setCategoryForm({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        display_order: category.display_order,
        is_active: category.is_active,
      });
    } else {
      setCategoryForm({ name: "", slug: "", description: "", display_order: 0, is_active: true });
    }
    setCategoryDialog({ open: true, category });
  };

  const handleSaveCategory = async () => {
    try {
      if (categoryDialog.category) {
        await updateCategory.mutateAsync({ id: categoryDialog.category.id, ...categoryForm });
        toast({ title: "Đã cập nhật danh mục" });
      } else {
        await createCategory.mutateAsync(categoryForm);
        toast({ title: "Đã tạo danh mục mới" });
      }
      setCategoryDialog({ open: false });
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await deleteCategory.mutateAsync(id);
      toast({ title: "Đã xóa danh mục" });
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  };

  const handleImportSampleData = async () => {
    if (!confirm("Bạn có muốn import 5 bài viết mẫu vào Nháp không?")) return;

    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({ title: "Vui lòng đăng nhập", variant: "destructive" });
        return;
      }

      // Use current user's ID as author_id (same as auth.uid())
      const authorId = userData.user.id;
      const timestamp = Date.now();
      let successCount = 0;

      for (const post of SAMPLE_BLOG_POSTS) {
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
          published_at: null
        });

        if (error) {
          console.error("Insert error:", error);
        } else {
          successCount++;
        }
      }

      if (successCount > 0) {
        toast({ title: `Đã import ${successCount} bài viết vào mục Nháp` });
        window.location.reload();
      } else {
        toast({ title: "Không thể import. Kiểm tra console.", variant: "destructive" });
      }

    } catch (error: any) {
      toast({ title: "Lỗi import", description: error.message, variant: "destructive" });
    }
  };

  // Article handlers
  const handleApprove = async (article: BlogArticle) => {
    try {
      await updateArticle.mutateAsync({
        id: article.id,
        status: "published",
        published_at: new Date().toISOString(),
        admin_notes: adminNotes || null,
      });
      toast({ title: "Đã duyệt bài viết" });
      setArticleDialog({ open: false });
      setAdminNotes("");
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  };

  const handleReject = async (article: BlogArticle) => {
    if (!adminNotes.trim()) {
      toast({ title: "Vui lòng nhập lý do từ chối", variant: "destructive" });
      return;
    }
    try {
      await updateArticle.mutateAsync({
        id: article.id,
        status: "rejected",
        admin_notes: adminNotes,
      });
      toast({ title: "Đã từ chối bài viết" });
      setArticleDialog({ open: false });
      setAdminNotes("");
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      await deleteArticle.mutateAsync(id);
      toast({ title: "Đã xóa bài viết" });
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  };

  const ArticleTable = ({ articleList }: { articleList: BlogArticle[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tiêu đề</TableHead>
          <TableHead>Tác giả</TableHead>
          <TableHead>Danh mục</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articleList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
              Không có bài viết nào
            </TableCell>
          </TableRow>
        ) : (
          articleList.map((article) => (
            <TableRow key={article.id}>
              <TableCell className="font-medium max-w-[200px] truncate">
                {article.title}
              </TableCell>
              <TableCell>{article.author?.display_name || "N/A"}</TableCell>
              <TableCell>{article.category?.name || "Không phân loại"}</TableCell>
              <TableCell>
                <Badge className={statusColors[article.status]}>
                  {statusLabels[article.status]}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(article.created_at), "dd/MM/yyyy", { locale: vi })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {/* Edit button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setArticleFormDialog({ open: true, article })}
                    title="Chỉnh sửa"
                  >
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  {article.status === "published" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="Xem bài viết"
                    >
                      <a href={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {article.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setAdminNotes("");
                          setArticleDialog({ open: true, article, action: "approve" });
                        }}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setAdminNotes("");
                          setArticleDialog({ open: true, article, action: "reject" });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteArticle(article.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <>
      <Helmet>
        <title>Quản Lý Blog | Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-serif">Quản Lý Blog</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Articles */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-sans">Bài Viết</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleImportSampleData}>
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Import Demo
                    </Button>
                    <Button onClick={() => setArticleFormDialog({ open: true })}>
                      <Plus className="h-4 w-4 mr-2" />
                      Viết Bài Mới
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="pending" className="gap-2">
                        Chờ duyệt
                        {pendingArticles.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {pendingArticles.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="published">Đã xuất bản</TabsTrigger>
                      <TabsTrigger value="rejected">Từ chối</TabsTrigger>
                      <TabsTrigger value="draft">Nháp</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending">
                      {isLoadingArticles ? (
                        <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
                      ) : (
                        <ArticleTable articleList={pendingArticles} />
                      )}
                    </TabsContent>

                    <TabsContent value="published">
                      <ArticleTable articleList={publishedArticles} />
                    </TabsContent>

                    <TabsContent value="rejected">
                      <ArticleTable articleList={rejectedArticles} />
                    </TabsContent>

                    <TabsContent value="draft">
                      <ArticleTable articleList={draftArticles} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Categories */}
            <div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-sans flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Danh Mục
                  </CardTitle>
                  <Button size="sm" onClick={() => openCategoryDialog()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingCategories ? (
                    <div className="text-center py-4 text-muted-foreground">Đang tải...</div>
                  ) : !categories?.length ? (
                    <div className="text-center py-4 text-muted-foreground">Chưa có danh mục</div>
                  ) : (
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-3 border border-border rounded-sm"
                        >
                          <div>
                            <p className="font-medium text-sm">{category.name}</p>
                            <p className="text-xs text-muted-foreground">/{category.slug}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openCategoryDialog(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Category Dialog */}
      <Dialog open={categoryDialog.open} onOpenChange={(open) => setCategoryDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {categoryDialog.category ? "Sửa Danh Mục" : "Thêm Danh Mục"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên danh mục</label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="VD: Vang Pháp"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (URL)</label>
              <Input
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                placeholder="VD: vang-phap"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả</label>
              <Textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Mô tả ngắn về danh mục"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Thứ tự hiển thị</label>
              <Input
                type="number"
                value={categoryForm.display_order}
                onChange={(e) => setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialog({ open: false })}>
              Hủy
            </Button>
            <Button onClick={handleSaveCategory}>
              {categoryDialog.category ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Article Action Dialog */}
      <Dialog open={articleDialog.open} onOpenChange={(open) => setArticleDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {articleDialog.action === "approve" ? "Duyệt Bài Viết" : "Từ Chối Bài Viết"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4 font-medium">{articleDialog.article?.title}</p>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {articleDialog.action === "approve" ? "Ghi chú (tùy chọn)" : "Lý do từ chối (bắt buộc)"}
              </label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={articleDialog.action === "approve" ? "Ghi chú cho tác giả..." : "Nhập lý do từ chối..."}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArticleDialog({ open: false })}>
              Hủy
            </Button>
            {articleDialog.action === "approve" ? (
              <Button onClick={() => articleDialog.article && handleApprove(articleDialog.article)}>
                Duyệt
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => articleDialog.article && handleReject(articleDialog.article)}
              >
                Từ chối
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Article Form Dialog */}
      <ArticleFormDialog
        open={articleFormDialog.open}
        onOpenChange={(open) => setArticleFormDialog({ open })}
        article={articleFormDialog.article}
        isAdmin={true}
      />
    </>
  );
};

export default AdminBlog;
