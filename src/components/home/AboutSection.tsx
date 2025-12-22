import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div className="aspect-[4/5] bg-background overflow-hidden order-2 lg:order-1">
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center p-8">
                <p className="text-xs tracking-widest uppercase mb-4">Sélection</p>
                <p className="font-serif text-4xl italic">Catalog No.1</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <p className="text-xs font-sans tracking-[0.3em] uppercase text-muted-foreground">
              Our Philosophy
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light leading-tight">
              A commitment to<br />
              <span className="italic">excellence</span>
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Sélection was born from a passion for discovering exceptional wines 
                that tell stories of their terroir. We travel to the heart of France 
                and Italy, seeking out artisanal producers who craft wines with 
                dedication and authenticity.
              </p>
              <p>
                Each wine in our collection is personally selected, ensuring that 
                every bottle meets our exacting standards of quality, character, 
                and value.
              </p>
            </div>
            <div className="pt-4">
              <Button asChild variant="minimal" size="default">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
