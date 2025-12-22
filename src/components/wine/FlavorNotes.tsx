import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Sparkles, type LucideIcon } from "lucide-react";

interface FlavorNotesProps {
  notes: string[];
  className?: string;
}

// Map flavor notes to Vietnamese labels
const flavorLabels: Record<string, string> = {
  cherry: "Anh đào",
  plum: "Mận",
  berry: "Dâu",
  blackberry: "Dâu đen",
  raspberry: "Mâm xôi",
  strawberry: "Dâu tây",
  citrus: "Cam quýt",
  lemon: "Chanh",
  apple: "Táo",
  pear: "Lê",
  peach: "Đào",
  tropical: "Nhiệt đới",
  fig: "Sung",
  raisin: "Nho khô",
  floral: "Hoa",
  rose: "Hoa hồng",
  herb: "Thảo mộc",
  mint: "Bạc hà",
  spice: "Gia vị",
  pepper: "Tiêu",
  licorice: "Cam thảo",
  mineral: "Khoáng chất",
  oak: "Gỗ sồi",
  earth: "Đất",
  tobacco: "Thuốc lá",
  leather: "Da thuộc",
  smoke: "Khói",
  vanilla: "Vani",
  chocolate: "Chocolate",
  coffee: "Cà phê",
  honey: "Mật ong",
  butter: "Bơ",
  cream: "Kem",
  almond: "Hạnh nhân",
  caramel: "Caramel",
};

// Supabase storage URL for flavor icons
const STORAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/flavor-icons`;

const FlavorNotes = ({ notes, className }: FlavorNotesProps) => {
  const [loadedIcons, setLoadedIcons] = useState<Record<string, boolean>>({});
  const [failedIcons, setFailedIcons] = useState<Record<string, boolean>>({});

  const handleImageLoad = (note: string) => {
    setLoadedIcons(prev => ({ ...prev, [note]: true }));
  };

  const handleImageError = (note: string) => {
    setFailedIcons(prev => ({ ...prev, [note]: true }));
  };

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {notes.map((note) => {
        const noteKey = note.toLowerCase();
        const label = flavorLabels[noteKey] || note;
        const iconUrl = `${STORAGE_URL}/${noteKey}.png`;
        const hasLoaded = loadedIcons[noteKey];
        const hasFailed = failedIcons[noteKey];
        
        return (
          <div
            key={note}
            className="flex flex-col items-center gap-2 p-3 bg-secondary/40 rounded-lg min-w-[72px] hover:bg-secondary/60 transition-colors"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              {!hasFailed ? (
                <img
                  src={iconUrl}
                  alt={label}
                  className={cn(
                    "w-10 h-10 object-contain transition-opacity duration-300",
                    hasLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => handleImageLoad(noteKey)}
                  onError={() => handleImageError(noteKey)}
                  loading="lazy"
                />
              ) : (
                <Sparkles className="w-6 h-6 text-primary" strokeWidth={1.5} />
              )}
              {!hasLoaded && !hasFailed && (
                <div className="absolute w-6 h-6 rounded-full bg-secondary animate-pulse" />
              )}
            </div>
            <span className="text-xs text-muted-foreground text-center font-medium">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default FlavorNotes;
