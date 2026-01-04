import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { Order, useUpdateOrder } from "@/hooks/useOrders";

interface OrderItemForm {
  id?: string;
  wine_id: string;
  wine_name: string;
  quantity: number;
  unit_price: number;
  purchase_price: number;
  original_quantity?: number; // Track original quantity for inventory adjustment
}

interface EditOrderDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function parsePrice(priceStr: string): number {
  const num = priceStr.replace(/[^\d]/g, "");
  return parseInt(num, 10) || 0;
}

const EditOrderDialog = ({ order, open, onOpenChange }: EditOrderDialogProps) => {
  const { data: inventory } = useInventory();
  const updateOrder = useUpdateOrder();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<"sale" | "gift">("sale");
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<OrderItemForm[]>([]);

  // Initialize form when order changes
  useEffect(() => {
    if (order) {
      setCustomerName(order.customer_name);
      setCustomerPhone(order.customer_phone || "");
      setOrderType(order.order_type);
      setNotes(order.notes || "");
      setDiscount(order.discount || 0);
      setItems(
        order.order_items?.map((item) => ({
          id: item.id,
          wine_id: item.wine_id || "",
          wine_name: item.wine_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          purchase_price: item.purchase_price,
          original_quantity: item.quantity,
        })) || []
      );
    }
  }, [order]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { wine_id: "", wine_name: "", quantity: 1, unit_price: 0, purchase_price: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, wineId: string) => {
    const invItem = inventory?.find((i) => i.wine_id === wineId);
    if (!invItem) return;

    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      wine_id: wineId,
      wine_name: invItem.wine?.name ?? "",
      quantity: 1,
      unit_price: parsePrice(invItem.wine?.price ?? "0"),
      purchase_price: invItem.purchase_price,
    };
    setItems(newItems);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !customerName || items.length === 0) return;

    await updateOrder.mutateAsync({
      orderId: order.id,
      customer_name: customerName,
      customer_phone: customerPhone || undefined,
      order_type: orderType,
      notes: notes || undefined,
      discount,
      items: items.map((item) => ({
        id: item.id,
        wine_id: item.wine_id,
        wine_name: item.wine_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        purchase_price: item.purchase_price,
        original_quantity: item.original_quantity,
      })),
      originalItems: order.order_items || [],
    });

    onOpenChange(false);
  };

  // Get available inventory (including current order items)
  const getAvailableStock = (wineId: string, currentItemIndex: number) => {
    const invItem = inventory?.find((i) => i.wine_id === wineId);
    if (!invItem) return 0;
    
    let available = invItem.quantity_in_stock;
    
    // Add back the original quantity if this item was part of the order
    const currentItem = items[currentItemIndex];
    if (currentItem?.original_quantity && currentItem.wine_id === wineId) {
      available += currentItem.original_quantity;
    }
    
    return available;
  };

  const availableInventory = inventory?.filter((i) => i.quantity_in_stock > 0) ?? [];
  
  // Also include wines that are currently in the order but may have 0 stock
  const currentWineIds = items.map(i => i.wine_id).filter(Boolean);
  const orderWines = inventory?.filter(i => currentWineIds.includes(i.wine_id)) ?? [];
  const allAvailableWines = [...new Map([...availableInventory, ...orderWines].map(i => [i.wine_id, i])).values()];

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - discount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sửa Đơn Hàng</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tên Khách Hàng *</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nhập tên khách hàng"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Số Điện Thoại</Label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0912 345 678"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Loại Đơn</Label>
            <Select
              value={orderType}
              onValueChange={(v) => setOrderType(v as "sale" | "gift")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Đơn Bán</SelectItem>
                <SelectItem value="gift">Đơn Tặng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Sản Phẩm *</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-1" />
                Thêm
              </Button>
            </div>

            {items.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                Chưa có sản phẩm. Nhấn "Thêm" để thêm sản phẩm.
              </p>
            )}

            <div className="space-y-2">
              {items.map((item, index) => {
                const maxQty = getAvailableStock(item.wine_id, index);
                const itemTotal = item.unit_price * item.quantity;

                return (
                  <div
                    key={index}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <Select
                        value={item.wine_id}
                        onValueChange={(v) => handleItemChange(index, v)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Chọn sản phẩm..." />
                        </SelectTrigger>
                        <SelectContent>
                          {allAvailableWines.map((inv) => {
                            const stock = inv.quantity_in_stock + (item.original_quantity && item.wine_id === inv.wine_id ? item.original_quantity : 0);
                            return (
                              <SelectItem key={inv.wine_id} value={inv.wine_id}>
                                {inv.wine?.name} (còn {stock})
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <Input
                        type="number"
                        min="1"
                        max={maxQty}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, Number(e.target.value))
                        }
                        className="w-20"
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    {item.wine_id && (
                      <div className="flex justify-between text-sm text-muted-foreground px-1">
                        <span>Đơn giá: {item.unit_price.toLocaleString("vi-VN")} đ</span>
                        <span className="font-medium text-foreground">
                          Thành tiền: {itemTotal.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tổng tiền hàng:</span>
                <span>{subtotal.toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="flex justify-between text-sm items-center gap-2">
                <span>Chiết khấu:</span>
                <Input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-32 h-8 text-right"
                />
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Thành tiền:</span>
                <span className="text-primary">{finalTotal.toLocaleString("vi-VN")} đ</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Ghi Chú</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú thêm..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Huỷ
            </Button>
            <Button
              type="submit"
              disabled={!customerName || items.length === 0 || updateOrder.isPending}
            >
              Lưu Thay Đổi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDialog;
