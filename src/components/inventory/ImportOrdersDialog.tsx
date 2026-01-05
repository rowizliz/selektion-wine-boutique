import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ImportOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId: string | null;
}

interface CSVOrder {
  customer_name: string;
  customer_phone?: string;
  order_type: string;
  notes?: string;
  discount?: string;
  wines: string; // Format: "wine_name:quantity:unit_price:purchase_price;..."
  created_at?: string;
}

interface ImportStatus {
  customer_name: string;
  status: "pending" | "success" | "error";
  message: string;
}

function parseCSV(text: string): CSVOrder[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""));
  const orders: CSVOrder[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const order: Record<string, string> = {};

    headers.forEach((header, index) => {
      if (values[index]) {
        order[header] = values[index].trim();
      }
    });

    if (order.customer_name && order.wines) {
      orders.push(order as unknown as CSVOrder);
    }
  }

  return orders;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.replace(/^"|"$/g, ""));
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.replace(/^"|"$/g, ""));
  return result;
}

function parseWines(winesStr: string): { wine_name: string; quantity: number; unit_price: number; purchase_price: number }[] {
  const wines: { wine_name: string; quantity: number; unit_price: number; purchase_price: number }[] = [];
  
  const items = winesStr.split(";");
  for (const item of items) {
    const parts = item.split(":");
    if (parts.length >= 4) {
      wines.push({
        wine_name: parts[0].trim(),
        quantity: parseInt(parts[1]) || 1,
        unit_price: parseFloat(parts[2]) || 0,
        purchase_price: parseFloat(parts[3]) || 0,
      });
    }
  }

  return wines;
}

export default function ImportOrdersDialog({
  open,
  onOpenChange,
  profileId,
}: ImportOrdersDialogProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvOrders, setCsvOrders] = useState<CSVOrder[]>([]);
  const [importStatuses, setImportStatuses] = useState<ImportStatus[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const orders = parseCSV(text);
      setCsvOrders(orders);
      setImportStatuses(
        orders.map((o) => ({
          customer_name: o.customer_name,
          status: "pending" as const,
          message: "Chờ import",
        }))
      );
    };
    reader.readAsText(file);
  };

  const importOrders = async () => {
    if (csvOrders.length === 0) {
      toast.error("Chưa có dữ liệu để import");
      return;
    }

    setIsImporting(true);
    const newStatuses = [...importStatuses];

    for (let i = 0; i < csvOrders.length; i++) {
      const csvOrder = csvOrders[i];

      try {
        const wines = parseWines(csvOrder.wines);
        if (wines.length === 0) {
          newStatuses[i] = {
            customer_name: csvOrder.customer_name,
            status: "error",
            message: "Không có sản phẩm hợp lệ",
          };
          setImportStatuses([...newStatuses]);
          continue;
        }

        // Create order
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert({
            customer_name: csvOrder.customer_name,
            customer_phone: csvOrder.customer_phone || null,
            order_type: csvOrder.order_type === "gift" ? "gift" : "sale",
            notes: csvOrder.notes || null,
            discount: parseFloat(csvOrder.discount || "0") || 0,
            profile_id: profileId,
            created_at: csvOrder.created_at || new Date().toISOString(),
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = wines.map((wine) => ({
          order_id: orderData.id,
          wine_id: null as string | null,
          wine_name: wine.wine_name,
          quantity: wine.quantity,
          unit_price: wine.unit_price,
          purchase_price: wine.purchase_price,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;

        newStatuses[i] = {
          customer_name: csvOrder.customer_name,
          status: "success",
          message: `Đã import ${wines.length} sản phẩm`,
        };
      } catch (error: any) {
        newStatuses[i] = {
          customer_name: csvOrder.customer_name,
          status: "error",
          message: error.message || "Lỗi không xác định",
        };
      }

      setImportStatuses([...newStatuses]);
    }

    setIsImporting(false);
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    toast.success("Import hoàn tất!");
  };

  const handleClose = () => {
    setCsvOrders([]);
    setImportStatuses([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  const successCount = importStatuses.filter((s) => s.status === "success").length;
  const errorCount = importStatuses.filter((s) => s.status === "error").length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Import Đơn Hàng từ CSV</DialogTitle>
          <DialogDescription>
            Upload file CSV chứa danh sách đơn hàng. File cần có các cột: customer_name, customer_phone, order_type (sale/gift), notes, discount, wines (định dạng: tên:số lượng:giá bán:giá nhập;...)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
            >
              <Upload className="h-4 w-4 mr-2" />
              Chọn file CSV
            </Button>
            {csvOrders.length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4 inline mr-1" />
                Đã tải {csvOrders.length} đơn hàng
              </p>
            )}
          </div>

          {/* CSV Template */}
          <div className="bg-muted p-3 rounded-lg text-xs">
            <p className="font-medium mb-1">Định dạng CSV mẫu:</p>
            <code className="block overflow-x-auto whitespace-nowrap">
              customer_name,customer_phone,order_type,notes,discount,wines<br/>
              "Nguyễn Văn A","0901234567","sale","Ghi chú","100000","Rượu 1:2:500000:300000;Rượu 2:1:400000:250000"
            </code>
          </div>

          {/* Import Status */}
          {importStatuses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Tổng: {csvOrders.length}</span>
                {successCount > 0 && (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    {successCount} thành công
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="text-red-600 flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {errorCount} lỗi
                  </span>
                )}
              </div>

              <ScrollArea className="h-48 border rounded-lg">
                <div className="p-2 space-y-1">
                  {importStatuses.map((status, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-2 rounded text-sm ${
                        status.status === "success"
                          ? "bg-green-50 text-green-700"
                          : status.status === "error"
                          ? "bg-red-50 text-red-700"
                          : "bg-muted"
                      }`}
                    >
                      <span className="font-medium truncate max-w-[200px]">
                        {status.customer_name}
                      </span>
                      <span className="flex items-center gap-1">
                        {status.status === "success" && <CheckCircle className="h-3 w-3" />}
                        {status.status === "error" && <XCircle className="h-3 w-3" />}
                        {status.status === "pending" && <AlertCircle className="h-3 w-3" />}
                        {status.message}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isImporting}>
              Đóng
            </Button>
            <Button
              onClick={importOrders}
              disabled={csvOrders.length === 0 || isImporting}
            >
              {isImporting ? "Đang import..." : "Import Đơn Hàng"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
