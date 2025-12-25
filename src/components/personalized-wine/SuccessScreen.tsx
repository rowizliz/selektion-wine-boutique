import { CheckCircle2, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ZALO_LINK = "https://zalo.me/0906777377";

const SuccessScreen = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        {/* Success Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-green-500/10 flex items-center justify-center animate-scale-in">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          {/* Confetti effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="absolute text-2xl animate-fade-in"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                {["🎉", "✨", "🍷", "🎊"][i % 4]}
              </span>
            ))}
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-3xl font-serif">Cảm ơn bạn!</h2>
          <p className="text-muted-foreground">
            Chúng tôi đã nhận được yêu cầu của bạn
          </p>
        </div>

        {/* Zalo CTA */}
        <div
          className="p-6 rounded-lg bg-muted/50 border space-y-3 animate-slide-up"
          style={{ animationDelay: "0.5s" }}
        >
          <p className="text-sm text-muted-foreground">
            Liên hệ ngay để được tư vấn và chốt đơn nhanh nhất
          </p>
          <Button asChild size="lg" className="w-full gap-2">
            <a href={ZALO_LINK} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5" />
              Kết nối qua Zalo
            </a>
          </Button>
        </div>

        {/* Secondary Action */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: "0.7s" }}
        >
          <Link to="/collection">
            <Button variant="outline" className="gap-2">
              Xem bộ sưu tập
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
