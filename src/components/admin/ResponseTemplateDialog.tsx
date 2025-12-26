import { useState, useMemo, useEffect } from "react";
import { Copy, MessageCircle, Wine, Plus, X, Search, Check, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PersonalizedWineRequest } from "@/hooks/usePersonalizedWineRequests";
import { useSaveWineRecommendations } from "@/hooks/useWineRecommendations";
import { wines, Wine as WineType } from "@/data/wines";

interface ResponseTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: PersonalizedWineRequest | null;
}

// Convert bundled asset path to public URL path
const getPublicImageUrl = (bundledPath: string | null): string | null => {
  if (!bundledPath) return null;
  
  // Extract filename from bundled path (e.g., "/assets/terres-rares-fixed-abc123.jpg" -> "terres-rares-fixed.jpg")
  const match = bundledPath.match(/\/([^/]+)-fixed[^.]*\.jpg$/);
  if (match) {
    const baseName = match[1];
    return `/wines/${baseName}-fixed.jpg`;
  }
  
  // Fallback: try to extract any filename
  const fallbackMatch = bundledPath.match(/\/([^/]+)$/);
  if (fallbackMatch) {
    return `/wines/${fallbackMatch[1].replace(/-[a-zA-Z0-9]+\.jpg$/, '.jpg')}`;
  }
  
  return bundledPath;
};

// Parse price string to number for comparison
const parsePrice = (priceStr: string): number => {
  const cleaned = priceStr.replace(/[^\d]/g, "");
  return parseInt(cleaned, 10) || 0;
};

// Get budget range in numbers
const getBudgetRange = (
  budgetStr: string | null
): { min: number; max: number } => {
  if (!budgetStr) return { min: 0, max: Infinity };

  const lowerBudget = budgetStr.toLowerCase();

  if (lowerBudget.includes("dưới 500") || lowerBudget.includes("under-500k")) {
    return { min: 0, max: 500000 };
  }
  if (
    lowerBudget.includes("500k-1m") ||
    lowerBudget.includes("500.000") ||
    lowerBudget.includes("500-1")
  ) {
    return { min: 400000, max: 1000000 };
  }
  if (
    lowerBudget.includes("1-2") ||
    lowerBudget.includes("1m-2m") ||
    lowerBudget.includes("1 triệu")
  ) {
    return { min: 800000, max: 2000000 };
  }
  if (
    lowerBudget.includes("2-5") ||
    lowerBudget.includes("2m-5m") ||
    lowerBudget.includes("2 triệu")
  ) {
    return { min: 1500000, max: 5000000 };
  }
  if (
    lowerBudget.includes("trên 5") ||
    lowerBudget.includes("over-5m") ||
    lowerBudget.includes("> 5")
  ) {
    return { min: 4000000, max: Infinity };
  }

  return { min: 0, max: Infinity };
};

