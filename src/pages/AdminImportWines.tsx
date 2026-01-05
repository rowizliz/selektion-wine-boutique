import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Upload, ArrowLeft, FileUp, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

// Import all wine data
import { wines as staticWines } from "@/data/wines";

interface ImportStatus {
  name: string;
  status: "pending" | "success" | "error";
  error?: string;
}

interface CSVWine {
  id: string;
  name: string;
  origin: string;
  grapes: string;
  price: string;
  description: string;
  story: string;
  image_url: string;
  category: string;
  temperature: string;
  alcohol: string;
  pairing: string;
  tasting_notes: string;
  flavor_notes: string;
  vintage: string;
  region: string;
  sweetness: string;
  body: string;
  tannin: string;
  acidity: string;
  fizzy: string;
  created_at: string;
  updated_at: string;
}

const AdminImportWines = () => {
  const queryClient = useQueryClient();
  const [isImporting, setIsImporting] = useState(false);
  const [importStatuses, setImportStatuses] = useState<ImportStatus[]>([]);
  const [progress, setProgress] = useState(0);
  const [existingCount, setExistingCount] = useState<number | null>(null);
  const [csvWines, setCsvWines] = useState<CSVWine[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    void checkExistingWines();
  }, []);

  const checkExistingWines = async () => {
    const { count, error } = await supabase
      .from("wines")
      .select("*", { count: "exact", head: true });

    if (error) {
      setExistingCount(0);
      return;
    }

    setExistingCount(count || 0);
  };

  const parseCSV = (text: string): CSVWine[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(';');
    const wines: CSVWine[] = [];
    
    let currentLine = '';
    for (let i = 1; i < lines.length; i++) {
      currentLine += lines[i];
      
      // Check if line is complete (has all fields)
      const fields = currentLine.split(';');
      if (fields.length >= headers.length) {
        const wine: any = {};
        headers.forEach((header, idx) => {
          wine[header.trim()] = fields[idx]?.trim() || '';
        });
        if (wine.id && wine.name) {
          wines.push(wine as CSVWine);
        }
        currentLine = '';
      } else {
        currentLine += '\n';
      }
    }
    
    return wines;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const wines = parseCSV(text);
      setCsvWines(wines);
      toast({
        title: "CSV đã tải",
        description: `Đã phát hiện ${wines.length} chai rượu từ file CSV`,
      });
    };
    reader.readAsText(file);
  };

  const parseFlavorNotes = (str: string): string[] | null => {
    if (!str) return null;
    try {
      // Parse JSON array like ["Dâu đen","Mâm xôi"]
      const parsed = JSON.parse(str.replace(/\\/g, ''));
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  };

  const parseNumber = (str: string): number | null => {
    if (!str || str === '') return null;
    const num = parseFloat(str);
    return isNaN(num) ? null : num;
  };

  const syncFromCSV = async () => {
    if (csvWines.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng tải file CSV trước",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportStatuses(csvWines.map((w) => ({ name: w.name, status: "pending" as const })));
    setProgress(0);

    let successCount = 0;
    let errorCount = 0;

    // Get current wines from DB to match by name
    const { data: dbWines, error: dbErr } = await supabase
      .from("wines")
      .select("id,name");

    if (dbErr) {
      setIsImporting(false);
      toast({
        title: "Lỗi",
        description: dbErr.message,
        variant: "destructive",
      });
      return;
    }

    const normalize = (s: string) => s.trim().toLowerCase();
    const byName = new Map<string, { id: string; name: string }>();

    for (const w of dbWines ?? []) {
      const key = normalize(w.name);
      if (!byName.has(key)) byName.set(key, w);
    }

    for (let i = 0; i < csvWines.length; i++) {
      const wine = csvWines[i];

      try {
        const match = byName.get(normalize(wine.name));
        
        const wineData = {
          name: wine.name,
          origin: wine.origin,
          grapes: wine.grapes,
          price: wine.price,
          description: wine.description,
          story: wine.story || null,
          image_url: wine.image_url || null,
          category: wine.category as "red" | "white" | "sparkling",
          temperature: wine.temperature || null,
          alcohol: wine.alcohol || null,
          pairing: wine.pairing || null,
          tasting_notes: wine.tasting_notes || null,
          flavor_notes: parseFlavorNotes(wine.flavor_notes),
          vintage: wine.vintage || null,
          region: wine.region || null,
          sweetness: parseNumber(wine.sweetness),
          body: parseNumber(wine.body),
          tannin: parseNumber(wine.tannin),
          acidity: parseNumber(wine.acidity),
          fizzy: parseNumber(wine.fizzy),
        };

        if (match) {
          const { error } = await supabase
            .from("wines")
            .update(wineData)
            .eq("id", match.id);
          if (error) throw error;
        } else {
          // Insert new wine
          const { error } = await supabase
            .from("wines")
            .insert(wineData);
          if (error) throw error;
        }

        successCount++;
        setImportStatuses((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: "success" as const } : s))
        );
      } catch (error: any) {
        errorCount++;
        setImportStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? { ...s, status: "error" as const, error: error.message }
              : s
          )
        );
      }

      setProgress(((i + 1) / csvWines.length) * 100);
    }

    setIsImporting(false);
    await checkExistingWines();
    queryClient.invalidateQueries({ queryKey: ["wines"] });

    toast({
      title: "Đồng bộ từ CSV hoàn tất",
      description: `Cập nhật/thêm: ${successCount}, Lỗi: ${errorCount}`,
      variant: errorCount > 0 ? "destructive" : "default",
    });
  };

  const mapStaticToDb = (wine: (typeof staticWines)[number]) => {
    return {
      name: wine.name,
      origin: wine.origin,
      grapes: wine.grapes,
      price: wine.price,
      description: wine.description,
      story: wine.story || null,
      category: wine.category,
      temperature: wine.temperature || null,
      alcohol: wine.alcohol || null,
      pairing: wine.pairing || null,
      tasting_notes: wine.tastingNotes || null,
      flavor_notes: wine.flavorNotes || null,
      vintage: wine.vintage || null,
      region: wine.region || null,
      sweetness: wine.characteristics?.sweetness ?? null,
      body: wine.characteristics?.body ?? null,
      tannin: wine.characteristics?.tannin ?? null,
      acidity: wine.characteristics?.acidity ?? null,
      fizzy: wine.characteristics?.fizzy ?? null,
    };
  };

  const importWines = async () => {
    setIsImporting(true);
    setImportStatuses(staticWines.map((w) => ({ name: w.name, status: "pending" as const })));
    setProgress(0);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < staticWines.length; i++) {
      const wine = staticWines[i];

      try {
        const wineData = {
          ...mapStaticToDb(wine),
          image_url: wine.image || null,
        };

        const { error } = await supabase.from("wines").insert(wineData);
        if (error) throw error;

        successCount++;
        setImportStatuses((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: "success" as const } : s))
        );
      } catch (error: any) {
        errorCount++;
        setImportStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? { ...s, status: "error" as const, error: error.message }
              : s
          )
        );
      }

      setProgress(((i + 1) / staticWines.length) * 100);
    }

    setIsImporting(false);
    await checkExistingWines();
    queryClient.invalidateQueries({ queryKey: ["wines"] });

    toast({
      title: "Import hoàn tất",
      description: `Thành công: ${successCount}, Lỗi: ${errorCount}`,
      variant: errorCount > 0 ? "destructive" : "default",
    });
  };

  const syncWines = async () => {
    setIsImporting(true);
    setImportStatuses(staticWines.map((w) => ({ name: w.name, status: "pending" as const })));
    setProgress(0);

    let successCount = 0;
    let errorCount = 0;

    const { data: dbWines, error: dbErr } = await supabase
      .from("wines")
      .select("id,name");

    if (dbErr) {
      setIsImporting(false);
      toast({
        title: "Lỗi",
        description: dbErr.message,
        variant: "destructive",
      });
      return;
    }

    const normalize = (s: string) => s.trim().toLowerCase();
    const byName = new Map<string, { id: string; name: string }>();

    for (const w of dbWines ?? []) {
      const key = normalize(w.name);
      if (!byName.has(key)) byName.set(key, w);
    }

    for (let i = 0; i < staticWines.length; i++) {
      const wine = staticWines[i];

      try {
        const match = byName.get(normalize(wine.name));
        const wineData = mapStaticToDb(wine);

        if (match) {
          const { error } = await supabase
            .from("wines")
            .update(wineData)
            .eq("id", match.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("wines")
            .insert({ ...wineData, image_url: wine.image || null });
          if (error) throw error;
        }

        successCount++;
        setImportStatuses((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: "success" as const } : s))
        );
      } catch (error: any) {
        errorCount++;
        setImportStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? { ...s, status: "error" as const, error: error.message }
              : s
          )
        );
      }

      setProgress(((i + 1) / staticWines.length) * 100);
    }

    setIsImporting(false);
    await checkExistingWines();
    queryClient.invalidateQueries({ queryKey: ["wines"] });

    toast({
      title: "Đồng bộ hoàn tất",
      description: `Cập nhật/thêm: ${successCount}, Lỗi: ${errorCount}`,
      variant: errorCount > 0 ? "destructive" : "default",
    });
  };

  const successCount = importStatuses.filter((s) => s.status === "success").length;
  const errorCount = importStatuses.filter((s) => s.status === "error").length;

  return (
    <>
      <Helmet>
        <title>Import Wines | Sélection</title>
        <meta
          name="description"
          content="Import dữ liệu rượu vang từ file tĩnh vào database để quản trị trên Sélection."
        />
        <link rel="canonical" href={`${window.location.origin}/admin/import-wines`} />
      </Helmet>

      <main className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon" aria-label="Về Admin Dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-serif">Import Dữ Liệu Rượu</h1>
              <p className="text-muted-foreground text-sm">
                Đồng bộ dữ liệu rượu từ CSV hoặc file tĩnh
              </p>
            </div>
          </header>

          {/* CSV Import Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileUp className="h-5 w-5" />
                Import từ CSV (Selection.com.vn)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                ✅ <b>Khuyến nghị:</b> Sử dụng file CSV export từ selection.com.vn để đồng bộ data chính xác nhất.
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  Chọn file CSV
                </Button>
                
                {csvWines.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    Đã tải: <span className="font-semibold text-foreground">{csvWines.length} chai rượu</span>
                  </div>
                )}
              </div>

              {csvWines.length > 0 && (
                <Button
                  onClick={syncFromCSV}
                  disabled={isImporting}
                  className="w-full"
                  size="lg"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isImporting ? 'animate-spin' : ''}`} />
                  {isImporting ? `Đang đồng bộ... ${Math.round(progress)}%` : `Đồng bộ ${csvWines.length} chai từ CSV`}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái Database</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{staticWines.length}</p>
                  <p className="text-sm text-muted-foreground">Rượu trong file tĩnh</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{existingCount ?? "..."}</p>
                  <p className="text-sm text-muted-foreground">Rượu trong database</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{successCount}</p>
                  <p className="text-sm text-muted-foreground">Đã import</p>
                </div>
              </div>

              {existingCount !== null && existingCount > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                  ⚠️ Database đã có {existingCount} chai rượu.
                  <div className="mt-1">
                    - <b>Import</b> sẽ tạo bản sao (không khuyến nghị).
                    <br />- <b>Đồng bộ</b> sẽ cập nhật/ghi đè nội dung theo file tĩnh.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button onClick={syncWines} disabled={isImporting} className="w-full" size="lg" variant="secondary">
                  <Upload className="h-4 w-4 mr-2" />
                  {isImporting ? `Đang đồng bộ... ${Math.round(progress)}%` : "Đồng bộ theo file tĩnh"}
                </Button>

                <Button onClick={importWines} disabled={isImporting} className="w-full" size="lg" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  {isImporting ? `Đang import... ${Math.round(progress)}%` : "Import (tạo bản sao)"}
                </Button>
              </div>

              {isImporting && <Progress value={progress} />}
            </CardContent>
          </Card>

          {/* Import Results */}
          {importStatuses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Kết quả ({successCount} thành công, {errorCount} lỗi)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {importStatuses.map((status, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm truncate flex-1">{status.name}</span>
                      {status.status === "success" && (
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      )}
                      {status.status === "error" && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-destructive truncate max-w-32">
                            {status.error}
                          </span>
                          <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                        </div>
                      )}
                      {status.status === "pending" && (
                        <span className="text-xs text-muted-foreground">Đang chờ...</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminImportWines;

