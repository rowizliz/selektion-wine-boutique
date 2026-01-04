import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Upload, Check, X, Eye } from "lucide-react";
import {
  useAllWithdrawals,
  useProcessWithdrawal,
  uploadTransferProof,
  type WithdrawalRequest,
} from "@/hooks/useWithdrawals";
import { useCollaborators } from "@/hooks/useCollaborators";

export function AdminWithdrawals() {
  const { data: withdrawals, isLoading } = useAllWithdrawals();
  const { data: collaborators } = useCollaborators();
  const processWithdrawal = useProcessWithdrawal();

  const [processingWithdrawal, setProcessingWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [viewingWithdrawal, setViewingWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [transferProofUrl, setTransferProofUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const getCollaboratorInfo = (collaboratorId: string) => {
    return collaborators?.find((c) => c.id === collaboratorId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default">Đã duyệt</Badge>;
      case "rejected":
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return <Badge variant="secondary">Chờ duyệt</Badge>;
    }
  };

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !processingWithdrawal) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadTransferProof(file, processingWithdrawal.id);
      setTransferProofUrl(url);
      toast.success("Đã tải lên ảnh chuyển khoản");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tải lên");
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = async () => {
    if (!processingWithdrawal) return;

    if (!transferProofUrl) {
      toast.error("Vui lòng tải lên ảnh chuyển khoản");
      return;
    }

    try {
      await processWithdrawal.mutateAsync({
        id: processingWithdrawal.id,
        status: "approved",
        transfer_proof_url: transferProofUrl,
        admin_notes: adminNotes,
        deduct_from_wallet: true,
        collaborator_id: processingWithdrawal.collaborator_id,
        amount: processingWithdrawal.amount,
      });
      toast.success("Đã duyệt yêu cầu rút tiền");
      setProcessingWithdrawal(null);
      setAdminNotes("");
      setTransferProofUrl("");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi duyệt");
    }
  };

  const handleReject = async () => {
    if (!processingWithdrawal) return;

    try {
      await processWithdrawal.mutateAsync({
        id: processingWithdrawal.id,
        status: "rejected",
        admin_notes: adminNotes,
      });
      toast.success("Đã từ chối yêu cầu rút tiền");
      setProcessingWithdrawal(null);
      setAdminNotes("");
      setTransferProofUrl("");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi từ chối");
    }
  };

  const openProcessDialog = (withdrawal: WithdrawalRequest) => {
    setProcessingWithdrawal(withdrawal);
    setAdminNotes("");
    setTransferProofUrl(withdrawal.transfer_proof_url || "");
  };

  if (isLoading) {
    return <p className="text-center py-8 text-muted-foreground">Đang tải...</p>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu rút tiền</CardTitle>
        </CardHeader>
        <CardContent>
          {!withdrawals?.length ? (
            <p className="text-center py-8 text-muted-foreground">Chưa có yêu cầu rút tiền nào</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CTV</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Ngày yêu cầu</TableHead>
                  <TableHead>Thông tin ngân hàng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => {
                  const collab = getCollaboratorInfo(withdrawal.collaborator_id);
                  return (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-medium">{collab?.name || "N/A"}</TableCell>
                      <TableCell className="font-semibold text-primary">
                        {formatPrice(withdrawal.amount)}
                      </TableCell>
                      <TableCell>
                        {new Date(withdrawal.created_at).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        {collab?.bank_account_number ? (
                          <div className="text-sm">
                            <p>{collab.bank_name}</p>
                            <p className="text-muted-foreground">{collab.bank_account_number}</p>
                            <p className="text-muted-foreground">{collab.bank_account_holder}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Chưa cập nhật</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {withdrawal.status === "pending" ? (
                          <Button size="sm" onClick={() => openProcessDialog(withdrawal)}>
                            Xử lý
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewingWithdrawal(withdrawal)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Process Withdrawal Dialog */}
      <Dialog open={!!processingWithdrawal} onOpenChange={() => setProcessingWithdrawal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Xử lý yêu cầu rút tiền</DialogTitle>
          </DialogHeader>
          {processingWithdrawal && (
            <div className="space-y-4">
              {/* Withdrawal Info */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CTV:</span>
                  <span className="font-medium">
                    {getCollaboratorInfo(processingWithdrawal.collaborator_id)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số tiền:</span>
                  <span className="font-semibold text-primary">
                    {formatPrice(processingWithdrawal.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngân hàng:</span>
                  <span>
                    {getCollaboratorInfo(processingWithdrawal.collaborator_id)?.bank_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">STK:</span>
                  <span>
                    {getCollaboratorInfo(processingWithdrawal.collaborator_id)?.bank_account_number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chủ TK:</span>
                  <span>
                    {getCollaboratorInfo(processingWithdrawal.collaborator_id)?.bank_account_holder}
                  </span>
                </div>
              </div>

              {/* QR Code if available */}
              {getCollaboratorInfo(processingWithdrawal.collaborator_id)?.qr_code_url && (
                <div>
                  <Label>Mã QR chuyển khoản của CTV</Label>
                  <img
                    src={getCollaboratorInfo(processingWithdrawal.collaborator_id)?.qr_code_url || ""}
                    alt="QR Code"
                    className="max-h-48 rounded-lg border mt-2"
                  />
                </div>
              )}

              {/* Upload Transfer Proof */}
              <div>
                <Label>Ảnh chuyển khoản (bắt buộc khi duyệt)</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadProof}
                />
                {transferProofUrl ? (
                  <div className="relative mt-2">
                    <img
                      src={transferProofUrl}
                      alt="Transfer proof"
                      className="max-h-48 rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => setTransferProofUrl("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Đang tải lên..." : "Tải lên ảnh chuyển khoản"}
                  </Button>
                )}
              </div>

              {/* Admin Notes */}
              <div>
                <Label>Ghi chú (tùy chọn)</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Ghi chú cho CTV..."
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setProcessingWithdrawal(null)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processWithdrawal.isPending}
            >
              <X className="h-4 w-4 mr-1" />
              Từ chối
            </Button>
            <Button onClick={handleApprove} disabled={processWithdrawal.isPending || !transferProofUrl}>
              <Check className="h-4 w-4 mr-1" />
              Duyệt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Withdrawal Dialog */}
      <Dialog open={!!viewingWithdrawal} onOpenChange={() => setViewingWithdrawal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu rút tiền</DialogTitle>
          </DialogHeader>
          {viewingWithdrawal && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CTV:</span>
                  <span className="font-medium">
                    {getCollaboratorInfo(viewingWithdrawal.collaborator_id)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số tiền:</span>
                  <span className="font-semibold text-primary">
                    {formatPrice(viewingWithdrawal.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  {getStatusBadge(viewingWithdrawal.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày yêu cầu:</span>
                  <span>{new Date(viewingWithdrawal.created_at).toLocaleDateString("vi-VN")}</span>
                </div>
                {viewingWithdrawal.processed_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày xử lý:</span>
                    <span>
                      {new Date(viewingWithdrawal.processed_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}
              </div>

              {viewingWithdrawal.transfer_proof_url && (
                <div>
                  <Label>Ảnh chuyển khoản</Label>
                  <img
                    src={viewingWithdrawal.transfer_proof_url}
                    alt="Transfer proof"
                    className="w-full rounded-lg border mt-2"
                  />
                </div>
              )}

              {viewingWithdrawal.admin_notes && (
                <div>
                  <Label>Ghi chú</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {viewingWithdrawal.admin_notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
