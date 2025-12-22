import { cn } from "@/lib/utils";

interface FlavorNotesProps {
  notes: string[];
  className?: string;
}

// Map flavor notes to Vietnamese labels and emojis
const flavorData: Record<string, { label: string; emoji: string; color: string }> = {
  // Fruits - Red
  cherry: { label: "Anh đào", emoji: "🍒", color: "bg-red-100 dark:bg-red-900/30" },
  strawberry: { label: "Dâu tây", emoji: "🍓", color: "bg-red-100 dark:bg-red-900/30" },
  raspberry: { label: "Mâm xôi", emoji: "🫐", color: "bg-rose-100 dark:bg-rose-900/30" },
  blackberry: { label: "Dâu đen", emoji: "🫐", color: "bg-purple-100 dark:bg-purple-900/30" },
  berry: { label: "Dâu", emoji: "🍇", color: "bg-purple-100 dark:bg-purple-900/30" },
  plum: { label: "Mận", emoji: "🍑", color: "bg-purple-100 dark:bg-purple-900/30" },
  grape: { label: "Nho", emoji: "🍇", color: "bg-purple-100 dark:bg-purple-900/30" },
  cranberry: { label: "Nam việt quất", emoji: "🔴", color: "bg-red-100 dark:bg-red-900/30" },
  
  // Fruits - Citrus & Tropical  
  citrus: { label: "Cam quýt", emoji: "🍊", color: "bg-orange-100 dark:bg-orange-900/30" },
  orange: { label: "Cam", emoji: "🍊", color: "bg-orange-100 dark:bg-orange-900/30" },
  tangerine: { label: "Quýt", emoji: "🍊", color: "bg-orange-100 dark:bg-orange-900/30" },
  lemon: { label: "Chanh", emoji: "🍋", color: "bg-yellow-100 dark:bg-yellow-900/30" },
  grapefruit: { label: "Bưởi", emoji: "🍊", color: "bg-pink-100 dark:bg-pink-900/30" },
  apple: { label: "Táo", emoji: "🍎", color: "bg-green-100 dark:bg-green-900/30" },
  pear: { label: "Lê", emoji: "🍐", color: "bg-green-100 dark:bg-green-900/30" },
  peach: { label: "Đào", emoji: "🍑", color: "bg-orange-100 dark:bg-orange-900/30" },
  tropical: { label: "Nhiệt đới", emoji: "🥭", color: "bg-yellow-100 dark:bg-yellow-900/30" },
  pineapple: { label: "Dứa", emoji: "🍍", color: "bg-yellow-100 dark:bg-yellow-900/30" },
  banana: { label: "Chuối", emoji: "🍌", color: "bg-yellow-100 dark:bg-yellow-900/30" },
  fig: { label: "Sung", emoji: "🫐", color: "bg-purple-100 dark:bg-purple-900/30" },
  raisin: { label: "Nho khô", emoji: "🍇", color: "bg-purple-100 dark:bg-purple-900/30" },
  
  // Floral & Herbal
  floral: { label: "Hoa", emoji: "🌸", color: "bg-pink-100 dark:bg-pink-900/30" },
  rose: { label: "Hoa hồng", emoji: "🌹", color: "bg-pink-100 dark:bg-pink-900/30" },
  jasmine: { label: "Hoa nhài", emoji: "🌼", color: "bg-white dark:bg-slate-800" },
  elderflower: { label: "Hoa cơm cháy", emoji: "🌸", color: "bg-white dark:bg-slate-800" },
  potpourri: { label: "Hoa khô", emoji: "💐", color: "bg-pink-100 dark:bg-pink-900/30" },
  violet: { label: "Hoa tím", emoji: "💜", color: "bg-violet-100 dark:bg-violet-900/30" },
  herb: { label: "Thảo mộc", emoji: "🌿", color: "bg-green-100 dark:bg-green-900/30" },
  mint: { label: "Bạc hà", emoji: "🍃", color: "bg-green-100 dark:bg-green-900/30" },
  eucalyptus: { label: "Khuynh diệp", emoji: "🌿", color: "bg-green-100 dark:bg-green-900/30" },
  "bell pepper": { label: "Ớt chuông", emoji: "🫑", color: "bg-green-100 dark:bg-green-900/30" },
  
  // Spices & Earth
  spice: { label: "Gia vị", emoji: "🌶️", color: "bg-amber-100 dark:bg-amber-900/30" },
  pepper: { label: "Tiêu", emoji: "🫚", color: "bg-amber-100 dark:bg-amber-900/30" },
  cinnamon: { label: "Quế", emoji: "🪵", color: "bg-amber-100 dark:bg-amber-900/30" },
  licorice: { label: "Cam thảo", emoji: "🍬", color: "bg-stone-100 dark:bg-stone-900/30" },
  ginger: { label: "Gừng", emoji: "🫚", color: "bg-amber-100 dark:bg-amber-900/30" },
  mineral: { label: "Khoáng chất", emoji: "💎", color: "bg-slate-100 dark:bg-slate-800" },
  earthy: { label: "Đất", emoji: "🏔️", color: "bg-stone-100 dark:bg-stone-900/30" },
  earth: { label: "Đất", emoji: "🏔️", color: "bg-stone-100 dark:bg-stone-900/30" },
  musk: { label: "Xạ hương", emoji: "✨", color: "bg-amber-100 dark:bg-amber-900/30" },
  
  // Wood & Smoke
  oak: { label: "Gỗ sồi", emoji: "🪵", color: "bg-amber-100 dark:bg-amber-900/30" },
  cedar: { label: "Gỗ tuyết tùng", emoji: "🌲", color: "bg-green-100 dark:bg-green-900/30" },
  tobacco: { label: "Thuốc lá", emoji: "🍂", color: "bg-amber-100 dark:bg-amber-900/30" },
  leather: { label: "Da thuộc", emoji: "🧥", color: "bg-amber-100 dark:bg-amber-900/30" },
  smoke: { label: "Khói", emoji: "💨", color: "bg-slate-100 dark:bg-slate-800" },
  
  // Sweet & Rich
  vanilla: { label: "Vani", emoji: "🍦", color: "bg-amber-50 dark:bg-amber-900/20" },
  chocolate: { label: "Chocolate", emoji: "🍫", color: "bg-amber-100 dark:bg-amber-900/30" },
  cocoa: { label: "Ca cao", emoji: "🍫", color: "bg-amber-100 dark:bg-amber-900/30" },
  coffee: { label: "Cà phê", emoji: "☕", color: "bg-amber-100 dark:bg-amber-900/30" },
  honey: { label: "Mật ong", emoji: "🍯", color: "bg-amber-100 dark:bg-amber-900/30" },
  butter: { label: "Bơ", emoji: "🧈", color: "bg-yellow-100 dark:bg-yellow-900/30" },
  cream: { label: "Kem", emoji: "🥛", color: "bg-white dark:bg-slate-800" },
  almond: { label: "Hạnh nhân", emoji: "🥜", color: "bg-amber-100 dark:bg-amber-900/30" },
  caramel: { label: "Caramel", emoji: "🍮", color: "bg-amber-100 dark:bg-amber-900/30" },
  moscato: { label: "Moscato", emoji: "🍇", color: "bg-amber-100 dark:bg-amber-900/30" },
  
  // Black fruits (for wine description)
  black: { label: "Quả đen", emoji: "🫐", color: "bg-slate-100 dark:bg-slate-800" },
  "black currant": { label: "Lý chua đen", emoji: "🫐", color: "bg-purple-100 dark:bg-purple-900/30" },
};

const FlavorNotes = ({ notes, className }: FlavorNotesProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {notes.map((note) => {
        const noteKey = note.toLowerCase();
        const data = flavorData[noteKey];
        const label = data?.label || note;
        const emoji = data?.emoji || "✨";
        const bgColor = data?.color || "bg-secondary/40";
        
        return (
          <div
            key={note}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full border border-border/30 hover:border-border/50 transition-all hover:scale-105",
              bgColor
            )}
          >
            <span className="text-lg leading-none" role="img" aria-label={label}>
              {emoji}
            </span>
            <span className="text-xs font-medium text-foreground/80">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default FlavorNotes;