import { cn } from "@/lib/utils";
import { LucideIcon, Cherry, Apple, Citrus, Grape, Flower, Flower2, Leaf, Coffee, Sparkles, TreeDeciduous, Wind, Droplets, Flame, Cookie, Heart, Circle, Banana, TreePine, Mountain, Gem, CloudFog, Candy, Nut } from 'lucide-react';

interface FlavorNotesProps {
  notes: string[];
  className?: string;
}

// Map flavor notes to Vietnamese labels and Lucide icons
const flavorData: Record<string, { label: string; Icon: LucideIcon; iconColor: string; bgColor: string }> = {
  // Red Fruits
  cherry: { label: "Anh đào", Icon: Cherry, iconColor: "text-red-500", bgColor: "bg-red-50 dark:bg-red-950/40" },
  strawberry: { label: "Dâu tây", Icon: Cherry, iconColor: "text-red-400", bgColor: "bg-red-50 dark:bg-red-950/40" },
  raspberry: { label: "Mâm xôi", Icon: Cherry, iconColor: "text-pink-500", bgColor: "bg-pink-50 dark:bg-pink-950/40" },
  blackberry: { label: "Dâu đen", Icon: Grape, iconColor: "text-purple-700", bgColor: "bg-purple-50 dark:bg-purple-950/40" },
  berry: { label: "Quả mọng", Icon: Grape, iconColor: "text-purple-500", bgColor: "bg-purple-50 dark:bg-purple-950/40" },
  plum: { label: "Mận", Icon: Apple, iconColor: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-950/40" },
  cranberry: { label: "Nam việt quất", Icon: Cherry, iconColor: "text-red-600", bgColor: "bg-red-50 dark:bg-red-950/40" },
  currant: { label: "Lý chua", Icon: Grape, iconColor: "text-red-700", bgColor: "bg-red-50 dark:bg-red-950/40" },
  "black currant": { label: "Lý chua đen", Icon: Grape, iconColor: "text-purple-800", bgColor: "bg-purple-50 dark:bg-purple-950/40" },
  black: { label: "Quả đen", Icon: Grape, iconColor: "text-purple-900", bgColor: "bg-purple-50 dark:bg-purple-950/40" },

  // Citrus
  citrus: { label: "Cam quýt", Icon: Citrus, iconColor: "text-yellow-500", bgColor: "bg-yellow-50 dark:bg-yellow-950/40" },
  orange: { label: "Cam", Icon: Citrus, iconColor: "text-orange-500", bgColor: "bg-orange-50 dark:bg-orange-950/40" },
  tangerine: { label: "Quýt", Icon: Citrus, iconColor: "text-orange-400", bgColor: "bg-orange-50 dark:bg-orange-950/40" },
  lemon: { label: "Chanh vàng", Icon: Citrus, iconColor: "text-yellow-400", bgColor: "bg-yellow-50 dark:bg-yellow-950/40" },
  grapefruit: { label: "Bưởi", Icon: Citrus, iconColor: "text-pink-400", bgColor: "bg-pink-50 dark:bg-pink-950/40" },
  "orange peel": { label: "Vỏ cam", Icon: Citrus, iconColor: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-950/40" },

  // Other Fruits
  apple: { label: "Táo", Icon: Apple, iconColor: "text-green-500", bgColor: "bg-green-50 dark:bg-green-950/40" },
  pear: { label: "Lê", Icon: Apple, iconColor: "text-lime-500", bgColor: "bg-lime-50 dark:bg-lime-950/40" },
  peach: { label: "Đào", Icon: Apple, iconColor: "text-orange-300", bgColor: "bg-orange-50 dark:bg-orange-950/40" },
  tropical: { label: "Nhiệt đới", Icon: TreePine, iconColor: "text-green-400", bgColor: "bg-green-50 dark:bg-green-950/40" },
  pineapple: { label: "Dứa", Icon: Sparkles, iconColor: "text-yellow-500", bgColor: "bg-yellow-50 dark:bg-yellow-950/40" },
  banana: { label: "Chuối", Icon: Banana, iconColor: "text-yellow-400", bgColor: "bg-yellow-50 dark:bg-yellow-950/40" },
  fig: { label: "Sung", Icon: Apple, iconColor: "text-purple-400", bgColor: "bg-purple-50 dark:bg-purple-950/40" },
  raisin: { label: "Nho khô", Icon: Grape, iconColor: "text-amber-700", bgColor: "bg-amber-50 dark:bg-amber-950/40" },

  // Floral
  floral: { label: "Hoa", Icon: Flower2, iconColor: "text-pink-400", bgColor: "bg-pink-50 dark:bg-pink-950/40" },
  rose: { label: "Hoa hồng", Icon: Flower2, iconColor: "text-rose-400", bgColor: "bg-rose-50 dark:bg-rose-950/40" },
  violet: { label: "Hoa tím", Icon: Flower2, iconColor: "text-violet-500", bgColor: "bg-violet-50 dark:bg-violet-950/40" },
  jasmine: { label: "Hoa nhài", Icon: Flower2, iconColor: "text-white", bgColor: "bg-slate-100 dark:bg-slate-800/40" },
  elderflower: { label: "Hoa cơm cháy", Icon: Flower2, iconColor: "text-lime-300", bgColor: "bg-lime-50 dark:bg-lime-950/40" },
  potpourri: { label: "Hoa khô", Icon: Flower2, iconColor: "text-pink-300", bgColor: "bg-pink-50 dark:bg-pink-950/40" },

  // Herbal
  herb: { label: "Thảo mộc", Icon: Leaf, iconColor: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950/40" },
  mint: { label: "Bạc hà", Icon: Leaf, iconColor: "text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950/40" },
  eucalyptus: { label: "Khuynh diệp", Icon: Leaf, iconColor: "text-teal-500", bgColor: "bg-teal-50 dark:bg-teal-950/40" },
  "bell pepper": { label: "Ớt chuông", Icon: Leaf, iconColor: "text-green-500", bgColor: "bg-green-50 dark:bg-green-950/40" },
  sage: { label: "Xô thơm", Icon: Leaf, iconColor: "text-green-400", bgColor: "bg-green-50 dark:bg-green-950/40" },

  // Spices
  spice: { label: "Gia vị", Icon: Flame, iconColor: "text-orange-500", bgColor: "bg-orange-50 dark:bg-orange-950/40" },
  pepper: { label: "Tiêu", Icon: Flame, iconColor: "text-gray-600", bgColor: "bg-gray-50 dark:bg-gray-800/40" },
  cinnamon: { label: "Quế", Icon: Flame, iconColor: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-950/40" },
  ginger: { label: "Gừng", Icon: Flame, iconColor: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-950/40" },
  licorice: { label: "Cam thảo", Icon: Flame, iconColor: "text-amber-800", bgColor: "bg-amber-50 dark:bg-amber-950/40" },

  // Wood & Smoke
  oak: { label: "Gỗ sồi", Icon: TreeDeciduous, iconColor: "text-amber-700", bgColor: "bg-amber-50 dark:bg-amber-950/40" },
  cedar: { label: "Gỗ tuyết tùng", Icon: TreeDeciduous, iconColor: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-950/40" },
  tobacco: { label: "Thuốc lá", Icon: Leaf, iconColor: "text-amber-800", bgColor: "bg-amber-50 dark:bg-amber-950/40" },
  leather: { label: "Da thuộc", Icon: Sparkles, iconColor: "text-amber-900", bgColor: "bg-amber-50 dark:bg-amber-950/40" },
  smoke: { label: "Khói", Icon: CloudFog, iconColor: "text-gray-500", bgColor: "bg-gray-50 dark:bg-gray-800/40" },

  // Sweet & Rich
  vanilla: { label: "Vani", Icon: Cookie, iconColor: "text-amber-300", bgColor: "bg-amber-50 dark:bg-amber-950/40" },
  chocolate: { label: "Sô-cô-la", Icon: Cookie, iconColor: "text-amber-800", bgColor: "bg-amber-50 dark:bg-amber-950/40" },
  cocoa: { label: "Ca cao", Icon: Cookie, iconColor: "text-amber-900", bgColor: "bg-amber-50 dark:bg-amber-950/40" },
  mocha: { label: "Mocha", Icon: Coffee, iconColor: "text-amber-700", bgColor: "bg-amber-50 dark:bg-amber-950/40" },
  coffee: { label: "Cà phê", Icon: Coffee, iconColor: "text-amber-950", bgColor: "bg-amber-50 dark:bg-amber-950/40" },
  honey: { label: "Mật ong", Icon: Cookie, iconColor: "text-yellow-500", bgColor: "bg-yellow-50 dark:bg-yellow-950/40" },
  butter: { label: "Bơ", Icon: Cookie, iconColor: "text-yellow-300", bgColor: "bg-yellow-50 dark:bg-yellow-950/40" },
  cream: { label: "Kem", Icon: Cookie, iconColor: "text-amber-100", bgColor: "bg-amber-50 dark:bg-amber-950/40" },
  caramel: { label: "Caramel", Icon: Cookie, iconColor: "text-amber-500", bgColor: "bg-amber-50 dark:bg-amber-950/40" },
  almond: { label: "Hạnh nhân", Icon: Nut, iconColor: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-950/40" },

  // Earthy & Mineral
  earthy: { label: "Đất", Icon: Mountain, iconColor: "text-stone-600", bgColor: "bg-stone-50 dark:bg-stone-800/40" },
  mineral: { label: "Khoáng chất", Icon: Mountain, iconColor: "text-slate-500", bgColor: "bg-slate-50 dark:bg-slate-800/40" },
  musk: { label: "Xạ hương", Icon: Sparkles, iconColor: "text-pink-400", bgColor: "bg-pink-50 dark:bg-pink-950/40" },

  // Special
  cheese: { label: "Phô mai", Icon: Circle, iconColor: "text-amber-200", bgColor: "bg-amber-50 dark:bg-amber-950/40" },
  moscato: { label: "Moscato", Icon: Grape, iconColor: "text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/40" },
};

const FlavorNotes = ({ notes, className }: FlavorNotesProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {notes.map((note) => {
        const noteKey = note.toLowerCase();
        const data = flavorData[noteKey];
        const label = data?.label || note;
        const IconComponent = data?.Icon || Sparkles;
        const iconColor = data?.iconColor || "text-muted-foreground";
        const bgColor = data?.bgColor || "bg-secondary/40";
        
        return (
          <div
            key={note}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full border border-border/30 hover:border-border/50 transition-all hover:scale-105",
              bgColor
            )}
          >
            <IconComponent className={cn("w-4 h-4", iconColor)} aria-hidden="true" />
            <span className="text-xs font-medium text-foreground/80">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default FlavorNotes;