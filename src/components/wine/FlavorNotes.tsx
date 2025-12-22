import { cn } from "@/lib/utils";
import { 
  Cherry, 
  Grape, 
  Leaf, 
  Flower2, 
  Coffee, 
  Droplets,
  Flame,
  Citrus,
  Apple,
  TreeDeciduous,
  Sparkles,
  Mountain,
  Wind,
  Cookie,
  Circle,
  type LucideIcon
} from "lucide-react";

interface FlavorNotesProps {
  notes: string[];
  className?: string;
}

// Map flavor notes to Vietnamese labels and Lucide icons
const flavorMap: Record<string, { label: string; Icon: LucideIcon; color: string }> = {
  // Fruits - Red
  cherry: { label: "Anh đào", Icon: Cherry, color: "text-red-500" },
  plum: { label: "Mận", Icon: Circle, color: "text-purple-600" },
  berry: { label: "Dâu", Icon: Grape, color: "text-pink-500" },
  blackberry: { label: "Dâu đen", Icon: Grape, color: "text-purple-800" },
  raspberry: { label: "Mâm xôi", Icon: Grape, color: "text-pink-600" },
  strawberry: { label: "Dâu tây", Icon: Cherry, color: "text-red-400" },
  
  // Fruits - Light
  citrus: { label: "Cam quýt", Icon: Citrus, color: "text-orange-400" },
  lemon: { label: "Chanh", Icon: Citrus, color: "text-yellow-400" },
  apple: { label: "Táo", Icon: Apple, color: "text-green-500" },
  pear: { label: "Lê", Icon: Apple, color: "text-lime-400" },
  peach: { label: "Đào", Icon: Apple, color: "text-orange-300" },
  tropical: { label: "Nhiệt đới", Icon: Leaf, color: "text-yellow-500" },
  fig: { label: "Sung", Icon: Circle, color: "text-purple-400" },
  raisin: { label: "Nho khô", Icon: Grape, color: "text-amber-700" },
  
  // Floral
  floral: { label: "Hoa", Icon: Flower2, color: "text-pink-400" },
  rose: { label: "Hoa hồng", Icon: Flower2, color: "text-rose-500" },
  
  // Herbs & Spices
  herb: { label: "Thảo mộc", Icon: Leaf, color: "text-green-600" },
  spice: { label: "Gia vị", Icon: Flame, color: "text-orange-500" },
  pepper: { label: "Tiêu", Icon: Flame, color: "text-red-600" },
  licorice: { label: "Cam thảo", Icon: Sparkles, color: "text-slate-700" },
  
  // Earth & Wood
  mineral: { label: "Khoáng chất", Icon: Mountain, color: "text-slate-500" },
  oak: { label: "Gỗ sồi", Icon: TreeDeciduous, color: "text-amber-600" },
  earth: { label: "Đất", Icon: Mountain, color: "text-stone-600" },
  tobacco: { label: "Thuốc lá", Icon: Leaf, color: "text-amber-800" },
  leather: { label: "Da thuộc", Icon: Circle, color: "text-amber-900" },
  smoke: { label: "Khói", Icon: Wind, color: "text-gray-500" },
  
  // Sweet & Rich
  vanilla: { label: "Vani", Icon: Cookie, color: "text-amber-200" },
  chocolate: { label: "Chocolate", Icon: Cookie, color: "text-amber-800" },
  coffee: { label: "Cà phê", Icon: Coffee, color: "text-amber-900" },
  honey: { label: "Mật ong", Icon: Droplets, color: "text-amber-400" },
  butter: { label: "Bơ", Icon: Cookie, color: "text-yellow-300" },
  cream: { label: "Kem", Icon: Droplets, color: "text-slate-100" },
  almond: { label: "Hạnh nhân", Icon: Circle, color: "text-amber-500" },
};

const FlavorNotes = ({ notes, className }: FlavorNotesProps) => {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {notes.map((note) => {
        const flavor = flavorMap[note.toLowerCase()];
        const Icon = flavor?.Icon || Sparkles;
        const label = flavor?.label || note;
        const iconColor = flavor?.color || "text-primary";
        
        return (
          <div
            key={note}
            className="flex flex-col items-center gap-2 p-3 bg-secondary/40 rounded-lg min-w-[72px] hover:bg-secondary/60 transition-colors"
          >
            <div className={cn("w-8 h-8 flex items-center justify-center", iconColor)}>
              <Icon className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-muted-foreground text-center font-medium">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default FlavorNotes;
