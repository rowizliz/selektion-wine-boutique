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
        "relative p-3 md:p-6 rounded-lg border-2 transition-all duration-300 text-left w-full group",
        "hover:border-foreground/50 hover:shadow-lg",
        selected
          ? "border-foreground bg-foreground/5 shadow-md"
          : "border-border bg-background",
        className
      )}
    >
      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-2 right-2 md:top-3 md:right-3 w-5 h-5 md:w-6 md:h-6 rounded-full bg-foreground text-background flex items-center justify-center animate-scale-in">
          <Check className="w-3 h-3 md:w-4 md:h-4" />
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          "text-2xl md:text-4xl mb-2 md:mb-3 transition-transform duration-300",
          "group-hover:scale-110",
          selected && "scale-110"
        )}
      >
        {icon}
      </div>

      {/* Label */}
      <h3
        className={cn(
          "font-serif text-sm md:text-lg transition-colors",
          selected ? "text-foreground" : "text-foreground/80"
        )}
      >
        {label}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1 line-clamp-2">{description}</p>
      )}
    </button>
  );
};

export default VisualSelectCard;
