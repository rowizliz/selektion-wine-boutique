import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-wine.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background pt-20 pb-28 md:pb-32">
      <div className="container text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Tagline */}
          <p className="text-[clamp(8px,2.5vw,12px)] font-sans tracking-[0.2em] md:tracking-[0.3em] uppercase text-muted-foreground whitespace-nowrap">
            Bộ Sưu Tập Rượu Vang Tuyển Chọn
          </p>

          {/* Main heading */}
          <h1 className="text-[clamp(32px,9vw,96px)] font-serif font-light tracking-wide leading-[1.1]">
            Nghệ Thuật<br />
            <span className="italic">Tuyển Chọn</span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-light">
            Khám phá những chai rượu vang đặc biệt từ những vườn nho danh tiếng của Pháp, Ý, Chilê, Mỹ, Úc Châu...
            Mỗi chai được tuyển chọn kỹ lưỡng cho tính cách, di sản và sự xuất sắc.
          </p>

          {/* CTA */}
          <div className="pt-8">
            <Button asChild variant="luxury" size="xl">
              <Link to="/collection">
                Xem Bộ Sưu Tập
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements (kept off the CTA area on smaller heights) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground hidden md:flex">
        <span className="text-xs tracking-widest uppercase">Cuộn</span>
        <div className="w-px h-8 bg-border" />
      </div>
    </section>
  );
};

export default Hero;
