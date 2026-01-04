import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Order, useUpdateOrderStatus, useDeleteOrder } from "@/hooks/useOrders";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
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

const OrdersTable = ({ orders, isLoading }: OrdersTableProps) => {
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  const handleStatusChange = (orderId: string, status: Order["status"]) => {
    updateStatus.mutate({ orderId, status });
  };

  const handleDelete = (orderId: string) => {
    if (confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
      deleteOrder.mutate(orderId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-muted-foreground">
          Chưa có đơn hàng nào.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Khách Hàng</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Sản Phẩm</TableHead>
              <TableHead className="text-right">Doanh Thu</TableHead>
              <TableHead className="text-right">Chiết Khấu</TableHead>
              <TableHead className="text-right">Giá Vốn</TableHead>
              <TableHead className="text-right">Lợi Nhuận</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {orders.map((order) => {
              const revenue =
                order.order_items?.reduce(
                  (sum, item) => sum + item.unit_price * item.quantity,
                  0
                ) ?? 0;
              const cost =
                order.order_items?.reduce(
                  (sum, item) => sum + item.purchase_price * item.quantity,
                  0
                ) ?? 0;
              const discount = order.discount ?? 0;
              const profit = revenue - discount - cost;
              const itemCount =
                order.order_items?.reduce((sum, item) => sum + item.quantity, 0) ??
                0;

              return (
                <TableRow key={order.id}>
                  <TableCell>
                    {format(new Date(order.created_at), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      {order.customer_phone && (
                        <p className="text-sm text-muted-foreground">
                          {order.customer_phone}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.order_type === "sale" ? "default" : "secondary"}>
                      {order.order_type === "sale" ? "Bán" : "Tặng"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      {order.order_items?.map((item, idx) => (
                        <p key={idx} className="text-sm truncate">
                          {item.quantity}x {item.wine_name}
                        </p>
                      ))}
                      <p className="text-xs text-muted-foreground mt-1">
                        Tổng: {itemCount} chai
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(revenue)}
                  </TableCell>
                  <TableCell className="text-right text-orange-600">
                    {discount > 0 ? `-${formatCurrency(discount)}` : "-"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(cost)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      profit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(profit)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Badge className={statusColors[order.status]}>
                            {statusLabels[order.status]}
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {(["pending", "confirmed", "completed", "cancelled"] as const).map(
                          (status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => handleStatusChange(order.id, status)}
                              disabled={order.status === status}
                            >
                              {statusLabels[status]}
                            </DropdownMenuItem>
                          )
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(order.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrdersTable;
