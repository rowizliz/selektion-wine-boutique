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
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateWine, useUpdateWine, uploadWineImage, WineDB, WineInput } from "@/hooks/useWines";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2 } from "lucide-react";

interface WineFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wine: WineDB | null;
}

const FLAVOR_OPTIONS = [
  "cherry", "plum", "raspberry", "strawberry", "blackberry", "currant",
  "vanilla", "chocolate", "cocoa", "mocha", "caramel", "honey",
  "apple", "peach", "citrus", "orange", "grapefruit", "lemon",
  "floral", "violet", "rose", "herb", "tobacco", "leather",
  "cedar", "butter", "cream", "earthy", "mineral", "spice",
  "berry", "raisin", "musk", "banana",
];

const WineFormDialog = ({ open, onOpenChange, wine }: WineFormDialogProps) => {
  const createWine = useCreateWine();
  const updateWine = useUpdateWine();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<WineInput>({
    name: "",
    origin: "",
    grapes: "",
    price: "",
    description: "",
    category: "red",
  });

  useEffect(() => {
    if (wine) {
      setFormData({
        name: wine.name,
        origin: wine.origin,
        grapes: wine.grapes,
        price: wine.price,
        description: wine.description,
        story: wine.story || undefined,
        image_url: wine.image_url || undefined,
        category: wine.category,
        temperature: wine.temperature || undefined,
        alcohol: wine.alcohol || undefined,
        pairing: wine.pairing || undefined,
        tasting_notes: wine.tasting_notes || undefined,
        flavor_notes: wine.flavor_notes || undefined,
        vintage: wine.vintage || undefined,
        region: wine.region || undefined,
        sweetness: wine.sweetness || undefined,
        body: wine.body || undefined,
        tannin: wine.tannin || undefined,
        acidity: wine.acidity || undefined,
        fizzy: wine.fizzy || undefined,
      });
    } else {
      setFormData({
        name: "",
        origin: "",
        grapes: "",
        price: "",
        description: "",
        category: "red",
      });
    }
  }, [wine]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadWineImage(file);
      setFormData((prev) => ({ ...prev, image_url: url }));
      toast({
        title: "Thành công",
        description: "Đã tải ảnh lên",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (wine) {
        await updateWine.mutateAsync({ id: wine.id, ...formData });
      } else {
        await createWine.mutateAsync(formData);
      }
      onOpenChange(false);
    } catch (error) {
      // Error handled in mutation
    }
  };

  const toggleFlavorNote = (flavor: string) => {
    setFormData((prev) => {
      const current = prev.flavor_notes || [];
      const isSelected = current.includes(flavor);
      return {
        ...prev,
        flavor_notes: isSelected
          ? current.filter((f) => f !== flavor)
          : [...current, flavor],
      };
    });
  };

  const isSubmitting = createWine.isPending || updateWine.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {wine ? "Chỉnh sửa rượu" : "Thêm rượu mới"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Hình ảnh</Label>
              <div className="flex items-start gap-4">
                {formData.image_url ? (
                  <div className="relative">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-24 h-32 object-contain rounded border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image_url: undefined }))
                      }
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="w-24 h-32 border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">
                          Tải ảnh
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                )}
                <div className="flex-1 space-y-2">
                  <Label htmlFor="image_url">Hoặc nhập URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, image_url: e.target.value }))
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên rượu *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vintage">Năm sản xuất</Label>
                <Input
                  id="vintage"
                  value={formData.vintage || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, vintage: e.target.value }))
                  }
                  placeholder="2020"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Xuất xứ *</Label>
                <Input
                  id="origin"
                  value={formData.origin}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, origin: e.target.value }))
                  }
                  placeholder="Bordeaux, France"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Vùng chi tiết</Label>
                <Input
                  id="region"
                  value={formData.region || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, region: e.target.value }))
                  }
                  placeholder="Saint-Émilion"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grapes">Giống nho *</Label>
                <Input
                  id="grapes"
                  value={formData.grapes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, grapes: e.target.value }))
                  }
                  placeholder="Merlot, Cabernet Sauvignon"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Loại *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: "red" | "white" | "sparkling") =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="red">Vang đỏ</SelectItem>
                    <SelectItem value="white">Vang trắng</SelectItem>
                    <SelectItem value="sparkling">Vang sủi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Giá *</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="1,550,000₫"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alcohol">Nồng độ cồn</Label>
                <Input
                  id="alcohol"
                  value={formData.alcohol || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, alcohol: e.target.value }))
                  }
                  placeholder="14%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Nhiệt độ phục vụ</Label>
                <Input
                  id="temperature"
                  value={formData.temperature || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, temperature: e.target.value }))
                  }
                  placeholder="16-18°C"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả ngắn *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="story">Câu chuyện chi tiết</Label>
              <Textarea
                id="story"
                value={formData.story || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, story: e.target.value }))
                }
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tasting_notes">Ghi chú nếm thử</Label>
              <Textarea
                id="tasting_notes"
                value={formData.tasting_notes || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tasting_notes: e.target.value }))
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pairing">Kết hợp món ăn</Label>
              <Textarea
                id="pairing"
                value={formData.pairing || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, pairing: e.target.value }))
                }
                rows={2}
              />
            </div>

            {/* Flavor Notes */}
            <div className="space-y-2">
              <Label>Nốt hương</Label>
              <div className="flex flex-wrap gap-2">
                {FLAVOR_OPTIONS.map((flavor) => (
                  <Button
                    key={flavor}
                    type="button"
                    size="sm"
                    variant={
                      formData.flavor_notes?.includes(flavor)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => toggleFlavorNote(flavor)}
                    className="text-xs"
                  >
                    {flavor}
                  </Button>
                ))}
              </div>
            </div>

            {/* Characteristics */}
            <div className="space-y-4">
              <Label>Đặc tính (0-9)</Label>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Độ ngọt</span>
                    <span>{formData.sweetness || 0}</span>
                  </div>
                  <Slider
                    value={[formData.sweetness || 0]}
                    onValueChange={([v]) =>
                      setFormData((prev) => ({ ...prev, sweetness: v }))
                    }
                    max={9}
                    step={0.5}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Độ đậm</span>
                    <span>{formData.body || 0}</span>
                  </div>
                  <Slider
                    value={[formData.body || 0]}
                    onValueChange={([v]) =>
                      setFormData((prev) => ({ ...prev, body: v }))
                    }
                    max={9}
                    step={0.5}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Độ chát</span>
                    <span>{formData.tannin || 0}</span>
                  </div>
                  <Slider
                    value={[formData.tannin || 0]}
                    onValueChange={([v]) =>
                      setFormData((prev) => ({ ...prev, tannin: v }))
                    }
                    max={9}
                    step={0.5}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Độ chua</span>
                    <span>{formData.acidity || 0}</span>
                  </div>
                  <Slider
                    value={[formData.acidity || 0]}
                    onValueChange={([v]) =>
                      setFormData((prev) => ({ ...prev, acidity: v }))
                    }
                    max={9}
                    step={0.5}
                  />
                </div>
                {formData.category === "sparkling" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Độ sủi</span>
                      <span>{formData.fizzy || 0}</span>
                    </div>
                    <Slider
                      value={[formData.fizzy || 0]}
                      onValueChange={([v]) =>
                        setFormData((prev) => ({ ...prev, fizzy: v }))
                      }
                      max={9}
                      step={0.5}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : wine ? (
                  "Cập nhật"
                ) : (
                  "Thêm mới"
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default WineFormDialog;
