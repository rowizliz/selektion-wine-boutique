import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ImportInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId: string | null;
}

interface CSVInventoryItem {
  wine_id: string;
  quantity_in_stock: number;
  purchase_price: number;
}

interface ImportStatus {
  wine_id: string;
  status: "pending" | "importing" | "success" | "error";
  message?: string;
}

function parseCSV(text: string): CSVInventoryItem[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  // Detect delimiter: semicolon or comma
  const firstLine = lines[0];
  const delimiter = firstLine.includes(";") ? ";" : ",";

  const headers = lines[0].split(delimiter).map((h) => h.trim().toLowerCase());

  const wineIdIndex = headers.findIndex(h => h === "wine_id");
  const quantityIndex = headers.findIndex(h => h === "quantity_in_stock");
  const priceIndex = headers.findIndex(h => h === "purchase_price");

  if (wineIdIndex === -1 || quantityIndex === -1 || priceIndex === -1) {
    throw new Error("CSV thiếu cột bắt buộc: wine_id, quantity_in_stock, purchase_price");
  }

  const items: CSVInventoryItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(delimiter);
    
    const wine_id = values[wineIdIndex]?.trim();
    const quantity = parseInt(values[quantityIndex]?.trim() || "0", 10);
    const price = parseFloat(values[priceIndex]?.trim().replace(",", ".") || "0");

    if (wine_id) {
      items.push({
        wine_id,
        quantity_in_stock: quantity,
        purchase_price: price,
      });
    }
  }

  return items;
}

export default function ImportInventoryDialog({
  open,
  onOpenChange,
  profileId,
}: ImportInventoryDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedItems, setParsedItems] = useState<CSVInventoryItem[]>([]);
  const [importStatuses, setImportStatuses] = useState<ImportStatus[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setImportStatuses([]);

    try {
      const text = await selectedFile.text();
      const items = parseCSV(text);
      setParsedItems(items);
      setImportStatuses(
        items.map((item) => ({
          wine_id: item.wine_id,
          status: "pending" as const,
        }))
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lỗi đọc file CSV");
      setParsedItems([]);
    }
  };

  const importInventory = async () => {
    if (!profileId) {
      toast.error("Vui lòng chọn kỳ hàng trước khi import");
      return;
    }

    setIsImporting(true);

    for (let i = 0; i < parsedItems.length; i++) {
      const item = parsedItems[i];

      setImportStatuses((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: "importing" as const } : s
        )
      );

      try {
        // Check if inventory exists for this wine in this profile
        const { data: existing } = await supabase
          .from("inventory")
          .select("id")
          .eq("wine_id", item.wine_id)
          .eq("profile_id", profileId)
          .maybeSingle();

        if (existing) {
          // Update existing
          const { error } = await supabase
            .from("inventory")
            .update({
              quantity_in_stock: item.quantity_in_stock,
              purchase_price: item.purchase_price,
            })
            .eq("id", existing.id);

          if (error) throw error;
        } else {
          // Insert new
          const { error } = await supabase.from("inventory").insert({
            wine_id: item.wine_id,
            quantity_in_stock: item.quantity_in_stock,
            purchase_price: item.purchase_price,
            profile_id: profileId,
          });

          if (error) throw error;
        }

        setImportStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? { ...s, status: "success" as const, message: "Đã import" }
              : s
          )
        );
      } catch (error) {
        setImportStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? {
                  ...s,
                  status: "error" as const,
                  message: error instanceof Error ? error.message : "Lỗi",
                }
              : s
          )
        );
      }
    }

    setIsImporting(false);
    queryClient.invalidateQueries({ queryKey: ["inventory"] });
    toast.success("Đã hoàn thành import kho hàng");
  };

  const handleClose = () => {
    setFile(null);
    setParsedItems([]);
    setImportStatuses([]);
    onOpenChange(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const successCount = importStatuses.filter((s) => s.status === "success").length;
  const errorCount = importStatuses.filter((s) => s.status === "error").length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Kho Hàng từ CSV</DialogTitle>
          <DialogDescription>
            Upload file CSV chứa dữ liệu kho hàng để import vào hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Chọn file CSV</Label>
            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isImporting}
              />
            </div>
          </div>

          {/* Sample Format */}
          <div className="bg-muted p-3 rounded-lg text-xs">
            <p className="font-medium mb-1">Format CSV mẫu:</p>
            <code className="text-muted-foreground">
              wine_id;quantity_in_stock;purchase_price
              <br />
              4dd0209c-f4b3-4791-94f9-a954e0ee65e3;12;300000
              <br />
              3adeeddf-5289-4b45-8b06-87d12d0651cf;6;650000
            </code>
          </div>

          {/* Preview & Status */}
          {parsedItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  <FileText className="h-4 w-4 inline mr-1" />
                  {parsedItems.length} sản phẩm trong file
                </p>
                {importStatuses.some((s) => s.status !== "pending") && (
                  <p className="text-sm text-muted-foreground">
                    <span className="text-green-600">{successCount} thành công</span>
                    {errorCount > 0 && (
                      <span className="text-red-600 ml-2">{errorCount} lỗi</span>
                    )}
                  </p>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left p-2">Wine ID</th>
                      <th className="text-right p-2">Số lượng</th>
                      <th className="text-right p-2">Giá nhập</th>
                      <th className="text-center p-2 w-20">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedItems.map((item, idx) => {
                      const status = importStatuses[idx];
                      return (
                        <tr key={idx} className="border-t">
                          <td className="p-2 font-mono text-xs truncate max-w-[200px]">
                            {item.wine_id}
                          </td>
                          <td className="p-2 text-right">{item.quantity_in_stock}</td>
                          <td className="p-2 text-right">
                            {item.purchase_price.toLocaleString("vi-VN")}đ
                          </td>
                          <td className="p-2 text-center">
                            {status?.status === "pending" && (
                              <span className="text-muted-foreground">—</span>
                            )}
                            {status?.status === "importing" && (
                              <Loader2 className="h-4 w-4 animate-spin mx-auto text-blue-500" />
                            )}
                            {status?.status === "success" && (
                              <CheckCircle className="h-4 w-4 mx-auto text-green-500" />
                            )}
                            {status?.status === "error" && (
                              <XCircle className="h-4 w-4 mx-auto text-red-500" />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={isImporting}>
              Đóng
            </Button>
            <Button
              onClick={importInventory}
              disabled={parsedItems.length === 0 || isImporting || !profileId}
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang import...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import {parsedItems.length} sản phẩm
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
