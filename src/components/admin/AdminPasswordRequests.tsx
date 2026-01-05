import { useState } from "react";
import { Check, X, Key, Loader2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Collaborator } from "@/hooks/useCollaborators";

interface PasswordRequest {
  id: string;
  collaborator_id: string;
  reason: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  processed_at: string | null;
}

interface AdminPasswordRequestsProps {
  collaborators: Collaborator[] | undefined;
}

export const AdminPasswordRequests = ({ collaborators }: AdminPasswordRequestsProps) => {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<PasswordRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState("");

  const { data: requests, isLoading } = useQuery({
    queryKey: ["password-change-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("password_change_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PasswordRequest[];
    },
  });

  const processRequest = useMutation({
    mutationFn: async ({ id, approve }: { id: string; approve: boolean }) => {
      const request = requests?.find((r) => r.id === id);
      if (!request) throw new Error("Request not found");

      // If approving, send password reset email
      if (approve) {
        const collaborator = collaborators?.find((c) => c.id === request.collaborator_id);
        if (!collaborator) throw new Error("Collaborator not found");

        // Send password reset email
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          collaborator.email,
          {
            redirectTo: `${window.location.origin}/auth?reset=true`,
          }
        );
        if (resetError) throw resetError;
      }

      // Update request status
      const { error } = await supabase
        .from("password_change_requests")
        .update({
          status: approve ? "approved" : "rejected",
          admin_notes: adminNotes || null,
          processed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, { approve }) => {
      queryClient.invalidateQueries({ queryKey: ["password-change-requests"] });
      queryClient.invalidateQueries({ queryKey: ["pending-request-counts"] });
      toast.success(
        approve
          ? "Đã duyệt và gửi email đặt lại mật khẩu cho CTV"
          : "Đã từ chối yêu cầu"
      );
      setSelectedRequest(null);
      setAdminNotes("");
    },
    onError: (error: Error) => {
      toast.error("Lỗi: " + error.message);
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      const { error } = await supabase
        .from("password_change_requests")
        .update({
          status,
          admin_notes: notes || null,
          processed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["password-change-requests"] });
      queryClient.invalidateQueries({ queryKey: ["pending-request-counts"] });
      toast.success("Đã cập nhật trạng thái yêu cầu");
      setSelectedRequest(null);
      setAdminNotes("");
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast.error("Lỗi: " + error.message);
    },
  });

  const handleProcess = async (approve: boolean) => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    await processRequest.mutateAsync({ id: selectedRequest.id, approve });
    setIsProcessing(false);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    await updateStatus.mutateAsync({
      id: selectedRequest.id,
      status: editStatus,
      notes: adminNotes,
    });
    setIsProcessing(false);
  };

  const openEditDialog = (request: PasswordRequest) => {
    setSelectedRequest(request);
    setEditStatus(request.status);
    setAdminNotes(request.admin_notes || "");
    setIsEditing(true);
  };

  const getCollaboratorName = (collaboratorId: string) => {
    return collaborators?.find((c) => c.id === collaboratorId)?.name || "N/A";
  };

  const getCollaboratorEmail = (collaboratorId: string) => {
    return collaborators?.find((c) => c.id === collaboratorId)?.email || "N/A";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Chờ duyệt</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Đã duyệt</Badge>;
      case "rejected":
        return <Badge variant="destructive">Từ chối</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Hoàn thành</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingCount = requests?.filter((r) => r.status === "pending").length || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Yêu cầu đổi mật khẩu
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingCount} chờ duyệt
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!requests?.length ? (
            <p className="text-muted-foreground">Chưa có yêu cầu nào</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CTV</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Lý do</TableHead>
                    <TableHead>Ngày gửi</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {getCollaboratorName(request.collaborator_id)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getCollaboratorEmail(request.collaborator_id)}
                      </TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">
                        {request.reason || "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(request.created_at).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.status === "pending" ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => {
                                setSelectedRequest(request);
                                setAdminNotes("");
                                setIsEditing(false);
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setSelectedRequest(request);
                                setAdminNotes("");
                                setIsEditing(false);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setAdminNotes(request.admin_notes || "");
                                setIsEditing(false);
                              }}
                            >
                              Xem
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(request)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail/Process Dialog */}
      <Dialog open={!!selectedRequest && !isEditing} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Chi tiết yêu cầu đổi mật khẩu
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">
                  CTV: {getCollaboratorName(selectedRequest.collaborator_id)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Email: {getCollaboratorEmail(selectedRequest.collaborator_id)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Gửi lúc: {new Date(selectedRequest.created_at).toLocaleString("vi-VN")}
                </p>
              </div>

              {selectedRequest.reason && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Lý do:</p>
                  <p className="text-sm p-2 bg-muted rounded">{selectedRequest.reason}</p>
                </div>
              )}

              {selectedRequest.status === "pending" && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Ghi chú (tùy chọn):</p>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Ghi chú cho CTV..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Nếu duyệt, hệ thống sẽ gửi email đặt lại mật khẩu cho CTV.
                  </p>
                </div>
              )}

              {selectedRequest.status !== "pending" && selectedRequest.admin_notes && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Ghi chú Admin:</p>
                  <p className="text-sm p-2 bg-muted rounded">{selectedRequest.admin_notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {selectedRequest?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleProcess(false)}
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4 mr-2" />
                  Từ chối
                </Button>
                <Button onClick={() => handleProcess(true)} disabled={isProcessing}>
                  <Check className="h-4 w-4 mr-2" />
                  Duyệt & Gửi email
                </Button>
              </>
            )}
            {selectedRequest?.status !== "pending" && (
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Đóng
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={isEditing} onOpenChange={() => { setIsEditing(false); setSelectedRequest(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Chỉnh sửa trạng thái
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">
                  CTV: {getCollaboratorName(selectedRequest.collaborator_id)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Email: {getCollaboratorEmail(selectedRequest.collaborator_id)}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ duyệt</SelectItem>
                    <SelectItem value="approved">Đã duyệt</SelectItem>
                    <SelectItem value="rejected">Từ chối</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ghi chú (tùy chọn)</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Ghi chú..."
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setIsEditing(false); setSelectedRequest(null); }}>
              Hủy
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isProcessing}>
              {isProcessing ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
