import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft, Plus, Eye, Trash2, Copy, QrCode, Users, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useInvitations, useDeleteInvitation, useInvitationRSVPs, useCheckInGuest, useDeleteRSVP, Invitation, InvitationRSVP } from "@/hooks/useInvitations";
import InvitationFormDialog from "@/components/invitations/InvitationFormDialog";

const AdminInvitations = () => {
  const { data: invitations, isLoading } = useInvitations();
  const deleteInvitation = useDeleteInvitation();
  const checkInGuest = useCheckInGuest();
  
  const [showForm, setShowForm] = useState(false);
  const [editingInvitation, setEditingInvitation] = useState<Invitation | null>(null);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteInvitation.mutateAsync(deleteId);
      toast.success("Đã xóa thiệp mời");
      setDeleteId(null);
    } catch (error) {
      toast.error("Lỗi khi xóa thiệp mời");
    }
  };

  const handleCopyLink = (invitation: Invitation) => {
    const link = `${window.location.origin}/thiep/${invitation.url_slug}`;
    navigator.clipboard.writeText(link);
    toast.success("Đã sao chép link thiệp");
  };

  const handleCopyPIN = (pin: string) => {
    navigator.clipboard.writeText(pin);
    toast.success("Đã sao chép mã PIN");
  };

  const handleEdit = (invitation: Invitation) => {
    setEditingInvitation(invitation);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingInvitation(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Quản lý Thiệp Mời | Admin</title>
      </Helmet>

      <main className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-serif">Thiệp Mời Online</h1>
                <p className="text-muted-foreground text-sm">
                  Tạo và quản lý thiệp mời sự kiện
                </p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo thiệp mới
            </Button>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tổng số thiệp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{invitations?.length || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sự kiện</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Địa điểm</TableHead>
                    <TableHead>Mã PIN</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations?.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">
                        {invitation.title}
                      </TableCell>
                      <TableCell>
                        {format(new Date(invitation.event_date), "dd/MM/yyyy HH:mm", { locale: vi })}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {invitation.location}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer font-mono"
                          onClick={() => handleCopyPIN(invitation.pin_code)}
                        >
                          {invitation.pin_code}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyLink(invitation)}
                            title="Sao chép link"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedInvitation(invitation)}
                            title="Xem chi tiết & RSVP"
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(invitation)}
                            title="Chỉnh sửa"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(invitation.id)}
                            className="text-destructive hover:text-destructive"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!invitations || invitations.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Chưa có thiệp mời nào. Bấm "Tạo thiệp mới" để bắt đầu.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Form Dialog */}
      <InvitationFormDialog
        open={showForm}
        onOpenChange={handleCloseForm}
        invitation={editingInvitation}
      />

      {/* RSVP Detail Dialog */}
      {selectedInvitation && (
        <RSVPDetailDialog
          invitation={selectedInvitation}
          open={!!selectedInvitation}
          onOpenChange={(open) => !open && setSelectedInvitation(null)}
          onCheckIn={(rsvpId) => {
            checkInGuest.mutate({ rsvpId, invitationId: selectedInvitation.id });
          }}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa thiệp mời này? Hành động này không thể hoàn tác.
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

// RSVP Detail Dialog Component
interface RSVPDetailDialogProps {
  invitation: Invitation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckIn: (rsvpId: string) => void;
}

const RSVPDetailDialog = ({ invitation, open, onOpenChange, onCheckIn }: RSVPDetailDialogProps) => {
  const { data: rsvps, isLoading } = useInvitationRSVPs(invitation.id);
  const deleteRSVP = useDeleteRSVP();
  const [deleteRsvpId, setDeleteRsvpId] = useState<string | null>(null);

  const attendingCount = rsvps?.filter(r => r.attending).reduce((sum, r) => sum + r.guest_count, 0) || 0;
  const notAttendingCount = rsvps?.filter(r => !r.attending).length || 0;
  const checkedInCount = rsvps?.filter(r => r.checked_in_at).length || 0;

  const handleCopyQRLink = () => {
    const link = `${window.location.origin}/thiep/${invitation.url_slug}`;
    navigator.clipboard.writeText(link);
    toast.success("Đã sao chép link QR check-in");
  };

  const handleDeleteRSVP = async () => {
    if (!deleteRsvpId) return;
    try {
      await deleteRSVP.mutateAsync({ rsvpId: deleteRsvpId, invitationId: invitation.id });
      toast.success("Đã xóa khách mời");
      setDeleteRsvpId(null);
    } catch (error) {
      toast.error("Lỗi khi xóa khách mời");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {invitation.title} - Danh sách RSVP
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{attendingCount}</p>
                  <p className="text-sm text-muted-foreground">Tham dự</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{notAttendingCount}</p>
                  <p className="text-sm text-muted-foreground">Không tham dự</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{checkedInCount}</p>
                  <p className="text-sm text-muted-foreground">Đã check-in</p>
                </CardContent>
              </Card>
            </div>

            {/* QR Link */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyQRLink}>
                <QrCode className="h-4 w-4 mr-2" />
                Link QR Check-in
              </Button>
              <span className="text-sm text-muted-foreground">
                PIN: <code className="bg-muted px-2 py-1 rounded">{invitation.pin_code}</code>
              </span>
            </div>

            {/* RSVP Table */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <TooltipProvider>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Khách</TableHead>
                      <TableHead>SĐT</TableHead>
                      <TableHead>Số người</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ghi chú</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rsvps?.map((rsvp) => (
                      <TableRow key={rsvp.id}>
                        <TableCell className="font-medium">{rsvp.guest_name}</TableCell>
                        <TableCell>{rsvp.phone || "-"}</TableCell>
                        <TableCell>{rsvp.guest_count}</TableCell>
                        <TableCell>
                          {rsvp.attending ? (
                            <Badge className="bg-green-100 text-green-700">
                              <Check className="h-3 w-3 mr-1" />
                              Tham dự
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <X className="h-3 w-3 mr-1" />
                              Không
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          {rsvp.note ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="block truncate cursor-help">{rsvp.note}</span>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[300px] whitespace-pre-wrap">
                                {rsvp.note}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {rsvp.checked_in_at ? (
                            <Badge className="bg-blue-100 text-blue-700">
                              {format(new Date(rsvp.checked_in_at), "HH:mm")}
                            </Badge>
                          ) : rsvp.attending ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onCheckIn(rsvp.id)}
                            >
                              Check-in
                            </Button>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteRsvpId(rsvp.id)}
                            className="text-destructive hover:text-destructive h-8 w-8"
                            title="Xóa khách"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!rsvps || rsvps.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Chưa có khách nào phản hồi
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TooltipProvider>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete RSVP Confirmation */}
      <AlertDialog open={!!deleteRsvpId} onOpenChange={(open) => !open && setDeleteRsvpId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa khách mời này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRSVP} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminInvitations;
