import { Badge } from "@/components/ui/badge";
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
import { useState } from "react";
import { useCollaboratorWithdrawals, type WithdrawalRequest } from "@/hooks/useWithdrawals";

interface WithdrawalHistoryProps {
  collaboratorId: string;
}

export function WithdrawalHistory({ collaboratorId }: WithdrawalHistoryProps) {
  const { data: withdrawals, isLoading } = useCollaboratorWithdrawals(collaboratorId);
  const [viewingProof, setViewingProof] = useState<WithdrawalRequest | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
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

  if (isLoading) {
    return <p className="text-center py-8 text-muted-foreground">Đang tải...</p>;
  }

  if (!withdrawals?.length) {
    return <p className="text-center py-8 text-muted-foreground">Chưa có yêu cầu rút tiền nào</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ngày yêu cầu</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày xử lý</TableHead>
            <TableHead>Ảnh chuyển khoản</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.map((withdrawal) => (
            <TableRow key={withdrawal.id}>
              <TableCell>
                {new Date(withdrawal.created_at).toLocaleDateString("vi-VN")}
              </TableCell>
              <TableCell className="font-semibold">
                {formatPrice(withdrawal.amount)}
              </TableCell>
              <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
              <TableCell>
                {withdrawal.processed_at
                  ? new Date(withdrawal.processed_at).toLocaleDateString("vi-VN")
                  : "-"}
              </TableCell>
              <TableCell>
                {withdrawal.transfer_proof_url ? (
                  <button
                    className="text-primary underline text-sm hover:no-underline"
                    onClick={() => setViewingProof(withdrawal)}
                  >
                    Xem ảnh
                  </button>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* View Transfer Proof Dialog */}
      <Dialog open={!!viewingProof} onOpenChange={() => setViewingProof(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ảnh chuyển khoản</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {viewingProof?.transfer_proof_url && (
              <img
                src={viewingProof.transfer_proof_url}
                alt="Transfer proof"
                className="w-full rounded-lg border"
              />
            )}
            {viewingProof?.admin_notes && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium">Ghi chú từ admin:</p>
                <p className="text-sm text-muted-foreground">{viewingProof.admin_notes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
