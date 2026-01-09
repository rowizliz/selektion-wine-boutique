import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Package, Wallet, ChevronRight, Clock } from "lucide-react";
import { CollaboratorOrder } from "@/hooks/useCollaborators";
import { WithdrawalRequest } from "@/hooks/useWithdrawals";

interface CollaboratorHistoryProps {
    orders: CollaboratorOrder[];
    withdrawals: WithdrawalRequest[];
}

export const CollaboratorHistory = ({ orders, withdrawals }: CollaboratorHistoryProps) => {
    const [selectedOrder, setSelectedOrder] = useState<CollaboratorOrder | null>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getOrderStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
            pending: { label: "Chờ duyệt", variant: "secondary" },
            approved: { label: "Đã duyệt", variant: "default" },
            rejected: { label: "Từ chối", variant: "destructive" },
            completed: { label: "Hoàn thành", variant: "default" },
        };
        const config = statusMap[status] || { label: status, variant: "outline" as const };
        return <Badge variant={config.variant} className="text-[9px] px-1.5 h-4">{config.label}</Badge>;
    };

    const getWithdrawalStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
            pending: { label: "Chờ xử lý", variant: "secondary" },
            approved: { label: "Đã duyệt", variant: "default" },
            rejected: { label: "Từ chối", variant: "destructive" },
            completed: { label: "Hoàn thành", variant: "default" },
        };
        const config = statusMap[status] || { label: status, variant: "outline" as const };
        return <Badge variant={config.variant} className="text-[9px] px-1.5 h-4">{config.label}</Badge>;
    };

    return (
        <div className="flex-1 overflow-hidden pb-16">
            <Tabs defaultValue="orders" className="h-full flex flex-col">
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-3 py-2 border-b">
                    <TabsList className="grid w-full grid-cols-2 h-9">
                        <TabsTrigger value="orders" className="text-xs">
                            <Package className="h-3.5 w-3.5 mr-1.5" />
                            Đơn hàng
                        </TabsTrigger>
                        <TabsTrigger value="withdrawals" className="text-xs">
                            <Wallet className="h-3.5 w-3.5 mr-1.5" />
                            Rút tiền
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="orders" className="flex-1 overflow-y-auto p-2 m-0">
                    {orders.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground text-sm">
                            Chưa có đơn hàng nào
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-card rounded-lg p-3 border shadow-sm cursor-pointer hover:bg-muted/30 transition-colors"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="flex items-start justify-between mb-1.5">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{order.customer_name}</p>
                                            <p className="text-[10px] text-muted-foreground">{formatDate(order.created_at)}</p>
                                        </div>
                                        {getOrderStatusBadge(order.status)}
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Tổng tiền:</span>
                                        <span className="font-bold">{formatPrice(order.total_amount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-green-600">
                                        <span>Hoa hồng:</span>
                                        <span className="font-medium">+{formatPrice(order.commission_amount)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="withdrawals" className="flex-1 overflow-y-auto p-2 m-0">
                    {withdrawals.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground text-sm">
                            Chưa có yêu cầu rút tiền nào
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {withdrawals.map((withdrawal) => (
                                <div
                                    key={withdrawal.id}
                                    className="bg-card rounded-lg p-3 border shadow-sm"
                                >
                                    <div className="flex items-start justify-between mb-1.5">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm">{formatPrice(withdrawal.amount)}</p>
                                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatDate(withdrawal.created_at)}
                                            </p>
                                        </div>
                                        {getWithdrawalStatusBadge(withdrawal.status)}
                                    </div>
                                    {withdrawal.admin_notes && (
                                        <p className="text-[10px] text-amber-600 mt-1 italic">
                                            Ghi chú: {withdrawal.admin_notes}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Order Detail Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-base">Chi tiết đơn hàng</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-3 text-sm">
                            <div className="bg-muted/30 p-2 rounded-lg space-y-1">
                                <p><strong>Khách:</strong> {selectedOrder.customer_name}</p>
                                {selectedOrder.customer_phone && <p><strong>SĐT:</strong> {selectedOrder.customer_phone}</p>}
                                {selectedOrder.customer_address && <p><strong>Địa chỉ:</strong> {selectedOrder.customer_address}</p>}
                                <p><strong>Ngày:</strong> {formatDate(selectedOrder.created_at)}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-1.5 text-xs uppercase text-muted-foreground">Sản phẩm</h4>
                                <div className="space-y-1.5">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-xs bg-muted/20 p-1.5 rounded">
                                            <span className="flex-1 truncate mr-2">{item.wine_name}</span>
                                            <span className="whitespace-nowrap">x{item.quantity} • {formatPrice(item.collaborator_price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-2 space-y-1">
                                <div className="flex justify-between">
                                    <span>Tổng tiền:</span>
                                    <span className="font-bold">{formatPrice(selectedOrder.total_amount)}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Hoa hồng:</span>
                                    <span className="font-bold">+{formatPrice(selectedOrder.commission_amount)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
