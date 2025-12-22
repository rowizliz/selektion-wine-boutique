import { cn } from "@/lib/utils";

interface FlavorNotesProps {
  notes: string[];
  className?: string;
}

// Map flavor notes to Vietnamese labels and emojis/icons
const flavorMap: Record<string, { label: string; emoji: string }> = {
  cherry: { label: "Anh đào", emoji: "🍒" },
  plum: { label: "Mận", emoji: "🫐" },
  berry: { label: "Dâu", emoji: "🍓" },
  blackberry: { label: "Dâu đen", emoji: "🫐" },
  raspberry: { label: "Mâm xôi", emoji: "🍇" },
  strawberry: { label: "Dâu tây", emoji: "🍓" },
  mineral: { label: "Khoáng chất", emoji: "💎" },
  vanilla: { label: "Vani", emoji: "🍦" },
  oak: { label: "Gỗ sồi", emoji: "🪵" },
  spice: { label: "Gia vị", emoji: "🌶️" },
  chocolate: { label: "Chocolate", emoji: "🍫" },
  coffee: { label: "Cà phê", emoji: "☕" },
  tobacco: { label: "Thuốc lá", emoji: "🍂" },
  leather: { label: "Da thuộc", emoji: "👜" },
  floral: { label: "Hoa", emoji: "🌸" },
  rose: { label: "Hoa hồng", emoji: "🌹" },
  honey: { label: "Mật ong", emoji: "🍯" },
  citrus: { label: "Cam quýt", emoji: "🍊" },
  lemon: { label: "Chanh", emoji: "🍋" },
  apple: { label: "Táo", emoji: "🍎" },
  pear: { label: "Lê", emoji: "🍐" },
  peach: { label: "Đào", emoji: "🍑" },
  tropical: { label: "Nhiệt đới", emoji: "🥭" },
  herb: { label: "Thảo mộc", emoji: "🌿" },
  pepper: { label: "Tiêu", emoji: "🫑" },
  licorice: { label: "Cam thảo", emoji: "🖤" },
  earth: { label: "Đất", emoji: "🌍" },
  smoke: { label: "Khói", emoji: "💨" },
  butter: { label: "Bơ", emoji: "🧈" },
  cream: { label: "Kem", emoji: "🥛" },
  fig: { label: "Sung", emoji: "🫐" },
  raisin: { label: "Nho khô", emoji: "🍇" },
  almond: { label: "Hạnh nhân", emoji: "🥜" },
};

const FlavorNotes = ({ notes, className }: FlavorNotesProps) => {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {notes.map((note) => {
        const flavor = flavorMap[note.toLowerCase()] || { label: note, emoji: "🍷" };
        return (
          <div
            key={note}
            className="flex flex-col items-center gap-1 p-3 bg-secondary/50 rounded-lg min-w-[70px]"
          >
            <span className="text-2xl">{flavor.emoji}</span>
            <span className="text-xs text-muted-foreground text-center">{flavor.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default FlavorNotes;
