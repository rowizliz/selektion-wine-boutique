import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, ImageIcon, ArrowLeft } from "lucide-react";

const FLAVORS = [
  "cherry", "plum", "berry", "blackberry", "raspberry", "strawberry",
  "citrus", "lemon", "apple", "pear", "peach", "tropical", "fig", "raisin",
  "floral", "rose", "herb", "mint", "spice", "pepper", "licorice",
  "mineral", "oak", "earth", "tobacco", "leather", "smoke",
  "vanilla", "chocolate", "coffee", "honey", "butter", "cream", "almond", "caramel"
];

const STORAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/flavor-icons`;

const flavorLabels: Record<string, string> = {
  cherry: "Anh đào", plum: "Mận", berry: "Dâu", blackberry: "Dâu đen",
  raspberry: "Mâm xôi", strawberry: "Dâu tây", citrus: "Cam quýt",
  lemon: "Chanh", apple: "Táo", pear: "Lê", peach: "Đào",
  tropical: "Nhiệt đới", fig: "Sung", raisin: "Nho khô",
  floral: "Hoa", rose: "Hoa hồng", herb: "Thảo mộc", mint: "Bạc hà",
  spice: "Gia vị", pepper: "Tiêu", licorice: "Cam thảo",
  mineral: "Khoáng chất", oak: "Gỗ sồi", earth: "Đất",
  tobacco: "Thuốc lá", leather: "Da thuộc", smoke: "Khói",
  vanilla: "Vani", chocolate: "Chocolate", coffee: "Cà phê",
  honey: "Mật ong", butter: "Bơ", cream: "Kem",
  almond: "Hạnh nhân", caramel: "Caramel",
};

interface IconStatus {
  exists: boolean;
  url?: string;
  generating?: boolean;
  error?: string;
}

const AdminFlavorIcons = () => {
  const [iconStatuses, setIconStatuses] = useState<Record<string, IconStatus>>({});
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkExistingIcons = async () => {
    setIsChecking(true);
    const statuses: Record<string, IconStatus> = {};

    for (const flavor of FLAVORS) {
      try {
        const response = await fetch(`${STORAGE_URL}/${flavor}.png`, { method: 'HEAD' });
        statuses[flavor] = {
          exists: response.ok,
          url: response.ok ? `${STORAGE_URL}/${flavor}.png` : undefined
        };
      } catch {
        statuses[flavor] = { exists: false };
      }
    }

    setIconStatuses(statuses);
    setIsChecking(false);
    
    const existingCount = Object.values(statuses).filter(s => s.exists).length;
    toast.success(`Đã kiểm tra: ${existingCount}/${FLAVORS.length} icons tồn tại`);
  };

  const generateSingleIcon = async (flavorId: string) => {
    setIconStatuses(prev => ({
      ...prev,
      [flavorId]: { ...prev[flavorId], generating: true, error: undefined }
    }));

    try {
      const { data, error } = await supabase.functions.invoke('generate-flavor-icon', {
        body: { flavorId }
      });

      if (error) throw error;

      const result = data.results?.[0];
      if (result?.error) throw new Error(result.error);

      setIconStatuses(prev => ({
        ...prev,
        [flavorId]: { exists: true, url: result.url, generating: false }
      }));
      
      toast.success(`Đã tạo icon: ${flavorLabels[flavorId]}`);
    } catch (error) {
      console.error(`Error generating ${flavorId}:`, error);
      setIconStatuses(prev => ({
        ...prev,
        [flavorId]: { 
          exists: false, 
          generating: false, 
          error: error instanceof Error ? error.message : 'Lỗi không xác định'
        }
      }));
      toast.error(`Lỗi tạo icon ${flavorLabels[flavorId]}`);
    }
  };

  const generateAllIcons = async () => {
    setIsGeneratingAll(true);
    
    const missingFlavors = FLAVORS.filter(f => !iconStatuses[f]?.exists);
    
    if (missingFlavors.length === 0) {
      toast.info("Tất cả icons đã tồn tại!");
      setIsGeneratingAll(false);
      return;
    }

    toast.info(`Đang tạo ${missingFlavors.length} icons... Vui lòng đợi.`);

    for (const flavor of missingFlavors) {
      await generateSingleIcon(flavor);
      // Small delay between generations
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsGeneratingAll(false);
    toast.success("Hoàn thành tạo icons!");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="icon" aria-label="Về Admin Dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-serif">Quản lý Icons Nốt Hương</h1>
            <p className="text-muted-foreground text-sm">
              Tạo và quản lý icon cho các hương vị rượu
            </p>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-6 h-6" />
              Danh sách Icons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Action buttons */}
            <div className="flex gap-4 flex-wrap">
              <Button onClick={checkExistingIcons} disabled={isChecking}>
                {isChecking ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang kiểm tra...
                  </>
                ) : (
                  "Kiểm tra Icons Hiện Có"
                )}
              </Button>
              
              <Button 
                onClick={generateAllIcons} 
                disabled={isGeneratingAll || isChecking}
                variant="default"
              >
                {isGeneratingAll ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tạo icons...
                  </>
                ) : (
                  "Tạo Tất Cả Icons Thiếu"
                )}
              </Button>
            </div>

            {/* Icons grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {FLAVORS.map(flavor => {
                const status = iconStatuses[flavor];
                const label = flavorLabels[flavor];
                
                return (
                  <Card key={flavor} className="p-3">
                    <div className="flex flex-col items-center gap-2">
                      {/* Icon preview */}
                      <div className="w-16 h-16 rounded-lg bg-secondary/50 flex items-center justify-center overflow-hidden">
                        {status?.exists && status.url ? (
                          <img 
                            src={`${status.url}?t=${Date.now()}`} 
                            alt={label}
                            className="w-14 h-14 object-contain"
                          />
                        ) : status?.generating ? (
                          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                        )}
                      </div>
                      
                      {/* Label */}
                      <span className="text-xs font-medium text-center">{label}</span>
                      
                      {/* Status indicator */}
                      <div className="flex items-center gap-1">
                        {status?.exists ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : status?.error ? (
                          <XCircle className="w-4 h-4 text-destructive" />
                        ) : null}
                      </div>
                      
                      {/* Generate button */}
                      {(!status?.exists || status?.error) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => generateSingleIcon(flavor)}
                          disabled={status?.generating || isGeneratingAll}
                        >
                          {status?.generating ? "..." : "Tạo"}
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminFlavorIcons;
