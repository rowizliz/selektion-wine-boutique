import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { Order, useUpdateOrderStatus, useDeleteOrder } from "@/hooks/useOrders";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface MobileOrderCardProps {
  order: Order;
  onEdit: (order: Order) => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

const statusColors: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<Order["status"], string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  completed: "Hoàn thành",
  cancelled: "Đã huỷ",
};

const MobileOrderCard = ({ order, onEdit }: MobileOrderCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  const revenue = order.order_items?.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) ?? 0;
  const cost = order.order_items?.reduce((sum, item) => sum + item.purchase_price * item.quantity, 0) ?? 0;
  const discount = order.discount ?? 0;
  const profit = revenue - discount - cost;
  const itemCount = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const handleStatusChange = (status: Order["status"]) => {
    updateStatus.mutate({ orderId: order.id, status });
  };

  const handleDelete = () => {
    if (confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
      deleteOrder.mutate(order.id);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Main row */}
        <div 
          className="flex items-center gap-3 p-3 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-sm truncate">{order.customer_name}</p>
              <Badge variant={order.order_type === "sale" ? "default" : "secondary"} className="text-xs">
                {order.order_type === "sale" ? "Bán" : "Tặng"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(order.created_at), "dd/MM/yyyy", { locale: vi })} • {itemCount} chai
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`font-bold text-sm ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(profit)}
            </p>
            <Badge className={`${statusColors[order.status]} text-xs`}>
              {statusLabels[order.status]}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="border-t bg-muted/30 p-3 space-y-3">
            {/* Products list */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Sản Phẩm</p>
              <div className="space-y-1">
                {order.order_items?.map((item, idx) => (
                  <p key={idx} className="text-sm">
                    {item.quantity}x {item.wine_name}
                  </p>
                ))}
              </div>
            </div>

            {/* Financial details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Doanh Thu</p>
                <p className="font-medium">{formatCurrency(revenue)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Giá Vốn</p>
                <p className="font-medium text-muted-foreground">{formatCurrency(cost)}</p>
              </div>
              {discount > 0 && (
                <div>
                  <p className="text-muted-foreground text-xs">Chiết Khấu</p>
                  <p className="font-medium text-orange-600">-{formatCurrency(discount)}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-xs">Lợi Nhuận</p>
                <p className={`font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(profit)}
                </p>
              </div>
            </div>

            {order.customer_phone && (
              <div>
                <p className="text-muted-foreground text-xs">SĐT</p>
                <p className="text-sm">{order.customer_phone}</p>
              </div>
            )}

            {order.notes && (
              <div>
                <p className="text-muted-foreground text-xs">Ghi Chú</p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-2 border-t">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Đổi Trạng Thái
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {(["pending", "confirmed", "completed", "cancelled"] as const).map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={order.status === status}
                    >
                      {statusLabels[status]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex gap-2">
                {order.status === "pending" && (
                  <Button size="sm" variant="outline" onClick={() => onEdit(order)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileOrderCard;
