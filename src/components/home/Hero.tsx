import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-wine.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background pt-20">
      <div className="container text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Tagline */}
          <p className="text-xs font-sans tracking-[0.3em] uppercase text-muted-foreground">
            Bộ Sưu Tập Rượu Vang Tuyển Chọn
          </p>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-wide leading-tight">
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

      {/* Decorative elements */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs tracking-widest uppercase">Cuộn</span>
        <div className="w-px h-12 bg-border" />
      </div>
    </section>
  );
};

export default Hero;
