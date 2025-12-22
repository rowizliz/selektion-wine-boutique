import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getWineById, wines } from "@/data/wines";
import { ArrowLeft, Thermometer, Wine as WineIcon, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

const WineDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const wine = id ? getWineById(id) : undefined;

  if (!wine) {
    return (
      <>
        <Header />
        <main className="pt-20 md:pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif mb-4">Wine not found</h1>
            <Button variant="outline" onClick={() => navigate("/collection")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collection
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Get related wines (same category, exclude current)
  const relatedWines = wines
    .filter(w => w.category === wine.category && w.id !== wine.id)
    .slice(0, 4);

  return (
    <>
      <Helmet>
        <title>{wine.name} | SÉLECTION</title>
        <meta 
          name="description" 
          content={`${wine.name} - ${wine.origin}. ${wine.description.slice(0, 150)}...`} 
        />
      </Helmet>

      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        {/* Breadcrumb */}
        <section className="py-6 bg-background border-b border-border/50">
          <div className="container">
            <Link 
              to="/collection" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collection
            </Link>
          </div>
        </section>

        {/* Wine Detail */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Image */}
              <div className="flex items-center justify-center">
                <div className="aspect-[3/4] w-full max-w-md bg-white rounded-sm flex items-center justify-center p-8 lg:p-12">
                  <img 
                    src={wine.image} 
                    alt={wine.name}
                    className="max-w-full max-h-full object-contain animate-fade-in"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
                  {wine.category === "red" ? "Red Wine" : wine.category === "white" ? "White Wine" : "Sparkling Wine"}
                </p>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-4">
                  {wine.name}
                </h1>
                
                <p className="text-sm tracking-widest text-muted-foreground uppercase mb-6">
                  {wine.origin}
                </p>

                <p className="text-2xl md:text-3xl font-serif mb-8">
                  {wine.price}
                </p>

                <p className="text-muted-foreground leading-relaxed mb-8">
                  {wine.description}
                </p>

                {/* Wine Details Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start gap-3">
                    <WineIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Grapes</p>
                      <p className="text-sm">{wine.grapes}</p>
                    </div>
                  </div>
                  
                  {wine.temperature && (
                    <div className="flex items-start gap-3">
                      <Thermometer className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Temperature</p>
                        <p className="text-sm">{wine.temperature}</p>
                      </div>
                    </div>
                  )}
                  
                  {wine.alcohol && (
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-muted-foreground">
                        <span className="text-xs font-medium">ABV</span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Alcohol</p>
                        <p className="text-sm">{wine.alcohol}</p>
                      </div>
                    </div>
                  )}
                  
                  {wine.pairing && (
                    <div className="flex items-start gap-3">
                      <UtensilsCrossed className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Food Pairing</p>
                        <p className="text-sm">{wine.pairing}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact CTA */}
                <div className="pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Interested in this wine? Contact us to order.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild>
                      <a href="https://zalo.me/0906777377" target="_blank" rel="noopener noreferrer">
                        Order via Zalo
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Wines */}
        {relatedWines.length > 0 && (
          <section className="py-16 md:py-24 bg-secondary/30">
            <div className="container">
              <h2 className="text-2xl md:text-3xl font-serif font-light text-center mb-12">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {relatedWines.map((relatedWine, index) => (
                  <Link
                    key={relatedWine.id}
                    to={`/collection/${relatedWine.id}`}
                    className="group opacity-0 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="aspect-[3/4] bg-white mb-4 overflow-hidden flex items-center justify-center p-4">
                      <img 
                        src={relatedWine.image} 
                        alt={relatedWine.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-sm font-serif group-hover:text-muted-foreground transition-colors line-clamp-2">
                      {relatedWine.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {relatedWine.price}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default WineDetail;
