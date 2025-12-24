import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface StepCuisineProps {
  data: {
    cuisine_types: string[];
    taste_sweet_level: number;
    taste_spicy_level: number;
  };
  onChange: (field: string, value: string[] | number) => void;
}

const cuisineOptions = [
  { id: "vietnamese", icon: "🍜", label: "Việt Nam" },
  { id: "european", icon: "🍝", label: "Châu Âu" },
  { id: "japanese", icon: "🍣", label: "Nhật Bản" },
  { id: "korean", icon: "🥘", label: "Hàn Quốc" },
  { id: "chinese", icon: "🥡", label: "Trung Hoa" },
  { id: "thai", icon: "🍛", label: "Thái Lan" },
  { id: "american", icon: "🍔", label: "Mỹ" },
  { id: "seafood", icon: "🦐", label: "Hải sản" },
];

const StepCuisine = ({ data, onChange }: StepCuisineProps) => {
  const toggleCuisine = (cuisineId: string) => {
    const newValues = data.cuisine_types.includes(cuisineId)
      ? data.cuisine_types.filter((c) => c !== cuisineId)
      : [...data.cuisine_types, cuisineId];
    onChange("cuisine_types", newValues);
  };

  return (
    <div className="space-y-6 md:space-y-10">
      {/* Cuisine Types */}
      <div className="space-y-3 md:space-y-4">
        <div className="text-center">
          <h2 className="text-xl md:text-3xl font-serif">
            Bạn thường ăn món gì?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-1 md:mt-2">
            Giúp chúng tôi gợi ý rượu phù hợp với khẩu vị
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 md:gap-3 max-w-lg mx-auto">
          {cuisineOptions.map((cuisine) => (
            <button
              key={cuisine.id}
              type="button"
              onClick={() => toggleCuisine(cuisine.id)}
              className={cn(
                "flex flex-col items-center p-2 md:p-4 rounded-lg border-2 transition-all duration-300",
                "hover:border-foreground/50",
                data.cuisine_types.includes(cuisine.id)
                  ? "border-foreground bg-foreground/5"
                  : "border-border"
              )}
            >
              <span className="text-xl md:text-3xl mb-1 md:mb-2">{cuisine.icon}</span>
              <span className="text-[10px] md:text-xs font-sans">{cuisine.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Taste Sliders */}
      <div className="space-y-6 md:space-y-8 max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-xl md:text-3xl font-serif">
            Khẩu vị của bạn
          </h2>
        </div>

        {/* Sweet Level */}
        <div className="space-y-3 md:space-y-4">
          <div className="flex justify-between text-xs md:text-sm font-sans">
            <span>Ít ngọt</span>
            <span className="text-muted-foreground">Độ ngọt</span>
            <span>Rất ngọt</span>
          </div>
          <Slider
            value={[data.taste_sweet_level]}
            onValueChange={([value]) => onChange("taste_sweet_level", value)}
            max={5}
            min={1}
            step={1}
            className="py-2"
          />
          <div className="flex justify-center">
            <span className="text-xl md:text-2xl">
              {data.taste_sweet_level <= 2 ? "🍋" : data.taste_sweet_level >= 4 ? "🍯" : "😊"}
            </span>
          </div>
        </div>

        {/* Spicy Level */}
        <div className="space-y-3 md:space-y-4">
          <div className="flex justify-between text-xs md:text-sm font-sans">
            <span>Nhẹ nhàng</span>
            <span className="text-muted-foreground">Độ cay</span>
            <span>Cay nồng</span>
          </div>
          <Slider
            value={[data.taste_spicy_level]}
            onValueChange={([value]) => onChange("taste_spicy_level", value)}
            max={5}
            min={1}
            step={1}
            className="py-2"
          />
          <div className="flex justify-center">
            <span className="text-xl md:text-2xl">
              {data.taste_spicy_level <= 2 ? "😌" : data.taste_spicy_level >= 4 ? "🔥" : "🌶️"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCuisine;
