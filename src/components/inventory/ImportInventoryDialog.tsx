import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ImportInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId: string | null;
}

interface CSVInventoryItem {
  wine_name: string;
  wine_id?: string;
  quantity_in_stock: number;
  purchase_price: number;
}

interface ParsedInventoryItem extends CSVInventoryItem {
  resolved_wine_id: string | null;
  resolved_wine_name: string | null;
}

interface ImportStatus {
  wine_name: string;
  status: "pending" | "importing" | "success" | "error" | "not_found";
  message?: string;
}

function parseCSV(text: string): CSVInventoryItem[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  // Detect delimiter: semicolon or comma
  const firstLine = lines[0];
  const delimiter = firstLine.includes(";") ? ";" : ",";

  const headers = lines[0].split(delimiter).map((h) => h.trim().toLowerCase().replace(/"/g, ""));

  // Support both wine_name and name columns
  const wineNameIndex = headers.findIndex(h => h === "wine_name" || h === "name");
  const quantityIndex = headers.findIndex(h => h === "quantity_in_stock" || h === "quantity");
  const priceIndex = headers.findIndex(h => h === "purchase_price" || h === "price");

  if (wineNameIndex === -1) {
    throw new Error("CSV thiếu cột bắt buộc: wine_name hoặc name");
  }
  if (quantityIndex === -1) {
    throw new Error("CSV thiếu cột bắt buộc: quantity_in_stock hoặc quantity");
  }
  if (priceIndex === -1) {
    throw new Error("CSV thiếu cột bắt buộc: purchase_price hoặc price");
  }

  const items: CSVInventoryItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle CSV with quoted values
    const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ""));
    
    const wine_name = values[wineNameIndex]?.trim();
    const quantity = parseInt(values[quantityIndex]?.trim() || "0", 10);
    const price = parseFloat(values[priceIndex]?.trim().replace(",", ".") || "0");

    if (wine_name) {
      items.push({
        wine_name,
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
  const [parsedItems, setParsedItems] = useState<ParsedInventoryItem[]>([]);
  const [importStatuses, setImportStatuses] = useState<ImportStatus[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Fetch wines for matching
  const resolveWineNames = async (items: CSVInventoryItem[]): Promise<ParsedInventoryItem[]> => {
    const { data: wines } = await supabase
      .from("wines")
      .select("id, name");

    if (!wines) return items.map(item => ({ ...item, resolved_wine_id: null, resolved_wine_name: null }));

    return items.map(item => {
      // Case-insensitive match
      const matchedWine = wines.find(
        w => w.name.toLowerCase().trim() === item.wine_name.toLowerCase().trim()
      );

      return {
        ...item,
        resolved_wine_id: matchedWine?.id || null,
        resolved_wine_name: matchedWine?.name || null,
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setImportStatuses([]);
    setIsValidating(true);

    try {
      const text = await selectedFile.text();
      const items = parseCSV(text);
      
      // Resolve wine names to IDs
      const resolvedItems = await resolveWineNames(items);
      setParsedItems(resolvedItems);
      
      // Set initial statuses - mark not found items
      setImportStatuses(
        resolvedItems.map((item) => ({
          wine_name: item.wine_name,
          status: item.resolved_wine_id ? "pending" : "not_found",
          message: item.resolved_wine_id ? undefined : "Không tìm thấy wine",
        }))
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lỗi đọc file CSV");
      setParsedItems([]);
    } finally {
      setIsValidating(false);
    }
  };

  const importInventory = async () => {
    if (!profileId) {
      toast.error("Vui lòng chọn kỳ hàng trước khi import");
      return;
    }

    // Only import items with resolved wine_id
    const validItems = parsedItems.filter(item => item.resolved_wine_id);
    
    if (validItems.length === 0) {
      toast.error("Không có sản phẩm hợp lệ để import");
      return;
    }

    setIsImporting(true);

    for (let i = 0; i < parsedItems.length; i++) {
      const item = parsedItems[i];

      // Skip not found items
      if (!item.resolved_wine_id) {
        continue;
      }

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
          .eq("wine_id", item.resolved_wine_id)
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
            wine_id: item.resolved_wine_id,
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
  const notFoundCount = importStatuses.filter((s) => s.status === "not_found").length;
  const validCount = parsedItems.filter((item) => item.resolved_wine_id).length;

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
                disabled={isImporting || isValidating}
              />
            </div>
          </div>

          {/* Sample Format */}
          <div className="bg-muted p-3 rounded-lg text-xs">
            <p className="font-medium mb-1">Format CSV mẫu:</p>
            <code className="text-muted-foreground">
              wine_name;quantity_in_stock;purchase_price
              <br />
              770 Miles Zinfandel;12;300000
              <br />
              Château Franc Pipeau;6;650000
            </code>
          </div>

          {/* Validating */}
          {isValidating && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Đang kiểm tra danh sách wines...</span>
            </div>
          )}

          {/* Preview & Status */}
          {parsedItems.length > 0 && !isValidating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  <FileText className="h-4 w-4 inline mr-1" />
                  {parsedItems.length} sản phẩm trong file
                </p>
                <div className="text-sm text-muted-foreground">
                  {notFoundCount > 0 && (
                    <span className="text-amber-600 mr-2">
                      <AlertCircle className="h-3 w-3 inline mr-1" />
                      {notFoundCount} không tìm thấy
                    </span>
                  )}
                  {importStatuses.some((s) => s.status === "success" || s.status === "error") && (
                    <>
                      <span className="text-green-600">{successCount} thành công</span>
                      {errorCount > 0 && (
                        <span className="text-red-600 ml-2">{errorCount} lỗi</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left p-2">Tên Wine</th>
                      <th className="text-right p-2">Số lượng</th>
                      <th className="text-right p-2">Giá nhập</th>
                      <th className="text-center p-2 w-24">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedItems.map((item, idx) => {
                      const status = importStatuses[idx];
                      const isNotFound = !item.resolved_wine_id;
                      return (
                        <tr key={idx} className={`border-t ${isNotFound ? "bg-amber-50" : ""}`}>
                          <td className="p-2 max-w-[200px]">
                            <div className="truncate" title={item.wine_name}>
                              {item.resolved_wine_name || item.wine_name}
                            </div>
                            {isNotFound && (
                              <div className="text-xs text-amber-600">Không tìm thấy</div>
                            )}
                          </td>
                          <td className="p-2 text-right">{item.quantity_in_stock}</td>
                          <td className="p-2 text-right">
                            {item.purchase_price.toLocaleString("vi-VN")}đ
                          </td>
                          <td className="p-2 text-center">
                            {status?.status === "pending" && (
                              <span className="text-muted-foreground">—</span>
                            )}
                            {status?.status === "not_found" && (
                              <AlertCircle className="h-4 w-4 mx-auto text-amber-500" />
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
              disabled={validCount === 0 || isImporting || isValidating || !profileId}
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang import...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import {validCount} sản phẩm
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
