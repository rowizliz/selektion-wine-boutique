import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { 
  Gift, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  Eye, 
  Trash2,
  ArrowLeft,
  Phone,
  User,
  Calendar,
  Wine,
  Music,
  Palette,
  MessageSquare,
  DollarSign,
  UtensilsCrossed
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  useBirthdayGiftRequests, 
  useUpdateRequestStatus, 
  useDeleteBirthdayGiftRequest,
  BirthdayGiftRequest 
} from "@/hooks/useBirthdayGiftRequests";

const statusConfig = {
  pending: { label: "Chờ xử lý", variant: "secondary" as const, icon: Clock },
  processing: { label: "Đang xử lý", variant: "default" as const, icon: Loader2 },
  completed: { label: "Hoàn thành", variant: "outline" as const, icon: CheckCircle2 },
};

const AdminBirthdayGifts = () => {
  const { data: requests, isLoading, error } = useBirthdayGiftRequests();
  const updateStatus = useUpdateRequestStatus();
  const deleteRequest = useDeleteBirthdayGiftRequest();
  
  const [selectedRequest, setSelectedRequest] = useState<BirthdayGiftRequest | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Đã cập nhật trạng thái");
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRequest.mutateAsync(deleteId);
      toast.success("Đã xóa yêu cầu");
      setDeleteId(null);
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const stats = {
    total: requests?.length || 0,
    pending: requests?.filter(r => r.status === 'pending').length || 0,
    processing: requests?.filter(r => r.status === 'processing').length || 0,
    completed: requests?.filter(r => r.status === 'completed').length || 0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Có lỗi xảy ra khi tải dữ liệu</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Quản lý Quà Sinh Nhật | Admin</title>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/admin/wines">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Gift className="w-6 h-6 text-primary" />
                  Quản lý Quà Sinh Nhật
                </h1>
                <p className="text-muted-foreground text-sm">
                  Xem và quản lý các yêu cầu đặt quà sinh nhật
                </p>
              </div>
            </div>
            
            <Link to="/admin/wines">
              <Button variant="outline">Quản lý Rượu</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-lg bg-card border">
              <p className="text-sm text-muted-foreground">Tổng yêu cầu</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-yellow-600">Chờ xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-600">Đang xử lý</p>
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-600">Hoàn thành</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Người đặt</TableHead>
                  <TableHead>Người nhận</TableHead>
                  <TableHead>Ngân sách</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Chưa có yêu cầu nào
                    </TableCell>
                  </TableRow>
                ) : (
                  requests?.map((request) => {
                    const StatusIcon = statusConfig[request.status as keyof typeof statusConfig]?.icon || Clock;
                    return (
                      <TableRow key={request.id}>
                        <TableCell className="text-sm">
                          {format(new Date(request.created_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.sender_name}</p>
                            <p className="text-sm text-muted-foreground">{request.sender_phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{request.recipient_name}</p>
                        </TableCell>
                        <TableCell>{request.budget || "Chưa xác định"}</TableCell>
                        <TableCell>
                          <Select
                            value={request.status}
                            onValueChange={(value) => handleStatusChange(request.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                  <StatusIcon className="w-4 h-4" />
                                  {statusConfig[request.status as keyof typeof statusConfig]?.label || request.status}
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" /> Chờ xử lý
                                </div>
                              </SelectItem>
                              <SelectItem value="processing">
                                <div className="flex items-center gap-2">
                                  <Loader2 className="w-4 h-4" /> Đang xử lý
                                </div>
                              </SelectItem>
                              <SelectItem value="completed">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" /> Hoàn thành
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(request.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Chi tiết yêu cầu
            </DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Phone className="w-4 h-4" /> Thông tin liên hệ
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Người đặt</p>
                    <p className="font-medium">{selectedRequest.sender_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium">{selectedRequest.sender_phone}</p>
                  </div>
                </div>
              </div>

              {/* Recipient Info */}
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <User className="w-4 h-4" /> Thông tin người nhận
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tên</p>
                    <p className="font-medium">{selectedRequest.recipient_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ngày sinh</p>
                    <p className="font-medium">
                      {selectedRequest.recipient_birthday 
                        ? format(new Date(selectedRequest.recipient_birthday), "dd/MM/yyyy")
                        : "Chưa cung cấp"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Giới tính</p>
                    <p className="font-medium">{selectedRequest.recipient_gender || "Chưa cung cấp"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mối quan hệ</p>
                    <p className="font-medium">{selectedRequest.relationship || "Chưa cung cấp"}</p>
                  </div>
                </div>
              </div>

              {/* Wine Preferences */}
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Wine className="w-4 h-4" /> Gu rượu vang
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Loại rượu</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRequest.wine_types?.length ? (
                        selectedRequest.wine_types.map((type) => (
                          <Badge key={type} variant="secondary">{type}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Chưa chọn</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phong cách</p>
                    <p className="font-medium">{selectedRequest.wine_style || "Chưa cung cấp"}</p>
                  </div>
                </div>
              </div>

              {/* Food Preferences */}
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <UtensilsCrossed className="w-4 h-4" /> Gu ẩm thực
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Ẩm thực yêu thích</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRequest.cuisine_types?.length ? (
                        selectedRequest.cuisine_types.map((type) => (
                          <Badge key={type} variant="secondary">{type}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Chưa chọn</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Khẩu vị</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRequest.taste_preferences?.length ? (
                        selectedRequest.taste_preferences.map((pref) => (
                          <Badge key={pref} variant="secondary">{pref}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Chưa chọn</span>
                      )}
                    </div>
                  </div>
                  {selectedRequest.food_allergies && (
                    <div>
                      <p className="text-muted-foreground">Dị ứng / Không ăn được</p>
                      <p className="font-medium">{selectedRequest.food_allergies}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Music & Hobbies */}
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Music className="w-4 h-4" /> Âm nhạc & Giải trí
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Thể loại nhạc</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRequest.music_genres?.length ? (
                        selectedRequest.music_genres.map((genre) => (
                          <Badge key={genre} variant="secondary">{genre}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Chưa chọn</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sở thích</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRequest.hobbies?.length ? (
                        selectedRequest.hobbies.map((hobby) => (
                          <Badge key={hobby} variant="secondary">{hobby}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Chưa chọn</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Style */}
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4" /> Phong cách
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Màu sắc yêu thích</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRequest.favorite_colors?.length ? (
                        selectedRequest.favorite_colors.map((color) => (
                          <Badge key={color} variant="secondary">{color}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Chưa chọn</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phong cách</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRequest.style_preferences?.length ? (
                        selectedRequest.style_preferences.map((style) => (
                          <Badge key={style} variant="secondary">{style}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Chưa chọn</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedRequest.birthday_message && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4" /> Lời chúc sinh nhật
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">{selectedRequest.birthday_message}</p>
                </div>
              )}

              {/* Budget & Notes */}
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4" /> Ngân sách & Ghi chú
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Ngân sách</p>
                    <p className="font-medium">{selectedRequest.budget || "Chưa xác định"}</p>
                  </div>
                  {selectedRequest.additional_notes && (
                    <div>
                      <p className="text-muted-foreground">Ghi chú thêm</p>
                      <p className="font-medium">{selectedRequest.additional_notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <a 
                  href={`tel:${selectedRequest.sender_phone}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Gọi điện
                  </Button>
                </a>
                <a 
                  href={`https://zalo.me/${selectedRequest.sender_phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full">
                    Nhắn Zalo
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa yêu cầu này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminBirthdayGifts;
