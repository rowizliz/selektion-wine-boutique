import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface VisualSelectCardProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

const VisualSelectCard = ({
  icon,
  label,
  description,
  selected,
  onClick,
  className,
}: VisualSelectCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative p-6 rounded-lg border-2 transition-all duration-300 text-left w-full group",
        "hover:border-foreground/50 hover:shadow-lg",
        selected
          ? "border-foreground bg-foreground/5 shadow-md"
          : "border-border bg-background",
        className
      )}
    >
      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center animate-scale-in">
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          "text-4xl mb-3 transition-transform duration-300",
          "group-hover:scale-110",
          selected && "scale-110"
        )}
      >
        {icon}
      </div>

      {/* Label */}
      <h3
        className={cn(
          "font-serif text-lg transition-colors",
          selected ? "text-foreground" : "text-foreground/80"
        )}
      >
        {label}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </button>
  );
};

export default VisualSelectCard;
