import { useState, useEffect } from "react";
import { Key, Loader2, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { CollaboratorProfile } from "@/hooks/useCollaborators";

interface PasswordChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaborator: CollaboratorProfile;
}

interface PasswordRequest {
  id: string;
  status: string;
  created_at: string;
  reason: string | null;
}

export const PasswordChangeDialog = ({
  open,
  onOpenChange,
  collaborator,
}: PasswordChangeDialogProps) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestRequest, setLatestRequest] = useState<PasswordRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Password change form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (open && collaborator) {
      fetchLatestRequest();
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [open, collaborator]);

  const fetchLatestRequest = async () => {
    setIsLoading(true);
    // Get the most recent request (pending or approved)
    const { data } = await supabase
      .from("password_change_requests")
      .select("*")
      .eq("collaborator_id", collaborator.id)
      .in("status", ["pending", "approved"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    setLatestRequest(data);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const { error } = await supabase
      .from("password_change_requests")
      .insert({
        collaborator_id: collaborator.id,
        reason: reason.trim() || null,
      });

    setIsSubmitting(false);

    if (error) {
      toast.error("Lỗi gửi yêu cầu: " + error.message);
      return;
    }

    toast.success("Yêu cầu đổi mật khẩu đã được gửi, đợi Admin duyệt");
    setReason("");
    fetchLatestRequest();
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsChangingPassword(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setIsChangingPassword(false);
      toast.error("Lỗi đổi mật khẩu: " + error.message);
      return;
    }

    // Mark the request as completed
    if (latestRequest) {
      await supabase
        .from("password_change_requests")
        .update({ status: "completed" })
        .eq("id", latestRequest.id);
    }

    setIsChangingPassword(false);
    toast.success("Đổi mật khẩu thành công!");
    setNewPassword("");
    setConfirmPassword("");
    onOpenChange(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      );
    }

    // Request was approved - show password change form
    if (latestRequest?.status === "approved") {
      return (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="font-medium text-green-800 flex items-center gap-2">
              <Check className="h-4 w-4" />
              Yêu cầu đã được duyệt
            </p>
            <p className="text-green-700 text-sm mt-1">
              Bạn có thể đặt mật khẩu mới bên dưới.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>
        </div>
      );
    }

    // Request is pending
    if (latestRequest?.status === "pending") {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="font-medium text-yellow-800">Bạn có yêu cầu đang chờ duyệt</p>
          <p className="text-yellow-700 text-sm mt-1">
            Gửi lúc: {new Date(latestRequest.created_at).toLocaleString("vi-VN")}
          </p>
          {latestRequest.reason && (
            <p className="text-yellow-700 text-sm mt-1">
              Lý do: {latestRequest.reason}
            </p>
          )}
        </div>
      );
    }

    // No request - show form to create one
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reason">Lý do đổi mật khẩu (tùy chọn)</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="VD: Quên mật khẩu, muốn tăng bảo mật..."
            rows={3}
          />
        </div>
      </div>
    );
  };

  const renderFooter = () => {
    if (isLoading) {
      return (
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Đóng
        </Button>
      );
    }

    if (latestRequest?.status === "approved") {
      return (
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button 
            onClick={handleChangePassword} 
            disabled={isChangingPassword || !newPassword || !confirmPassword}
          >
            {isChangingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
          </Button>
        </>
      );
    }

    if (latestRequest?.status === "pending") {
      return (
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Đóng
        </Button>
      );
    }

    return (
      <>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Đóng
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
        </Button>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            {latestRequest?.status === "approved" ? "Đổi mật khẩu" : "Yêu cầu đổi mật khẩu"}
          </DialogTitle>
          <DialogDescription>
            {latestRequest?.status === "approved" 
              ? "Nhập mật khẩu mới cho tài khoản của bạn."
              : "Gửi yêu cầu đổi mật khẩu để Admin xét duyệt."}
          </DialogDescription>
        </DialogHeader>

        {renderContent()}

        <DialogFooter className="gap-2 sm:gap-0">
          {renderFooter()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
