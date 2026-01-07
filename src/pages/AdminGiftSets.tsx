import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Search, Pencil, Trash2, Gift, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useGiftSets, useCreateGiftSet, useUpdateGiftSet, useDeleteGiftSet, GiftSetDB, GiftSetInput } from "@/hooks/useGiftSets";
import GiftSetFormDialog from "@/components/admin/GiftSetFormDialog";

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "standard":
      return { label: "Tiêu chuẩn", variant: "secondary" as const };
    case "premium":
      return { label: "Cao cấp", variant: "default" as const };
    case "luxury":
      return { label: "Sang trọng", variant: "outline" as const };
    default:
      return { label: category, variant: "secondary" as const };
  }
};

const AdminGiftSets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingGiftSet, setEditingGiftSet] = useState<GiftSetDB | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: giftSets, isLoading } = useGiftSets();
  const createMutation = useCreateGiftSet();
  const updateMutation = useUpdateGiftSet();
  const deleteMutation = useDeleteGiftSet();

  const filteredGiftSets = giftSets?.filter((gs) =>
    gs.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gs.wine?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: giftSets?.length ?? 0,
    standard: giftSets?.filter((gs) => gs.category === "standard").length ?? 0,
    premium: giftSets?.filter((gs) => gs.category === "premium").length ?? 0,
    luxury: giftSets?.filter((gs) => gs.category === "luxury").length ?? 0,
  };

  const handleSubmit = async (data: GiftSetInput & { id?: string }) => {
    if (data.id) {
      await updateMutation.mutateAsync(data as GiftSetInput & { id: string });
    } else {
      await createMutation.mutateAsync(data);
    }
    setFormOpen(false);
    setEditingGiftSet(null);
  };

  const handleEdit = (giftSet: GiftSetDB) => {
    setEditingGiftSet(giftSet);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Quản lý Quà Tặng | Admin</title>
      </Helmet>

      <main className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-serif">Quản lý Quà Tặng</h1>
              <p className="text-muted-foreground text-sm">Thêm, sửa, xóa các set quà tặng rượu vang</p>
            </div>
            <Button onClick={() => { setEditingGiftSet(null); setFormOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm set quà
            </Button>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tiêu chuẩn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.standard}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Cao cấp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{stats.premium}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sang trọng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.luxury}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên set quà hoặc rượu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredGiftSets && filteredGiftSets.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Ảnh</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Rượu</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGiftSets.map((giftSet) => {
                    const categoryInfo = getCategoryLabel(giftSet.category);
                    return (
                      <TableRow key={giftSet.id}>
                        <TableCell>
                          {giftSet.image_url ? (
                            <img
                              src={giftSet.image_url}
                              alt={giftSet.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <Gift className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{giftSet.name}</TableCell>
                        <TableCell>{formatPrice(giftSet.price)}</TableCell>
                        <TableCell>
                          <Badge variant={categoryInfo.variant}>{categoryInfo.label}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{giftSet.wine || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={giftSet.is_active ? "default" : "secondary"}>
                            {giftSet.is_active ? "Hiển thị" : "Ẩn"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(giftSet)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(giftSet.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "Không tìm thấy set quà nào" : "Chưa có set quà nào"}
              </p>
              <Button className="mt-4" onClick={() => { setEditingGiftSet(null); setFormOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm set quà đầu tiên
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Form Dialog */}
      <GiftSetFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingGiftSet(null);
        }}
        giftSet={editingGiftSet}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Set quà sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminGiftSets;
