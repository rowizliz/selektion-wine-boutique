import { useState, useEffect } from "react";
import { Key, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

interface PasswordChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaborator: Collaborator;
}

interface PendingRequest {
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
  const [pendingRequest, setPendingRequest] = useState<PendingRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && collaborator) {
      fetchPendingRequest();
    }
  }, [open, collaborator]);

  const fetchPendingRequest = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("password_change_requests")
      .select("*")
      .eq("collaborator_id", collaborator.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    setPendingRequest(data);
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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Yêu cầu đổi mật khẩu
          </DialogTitle>
          <DialogDescription>
            Gửi yêu cầu đổi mật khẩu để Admin xét duyệt. Sau khi được duyệt, bạn sẽ nhận email để đặt mật khẩu mới.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : pendingRequest ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="font-medium text-yellow-800">Bạn có yêu cầu đang chờ duyệt</p>
            <p className="text-yellow-700 text-sm mt-1">
              Gửi lúc: {new Date(pendingRequest.created_at).toLocaleString("vi-VN")}
            </p>
            {pendingRequest.reason && (
              <p className="text-yellow-700 text-sm mt-1">
                Lý do: {pendingRequest.reason}
              </p>
            )}
          </div>
        ) : (
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
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {!pendingRequest && !isLoading && (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
