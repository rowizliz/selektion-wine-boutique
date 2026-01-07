import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft, Eye, Download, Trash2, UserPlus, Loader2 } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  useApplications,
  useUpdateApplication,
  useDeleteApplication,
  getCVSignedUrl,
  CollaboratorApplication,
} from "@/hooks/useCollaboratorApplications";

const statusLabels: Record<string, string> = {
  pending: "Chờ xử lý",
  reviewing: "Đang xem xét",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  reviewing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  approved: "bg-green-500/10 text-green-600 border-green-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

const AdminRecruitment = () => {
  const { toast } = useToast();
  const { data: applications, isLoading } = useApplications();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<CollaboratorApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isDownloadingCV, setIsDownloadingCV] = useState(false);

  const filteredApplications = applications?.filter((app) => {
    if (filterStatus === "all") return true;
    return app.status === filterStatus;
  });

  const handleViewDetails = (app: CollaboratorApplication) => {
    setSelectedApplication(app);
    setAdminNotes(app.admin_notes || "");
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateApplication.mutateAsync({ id, status: status as CollaboratorApplication['status'] });
      toast({
        title: "Cập nhật thành công",
        description: "Trạng thái đơn đã được cập nhật",
      });
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể cập nhật trạng thái",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApplication) return;
    try {
      await updateApplication.mutateAsync({
        id: selectedApplication.id,
        admin_notes: adminNotes,
      });
      setSelectedApplication({ ...selectedApplication, admin_notes: adminNotes });
      toast({
        title: "Đã lưu ghi chú",
      });
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCV = async (cvUrl: string) => {
    try {
      setIsDownloadingCV(true);
      const signedUrl = await getCVSignedUrl(cvUrl);
      window.open(signedUrl, "_blank");
    } catch (error) {
      toast({
        title: "Không thể tải CV",
        description: "Có lỗi xảy ra khi tải file",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingCV(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication.mutateAsync(id);
      toast({
        title: "Đã xóa đơn ứng tuyển",
      });
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        variant: "destructive",
      });
    }
  };

  const pendingCount = applications?.filter((a) => a.status === "pending").length || 0;

  return (
    <>
      <Helmet>
        <title>Quản Lý Đơn Ứng Tuyển | Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-serif">Đơn Ứng Tuyển CTV</h1>
                {pendingCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {pendingCount} đơn chờ xử lý
                  </p>
                )}
              </div>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="reviewing">Đang xem xét</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredApplications?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có đơn ứng tuyển nào
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>SĐT</TableHead>
                    <TableHead>Ngày nộp</TableHead>
                    <TableHead>CV</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications?.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.full_name}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{app.phone}</TableCell>
                      <TableCell>
                        {format(new Date(app.created_at), "dd/MM/yyyy", { locale: vi })}
                      </TableCell>
                      <TableCell>
                        {app.cv_url ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadCV(app.cv_url!)}
                            disabled={isDownloadingCV}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={app.status}
                          onValueChange={(value) => handleStatusChange(app.id, value)}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <Badge
                              variant="outline"
                              className={statusColors[app.status]}
                            >
                              {statusLabels[app.status]}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Chờ xử lý</SelectItem>
                            <SelectItem value="reviewing">Đang xem xét</SelectItem>
                            <SelectItem value="approved">Đã duyệt</SelectItem>
                            <SelectItem value="rejected">Từ chối</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(app)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xóa đơn ứng tuyển?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc muốn xóa đơn của {app.full_name}? Hành động này không thể hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(app.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn ứng tuyển</DialogTitle>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Họ tên</Label>
                  <p className="font-medium">{selectedApplication.full_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Email</Label>
                  <p>{selectedApplication.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Số điện thoại</Label>
                  <p>{selectedApplication.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Ngày sinh</Label>
                  <p>
                    {selectedApplication.date_of_birth
                      ? format(new Date(selectedApplication.date_of_birth), "dd/MM/yyyy")
                      : "-"}
                  </p>
                </div>
              </div>

              {selectedApplication.address && (
                <div>
                  <Label className="text-muted-foreground text-xs">Địa chỉ</Label>
                  <p>{selectedApplication.address}</p>
                </div>
              )}

              {selectedApplication.occupation && (
                <div>
                  <Label className="text-muted-foreground text-xs">Nghề nghiệp</Label>
                  <p>{selectedApplication.occupation}</p>
                </div>
              )}

              {selectedApplication.experience && (
                <div>
                  <Label className="text-muted-foreground text-xs">Kinh nghiệm</Label>
                  <p className="whitespace-pre-wrap">{selectedApplication.experience}</p>
                </div>
              )}

              {selectedApplication.motivation && (
                <div>
                  <Label className="text-muted-foreground text-xs">Lý do ứng tuyển</Label>
                  <p className="whitespace-pre-wrap">{selectedApplication.motivation}</p>
                </div>
              )}

              {selectedApplication.cv_url && (
                <div>
                  <Label className="text-muted-foreground text-xs">CV</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadCV(selectedApplication.cv_url!)}
                    disabled={isDownloadingCV}
                    className="mt-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Tải CV
                  </Button>
                </div>
              )}

              <div className="border-t pt-4">
                <Label className="text-muted-foreground text-xs">Ghi chú Admin</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Thêm ghi chú về ứng viên..."
                  rows={3}
                  className="mt-1"
                />
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={updateApplication.isPending}
                  className="mt-2"
                >
                  Lưu ghi chú
                </Button>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Label className="text-muted-foreground text-xs">Trạng thái:</Label>
                  <Select
                    value={selectedApplication.status}
                    onValueChange={(value) => {
                      handleStatusChange(selectedApplication.id, value);
                      setSelectedApplication({ ...selectedApplication, status: value as CollaboratorApplication['status'] });
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="reviewing">Đang xem xét</SelectItem>
                      <SelectItem value="approved">Đã duyệt</SelectItem>
                      <SelectItem value="rejected">Từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedApplication.status === "approved" && (
                  <Link to="/admin/collaborators">
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Tạo tài khoản CTV
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminRecruitment;
