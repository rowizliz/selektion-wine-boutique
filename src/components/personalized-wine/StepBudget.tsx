import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface StepBudgetProps {
  data: {
    budget_range: string;
    occasions: string[];
  };
  onChange: (field: string, value: string | string[]) => void;
}

const budgetRanges = [
  { value: 1, label: "Dưới 500K", range: "< 500.000đ" },
  { value: 2, label: "500K - 1 Triệu", range: "500K - 1M" },
  { value: 3, label: "1 - 2 Triệu", range: "1M - 2M" },
  { value: 4, label: "2 - 5 Triệu", range: "2M - 5M" },
  { value: 5, label: "Trên 5 Triệu", range: "> 5.000.000đ" },
];

const occasionOptions = [
  { id: "party", icon: "🎉", label: "Tiệc tùng" },
  { id: "gift", icon: "🎁", label: "Tặng quà" },
  { id: "personal", icon: "🍷", label: "Thưởng thức" },
  { id: "romantic", icon: "💕", label: "Hẹn hò" },
  { id: "business", icon: "💼", label: "Công việc" },
  { id: "celebration", icon: "🥳", label: "Kỷ niệm" },
];

const StepBudget = ({ data, onChange }: StepBudgetProps) => {
  const [budgetValue, setBudgetValue] = useState(3);

  useEffect(() => {
    // Set initial value from data
    const currentBudget = budgetRanges.find((b) => b.label === data.budget_range);
    if (currentBudget) {
      setBudgetValue(currentBudget.value);
    }
  }, [data.budget_range]);

  const handleBudgetChange = (value: number[]) => {
    setBudgetValue(value[0]);
    const budget = budgetRanges.find((b) => b.value === value[0]);
    if (budget) {
      onChange("budget_range", budget.label);
    }
  };

  const toggleOccasion = (occasionId: string) => {
    const newValues = data.occasions.includes(occasionId)
      ? data.occasions.filter((o) => o !== occasionId)
      : [...data.occasions, occasionId];
    onChange("occasions", newValues);
  };

  const currentBudget = budgetRanges.find((b) => b.value === budgetValue);

  return (
    <div className="space-y-6 md:space-y-10">
      {/* Budget */}
      <div className="space-y-4 md:space-y-6">
        <div className="text-center">
          <h2 className="text-xl md:text-3xl font-serif">
            Ngân sách của bạn?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-1 md:mt-2">
            Giúp chúng tôi gợi ý rượu phù hợp với túi tiền
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-4 md:space-y-6">
          {/* Budget Display */}
          <div className="text-center py-4 md:py-6 rounded-lg bg-foreground/5 border">
            <p className="text-2xl md:text-4xl font-serif">{currentBudget?.range}</p>
            <p className="text-muted-foreground text-xs md:text-sm mt-1">{currentBudget?.label}</p>
          </div>

          {/* Slider */}
          <div className="px-2 md:px-4">
            <Slider
              value={[budgetValue]}
              onValueChange={handleBudgetChange}
              max={5}
              min={1}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Tiết kiệm</span>
              <span>Cao cấp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Occasions */}
      <div className="space-y-3 md:space-y-4">
        <div className="text-center">
          <h2 className="text-xl md:text-3xl font-serif">
            Dịp sử dụng?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-1 md:mt-2">
            Bạn dùng rượu cho dịp gì?
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-lg mx-auto">
          {occasionOptions.map((occasion) => (
            <button
              key={occasion.id}
              type="button"
              onClick={() => toggleOccasion(occasion.id)}
              className={cn(
                "flex flex-col items-center p-2 md:p-4 rounded-lg border-2 transition-all duration-300",
                "hover:border-foreground/50 active:scale-95 md:hover:scale-105",
                data.occasions.includes(occasion.id)
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background"
              )}
            >
              <span className="text-lg md:text-2xl mb-1 md:mb-2">{occasion.icon}</span>
              <span className="text-[10px] md:text-xs font-sans">{occasion.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepBudget;
