import { cn } from "@/lib/utils";
import {
  CherryIcon, StrawberryIcon, RaspberryIcon, GrapeIcon, AppleIcon, CitrusIcon, PlumIcon, PeachIcon, PearIcon, BananaIcon,
  RoseIcon, FlowerIcon, VioletIcon, BellPepperIcon,
  LeafIcon, MintIcon,
  VanillaIcon, PepperIcon, CinnamonIcon,
  OakIcon, EarthIcon, MushroomIcon,
  CoffeeIcon, HoneyIcon, CreamIcon, ButterIcon, ChocolateIcon, CheeseIcon,
  TobaccoIcon, LeatherIcon, SmokeIcon,
  NutIcon
} from './CustomFlavorIcons';
import { Sparkles } from 'lucide-react';

interface FlavorNotesProps {
  notes: string[];
  className?: string;
}

// Wine Folly Style - Simple recognizable icons
type IconComponent = React.FC<{ className?: string }>;
const flavorData: Record<string, { label: string; Icon: IconComponent }> = {
  // Red Fruits
  cherry: { label: "Anh đào", Icon: CherryIcon },
  "anh đào": { label: "Anh đào", Icon: CherryIcon },
  strawberry: { label: "Dâu tây", Icon: StrawberryIcon },
  "dâu tây": { label: "Dâu tây", Icon: StrawberryIcon },
  raspberry: { label: "Mâm xôi", Icon: RaspberryIcon },
  "mâm xôi": { label: "Mâm xôi", Icon: RaspberryIcon },
  blackberry: { label: "Dâu đen", Icon: GrapeIcon },
  "dâu đen": { label: "Dâu đen", Icon: GrapeIcon },
  berry: { label: "Quả mọng", Icon: RaspberryIcon },
  "quả mọng": { label: "Quả mọng", Icon: RaspberryIcon },
  plum: { label: "Mận", Icon: PlumIcon },
  "mận": { label: "Mận", Icon: PlumIcon },
  cranberry: { label: "Nam việt quất", Icon: CherryIcon },
  "nam việt quất": { label: "Nam việt quất", Icon: CherryIcon },
  currant: { label: "Lý chua", Icon: GrapeIcon },
  "lý chua": { label: "Lý chua", Icon: GrapeIcon },
  "black currant": { label: "Lý chua đen", Icon: GrapeIcon },
  "lý chua đen": { label: "Lý chua đen", Icon: GrapeIcon },
  black: { label: "Quả đen", Icon: GrapeIcon },
  "quả đen": { label: "Quả đen", Icon: GrapeIcon },
  nho: { label: "Nho", Icon: GrapeIcon },
  grape: { label: "Nho", Icon: GrapeIcon },

  // Citrus
  citrus: { label: "Cam quýt", Icon: CitrusIcon },
  "cam quýt": { label: "Cam quýt", Icon: CitrusIcon },
  orange: { label: "Cam", Icon: CitrusIcon },
  cam: { label: "Cam", Icon: CitrusIcon },
  tangerine: { label: "Quýt", Icon: CitrusIcon },
  "quýt": { label: "Quýt", Icon: CitrusIcon },
  lemon: { label: "Chanh vàng", Icon: CitrusIcon },
  "chanh vàng": { label: "Chanh vàng", Icon: CitrusIcon },
  grapefruit: { label: "Bưởi", Icon: CitrusIcon },
  "bưởi": { label: "Bưởi", Icon: CitrusIcon },
  "orange peel": { label: "Vỏ cam", Icon: CitrusIcon },
  "vỏ cam": { label: "Vỏ cam", Icon: CitrusIcon },

  // Other Fruits
  apple: { label: "Táo", Icon: AppleIcon },
  "táo": { label: "Táo", Icon: AppleIcon },
  pear: { label: "Lê", Icon: PearIcon },
  "lê": { label: "Lê", Icon: PearIcon },
  peach: { label: "Đào", Icon: PeachIcon },
  "đào": { label: "Đào", Icon: PeachIcon },
  tropical: { label: "Nhiệt đới", Icon: BananaIcon },
  "nhiệt đới": { label: "Nhiệt đới", Icon: BananaIcon },
  pineapple: { label: "Dứa", Icon: CitrusIcon },
  "dứa": { label: "Dứa", Icon: CitrusIcon },
  banana: { label: "Chuối", Icon: BananaIcon },
  "chuối": { label: "Chuối", Icon: BananaIcon },
  fig: { label: "Sung", Icon: PlumIcon },
  "sung": { label: "Sung", Icon: PlumIcon },
  raisin: { label: "Nho khô", Icon: GrapeIcon },
  "nho khô": { label: "Nho khô", Icon: GrapeIcon },

  // Floral
  floral: { label: "Hoa", Icon: FlowerIcon },
  "hoa": { label: "Hoa", Icon: FlowerIcon },
  rose: { label: "Hoa hồng", Icon: RoseIcon },
  "hoa hồng": { label: "Hoa hồng", Icon: RoseIcon },
  violet: { label: "Hoa tím", Icon: VioletIcon },
  "hoa tím": { label: "Hoa tím", Icon: VioletIcon },
  jasmine: { label: "Hoa nhài", Icon: FlowerIcon },
  "hoa nhài": { label: "Hoa nhài", Icon: FlowerIcon },
  elderflower: { label: "Hoa cơm cháy", Icon: FlowerIcon },
  "hoa cơm cháy": { label: "Hoa cơm cháy", Icon: FlowerIcon },
  potpourri: { label: "Hoa khô", Icon: FlowerIcon },
  "hoa khô": { label: "Hoa khô", Icon: FlowerIcon },
  "hoa lan": { label: "Hoa lan", Icon: FlowerIcon },

  // Herbal
  herb: { label: "Thảo mộc", Icon: LeafIcon },
  "thảo mộc": { label: "Thảo mộc", Icon: LeafIcon },
  mint: { label: "Bạc hà", Icon: MintIcon },
  "bạc hà": { label: "Bạc hà", Icon: MintIcon },
  eucalyptus: { label: "Khuynh diệp", Icon: LeafIcon },
  "khuynh diệp": { label: "Khuynh diệp", Icon: LeafIcon },
  "bell pepper": { label: "Ớt chuông", Icon: BellPepperIcon },
  "ớt chuông": { label: "Ớt chuông", Icon: BellPepperIcon },
  sage: { label: "Xô thơm", Icon: LeafIcon },
  "xô thơm": { label: "Xô thơm", Icon: LeafIcon },

  // Spices
  spice: { label: "Gia vị", Icon: PepperIcon },
  "gia vị": { label: "Gia vị", Icon: PepperIcon },
  pepper: { label: "Tiêu", Icon: PepperIcon },
  "tiêu": { label: "Tiêu", Icon: PepperIcon },
  cinnamon: { label: "Quế", Icon: CinnamonIcon },
  "quế": { label: "Quế", Icon: CinnamonIcon },
  ginger: { label: "Gừng", Icon: PepperIcon },
  "gừng": { label: "Gừng", Icon: PepperIcon },
  licorice: { label: "Cam thảo", Icon: CinnamonIcon },
  "cam thảo": { label: "Cam thảo", Icon: CinnamonIcon },

  // Wood & Smoke
  oak: { label: "Gỗ sồi", Icon: OakIcon },
  "gỗ sồi": { label: "Gỗ sồi", Icon: OakIcon },
  cedar: { label: "Gỗ tuyết tùng", Icon: OakIcon },
  "gỗ tuyết tùng": { label: "Gỗ tuyết tùng", Icon: OakIcon },
  tobacco: { label: "Thuốc lá", Icon: TobaccoIcon },
  "thuốc lá": { label: "Thuốc lá", Icon: TobaccoIcon },
  leather: { label: "Da thuộc", Icon: LeatherIcon },
  "da thuộc": { label: "Da thuộc", Icon: LeatherIcon },
  smoke: { label: "Khói", Icon: SmokeIcon },
  "khói": { label: "Khói", Icon: SmokeIcon },
  earthy: { label: "Đất", Icon: EarthIcon },
  "đất": { label: "Đất", Icon: EarthIcon },
  mineral: { label: "Khoáng chất", Icon: EarthIcon },
  "khoáng chất": { label: "Khoáng chất", Icon: EarthIcon },
  mushroom: { label: "Nấm", Icon: MushroomIcon },
  "nấm": { label: "Nấm", Icon: MushroomIcon },

  // Sweet & Rich
  vanilla: { label: "Vani", Icon: VanillaIcon },
  "vani": { label: "Vani", Icon: VanillaIcon },
  chocolate: { label: "Sô-cô-la", Icon: ChocolateIcon },
  "sô-cô-la": { label: "Sô-cô-la", Icon: ChocolateIcon },
  cocoa: { label: "Ca cao", Icon: ChocolateIcon },
  "ca cao": { label: "Ca cao", Icon: ChocolateIcon },
  mocha: { label: "Mocha", Icon: CoffeeIcon },
  coffee: { label: "Cà phê", Icon: CoffeeIcon },
  "cà phê": { label: "Cà phê", Icon: CoffeeIcon },
  honey: { label: "Mật ong", Icon: HoneyIcon },
  "mật ong": { label: "Mật ong", Icon: HoneyIcon },
  butter: { label: "Bơ", Icon: ButterIcon },
  "bơ": { label: "Bơ", Icon: ButterIcon },
  cream: { label: "Kem", Icon: CreamIcon },
  "kem": { label: "Kem", Icon: CreamIcon },
  caramel: { label: "Caramel", Icon: HoneyIcon },
  almond: { label: "Hạnh nhân", Icon: NutIcon },
  "hạnh nhân": { label: "Hạnh nhân", Icon: NutIcon },

  // Special
  musk: { label: "Xạ hương", Icon: FlowerIcon },
  "xạ hương": { label: "Xạ hương", Icon: FlowerIcon },
  cheese: { label: "Phô mai", Icon: CheeseIcon },
  "phô mai": { label: "Phô mai", Icon: CheeseIcon },
  moscato: { label: "Moscato", Icon: GrapeIcon },
};

// Default icon for unknown flavors
const DefaultIcon = Sparkles;

const FlavorNotes = ({ notes, className }: FlavorNotesProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {notes.map((note) => {
        const noteKey = note.toLowerCase();
        const data = flavorData[noteKey];
        const label = data?.label || note;
        const IconComponent = data?.Icon || DefaultIcon;

        return (
          <div
            key={note}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full",
              "border border-border/40",
              "bg-neutral-50 dark:bg-neutral-900/50",
              "hover:bg-neutral-100 dark:hover:bg-neutral-800/60",
              "hover:border-border/60",
              "transition-all duration-200 hover:scale-105",
              "shadow-sm hover:shadow"
            )}
          >
            <IconComponent
              className="w-5 h-5 text-foreground/80"
            />
            <span className="text-xs font-medium text-foreground/90">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default FlavorNotes;