import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

const WizardProgress = ({ currentStep, totalSteps, labels }: WizardProgressProps) => {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative">
        <div className="flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-sans text-xs md:text-sm transition-all duration-300 z-10",
                    isCompleted
                      ? "bg-foreground text-background"
                      : isCurrent
                      ? "bg-foreground text-background ring-2 md:ring-4 ring-foreground/20"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {labels && labels[index] && (
                  <span
                    className={cn(
                      "mt-2 text-xs font-sans hidden sm:block transition-colors",
                      isCurrent || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {labels[index]}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Connecting lines */}
        <div className="absolute top-4 md:top-5 left-0 right-0 h-[2px] -z-0">
          <div className="flex h-full">
            {Array.from({ length: totalSteps - 1 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "flex-1 mx-3 md:mx-5 transition-colors duration-300",
                  index < currentStep ? "bg-foreground" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardProgress;
