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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWines } from "@/hooks/useWines";
import { useUpsertInventory, useInventory } from "@/hooks/useInventory";

interface AddInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddInventoryDialog = ({ open, onOpenChange }: AddInventoryDialogProps) => {
  const { data: wines } = useWines();
  const { data: inventory } = useInventory();
  const upsertInventory = useUpsertInventory();

  const [selectedWine, setSelectedWine] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");

  // Filter wines that don't have inventory yet
  const inventoryWineIds = new Set(inventory?.map((i) => i.wine_id) ?? []);
  const availableWines = wines?.filter((w) => !inventoryWineIds.has(w.id)) ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWine || !quantity || !purchasePrice) return;

    await upsertInventory.mutateAsync({
      wine_id: selectedWine,
      quantity_in_stock: Number(quantity),
      purchase_price: Number(purchasePrice),
    });

    setSelectedWine("");
    setQuantity("");
    setPurchasePrice("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm Tồn Kho</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Sản Phẩm</Label>
            <Select value={selectedWine} onValueChange={setSelectedWine}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn sản phẩm..." />
              </SelectTrigger>
              <SelectContent>
                {availableWines.map((wine) => (
                  <SelectItem key={wine.id} value={wine.id}>
                    {wine.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableWines.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Tất cả sản phẩm đã có trong kho
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Số Lượng Tồn Kho</Label>
            <Input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Giá Nhập (VND)</Label>
            <Input
              type="number"
              min="0"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Huỷ
            </Button>
            <Button
              type="submit"
              disabled={!selectedWine || !quantity || !purchasePrice || upsertInventory.isPending}
            >
              Thêm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryDialog;
