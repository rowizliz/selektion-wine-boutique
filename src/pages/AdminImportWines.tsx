import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Upload, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Import all wine data
import { wines as staticWines } from "@/data/wines";

interface ImportStatus {
  name: string;
  status: "pending" | "success" | "error";
  error?: string;
}

const AdminImportWines = () => {
  const queryClient = useQueryClient();
  const [isImporting, setIsImporting] = useState(false);
  const [importStatuses, setImportStatuses] = useState<ImportStatus[]>([]);
  const [progress, setProgress] = useState(0);
  const [existingCount, setExistingCount] = useState<number | null>(null);
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

  const importWines = async () => {
    setIsImporting(true);
    setImportStatuses(staticWines.map((w) => ({ name: w.name, status: "pending" as const })));
    setProgress(0);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < staticWines.length; i++) {
      const wine = staticWines[i];

      try {
        // Map static wine data to database format
        const wineData = {
          name: wine.name,
          origin: wine.origin,
          grapes: wine.grapes,
          price: wine.price,
          description: wine.description,
          story: wine.story || null,
          image_url: wine.image || null,
          category: wine.category,
          temperature: wine.temperature || null,
          alcohol: wine.alcohol || null,
          pairing: wine.pairing || null,
          tasting_notes: wine.tastingNotes || null,
          flavor_notes: wine.flavorNotes || null,
          vintage: wine.vintage || null,
          region: wine.region || null,
          sweetness: wine.characteristics?.sweetness || null,
          body: wine.characteristics?.body || null,
          tannin: wine.characteristics?.tannin || null,
          acidity: wine.characteristics?.acidity || null,
          fizzy: wine.characteristics?.fizzy || null,
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
                Chuyển {staticWines.length} chai rượu từ file tĩnh vào database
              </p>
            </div>
          </header>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái</CardTitle>
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
                  ⚠️ Database đã có {existingCount} chai rượu. Import thêm sẽ tạo
                  bản sao.
                </div>
              )}

              <Button onClick={importWines} disabled={isImporting} className="w-full" size="lg">
                <Upload className="h-4 w-4 mr-2" />
                {isImporting ? `Đang import... ${Math.round(progress)}%` : "Bắt đầu Import"}
              </Button>

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

