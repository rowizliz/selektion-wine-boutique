import { useState, useEffect, useRef } from "react";
import { Settings, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Collaborator } from "@/hooks/useCollaborators";

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaborator: Collaborator;
}

interface PendingUpdate {
  id: string;
  status: string;
  created_at: string;
  requested_name: string | null;
  requested_phone: string | null;
  requested_avatar_url: string | null;
  requested_bank_name: string | null;
  requested_bank_account_number: string | null;
  requested_bank_account_holder: string | null;
  requested_qr_code_url: string | null;
}

export const ProfileSettingsDialog = ({
  open,
  onOpenChange,
  collaborator,
}: ProfileSettingsDialogProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountHolder, setBankAccountHolder] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<PendingUpdate | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && collaborator) {
      setName(collaborator.name || "");
      setPhone(collaborator.phone || "");
      setAvatarUrl(collaborator.avatar_url || "");
      setBankName(collaborator.bank_name || "");
      setBankAccountNumber(collaborator.bank_account_number || "");
      setBankAccountHolder(collaborator.bank_account_holder || "");
      setQrCodeUrl(collaborator.qr_code_url || "");
      
      // Check for pending update requests
      fetchPendingUpdate();
    }
  }, [open, collaborator]);

  const fetchPendingUpdate = async () => {
    const { data } = await supabase
      .from("collaborator_profile_updates")
      .select("*")
      .eq("collaborator_id", collaborator.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    setPendingUpdate(data);
  };

  const handleUploadFile = async (
    file: File,
    type: "avatar" | "qr"
  ): Promise<string | null> => {
    if (!file) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${collaborator.id}/${type}-${Date.now()}.${fileExt}`;
    
    setIsUploading(true);
    
    const { data, error } = await supabase.storage
      .from("collaborator-files")
      .upload(fileName, file, { upsert: true });

    setIsUploading(false);

    if (error) {
      toast.error("Lỗi tải ảnh lên: " + error.message);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from("collaborator-files")
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await handleUploadFile(file, "avatar");
    if (url) {
      setAvatarUrl(url);
    }
  };

  const handleQrChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await handleUploadFile(file, "qr");
    if (url) {
      setQrCodeUrl(url);
    }
  };

  const hasChanges = () => {
    return (
      name !== (collaborator.name || "") ||
      phone !== (collaborator.phone || "") ||
      avatarUrl !== (collaborator.avatar_url || "") ||
      bankName !== (collaborator.bank_name || "") ||
      bankAccountNumber !== (collaborator.bank_account_number || "") ||
      bankAccountHolder !== (collaborator.bank_account_holder || "") ||
      qrCodeUrl !== (collaborator.qr_code_url || "")
    );
  };

  const handleSubmit = async () => {
    if (!hasChanges()) {
      toast.info("Không có thay đổi nào");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from("collaborator_profile_updates")
      .insert({
        collaborator_id: collaborator.id,
        requested_name: name !== collaborator.name ? name : null,
        requested_phone: phone !== collaborator.phone ? phone : null,
        requested_avatar_url: avatarUrl !== collaborator.avatar_url ? avatarUrl : null,
        requested_bank_name: bankName !== collaborator.bank_name ? bankName : null,
        requested_bank_account_number: bankAccountNumber !== collaborator.bank_account_number ? bankAccountNumber : null,
        requested_bank_account_holder: bankAccountHolder !== collaborator.bank_account_holder ? bankAccountHolder : null,
        requested_qr_code_url: qrCodeUrl !== collaborator.qr_code_url ? qrCodeUrl : null,
      });

    setIsSubmitting(false);

    if (error) {
      toast.error("Lỗi gửi yêu cầu: " + error.message);
      return;
    }

    toast.success("Yêu cầu cập nhật đã được gửi, đợi Admin duyệt");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cài đặt hồ sơ
          </DialogTitle>
          <DialogDescription>
            Thay đổi thông tin cá nhân. Mỗi thay đổi cần Admin duyệt.
          </DialogDescription>
        </DialogHeader>

        {pendingUpdate && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm">
            <p className="font-medium text-yellow-800">Bạn có yêu cầu đang chờ duyệt</p>
            <p className="text-yellow-700 text-xs mt-1">
              Gửi lúc: {new Date(pendingUpdate.created_at).toLocaleString("vi-VN")}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="text-lg">{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Đang tải..." : "Đổi ảnh đại diện"}
            </Button>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên hiển thị</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên của bạn"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </div>

          {/* Bank Info */}
          <div className="space-y-2">
            <Label htmlFor="bank_name">Tên ngân hàng</Label>
            <Input
              id="bank_name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="VD: Vietcombank"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank_account_number">Số tài khoản</Label>
            <Input
              id="bank_account_number"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              placeholder="Nhập số tài khoản"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank_account_holder">Chủ tài khoản</Label>
            <Input
              id="bank_account_holder"
              value={bankAccountHolder}
              onChange={(e) => setBankAccountHolder(e.target.value)}
              placeholder="Nhập tên chủ tài khoản"
            />
          </div>

          {/* QR Code */}
          <div className="space-y-2">
            <Label>Mã QR ngân hàng</Label>
            {qrCodeUrl && (
              <div className="relative w-32 mx-auto">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-full rounded-md border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => setQrCodeUrl("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <input
              ref={qrInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleQrChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => qrInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Đang tải..." : "Tải mã QR lên"}
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !hasChanges()}>
            {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
