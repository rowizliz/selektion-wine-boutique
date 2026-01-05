import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, User, Image, Landmark, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCollaborators } from "@/hooks/useCollaborators";

interface ProfileUpdate {
  id: string;
  collaborator_id: string;
  requested_name: string | null;
  requested_phone: string | null;
  requested_avatar_url: string | null;
  requested_bank_name: string | null;
  requested_bank_account_number: string | null;
  requested_bank_account_holder: string | null;
  requested_qr_code_url: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  processed_at: string | null;
}

const AdminProfileUpdates = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: collaborators } = useCollaborators();
  const [selectedUpdate, setSelectedUpdate] = useState<ProfileUpdate | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: updates, isLoading } = useQuery({
    queryKey: ["profile-updates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collaborator_profile_updates")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ProfileUpdate[];
    },
  });

  const processUpdate = useMutation({
    mutationFn: async ({ id, approve }: { id: string; approve: boolean }) => {
      const update = updates?.find((u) => u.id === id);
      if (!update) throw new Error("Update not found");

      // If approving, update the collaborator profile
      if (approve) {
        const updateData: Record<string, string | null> = {};
        if (update.requested_name) updateData.name = update.requested_name;
        if (update.requested_phone) updateData.phone = update.requested_phone;
        if (update.requested_avatar_url) updateData.avatar_url = update.requested_avatar_url;
        if (update.requested_bank_name) updateData.bank_name = update.requested_bank_name;
        if (update.requested_bank_account_number) updateData.bank_account_number = update.requested_bank_account_number;
        if (update.requested_bank_account_holder) updateData.bank_account_holder = update.requested_bank_account_holder;
        if (update.requested_qr_code_url) updateData.qr_code_url = update.requested_qr_code_url;

        if (Object.keys(updateData).length > 0) {
          const { error: updateError } = await supabase
            .from("collaborators")
            .update(updateData)
            .eq("id", update.collaborator_id);
          if (updateError) throw updateError;
        }
      }

      // Update the request status
      const { error } = await supabase
        .from("collaborator_profile_updates")
        .update({
          status: approve ? "approved" : "rejected",
          admin_notes: adminNotes || null,
          processed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, { approve }) => {
      queryClient.invalidateQueries({ queryKey: ["profile-updates"] });
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
      toast.success(approve ? "Đã duyệt yêu cầu" : "Đã từ chối yêu cầu");
      setSelectedUpdate(null);
      setAdminNotes("");
    },
    onError: (error: Error) => {
      toast.error("Lỗi: " + error.message);
    },
  });

  const handleProcess = async (approve: boolean) => {
    if (!selectedUpdate) return;
    setIsProcessing(true);
    await processUpdate.mutateAsync({ id: selectedUpdate.id, approve });
    setIsProcessing(false);
  };

  const getCollaboratorName = (collaboratorId: string) => {
    return collaborators?.find((c) => c.id === collaboratorId)?.name || "N/A";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Chờ duyệt</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Đã duyệt</Badge>;
      case "rejected":
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingCount = updates?.filter((u) => u.status === "pending").length || 0;

  return (
    <>
      <Helmet>
        <title>Duyệt Profile CTV | Admin</title>
      </Helmet>

      <main className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-serif">Duyệt cập nhật hồ sơ CTV</h1>
              <p className="text-muted-foreground text-sm">
                {pendingCount} yêu cầu đang chờ duyệt
              </p>
            </div>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách yêu cầu</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Đang tải...</p>
              ) : !updates?.length ? (
                <p className="text-muted-foreground">Chưa có yêu cầu nào</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>CTV</TableHead>
                        <TableHead>Thay đổi</TableHead>
                        <TableHead>Ngày gửi</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {updates.map((update) => (
                        <TableRow key={update.id}>
                          <TableCell className="font-medium">
                            {getCollaboratorName(update.collaborator_id)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {update.requested_name && (
                                <Badge variant="secondary" className="text-xs">
                                  <User className="h-3 w-3 mr-1" />
                                  Tên
                                </Badge>
                              )}
                              {update.requested_phone && (
                                <Badge variant="secondary" className="text-xs">
                                  <Phone className="h-3 w-3 mr-1" />
                                  SĐT
                                </Badge>
                              )}
                              {update.requested_avatar_url && (
                                <Badge variant="secondary" className="text-xs">
                                  <Image className="h-3 w-3 mr-1" />
                                  Avatar
                                </Badge>
                              )}
                              {(update.requested_bank_name ||
                                update.requested_bank_account_number ||
                                update.requested_bank_account_holder ||
                                update.requested_qr_code_url) && (
                                <Badge variant="secondary" className="text-xs">
                                  <Landmark className="h-3 w-3 mr-1" />
                                  Ngân hàng
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(update.created_at).toLocaleDateString("vi-VN")}
                          </TableCell>
                          <TableCell>{getStatusBadge(update.status)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUpdate(update)}
                            >
                              Chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Detail Dialog */}
      <Dialog open={!!selectedUpdate} onOpenChange={() => setSelectedUpdate(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu cập nhật</DialogTitle>
          </DialogHeader>

          {selectedUpdate && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">
                  CTV: {getCollaboratorName(selectedUpdate.collaborator_id)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Gửi lúc: {new Date(selectedUpdate.created_at).toLocaleString("vi-VN")}
                </p>
              </div>

              {selectedUpdate.requested_name && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Tên mới:</p>
                  <p className="text-sm p-2 bg-muted rounded">{selectedUpdate.requested_name}</p>
                </div>
              )}

              {selectedUpdate.requested_phone && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Số điện thoại mới:</p>
                  <p className="text-sm p-2 bg-muted rounded">{selectedUpdate.requested_phone}</p>
                </div>
              )}

              {selectedUpdate.requested_avatar_url && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Ảnh đại diện mới:</p>
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUpdate.requested_avatar_url} />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                </div>
              )}

              {selectedUpdate.requested_bank_name && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Ngân hàng mới:</p>
                  <p className="text-sm p-2 bg-muted rounded">{selectedUpdate.requested_bank_name}</p>
                </div>
              )}

              {selectedUpdate.requested_bank_account_number && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Số tài khoản mới:</p>
                  <p className="text-sm p-2 bg-muted rounded">{selectedUpdate.requested_bank_account_number}</p>
                </div>
              )}

              {selectedUpdate.requested_bank_account_holder && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Chủ tài khoản mới:</p>
                  <p className="text-sm p-2 bg-muted rounded">{selectedUpdate.requested_bank_account_holder}</p>
                </div>
              )}

              {selectedUpdate.requested_qr_code_url && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Mã QR mới:</p>
                  <img
                    src={selectedUpdate.requested_qr_code_url}
                    alt="QR Code"
                    className="w-32 rounded border"
                  />
                </div>
              )}

              {selectedUpdate.status === "pending" && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Ghi chú (tùy chọn):</p>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Ghi chú cho CTV..."
                  />
                </div>
              )}

              {selectedUpdate.status !== "pending" && selectedUpdate.admin_notes && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Ghi chú Admin:</p>
                  <p className="text-sm p-2 bg-muted rounded">{selectedUpdate.admin_notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {selectedUpdate?.status === "pending" && (
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
                  Duyệt
                </Button>
              </>
            )}
            {selectedUpdate?.status !== "pending" && (
              <Button variant="outline" onClick={() => setSelectedUpdate(null)}>
                Đóng
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminProfileUpdates;
