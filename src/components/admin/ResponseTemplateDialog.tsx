import { useState, useMemo } from "react";
import { Copy, MessageCircle, Wine, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PersonalizedWineRequest } from "@/hooks/usePersonalizedWineRequests";
import { wines, Wine as WineType } from "@/data/wines";

interface ResponseTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: PersonalizedWineRequest | null;
}

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

// Get reason why wine is recommended
const getRecommendationReason = (
  wine: WineType,
  request: PersonalizedWineRequest
): string => {
  const reasons: string[] = [];

  // Budget
  const { min, max } = getBudgetRange(request.budget_range);
  const winePrice = parsePrice(wine.price);
  if (winePrice >= min && winePrice <= max) {
    reasons.push("phù hợp ngân sách");
  }

  // Wine type
  const wineTypes = request.wine_types || [];
  if (wineTypes.length > 0) {
    if (wine.category === "red" && wineTypes.some((t) => t.toLowerCase().includes("đỏ") || t.toLowerCase().includes("red"))) {
      reasons.push("đúng sở thích vang đỏ");
    }
    if (wine.category === "white" && wineTypes.some((t) => t.toLowerCase().includes("trắng") || t.toLowerCase().includes("white"))) {
      reasons.push("đúng sở thích vang trắng");
    }
    if (wine.category === "sparkling" && wineTypes.some((t) => t.toLowerCase().includes("sủi") || t.toLowerCase().includes("sparkling"))) {
      reasons.push("đúng sở thích vang sủi");
    }
  }

  // Style
  const styles = request.wine_styles || [];
  if (styles.some((s) => s.toLowerCase().includes("elegant") || s.toLowerCase().includes("thanh"))) {
    if (wine.characteristics && wine.characteristics.body <= 6) {
      reasons.push("phong cách thanh lịch");
    }
  }
  if (styles.some((s) => s.toLowerCase().includes("bold") || s.toLowerCase().includes("đậm"))) {
    if (wine.characteristics && wine.characteristics.body >= 6) {
      reasons.push("phong cách đậm đà");
    }
  }

  // Pairing
  const cuisines = request.cuisine_types || [];
  if (cuisines.length > 0 && wine.pairing) {
    reasons.push("kết hợp tốt với ẩm thực yêu thích");
  }

  // Occasions
  const occasions = request.occasions || [];
  if (occasions.some((o) => o.toLowerCase().includes("romantic")) && wine.category === "sparkling") {
    reasons.push("lãng mạn cho dịp đặc biệt");
  }
  if (occasions.some((o) => o.toLowerCase().includes("gift")) && parsePrice(wine.price) >= 1000000) {
    reasons.push("sang trọng phù hợp làm quà");
  }

  return reasons.length > 0 ? reasons.slice(0, 2).join(", ") : "chất lượng tốt trong tầm giá";
};

// Format arrays for display
const formatArray = (arr: string[] | null): string => {
  if (!arr || arr.length === 0) return "Chưa xác định";
  return arr.join(", ");
};

// Generate template
const generateTemplate = (
  request: PersonalizedWineRequest,
  recommendedWines: WineType[]
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

  recommendedWines.forEach((wine, index) => {
    const reason = getRecommendationReason(wine, request);
    template += `🍷 ${index + 1}. ${wine.name} - ${wine.price}
   Xuất xứ: ${wine.origin}
   → ${reason}

`;
  });

  template += `Anh/Chị vui lòng liên hệ hotline 0906.777.377 hoặc Zalo để được hỗ trợ đặt hàng.

Trân trọng,
SÉLECTION - Rượu Vang & Quà Tặng`;

  return template;
};

export const ResponseTemplateDialog = ({
  open,
  onOpenChange,
  request,
}: ResponseTemplateDialogProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const recommendedWines = useMemo(() => {
    if (!request) return [];
    return getWineRecommendations(request, 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, refreshKey]);

  const template = useMemo(() => {
    if (!request) return "";
    return generateTemplate(request, recommendedWines);
  }, [request, recommendedWines]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template);
      toast.success("Đã sao chép template!");
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  const handleZalo = () => {
    const encoded = encodeURIComponent(template);
    const zaloUrl = `https://zalo.me/${request?.phone?.replace(/^0/, "84")}`;
    window.open(zaloUrl, "_blank");
    // Also copy to clipboard for easy paste
    navigator.clipboard.writeText(template);
    toast.success("Đã sao chép template và mở Zalo!");
  };

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wine className="w-5 h-5 text-primary" />
            Template Phản Hồi - {request.customer_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recommended wines preview */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Rượu được đề xuất</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="h-7 text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Đề xuất khác
              </Button>
            </div>
            <div className="grid gap-2">
              {recommendedWines.map((wine) => (
                <div
                  key={wine.id}
                  className="flex items-center gap-3 p-2 rounded bg-background/50"
                >
                  <img
                    src={wine.image}
                    alt={wine.name}
                    className="w-10 h-14 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{wine.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {wine.origin}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {wine.price}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Template content */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Nội dung phản hồi
            </label>
            <Textarea
              value={template}
              readOnly
              className="min-h-[350px] font-mono text-sm resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Sao chép
            </Button>
            <Button onClick={handleZalo} className="bg-blue-500 hover:bg-blue-600">
              <MessageCircle className="w-4 h-4 mr-2" />
              Mở Zalo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