// Score a wine based on customer preferences
const scoreWine = (wine: WineType, request: PersonalizedWineRequest): number => {
  let score = 0;

  // Budget matching (most important)
  const { min, max } = getBudgetRange(request.budget_range);
  const winePrice = parsePrice(wine.price);
  if (winePrice >= min && winePrice <= max) {
    score += 30;
  } else if (winePrice < min * 0.8 || winePrice > max * 1.2) {
    score -= 20;
  }

  // Wine type matching
  const wineTypes = request.wine_types || [];
  const categoryMap: Record<string, string[]> = {
    red: ["red", "đỏ", "vang đỏ"],
    white: ["white", "trắng", "vang trắng"],
    sparkling: ["sparkling", "sủi", "champagne", "prosecco"],
  };

  const typeMatches = wineTypes.some((type) => {
    const lowerType = type.toLowerCase();
    const wineCategory = wine.category;
    return (
      categoryMap[wineCategory]?.some((cat) => lowerType.includes(cat)) ||
      lowerType.includes(wineCategory)
    );
  });
  if (typeMatches) score += 25;

  // Wine style matching
  const wineStyles = request.wine_styles || [];
  const styleKeywords: Record<string, string[]> = {
    elegant: ["mềm", "mịn", "thanh lịch", "cân bằng", "hài hòa"],
    bold: ["đậm", "mạnh", "cấu trúc", "tannin"],
    fruity: ["trái cây", "tươi", "ngọt", "cherry", "berry"],
    dry: ["khô", "dry", "brut"],
  };

  wineStyles.forEach((style) => {
    const lowerStyle = style.toLowerCase();
    Object.entries(styleKeywords).forEach(([key, keywords]) => {
      if (
        lowerStyle.includes(key) ||
        keywords.some((kw) => lowerStyle.includes(kw))
      ) {
        if (wine.tastingNotes?.toLowerCase().includes(key)) {
          score += 10;
        }
        keywords.forEach((kw) => {
          if (wine.tastingNotes?.toLowerCase().includes(kw)) {
            score += 5;
          }
        });
      }
    });
  });

  // Sweetness preference
  const sweetLevel = request.taste_sweet_level || 3;
  const wineSweetness = wine.characteristics?.sweetness || 2;
  const sweetDiff = Math.abs(sweetLevel - wineSweetness * 2);
  score -= sweetDiff * 2;

  // Cuisine pairing
  const cuisines = request.cuisine_types || [];
  const cuisinePairings: Record<string, string[]> = {
    vietnamese: ["seafood", "hải sản", "nhẹ", "tươi", "cá"],
    japanese: ["hải sản", "cá", "nhẹ", "trắng"],
    korean: ["cay", "thịt nướng", "bbq"],
    chinese: ["đậm", "thịt", "heo"],
    italian: ["pasta", "pizza", "thịt đỏ"],
    french: ["phô mai", "cheese", "thịt", "sốt"],
    bbq: ["thịt nướng", "đậm", "mạnh", "bbq"],
    seafood: ["hải sản", "cá", "tôm", "trắng"],
  };

  cuisines.forEach((cuisine) => {
    const lowerCuisine = cuisine.toLowerCase();
    Object.entries(cuisinePairings).forEach(([cuisineKey, pairings]) => {
      if (lowerCuisine.includes(cuisineKey)) {
        pairings.forEach((pairing) => {
          if (wine.pairing?.toLowerCase().includes(pairing)) {
            score += 8;
          }
        });
      }
    });
  });

  // Occasions
  const occasions = request.occasions || [];
  if (occasions.some((o) => o.toLowerCase().includes("romantic"))) {
    if (wine.category === "sparkling") score += 15;
  }
  if (occasions.some((o) => o.toLowerCase().includes("celebration"))) {
    if (wine.category === "sparkling") score += 15;
  }
  if (occasions.some((o) => o.toLowerCase().includes("gift"))) {
    if (parsePrice(wine.price) >= 1000000) score += 10;
  }

  return score;
};

// Get top wine recommendations
const getWineRecommendations = (
  request: PersonalizedWineRequest,
  count: number = 3
): WineType[] => {
  const scoredWines = wines.map((wine) => ({
    wine,
    score: scoreWine(wine, request),
  }));

  scoredWines.sort((a, b) => b.score - a.score);

  return scoredWines.slice(0, count).map((sw) => sw.wine);
};

// Format arrays for display
const formatArray = (arr: string[] | null): string => {
  if (!arr || arr.length === 0) return "Chưa xác định";
  return arr.join(", ");
};

// Generate template
const generateTemplate = (
  request: PersonalizedWineRequest,
  selectedWines: WineType[]
): string => {
  const customerName = request.customer_name;
  const wineTypes = formatArray(request.wine_types);
  const wineStyles = formatArray(request.wine_styles);
  const cuisineTypes = formatArray(request.cuisine_types);
  const sweetLevel = request.taste_sweet_level ?? "-";
  const spicyLevel = request.taste_spicy_level ?? "-";
  const budget = request.budget_range || "Chưa xác định";
  const occasions = formatArray(request.occasions);

  let template = `Kính gửi Anh/Chị ${customerName},

SÉLECTION xin chân thành cảm ơn Anh/Chị đã tin tưởng gửi yêu cầu tư vấn rượu vang.

Dựa trên sở thích của Anh/Chị:
• Loại rượu: ${wineTypes}
• Phong cách: ${wineStyles}
• Ẩm thực yêu thích: ${cuisineTypes}
• Khẩu vị - Độ ngọt: ${sweetLevel}/5, Độ cay: ${spicyLevel}/5
• Ngân sách: ${budget}
• Dịp sử dụng: ${occasions}

SÉLECTION xin đề xuất các chai rượu phù hợp:

`;

  selectedWines.forEach((wine, index) => {
    template += `🍷 ${index + 1}. ${wine.name} - ${wine.price}
   Xuất xứ: ${wine.origin}

`;
  });

  template += `Anh/Chị vui lòng liên hệ hotline 0906.777.377 hoặc Zalo để được hỗ trợ đặt hàng.

Trân trọng,
SÉLECTION - Rượu Vang & Quà Tặng`;

  return template;
};

