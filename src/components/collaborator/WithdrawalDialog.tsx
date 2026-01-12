import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2 } from "lucide-react";
import { useCreateWithdrawal, useCanRequestWithdrawal } from "@/hooks/useWithdrawals";
import { useOwnBankingDetails, type CollaboratorProfile } from "@/hooks/useCollaborators";

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaborator: CollaboratorProfile;
}

export function WithdrawalDialog({ open, onOpenChange, collaborator }: WithdrawalDialogProps) {
  const [amount, setAmount] = useState("");
  const createWithdrawal = useCreateWithdrawal();
  const { data: canWithdrawData } = useCanRequestWithdrawal(collaborator.id);
  const { data: bankingDetails, isLoading: isLoadingBanking } = useOwnBankingDetails();

  const hasBankAccount = !!bankingDetails?.bank_account_number;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const handleSubmit = async () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (numAmount > collaborator.wallet_balance) {
      toast.error("Số tiền rút vượt quá số dư ví");
      return;
    }

    try {
      await createWithdrawal.mutateAsync({
        collaborator_id: collaborator.id,
        amount: numAmount,
      });
      toast.success("Đã gửi yêu cầu rút tiền, chờ admin duyệt");
      setAmount("");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi gửi yêu cầu");
    }
  };

  const canRequest = canWithdrawData?.canRequest ?? true;
  const nextAllowedDate = canWithdrawData?.nextAllowedDate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yêu cầu rút tiền</DialogTitle>
          <DialogDescription>
            Số dư hiện tại: <span className="font-semibold text-primary">{formatPrice(collaborator.wallet_balance)}</span>
          </DialogDescription>
        </DialogHeader>

        {isLoadingBanking ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !canRequest && nextAllowedDate ? (
          <div className="py-4 text-center">
            <p className="text-muted-foreground">
              Bạn chỉ có thể yêu cầu rút tiền 1 lần/tuần.
            </p>
            <p className="mt-2 text-sm">
              Yêu cầu tiếp theo có thể gửi vào:{" "}
              <span className="font-semibold">
                {new Date(nextAllowedDate).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Số tiền muốn rút (đ)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền"
                min={0}
                max={collaborator.wallet_balance}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tối đa: {formatPrice(collaborator.wallet_balance)}
              </p>
            </div>

            {!hasBankAccount && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                ⚠️ Vui lòng cập nhật thông tin ngân hàng trước khi yêu cầu rút tiền.
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {canRequest && !isLoadingBanking && (
            <Button
              onClick={handleSubmit}
              disabled={createWithdrawal.isPending || !hasBankAccount}
            >
              {createWithdrawal.isPending ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
