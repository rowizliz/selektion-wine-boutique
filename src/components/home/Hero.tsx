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
            Curated Wine Collection
          </p>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-wide leading-tight">
            The Art of<br />
            <span className="italic">Selection</span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-light">
            Discover exceptional wines from the finest vineyards of France and Italy. 
            Each bottle is carefully selected for its character, heritage, and excellence.
          </p>

          {/* CTA */}
          <div className="pt-8">
            <Button asChild variant="luxury" size="xl">
              <Link to="/collection">
                View Collection
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-border" />
      </div>
    </section>
  );
};

export default Hero;
