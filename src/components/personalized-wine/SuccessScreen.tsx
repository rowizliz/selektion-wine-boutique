import { Wine, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ZALO_LINK = "https://zalo.me/0906777377";

const SuccessScreen = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16">
      <div className="text-center max-w-lg mx-auto px-6">
        
        {/* Decorative Top Divider */}
        <div className="flex items-center justify-center gap-4 mb-10 animate-fade-in">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-wine/40" />
          <div className="text-wine/60 text-lg">✦</div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-wine/40" />
        </div>

        {/* Elegant Wine Icon */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="w-20 h-20 mx-auto rounded-full border-2 border-wine/20 flex items-center justify-center bg-wine/5">
            <Wine className="w-10 h-10 text-wine" strokeWidth={1.5} />
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-3xl md:text-4xl font-serif tracking-wide text-foreground">
            Xin trân trọng cảm ơn Quý Khách
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Chúng tôi đã tiếp nhận yêu cầu tư vấn của Quý Khách
          </p>
        </div>

        {/* Subtle Divider */}
        <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="h-px w-24 bg-border" />
        </div>

        {/* Contact Information */}
        <div
          className="space-y-6 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
            Đội ngũ chuyên gia của chúng tôi sẽ liên hệ trong thời gian sớm nhất. 
            Quý Khách cũng có thể liên hệ trực tiếp qua Zalo để được hỗ trợ ngay.
          </p>

          {/* Primary CTA - Zalo */}
          <Button 
            asChild 
            size="lg" 
            className="gap-3 px-8 py-6 text-base bg-wine hover:bg-wine/90 text-white border-0"
          >
            <a href={ZALO_LINK} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5" />
              Liên Hệ Qua Zalo
            </a>
          </Button>
        </div>

        {/* Secondary Action */}
        <div
          className="mt-10 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <Link 
            to="/collection"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span className="text-sm tracking-wide">Khám phá bộ sưu tập</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Decorative Bottom Divider */}
        <div className="flex items-center justify-center gap-4 mt-12 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-wine/30" />
          <div className="text-wine/40 text-sm">◇</div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-wine/30" />
        </div>

      </div>
    </div>
  );
};

export default SuccessScreen;
