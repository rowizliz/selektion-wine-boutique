import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CollaboratorOrder } from "@/hooks/useCollaborators";

interface CollaboratorOrdersProps {
    orders: CollaboratorOrder[];
}

export const CollaboratorOrders = ({ orders }: CollaboratorOrdersProps) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Chờ duyệt</Badge>;
            case "approved":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đã duyệt</Badge>;
            case "rejected":
                return <Badge variant="destructive">Đã từ chối</Badge>;
            case "completed":
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Hoàn thành</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="pb-20 space-y-3">
            <h2 className="font-bold text-lg px-1">Lịch sử đơn hàng</h2>

            {orders.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                    Chưa có đơn hàng nào
                </div>
            ) : (
                <div className="grid gap-2.5">
                    {orders.map((order) => (
                        <Dialog key={order.id}>
                            <DialogTrigger asChild>
                                <Card className="overflow-hidden hover:shadow-md transition-shadow active:scale-[0.99] cursor-pointer rounded-lg">
                                    <CardContent className="p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-semibold text-sm">{order.customer_name}</div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {format(new Date(order.created_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                                                </div>
                                            </div>
                                            <div className="transform scale-90 origin-right">
                                                {getStatusBadge(order.status)}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-xs border-t pt-2 mt-1">
                                            <span className="text-muted-foreground">Tổng tiền:</span>
                                            <span className="font-bold">{formatCurrency(order.total_amount)}</span>
                                        </div>

                                        <div className="flex justify-between items-center text-xs mt-1">
                                            <span className="text-muted-foreground">Hoa hồng:</span>
                                            <span className="font-medium text-green-600">
                                                +{formatCurrency(order.commission_amount)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-sm text-muted-foreground">Thông tin khách hàng</h3>
                                        <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                                            <div className="flex justify-between">
                                                <span>Tên:</span>
                                                <span className="font-medium">{order.customer_name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>SĐT:</span>
                                                <span className="font-medium">{order.customer_phone || "---"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Địa chỉ:</span>
                                                <span className="font-medium text-right max-w-[200px] truncate">{order.customer_address || "---"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-medium text-sm text-muted-foreground">Sản phẩm</h3>
                                        <div className="space-y-2">
                                            {order.items?.map((item) => (
                                                <div key={item.id} className="flex justify-between items-center bg-card border p-2 rounded-lg">
                                                    <div className="text-sm">
                                                        <div className="font-medium">{item.wine_name}</div>
                                                        <div className="text-muted-foreground text-xs">SL: {item.quantity}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium text-sm">{formatCurrency(item.collaborator_price * item.quantity)}</div>
                                                        <div className="text-xs text-muted-foreground capitalize">
                                                            {/* Commission calculation hint could go here */}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t pt-3 space-y-2">
                                        <div className="flex justify-between font-bold">
                                            <span>Tổng cộng</span>
                                            <span>{formatCurrency(order.total_amount)}</span>
                                        </div>
                                        <div className="flex justify-between text-green-600 font-medium text-sm">
                                            <span>Hoa hồng nhận được</span>
                                            <span>+{formatCurrency(order.commission_amount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            )}
        </div>
    );
};
