import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { wines } from "@/data/wines";

const featuredWineIds = ["22", "16", "10", "26", "23"];
const featuredWines = featuredWineIds
  .map(id => wines.find(wine => wine.id === id))
  .filter((wine): wine is NonNullable<typeof wine> => wine !== undefined);

const FeaturedWines = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-xs font-sans tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Featured Selection
          </p>
          <h2 className="text-3xl md:text-5xl font-serif font-light">
            Our Finest Wines
          </h2>
        </div>

        {/* Wine grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {featuredWines.map((wine, index) => (
            <Link
              key={wine.id}
              to={`/collection/${wine.id}`}
              className={`group opacity-0 animate-slide-up stagger-${Math.min(index + 1, 5)}`}
            >
              <div className="aspect-[3/4] bg-secondary mb-4 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground group-hover:scale-105 transition-transform duration-700 ease-luxury">
                  {wine.image ? (
                    <img 
                      src={wine.image} 
                      alt={wine.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-16 h-48 border border-muted-foreground/30 mx-auto mb-4 rounded-t-full" />
                      <p className="text-xs tracking-widest uppercase">Wine Bottle</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-serif group-hover:text-muted-foreground transition-colors duration-300">
                  {wine.name}
                </h3>
                <p className="text-xs tracking-wider text-muted-foreground uppercase">
                  {wine.origin}
                </p>
                <p className="text-sm font-sans">
                  {wine.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-16">
          <Button asChild variant="outline" size="lg">
            <Link to="/collection">
              View All Wines
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWines;
