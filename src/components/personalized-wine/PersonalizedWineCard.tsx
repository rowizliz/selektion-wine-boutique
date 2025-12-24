import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import goldLogo from "@/assets/logo2.png";

const PersonalizedWineCard = () => {
  return (
    <Link
      to="/tu-van-ca-nhan"
      className="group opacity-0 animate-slide-up block"
      style={{ animationDelay: "0.6s" }}
    >
      {/* Card container - matches wine card aspect ratio */}
      <div className="aspect-[3/4] relative overflow-hidden rounded-sm mb-5 transition-all duration-700 group-hover:shadow-[0_20px_50px_-15px_rgba(212,175,55,0.15)]">
        {/* Gradient background with shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-foreground/[0.05] to-foreground/[0.10]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/[0.03] to-transparent animate-shimmer" />
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Top decorative wine glass silhouette */}
        <div className="absolute -top-16 -right-16 w-56 h-56 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M50 5 C30 5 20 25 20 40 C20 55 35 65 45 70 L45 85 L30 90 L70 90 L55 85 L55 70 C65 65 80 55 80 40 C80 25 70 5 50 5"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Floating sparkles */}
        <div className="absolute top-8 left-8 opacity-0 group-hover:opacity-60 transition-opacity duration-700 delay-100">
          <Sparkles className="w-3 h-3 text-amber-400/60 animate-pulse-slow" />
        </div>
        <div className="absolute top-12 right-10 opacity-0 group-hover:opacity-40 transition-opacity duration-700 delay-300">
          <Sparkles className="w-2 h-2 text-amber-300/50 animate-pulse-slow" style={{ animationDelay: "0.5s" }} />
        </div>
        <div className="absolute bottom-24 left-10 opacity-0 group-hover:opacity-50 transition-opacity duration-700 delay-200">
          <Sparkles className="w-2.5 h-2.5 text-amber-400/40 animate-pulse-slow" style={{ animationDelay: "1s" }} />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
          {/* Gold Logo with float animation */}
          <div className="relative mb-12 animate-float">
            {/* Glow ring behind logo */}
            <div className="absolute inset-0 w-28 h-28 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="w-28 h-28 flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-3">
              <img 
                src={goldLogo} 
                alt="Rượu Ý Logo" 
                className="w-24 h-auto opacity-60 group-hover:opacity-100 transition-all duration-700 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]"
              />
            </div>
            
            {/* Pulse rings */}
            <div className="absolute inset-0 w-28 h-28 rounded-full border border-amber-500/10 animate-ping-slow opacity-60" />
            <div className="absolute inset-0 w-28 h-28 rounded-full border border-amber-400/5 animate-ping-slow opacity-40" style={{ animationDelay: "1s" }} />
          </div>

          {/* Text content with stagger animation */}
          <div className="space-y-4 max-w-[200px]">
            <h3 className="text-xl font-serif text-foreground/80 leading-tight group-hover:text-foreground transition-all duration-500 transform group-hover:-translate-y-0.5">
              Chưa tìm được
              <br />
              <span className="italic text-foreground/90">rượu ưng ý?</span>
            </h3>
            <p className="text-xs text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors duration-500 delay-100">
              Để chúng tôi gợi ý chai rượu phù hợp với gu của bạn
            </p>
          </div>

          {/* CTA Button with enhanced hover */}
          <div className="mt-8 relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 text-xs font-sans tracking-wider uppercase border border-foreground/15 group-hover:border-foreground/80 transition-all duration-500">
            {/* Button fill animation */}
            <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 group-hover:text-background transition-colors duration-500 delay-75">Tư vấn</span>
            <ArrowRight className="relative z-10 w-3.5 h-3.5 group-hover:text-background group-hover:translate-x-1.5 transition-all duration-500 delay-75" />
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/60 via-background/20 to-transparent pointer-events-none" />
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
