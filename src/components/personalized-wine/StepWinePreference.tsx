import VisualSelectCard from "./VisualSelectCard";

interface StepWinePreferenceProps {
  data: {
    wine_types: string[];
    wine_styles: string[];
  };
  onChange: (field: string, value: string[]) => void;
}

const wineTypes = [
  { id: "red", icon: "🍷", label: "Vang Đỏ", description: "Đậm đà, phức tạp" },
  { id: "white", icon: "🥂", label: "Vang Trắng", description: "Tươi mát, thanh nhã" },
  { id: "sparkling", icon: "🍾", label: "Sparkling", description: "Sủi bọt, lễ hội" },
  { id: "unknown", icon: "❓", label: "Chưa biết", description: "Để tôi tư vấn cho bạn" },
];

const wineStyles = [
  { id: "sweet", icon: "🍯", label: "Ngọt nhẹ", description: "Dễ uống, thư giãn" },
  { id: "bold", icon: "💪", label: "Đậm đà", description: "Hương vị mạnh mẽ" },
  { id: "elegant", icon: "✨", label: "Thanh lịch", description: "Tinh tế, cân bằng" },
  { id: "fruity", icon: "🍇", label: "Trái cây", description: "Tươi mới, trẻ trung" },
];

const StepWinePreference = ({ data, onChange }: StepWinePreferenceProps) => {
  const toggleSelection = (field: string, value: string) => {
    const currentValues = field === "wine_types" ? data.wine_types : data.wine_styles;
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onChange(field, newValues);
  };

  return (
    <div className="space-y-6 md:space-y-10">
      {/* Wine Types */}
      <div className="space-y-3 md:space-y-4">
        <div className="text-center">
          <h2 className="text-xl md:text-3xl font-serif">
            Bạn thích loại rượu vang nào?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-1 md:mt-2">
            Có thể chọn nhiều loại
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {wineTypes.map((type) => (
            <VisualSelectCard
              key={type.id}
              icon={<span>{type.icon}</span>}
              label={type.label}
              description={type.description}
              selected={data.wine_types.includes(type.id)}
              onClick={() => toggleSelection("wine_types", type.id)}
            />
          ))}
        </div>
      </div>

      {/* Wine Styles */}
      <div className="space-y-3 md:space-y-4">
        <div className="text-center">
          <h2 className="text-xl md:text-3xl font-serif">
            Phong cách yêu thích?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-1 md:mt-2">
            Có thể chọn nhiều phong cách
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {wineStyles.map((style) => (
            <VisualSelectCard
              key={style.id}
              icon={<span>{style.icon}</span>}
              label={style.label}
              description={style.description}
              selected={data.wine_styles.includes(style.id)}
              onClick={() => toggleSelection("wine_styles", style.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepWinePreference;
