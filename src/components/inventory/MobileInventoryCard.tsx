import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X, ChevronDown, ChevronUp } from "lucide-react";
import { InventoryItem, useUpsertInventory } from "@/hooks/useInventory";

interface MobileInventoryCardProps {
  item: InventoryItem;
  soldCount?: number;
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

const MobileInventoryCard = ({ item, soldCount = 0 }: MobileInventoryCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editValues, setEditValues] = useState({ totalImported: 0, price: 0 });
  const upsertInventory = useUpsertInventory();

  const sellingPrice = parsePrice(item.wine?.price ?? "0");
  const profitPerBottle = sellingPrice - item.purchase_price;
  const totalValue = item.quantity_in_stock * item.purchase_price;
  const totalImported = item.quantity_in_stock + soldCount;

  const handleEdit = () => {
    setEditValues({
      totalImported: totalImported,
      price: item.purchase_price,
    });
    setIsEditing(true);
    setExpanded(true);
  };

  const handleSave = async () => {
    const quantityInStock = editValues.totalImported - soldCount;
    await upsertInventory.mutateAsync({
      wine_id: item.wine_id,
      quantity_in_stock: quantityInStock,
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
              {totalImported} / {item.quantity_in_stock}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Nhập / Tồn</p>
          </div>
          <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8">
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
                    className="h-8 text-sm px-2 mt-1"
                  />
                ) : (
                  <p className="font-medium">{formatCurrency(item.purchase_price)}</p>
                )}
              </div>
              <div className="col-span-1">
                <p className="text-muted-foreground text-xs">Tổng nhập</p>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editValues.totalImported}
                    onChange={(e) => setEditValues({ ...editValues, totalImported: Number(e.target.value) })}
                    className="h-8 text-sm px-2 mt-1"
                  />
                ) : (
                  <p className="font-medium">{totalImported}</p>
                )}
              </div>
              <div className="col-span-1">
                <p className="text-muted-foreground text-xs">Tồn Kho</p>
                {isEditing ? (
                  <p className="font-medium mt-1">{editValues.totalImported - soldCount}</p>
                ) : (
                  <p className={`font-medium ${item.quantity_in_stock < 5 ? "text-red-600" : ""}`}>
                    {item.quantity_in_stock}
                  </p>
                )}
              </div>
              <div className="col-span-2 border-t pt-2 mt-1">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-muted-foreground text-xs">Lợi Nhuận/Chai</p>
                    <p className={`font-medium ${profitPerBottle >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(profitPerBottle)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Tổng Giá Trị</p>
                    <p className="font-bold">{formatCurrency(totalValue)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center pt-2 border-t gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Hủy
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={upsertInventory.isPending}>
                    <Save className="h-4 w-4 mr-1" />
                    Lưu
                  </Button>
                </>
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
