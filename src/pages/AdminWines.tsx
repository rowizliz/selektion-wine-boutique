import { useState } from "react";
import { Helmet } from "react-helmet-async";
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
import { Plus, Pencil, Trash2, Search, Wine, ArrowLeft, MapPin } from "lucide-react";
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
    <>
      <Helmet>
        <title>Admin Wines | Sélection</title>
        <meta
          name="description"
          content="Bảng điều khiển admin để thêm, sửa, xóa rượu vang trong hệ thống Sélection."
        />
        <link rel="canonical" href={`${window.location.origin}/admin/wines`} />
      </Helmet>

      <main className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Link to="/admin">
                <Button variant="ghost" size="icon" aria-label="Về Admin Dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-serif">Quản lý Rượu Vang</h1>
                <p className="text-muted-foreground text-sm">
                  Thêm, sửa, xóa thông tin các chai rượu
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:ml-auto">
              <Link to="/admin/import-wines" className="w-full md:w-auto">
                <Button variant="outline" className="w-full md:w-auto">Import từ file tĩnh</Button>
              </Link>
              <Link to="/admin/flavor-icons" className="w-full md:w-auto">
                <Button variant="outline" className="w-full md:w-auto">Flavor Icons</Button>
              </Link>
            </div>
          </header>

          {/* Stats */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4" aria-label="Thống kê">
            <Card>
              <CardContent className="p-4 md:pt-6">
                <div className="flex items-center gap-3">
                  <Wine className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-xl md:text-2xl font-bold">{wines?.length || 0}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Tổng số rượu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600 text-sm font-medium">R</span>
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold">
                      {wines?.filter((w) => w.category === "red").length || 0}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">Vang đỏ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-600 text-sm font-medium">W</span>
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold">
                      {wines?.filter((w) => w.category === "white").length || 0}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">Vang trắng</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">S</span>
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold">
                      {wines?.filter((w) => w.category === "sparkling").length || 0}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">Vang sủi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Controls & List */}
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <Button onClick={handleCreate} className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Thêm rượu
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Đang tải...</div>
            ) : filteredWines?.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">
                  Không tìm thấy chai rượu nào.
                </p>
                <div className="mt-4 flex justify-center">
                  <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm rượu mới
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Table - Hidden on Mobile */}
                <Card className="hidden md:block">
                  <CardContent className="p-0">
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
                                  loading="lazy"
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
                                  <span className="text-muted-foreground ml-1">({wine.vintage})</span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">{wine.grapes}</div>
                            </TableCell>
                            <TableCell>
                              <div>{wine.origin}</div>
                              {wine.region && (
                                <div className="text-xs text-muted-foreground">{wine.region}</div>
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
                                  aria-label={`Sửa ${wine.name}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteId(wine.id)}
                                  aria-label={`Xóa ${wine.name}`}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Mobile Cards - Visible on Mobile */}
                <div className="md:hidden grid gap-4">
                  {filteredWines?.map((wine) => (
                    <Card key={wine.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex">
                          {/* Image Section */}
                          <div className="w-24 bg-muted/10 flex items-center justify-center p-2 border-r shrink-0">
                            {wine.image_url ? (
                              <img
                                src={wine.image_url}
                                alt={wine.name}
                                loading="lazy"
                                className="w-full h-24 object-contain"
                              />
                            ) : (
                              <Wine className="h-8 w-8 text-muted-foreground/40" />
                            )}
                          </div>

                          {/* Details Section */}
                          <div className="flex-1 p-3 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <h3 className="font-semibold text-sm line-clamp-2">
                                  {wine.name} {wine.vintage && <span className="text-muted-foreground font-normal">({wine.vintage})</span>}
                                </h3>
                              </div>
                              <Badge
                                variant="secondary"
                                className={`text-[10px] px-1 py-0 h-5 whitespace-nowrap ml-1 ${categoryColors[wine.category]}`}
                              >
                                {categoryLabels[wine.category]}
                              </Badge>
                            </div>

                            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                              {wine.grapes}
                            </p>

                            <div className="flex items-center text-xs text-muted-foreground mb-2">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-[120px]">{wine.origin}</span>
                              {wine.region && <span className="truncate ml-1">- {wine.region}</span>}
                            </div>

                            <div className="mt-auto pt-3 border-t flex flex-col gap-2">
                              <div className="font-semibold text-sm">{wine.price}</div>
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(wine)}
                                  className="w-full h-8 text-xs px-2"
                                >
                                  <Pencil className="h-3 w-3 mr-1" /> Sửa
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full h-8 text-xs px-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                                  onClick={() => setDeleteId(wine.id)}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" /> Xóa
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </section>
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
      </main>
    </>
  );
};

export default AdminWines;
