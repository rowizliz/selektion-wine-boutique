import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import goldLogo from "@/assets/logo2.png";

const PersonalizedWineCard = () => {
  return (
    <Link
      to="/tu-van-ca-nhan"
      className="group opacity-0 animate-slide-up"
      style={{ animationDelay: "0.6s" }}
    >
      {/* Card container - matches wine card aspect ratio */}
      <div className="aspect-[3/4] relative overflow-hidden rounded-sm mb-5">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] via-foreground/[0.06] to-foreground/[0.12]" />
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Top decorative wine glass silhouette */}
        <div className="absolute -top-20 -right-20 w-64 h-64 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M50 5 C30 5 20 25 20 40 C20 55 35 65 45 70 L45 85 L30 90 L70 90 L55 85 L55 70 C65 65 80 55 80 40 C80 25 70 5 50 5"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          {/* Gold Logo */}
          <div className="relative mb-6">
            <div className="w-20 h-20 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
              <img 
                src={goldLogo} 
                alt="Rượu Ý Logo" 
                className="w-16 h-auto opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]"
              />
            </div>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: "2s" }} />
          </div>

          {/* Text content */}
          <div className="space-y-3 max-w-[180px]">
            <h3 className="text-lg font-serif text-foreground/90 leading-tight group-hover:text-foreground transition-colors duration-500">
              Chưa tìm được
              <br />
              <span className="italic">rượu ưng ý?</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Để chúng tôi gợi ý chai rượu phù hợp với gu của bạn
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-sans tracking-wider uppercase border border-foreground/20 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-500">
            <span>Tư vấn</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
      </div>

      {/* Text below card - matches wine card info layout */}
      <div className="space-y-2">
        <h3 className="text-base font-serif group-hover:text-muted-foreground transition-colors duration-300 leading-tight">
          Tư Vấn Cá Nhân Hoá
        </h3>
        <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
          Dịch vụ miễn phí
        </p>
        <p className="text-xs text-muted-foreground">
          Theo sở thích của bạn
        </p>
        <p className="text-sm font-sans pt-1 text-foreground/70">Miễn phí</p>
      </div>
    </Link>
  );
};

export default PersonalizedWineCard;
