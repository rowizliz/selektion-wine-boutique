import { useState } from "react";
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
import { useCreateOrder } from "@/hooks/useOrders";

interface OrderItemForm {
  wine_id: string;
  wine_name: string;
  quantity: number;
  unit_price: number;
  purchase_price: number;
}

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId?: string;
}

function parsePrice(priceStr: string): number {
  const num = priceStr.replace(/[^\d]/g, "");
  return parseInt(num, 10) || 0;
}

const CreateOrderDialog = ({ open, onOpenChange, profileId }: CreateOrderDialogProps) => {
  const { data: inventory } = useInventory(profileId);
  const createOrder = useCreateOrder();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<"sale" | "gift">("sale");
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<OrderItemForm[]>([]);

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
    if (!customerName || items.length === 0) return;

    await createOrder.mutateAsync({
      customer_name: customerName,
      customer_phone: customerPhone || undefined,
      order_type: orderType,
      notes: notes || undefined,
      discount,
      profile_id: profileId,
      items,
    });

    setCustomerName("");
    setCustomerPhone("");
    setOrderType("sale");
    setNotes("");
    setDiscount(0);
    setItems([]);
    onOpenChange(false);
  };

  const availableInventory = inventory?.filter((i) => i.quantity_in_stock > 0) ?? [];

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - discount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Đơn Hàng Mới</DialogTitle>
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
                const invItem = inventory?.find((i) => i.wine_id === item.wine_id);
                const maxQty = invItem?.quantity_in_stock ?? 1;
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
                          {availableInventory.map((inv) => (
                            <SelectItem key={inv.wine_id} value={inv.wine_id}>
                              {inv.wine?.name} (còn {inv.quantity_in_stock})
                            </SelectItem>
                          ))}
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
              disabled={!customerName || items.length === 0 || createOrder.isPending}
            >
              Tạo Đơn Hàng
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderDialog;
