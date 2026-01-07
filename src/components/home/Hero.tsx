import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo3.png";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

const slides = [
  {
    tagline: "Bộ Sưu Tập Rượu Vang Tuyển Chọn",
    heading: "Nghệ Thuật, Di Sản",
    headingItalic: "Thổ Nhưỡng",
    description: "Khám phá những chai rượu vang đặc biệt từ những vườn nho danh tiếng của Pháp, Ý, Chilê, Mỹ, Úc Châu... Mỗi chai được tuyển chọn kỹ lưỡng cho tính cách, di sản và sự xuất sắc.",
    cta: { text: "Xem Bộ Sưu Tập", link: "/collection" }
  },
  {
    tagline: "Quà Tặng Doanh Nghiệp",
    heading: "Quà Tặng",
    headingItalic: "Rượu Vang",
    description: "Bộ sưu tập quà tặng rượu vang cao cấp dành cho đối tác và khách hàng. Thể hiện sự trân trọng với những chai rượu vang được tuyển chọn kỹ lưỡng.",
    cta: { text: "Xem Bộ Quà Tặng", link: "/gifts" }
  }
];

const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    duration: 40 // Slower transition ~2 seconds
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-play every 6 seconds
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background pt-20 pb-28 md:pb-32">
      <div className="container overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 text-center"
            >
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                {/* Logo */}
                <img 
                  src={logo} 
                  alt="SÉLECTION Logo" 
                  className="h-[180px] md:h-[240px] w-auto mx-auto"
                />

                {/* Tagline */}
                <p className="text-[clamp(8px,2.5vw,12px)] font-sans tracking-[0.2em] md:tracking-[0.3em] uppercase text-muted-foreground whitespace-nowrap">
                  {slide.tagline}
                </p>

                {/* Main heading */}
                <h1 className="text-[clamp(32px,9vw,96px)] font-serif font-light tracking-wide leading-[1.1]">
                  {slide.heading}<br />
                  <span className="italic text-[hsl(0,75%,45%)]">{slide.headingItalic}</span>
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-light">
                  {slide.description}
                </p>

                {/* CTA */}
                <div className="pt-8">
                  <Button asChild variant="luxury" size="xl">
                    <Link to={slide.cta.link}>
                      {slide.cta.text}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? "bg-primary w-6" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground hidden md:flex">
        <span className="text-xs tracking-widest uppercase">Cuộn</span>
        <div className="w-px h-8 bg-border" />
      </div>
    </section>
  );
};

export default Hero;
