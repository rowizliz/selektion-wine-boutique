
import { Home, History, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  cartItemCount: number;
}

export const MobileNav = ({ currentTab, onTabChange, cartItemCount }: MobileNavProps) => {
  const items = [
    { id: "dashboard", label: "Trang chủ", icon: Home },
    { id: "products", label: "Sản phẩm", icon: ShoppingBag },
    { id: "history", label: "Lịch sử", icon: History },
    { id: "menu", label: "Cá nhân", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t pb-safe">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.id === "products" && cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
