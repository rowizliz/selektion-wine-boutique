import { useState } from "react";
import { useWines, useDeleteWine, WineDB } from "@/hooks/useWines";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Search, Wine, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import WineFormDialog from "@/components/admin/WineFormDialog";

const categoryLabels: Record<string, string> = {
  red: "Vang đỏ",
  white: "Vang trắng",
  sparkling: "Vang sủi",
};

const categoryColors: Record<string, string> = {
  red: "bg-red-100 text-red-800",
  white: "bg-amber-100 text-amber-800",
  sparkling: "bg-blue-100 text-blue-800",
};

const AdminWines = () => {
  const { data: wines, isLoading } = useWines();
  const deleteWine = useDeleteWine();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingWine, setEditingWine] = useState<WineDB | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredWines = wines?.filter(
    (wine) =>
      wine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wine.origin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (wine: WineDB) => {
    setEditingWine(wine);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingWine(null);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteWine.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-serif">Quản lý Rượu Vang</h1>
            <p className="text-muted-foreground text-sm">
              Thêm, sửa, xóa thông tin các chai rượu
            </p>
          </div>
          <Link to="/admin/import-wines">
            <Button variant="outline">Import từ file tĩnh</Button>
          </Link>
          <Link to="/admin/flavor-icons">
            <Button variant="outline">Flavor Icons</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Wine className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{wines?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Tổng số rượu</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-sm font-medium">R</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {wines?.filter((w) => w.category === "red").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Vang đỏ</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-600 text-sm font-medium">W</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {wines?.filter((w) => w.category === "white").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Vang trắng</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">S</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {wines?.filter((w) => w.category === "sparkling").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Vang sủi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>Danh sách rượu</CardTitle>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm rượu
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Đang tải...
              </div>
            ) : filteredWines?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Không có rượu nào. Hãy thêm chai đầu tiên!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Ảnh</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Xuất xứ</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWines?.map((wine) => (
                    <TableRow key={wine.id}>
                      <TableCell>
                        {wine.image_url ? (
                          <img
                            src={wine.image_url}
                            alt={wine.name}
                            className="w-12 h-16 object-contain rounded"
                          />
                        ) : (
                          <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                            <Wine className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          {wine.name}
                          {wine.vintage && (
                            <span className="text-muted-foreground ml-1">
                              ({wine.vintage})
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {wine.grapes}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{wine.origin}</div>
                        {wine.region && (
                          <div className="text-xs text-muted-foreground">
                            {wine.region}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={categoryColors[wine.category]}
                        >
                          {categoryLabels[wine.category]}
                        </Badge>
                      </TableCell>
                      <TableCell>{wine.price}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(wine)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(wine.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <WineFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        wine={editingWine}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa chai rượu này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminWines;
