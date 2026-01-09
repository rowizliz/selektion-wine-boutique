import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X, ChevronDown, ChevronUp } from "lucide-react";
import { InventoryItem, useUpsertInventory } from "@/hooks/useInventory";

interface MobileInventoryCardProps {
  item: InventoryItem;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function parsePrice(priceStr: string): number {
  const num = priceStr.replace(/[^\d]/g, "");
  return parseInt(num, 10) || 0;
}

const MobileInventoryCard = ({ item }: MobileInventoryCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editValues, setEditValues] = useState({ quantity: 0, price: 0 });
  const upsertInventory = useUpsertInventory();

  const sellingPrice = parsePrice(item.wine?.price ?? "0");
  const profitPerBottle = sellingPrice - item.purchase_price;
  const totalValue = item.quantity_in_stock * item.purchase_price;

  const handleEdit = () => {
    setEditValues({
      quantity: item.quantity_in_stock,
      price: item.purchase_price,
    });
    setIsEditing(true);
    setExpanded(true);
  };

  const handleSave = async () => {
    await upsertInventory.mutateAsync({
      wine_id: item.wine_id,
      quantity_in_stock: editValues.quantity,
      purchase_price: editValues.price,
    });
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Main row - always visible */}
        <div 
          className="flex items-center gap-3 p-3 cursor-pointer"
          onClick={() => !isEditing && setExpanded(!expanded)}
        >
          {item.wine?.image_url && (
            <img
              src={item.wine.image_url}
              alt={item.wine.name}
              className="w-10 h-14 object-contain flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{item.wine?.name}</p>
            <p className="text-xs text-muted-foreground">{item.wine?.category}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`font-bold ${item.quantity_in_stock < 5 ? "text-red-600" : ""}`}>
              {item.quantity_in_stock}
            </p>
            <p className="text-xs text-muted-foreground">chai</p>
          </div>
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="border-t bg-muted/30 p-3 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Giá Bán</p>
                <p className="font-medium">{item.wine?.price}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Giá Nhập</p>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editValues.price}
                    onChange={(e) => setEditValues({ ...editValues, price: Number(e.target.value) })}
                    className="h-8 text-sm"
                  />
                ) : (
                  <p className="font-medium">{formatCurrency(item.purchase_price)}</p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Lợi Nhuận/Chai</p>
                <p className={`font-medium ${profitPerBottle >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(profitPerBottle)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Tồn Kho</p>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editValues.quantity}
                    onChange={(e) => setEditValues({ ...editValues, quantity: Number(e.target.value) })}
                    className="h-8 text-sm"
                  />
                ) : (
                  <p className="font-medium">{item.quantity_in_stock}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t">
              <div>
                <p className="text-muted-foreground text-xs">Tổng Giá Trị</p>
                <p className="font-bold">{formatCurrency(totalValue)}</p>
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Hủy
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={upsertInventory.isPending}>
                    <Save className="h-4 w-4 mr-1" />
                    Lưu
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={handleEdit}>
                  <Edit2 className="h-4 w-4 mr-1" />
                  Sửa
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileInventoryCard;
