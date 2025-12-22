import { cn } from "@/lib/utils";

interface WineCharacteristicsBarProps {
  label: string;
  value: number;
  maxValue?: number;
  className?: string;
}

const WineCharacteristicsBar = ({ 
  label, 
  value, 
  maxValue = 9,
  className 
}: WineCharacteristicsBarProps) => {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-xs text-muted-foreground/70">{value}/{maxValue}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary/80 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default WineCharacteristicsBar;
