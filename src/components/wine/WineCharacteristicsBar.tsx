import * as React from "react";
import { cn } from "@/lib/utils";

export interface WineCharacteristicsBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  maxValue?: number;
}

const WineCharacteristicsBar = React.forwardRef<
  HTMLDivElement,
  WineCharacteristicsBarProps
>(({ label, value, maxValue = 9, className, ...props }, ref) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-xs text-muted-foreground/70">
          {value}/{maxValue}
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary/80 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

WineCharacteristicsBar.displayName = "WineCharacteristicsBar";

export default WineCharacteristicsBar;
