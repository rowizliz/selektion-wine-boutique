import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit2, Save, X } from "lucide-react";
import { InventoryItem, useUpsertInventory } from "@/hooks/useInventory";

interface InventoryTableProps {
  inventory: InventoryItem[];
  isLoading: boolean;
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

const InventoryTable = ({ inventory, isLoading }: InventoryTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ quantity: 0, price: 0 });
  const upsertInventory = useUpsertInventory();

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditValues({
      quantity: item.quantity_in_stock,
      price: item.purchase_price,
    });
  };

  const handleSave = async (wineId: string) => {
    await upsertInventory.mutateAsync({
      wine_id: wineId,
      quantity_in_stock: editValues.quantity,
      purchase_price: editValues.price,
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
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

  if (inventory.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-muted-foreground">
          Chưa có dữ liệu kho hàng. Hãy thêm tồn kho cho các sản phẩm.
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
              <TableHead>Sản Phẩm</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead className="text-right">Giá Bán</TableHead>
              <TableHead className="text-right">Giá Nhập</TableHead>
              <TableHead className="text-right">Tồn Kho</TableHead>
              <TableHead className="text-right">Lợi Nhuận/Chai</TableHead>
              <TableHead className="text-right">Tổng Giá Trị</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => {
              const sellingPrice = parsePrice(item.wine?.price ?? "0");
              const profitPerBottle = sellingPrice - item.purchase_price;
              const totalValue = item.quantity_in_stock * item.purchase_price;
              const isEditing = editingId === item.id;

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {item.wine?.image_url && (
                        <img
                          src={item.wine.image_url}
                          alt={item.wine.name}
                          className="w-12 h-16 object-contain"
                        />
                      )}
                      <span className="font-medium">{item.wine?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.wine?.category}</TableCell>
                  <TableCell className="text-right">
                    {item.wine?.price}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValues.price}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-28 text-right"
                      />
                    ) : (
                      formatCurrency(item.purchase_price)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValues.quantity}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            quantity: Number(e.target.value),
                          })
                        }
                        className="w-20 text-right"
                      />
                    ) : (
                      <span
                        className={
                          item.quantity_in_stock < 5
                            ? "text-red-600 font-semibold"
                            : ""
                        }
                      >
                        {item.quantity_in_stock}
                      </span>
                    )}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      profitPerBottle >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(profitPerBottle)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totalValue)}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleSave(item.wine_id)}
                          disabled={upsertInventory.isPending}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
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

export default InventoryTable;
