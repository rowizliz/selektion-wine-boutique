import { CheckCircle2, Copy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface SuccessScreenProps {
  trackingToken: string;
}

const SuccessScreen = ({ trackingToken }: SuccessScreenProps) => {
  const copyTrackingToken = () => {
    navigator.clipboard.writeText(trackingToken);
    toast.success("Đã sao chép mã tra cứu!");
  };

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
            Chúng tôi đã nhận được yêu cầu và sẽ liên hệ tư vấn sớm nhất
          </p>
        </div>

        {/* Tracking Token */}
        <div
          className="p-6 rounded-lg bg-muted/50 border space-y-3 animate-slide-up"
          style={{ animationDelay: "0.5s" }}
        >
          <p className="text-sm text-muted-foreground">Mã tra cứu của bạn</p>
          <div className="flex items-center justify-center gap-2">
            <code className="text-lg font-mono bg-background px-4 py-2 rounded border">
              {trackingToken.slice(0, 8).toUpperCase()}
            </code>
            <Button variant="ghost" size="icon" onClick={copyTrackingToken}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Lưu lại mã này để tra cứu trạng thái yêu cầu
          </p>
        </div>

        {/* Actions */}
        <div
          className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in"
          style={{ animationDelay: "0.7s" }}
        >
          <Link to="/tra-cuu-tu-van">
            <Button variant="outline" className="w-full sm:w-auto">
              Tra cứu trạng thái
            </Button>
          </Link>
          <Link to="/collection">
            <Button className="w-full sm:w-auto gap-2">
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
