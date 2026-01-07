import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { GiftSetDB, GiftSetInput, uploadGiftImage } from "@/hooks/useGiftSets";

interface GiftSetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  giftSet: GiftSetDB | null;
  onSubmit: (data: GiftSetInput & { id?: string }) => void;
  isLoading: boolean;
}

const GiftSetFormDialog = ({
  open,
  onOpenChange,
  giftSet,
  onSubmit,
  isLoading,
}: GiftSetFormDialogProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [wine, setWine] = useState("");
  const [category, setCategory] = useState("standard");
  const [items, setItems] = useState<string[]>([""]);
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState("0");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (giftSet) {
      setName(giftSet.name);
      setPrice(giftSet.price.toString());
      setWine(giftSet.wine || "");
      setCategory(giftSet.category);
      setItems(giftSet.items.length > 0 ? giftSet.items : [""]);
      setImageUrl(giftSet.image_url || "");
      setIsActive(giftSet.is_active);
      setDisplayOrder(giftSet.display_order.toString());
    } else {
      setName("");
      setPrice("");
      setWine("");
      setCategory("standard");
      setItems([""]);
      setImageUrl("");
      setIsActive(true);
      setDisplayOrder("0");
    }
  }, [giftSet, open]);

  const handleAddItem = () => {
    setItems([...items, ""]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadGiftImage(file);
      setImageUrl(url);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredItems = items.filter((item) => item.trim() !== "");
    
    onSubmit({
      ...(giftSet && { id: giftSet.id }),
      name,
      price: parseFloat(price) || 0,
      wine: wine || null,
      category,
      items: filteredItems,
      image_url: imageUrl || null,
      is_active: isActive,
      display_order: parseInt(displayOrder) || 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{giftSet ? "Chỉnh sửa Set Quà" : "Thêm Set Quà Mới"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên set quà *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Sắc Xuân RW 17"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VND) *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="790000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Loại *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Tiêu chuẩn</SelectItem>
                  <SelectItem value="premium">Cao cấp</SelectItem>
                  <SelectItem value="luxury">Sang trọng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wine">Rượu đi kèm</Label>
            <Input
              id="wine"
              value={wine}
              onChange={(e) => setWine(e.target.value)}
              placeholder="VD: Vang đỏ Pháp"
            />
          </div>

          <div className="space-y-2">
            <Label>Các món trong set</Label>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    placeholder={`Món ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm món
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ảnh sản phẩm</Label>
            <div className="flex gap-4 items-start">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border"
                />
              )}
              <div className="flex-1">
                <Label
                  htmlFor="image-upload"
                  className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                >
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5" />
                  )}
                  <span>{uploading ? "Đang tải..." : "Upload ảnh"}</span>
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display_order">Thứ tự hiển thị</Label>
              <Input
                id="display_order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between space-x-2 pt-6">
              <Label htmlFor="is_active">Hiển thị</Label>
              <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading || uploading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : giftSet ? (
                "Cập nhật"
              ) : (
                "Thêm mới"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GiftSetFormDialog;
