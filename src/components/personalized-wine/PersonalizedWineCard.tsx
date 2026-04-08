import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import goldLogo from "@/assets/logo2.png";

const PersonalizedWineCard = () => {
  return (
    <Link
      to="/tu-van-ca-nhan"
      className="group opacity-0 animate-slide-up block"
      style={{ animationDelay: "0.6s" }}
    >
      {/* Card container */}
      <div className="aspect-[3/4] relative overflow-hidden rounded-sm mb-5 transition-all duration-700 group-hover:shadow-[0_25px_60px_-15px_rgba(212,175,55,0.25)]">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-foreground/[0.04] to-foreground/[0.08]" />
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating sparkle particles - always visible */}
        <div className="absolute top-6 left-6 animate-float-particle">
          <Star className="w-2 h-2 text-amber-400/50 fill-amber-400/30" />
        </div>
        <div className="absolute top-10 right-8 animate-float-particle" style={{ animationDelay: "1s" }}>
          <Sparkles className="w-2.5 h-2.5 text-amber-300/40" />
        </div>
        <div className="absolute top-20 left-12 animate-twinkle" style={{ animationDelay: "0.5s" }}>
          <Star className="w-1.5 h-1.5 text-amber-400/60 fill-amber-400/40" />
        </div>
        <div className="absolute top-16 right-14 animate-twinkle" style={{ animationDelay: "1.5s" }}>
          <Star className="w-2 h-2 text-amber-300/50 fill-amber-300/30" />
        </div>
        <div className="absolute bottom-32 left-8 animate-float-particle" style={{ animationDelay: "2s" }}>
          <Sparkles className="w-2 h-2 text-amber-400/35" />
        </div>
        <div className="absolute bottom-28 right-6 animate-twinkle" style={{ animationDelay: "2.5s" }}>
          <Star className="w-1.5 h-1.5 text-amber-500/45 fill-amber-500/25" />
        </div>
        <div className="absolute top-1/3 left-4 animate-twinkle" style={{ animationDelay: "3s" }}>
          <Star className="w-1 h-1 text-amber-300/50 fill-amber-300/30" />
        </div>
        <div className="absolute top-1/3 right-4 animate-float-particle" style={{ animationDelay: "0.8s" }}>
          <Star className="w-1.5 h-1.5 text-amber-400/40 fill-amber-400/20" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
          {/* Enhanced Gold Logo with multi-layer glow */}
          <div className="relative mb-12 flex items-center justify-center">
            
            {/* Rotating light rays */}
            <div className="absolute w-72 h-72 animate-rotate-slow opacity-30 group-hover:opacity-50 transition-opacity duration-1000">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgb(212,175,55)" stopOpacity="0" />
                    <stop offset="50%" stopColor="rgb(212,175,55)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(212,175,55)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[...Array(12)].map((_, i) => (
                  <line
                    key={i}
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="20"
                    stroke="url(#rayGradient)"
                    strokeWidth="1"
                    transform={`rotate(${i * 30} 100 100)`}
                  />
                ))}
              </svg>
            </div>
            
            {/* Outer glow rings - radiating */}
            <div className="absolute w-56 h-56 rounded-full border border-amber-400/10 animate-glow-ring" />
            <div className="absolute w-56 h-56 rounded-full border border-amber-500/8 animate-glow-ring" style={{ animationDelay: "1.3s" }} />
            <div className="absolute w-56 h-56 rounded-full border border-amber-300/6 animate-glow-ring" style={{ animationDelay: "2.6s" }} />
            
            {/* Multi-layer static glow backdrop */}
            <div className="absolute w-52 h-52 rounded-full bg-gradient-radial from-amber-400/20 via-amber-500/8 to-transparent blur-3xl" />
            <div className="absolute w-44 h-44 rounded-full bg-gradient-radial from-amber-300/15 via-amber-400/5 to-transparent blur-2xl" />
            <div className="absolute w-36 h-36 rounded-full bg-gradient-radial from-amber-200/10 via-transparent to-transparent blur-xl" />
            
            {/* Logo with enhanced glow breathe animation */}
            <img 
              src={goldLogo} 
              alt="Rượu Ý Logo" 
              className="relative h-36 w-auto animate-glow-breathe opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            />
            
            {/* Shimmer sweep overlay on hover */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer-vertical" />
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-4 max-w-[200px]">
            <h3 className="text-xl font-serif text-foreground/80 leading-tight group-hover:text-foreground transition-all duration-500 transform group-hover:-translate-y-0.5">
              Chưa tìm được
              <br />
              <span className="italic text-foreground/90 group-hover:text-amber-600/90 transition-colors duration-500">rượu ưng ý?</span>
            </h3>
            <p className="text-xs text-muted-foreground/70 leading-relaxed group-hover:text-muted-foreground transition-colors duration-500 delay-100">
              Để chúng tôi gợi ý chai rượu phù hợp với gu của bạn
            </p>
          </div>

          {/* Enhanced CTA Button with gold gradient */}
          <div className="mt-8 relative overflow-hidden inline-flex items-center gap-2 px-7 py-3.5 text-xs font-sans tracking-wider uppercase border border-amber-600/20 group-hover:border-amber-500/60 rounded-sm transition-all duration-500 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent">
            {/* Gold gradient fill animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            {/* Shine sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-300" />
            <span className="relative z-10 text-foreground/80 group-hover:text-white transition-colors duration-500 delay-75">Tư vấn ngay</span>
            <ArrowRight className="relative z-10 w-3.5 h-3.5 text-foreground/60 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-500 delay-75" />
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/50 via-background/20 to-transparent pointer-events-none" />
        
        {/* Subtle border glow on hover */}
        <div className="absolute inset-0 rounded-sm border border-amber-400/0 group-hover:border-amber-400/20 transition-colors duration-700 pointer-events-none" />
      </div>

      {/* Text below card */}
      <div className="space-y-2">
        <h3 className="text-base font-serif group-hover:text-amber-700/80 transition-colors duration-300 leading-tight">
          Tư Vấn Cá Nhân Hoá
        </h3>
        <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
          Dịch vụ miễn phí
        </p>
        <p className="text-xs text-muted-foreground">
          Theo sở thích của bạn
        </p>
        <p className="text-sm font-sans pt-1 text-amber-600/70">Miễn phí</p>
      </div>
    </Link>
  );
};

export default PersonalizedWineCard;
