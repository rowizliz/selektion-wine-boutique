import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getWineById, wines } from "@/data/wines";
import { ArrowLeft, Thermometer, Wine as WineIcon, UtensilsCrossed, Sparkles, MapPin, Calendar, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import WineCharacteristicsBar from "@/components/wine/WineCharacteristicsBar";
import FlavorNotes from "@/components/wine/FlavorNotes";

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

  const isSparklingWine = wine.category === "sparkling";

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

        {/* Wine Detail - Hero Section */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Image */}
              <div className="flex items-center justify-center">
                <div className="aspect-[3/4] w-full max-w-md bg-white rounded-sm flex items-center justify-center p-8 lg:p-12 shadow-lg">
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

                <p className="text-2xl md:text-3xl font-serif mb-8 text-primary">
                  {wine.price}
                </p>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <WineIcon className="w-5 h-5 text-primary/70" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Giống Nho</p>
                      <p className="text-sm font-medium">{wine.grapes}</p>
                    </div>
                  </div>
                  
                  {wine.temperature && (
                    <div className="flex items-center gap-3">
                      <Thermometer className="w-5 h-5 text-primary/70" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Nhiệt Độ Lý Tưởng</p>
                        <p className="text-sm font-medium">{wine.temperature}</p>
                      </div>
                    </div>
                  )}
                  
                  {wine.alcohol && (
                    <div className="flex items-center gap-3">
                      <Percent className="w-5 h-5 text-primary/70" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Nồng Độ Cồn</p>
                        <p className="text-sm font-medium">{wine.alcohol}</p>
                      </div>
                    </div>
                  )}
                  
                  {wine.region && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary/70" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Xuất Xứ</p>
                        <p className="text-sm font-medium">{wine.region}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact CTA */}
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <a href="https://zalo.me/0906777377" target="_blank" rel="noopener noreferrer">
                      Đặt Hàng Qua Zalo
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/contact">Liên Hệ</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flavor Notes Section */}
        {wine.flavorNotes && wine.flavorNotes.length > 0 && (
          <section className="py-12 bg-secondary/20 border-y border-border/30">
            <div className="container">
              <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary/70" />
                Nốt Hương
              </h2>
              <FlavorNotes notes={wine.flavorNotes} />
            </div>
          </section>
        )}

        {/* Wine Characteristics Section */}
        {wine.characteristics && (
          <section className="py-12 bg-background">
            <div className="container">
              <h2 className="text-xl font-serif mb-8">Đặc Tính Rượu</h2>
              <div className="max-w-2xl space-y-6">
                <WineCharacteristicsBar 
                  label="Độ Ngọt / Dryness" 
                  value={wine.characteristics.sweetness} 
                />
                <WineCharacteristicsBar 
                  label="Độ Đậm / Body" 
                  value={wine.characteristics.body} 
                />
                <WineCharacteristicsBar 
                  label="Độ Chát / Tannin" 
                  value={wine.characteristics.tannin} 
                />
                <WineCharacteristicsBar 
                  label="Độ Chua / Acidity" 
                  value={wine.characteristics.acidity} 
                />
                {isSparklingWine && wine.characteristics.fizzy !== undefined && (
                  <WineCharacteristicsBar 
                    label="Độ Sủi / Fizzy" 
                    value={wine.characteristics.fizzy} 
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {/* Description & Story Section */}
        <section className="py-12 md:py-16 bg-secondary/10">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              {/* Short Description */}
              <div className="mb-10">
                <h2 className="text-xl font-serif mb-4">Giới Thiệu</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {wine.description}
                </p>
              </div>

              {/* Full Story */}
              {wine.story && (
                <div className="mb-10">
                  <h2 className="text-xl font-serif mb-4">Câu Chuyện</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    {wine.story.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasting Notes */}
              {wine.tastingNotes && (
                <div className="mb-10 p-6 bg-background rounded-lg border border-border/50">
                  <h3 className="text-lg font-serif mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary/70" />
                    Ghi Chú Thưởng Thức
                  </h3>
                  <p className="text-muted-foreground">{wine.tastingNotes}</p>
                </div>
              )}

              {/* Food Pairing */}
              {wine.pairing && (
                <div className="p-6 bg-background rounded-lg border border-border/50">
                  <h3 className="text-lg font-serif mb-3 flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-primary/70" />
                    Gợi Ý Kết Hợp Ẩm Thực
                  </h3>
                  <p className="text-muted-foreground">{wine.pairing}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Wines */}
        {relatedWines.length > 0 && (
          <section className="py-16 md:py-24 bg-background border-t border-border/30">
            <div className="container">
              <h2 className="text-2xl md:text-3xl font-serif font-light text-center mb-12">
                Có Thể Bạn Cũng Thích
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {relatedWines.map((relatedWine, index) => (
                  <Link
                    key={relatedWine.id}
                    to={`/collection/${relatedWine.id}`}
                    className="group opacity-0 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="aspect-[3/4] bg-white mb-4 overflow-hidden flex items-center justify-center p-4 rounded-sm shadow-sm">
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