// Category labels
const categoryLabels: Record<string, string> = {
  red: "Vang Đỏ",
  white: "Vang Trắng",
  sparkling: "Vang Sủi",
};

export const ResponseTemplateDialog = ({
  open,
  onOpenChange,
  request,
}: ResponseTemplateDialogProps) => {
  const [selectedWines, setSelectedWines] = useState<WineType[]>([]);
  const [templateText, setTemplateText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isTemplateEdited, setIsTemplateEdited] = useState(false);
  
  const saveRecommendations = useSaveWineRecommendations();

  // Fetch existing wine recommendations for this request
  const { data: existingRecommendations } = useQuery({
    queryKey: ["wine-recommendations", request?.id],
    queryFn: async () => {
      if (!request?.id) return null;
      const { data, error } = await supabase
        .from("wine_recommendations")
        .select("*")
        .eq("request_id", request.id)
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!request?.id && open,
  });

  // Auto-select recommended wines when dialog opens
  useEffect(() => {
    if (open && request) {
      // If there are existing recommendations, load them
      if (existingRecommendations && existingRecommendations.length > 0) {
        const savedWines = existingRecommendations
          .map(rec => wines.find(w => w.id === rec.wine_id))
          .filter((w): w is WineType => w !== undefined);
        setSelectedWines(savedWines);
        setTemplateText(request.recommendation_message || generateTemplate(request, savedWines));
        setGeneratedLink(request.url_slug ? `https://selection.com.vn/tuvan/${request.url_slug}` : null);
      } else {
        // Generate new recommendations
        const recommended = getWineRecommendations(request, 3);
        setSelectedWines(recommended);
        setTemplateText(generateTemplate(request, recommended));
        setGeneratedLink(null);
      }
      setIsTemplateEdited(false);
    }
  }, [open, request, existingRecommendations]);

  // Only regenerate template if user hasn't manually edited it
  const handleRegenerateTemplate = () => {
    if (request) {
      setTemplateText(generateTemplate(request, selectedWines));
      setIsTemplateEdited(false);
    }
  };

  // Filter wines for selection
  const filteredWines = useMemo(() => {
    return wines.filter((wine) => {
      const matchesSearch =
        searchQuery === "" ||
        wine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wine.origin.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || wine.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const handleAddWine = (wine: WineType) => {
    if (!selectedWines.find((w) => w.id === wine.id)) {
      setSelectedWines([...selectedWines, wine]);
    }
  };

  const handleRemoveWine = (wineId: string) => {
    setSelectedWines(selectedWines.filter((w) => w.id !== wineId));
  };

  const isWineSelected = (wineId: string) => {
    return selectedWines.some((w) => w.id === wineId);
  };

  const handleCopyLink = async () => {
    if (generatedLink) {
      try {
        await navigator.clipboard.writeText(generatedLink);
        toast.success("Đã sao chép link!");
      } catch {
        toast.error("Không thể sao chép");
      }
    }
  };

  const handleSaveAndGenerateLink = async () => {
    if (!request || selectedWines.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 chai rượu");
      return;
    }

    try {
      const result = await saveRecommendations.mutateAsync({
        requestId: request.id,
        customerName: request.customer_name,
        message: templateText,
        wines: selectedWines.map((wine, index) => ({
          wine_id: wine.id,
          wine_name: wine.name,
          wine_price: wine.price,
          wine_image_url: getPublicImageUrl(wine.image),
          recommendation_reason: null, // Can be enhanced later with AI
          display_order: index,
        })),
      });

      // Generate URL-friendly slug
      const generateSlug = (name: string): string => {
        return name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "d")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      };

      const slug = `${generateSlug(request.customer_name)}-${request.id.slice(0, 8)}`;
      const link = `https://selection.com.vn/tuvan/${slug}`;
      setGeneratedLink(link);
      toast.success("Đã lưu gợi ý và tạo link thành công!");
    } catch (error) {
      console.error("Error saving recommendations:", error);
      toast.error("Có lỗi xảy ra khi lưu");
    }
  };

  const handleZalo = () => {
    const zaloUrl = `https://zalo.me/${request?.phone?.replace(/^0/, "84")}`;
    window.open(zaloUrl, "_blank");
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast.success("Đã sao chép link và mở Zalo!");
    }
  };

  const handleResetToSuggested = () => {
    if (request) {
      const recommended = getWineRecommendations(request, 3);
      setSelectedWines(recommended);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wine className="w-5 h-5 text-primary" />
            Template Phản Hồi - {request.customer_name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="wines" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wines">Chọn Rượu</TabsTrigger>
            <TabsTrigger value="template">Nội dung phản hồi</TabsTrigger>
          </TabsList>

          {/* Wine Selection Tab */}
          <TabsContent value="wines" className="flex-1 overflow-hidden mt-4">
            <div className="grid grid-cols-2 gap-4 h-[400px]">
              {/* Left: Wine catalog */}
              <div className="flex flex-col border rounded-lg overflow-hidden">
                <div className="p-3 border-b bg-muted/30 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm rượu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant={categoryFilter === "all" ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setCategoryFilter("all")}
                    >
                      Tất cả
                    </Button>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <Button
                        key={key}
                        variant={categoryFilter === key ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setCategoryFilter(key)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    {filteredWines.map((wine) => (
                      <div
                        key={wine.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                          isWineSelected(wine.id)
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() =>
                          isWineSelected(wine.id)
                            ? handleRemoveWine(wine.id)
                            : handleAddWine(wine)
                        }
                      >
                        <img
                          src={wine.image}
                          alt={wine.name}
                          className="w-8 h-11 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {wine.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {wine.price}
                          </p>
                        </div>
                        {isWineSelected(wine.id) ? (
                          <Check className="w-4 h-4 text-primary shrink-0" />
                        ) : (
                          <Plus className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Right: Selected wines */}
              <div className="flex flex-col border rounded-lg overflow-hidden">
                <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
                  <h3 className="font-semibold text-sm">
                    Rượu đã chọn ({selectedWines.length})
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleResetToSuggested}
                  >
                    Đề xuất AI
                  </Button>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-2">
                    {selectedWines.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Chưa chọn rượu nào
                      </p>
                    ) : (
                      selectedWines.map((wine, index) => (
                        <div
                          key={wine.id}
                          className="flex items-center gap-3 p-2 rounded bg-muted/30"
                        >
                          <span className="text-xs font-medium text-muted-foreground w-5">
                            {index + 1}.
                          </span>
                          <img
                            src={wine.image}
                            alt={wine.name}
                            className="w-10 h-14 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {wine.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {wine.origin}
                            </p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {wine.price}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0"
                            onClick={() => handleRemoveWine(wine.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          {/* Template Tab */}
          <TabsContent value="template" className="flex-1 overflow-hidden mt-4 flex flex-col">
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-medium mb-2 block">
                Nội dung phản hồi (có thể chỉnh sửa)
              </label>
              <Textarea
                value={templateText}
                onChange={(e) => {
                  setTemplateText(e.target.value);
                  setIsTemplateEdited(true);
                }}
                className="flex-1 min-h-[350px] font-mono text-sm resize-none"
              />
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 self-start"
                onClick={handleRegenerateTemplate}
              >
                Tạo lại template từ rượu đã chọn
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4 border-t">
          {generatedLink && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <Link2 className="w-4 h-4 text-green-600 shrink-0" />
              <code className="flex-1 text-sm truncate text-green-700 dark:text-green-400">
                {generatedLink}
              </code>
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <div className="flex gap-2 justify-end">
            {!generatedLink ? (
              <Button 
                onClick={handleSaveAndGenerateLink}
                disabled={saveRecommendations.isPending || selectedWines.length === 0}
              >
                {saveRecommendations.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Link2 className="w-4 h-4 mr-2" />
                )}
                Lưu & Tạo Link
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCopyLink}>
                  <Copy className="w-4 h-4 mr-2" />
                  Sao chép link
                </Button>
                <Button onClick={handleZalo} className="bg-blue-500 hover:bg-blue-600">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Mở Zalo
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
