import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { useUpdateCollaboratorBankInfo, uploadQRCode } from "@/hooks/useWithdrawals";
import type { Collaborator } from "@/hooks/useCollaborators";

interface BankInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaborator: Collaborator;
}

export function BankInfoDialog({ open, onOpenChange, collaborator }: BankInfoDialogProps) {
  const [bankName, setBankName] = useState(collaborator.bank_name || "");
  const [accountNumber, setAccountNumber] = useState(collaborator.bank_account_number || "");
  const [accountHolder, setAccountHolder] = useState(collaborator.bank_account_holder || "");
  const [qrCodeUrl, setQrCodeUrl] = useState(collaborator.qr_code_url || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateBankInfo = useUpdateCollaboratorBankInfo();

  const handleUploadQR = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadQRCode(file, collaborator.id);
      setQrCodeUrl(url);
      toast.success("Đã tải lên mã QR");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tải lên");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateBankInfo.mutateAsync({
        id: collaborator.id,
        bank_name: bankName || undefined,
        bank_account_number: accountNumber || undefined,
        bank_account_holder: accountHolder || undefined,
        qr_code_url: qrCodeUrl || undefined,
      });
      toast.success("Đã cập nhật thông tin ngân hàng");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi cập nhật");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thông tin ngân hàng</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Tên ngân hàng</Label>
            <Input
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="VD: Vietcombank, MB Bank..."
            />
          </div>
          <div>
            <Label>Số tài khoản</Label>
            <Input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Nhập số tài khoản"
            />
          </div>
          <div>
            <Label>Tên chủ tài khoản</Label>
            <Input
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="Nhập tên chủ tài khoản"
            />
          </div>
          <div>
            <Label>Mã QR chuyển khoản</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadQR}
            />
            {qrCodeUrl ? (
              <div className="relative mt-2">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="max-h-48 rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => setQrCodeUrl("")}
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
                {uploading ? "Đang tải lên..." : "Tải lên mã QR"}
              </Button>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={updateBankInfo.isPending}>
            {updateBankInfo.isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
