import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { useWines } from "@/hooks/useWines";
import logo from "@/assets/logo2.png";
import PersonalizedWineCard from "@/components/personalized-wine/PersonalizedWineCard";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import WineCharacteristics from "@/components/wine/WineCharacteristics";
import FlavorNotes from "@/components/wine/FlavorNotes";
import { Slider } from "@/components/ui/slider";
import { Grid2X2, Grid3X3, LayoutGrid } from "lucide-react";

const parsePrice = (price: string): number => {
  // Remove currency symbol and commas, parse as number
  return parseInt(price.replace(/[^\d]/g, ""), 10) || 0;
};

const Collection = () => {
  const { data: wines = [], isLoading, isError } = useWines();
  const [hoveredWineId, setHoveredWineId] = useState<string | null>(null);
  const [columnsPerRow, setColumnsPerRow] = useState(4);

  const canonicalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/collection`
      : "/collection";

  const withImgCacheBust = (url: string, version?: string) => {
    const v = version ?? "1";
    return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(v)}`;
  };

  // Sort wines by price from high to low
  const sortedWines = useMemo(
    () => [...wines].sort((a, b) => parsePrice(b.price) - parsePrice(a.price)),
    [wines]
  );

  const itemListSchema = useMemo(() => {
    if (sortedWines.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      name: "Bộ sưu tập rượu vang",
      numberOfItems: sortedWines.length,
      itemListElement: sortedWines.map((w, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url:
          typeof window !== "undefined"
            ? `${window.location.origin}/collection/${w.id}`
            : `/collection/${w.id}`,
        name: w.name,
      })),
    };
  }, [sortedWines]);

  return (
    <>
      <Helmet>
        <title>Bộ Sưu Tập Rượu Vang | SÉLECTION</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta
          name="description"
          content="Khám phá bộ sưu tập hơn 25 loại rượu vang hảo hạng từ Pháp, Ý, Chile và Mỹ. Rượu vang đỏ, trắng và sủi bọt cao cấp."
        />
        {itemListSchema && (
          <script type="application/ld+json">
            {JSON.stringify(itemListSchema)}
          </script>
        )}
      </Helmet>

      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        {/* Page Header */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container text-center">
            <p className="text-[clamp(8px,2.5vw,12px)] font-sans tracking-[0.2em] md:tracking-[0.3em] uppercase text-muted-foreground whitespace-nowrap">
              Bộ Sưu Tập
            </p>
            <h1 className="text-[clamp(24px,7vw,60px)] font-serif font-light whitespace-nowrap tracking-tight leading-[1.05]">
              Rượu Vang Tuyển Lựa
            </h1>
            <p className="mt-6 text-muted-foreground text-[clamp(10px,2.8vw,14px)] whitespace-nowrap">
              {isLoading
                ? "Đang tải bộ sưu tập…"
                : `${wines.length} loại rượu vang đặc biệt từ khắp nơi trên thế giới`}
            </p>

            {/* Logo */}
            <img 
              src={logo} 
              alt="SÉLECTION Logo" 
              className="h-[280px] md:h-[400px] w-auto mx-auto mt-12 md:mt-16"
            />
          </div>
        </section>

        {/* Wine Grid */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container">
            {/* Grid Filter */}
            <div className="flex items-center justify-end gap-4 mb-8 pb-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <LayoutGrid className="w-4 h-4" />
                  <span className="text-xs tracking-wide uppercase hidden sm:inline">Hiển thị</span>
                </div>
                <div className="flex items-center gap-3 bg-muted/30 rounded-full px-4 py-2">
                  <span className="text-xs font-medium w-4 text-center">{columnsPerRow}</span>
                  <Slider
                    value={[columnsPerRow]}
                    onValueChange={(value) => setColumnsPerRow(value[0])}
                    min={1}
                    max={4}
                    step={1}
                    className="w-24"
                  />
                </div>
              </div>
            </div>

            {isError ? (
              <div className="text-center text-sm text-muted-foreground">
                Không tải được bộ sưu tập lúc này.
              </div>
            ) : (
              <div 
                className={`grid gap-8 md:gap-10 transition-all duration-300`}
                style={{
                  gridTemplateColumns: `repeat(${columnsPerRow}, minmax(0, 1fr))`,
                }}
                onMouseLeave={() => setHoveredWineId(null)}
              >
                {sortedWines.map((wine, index) => {
                  const img = wine.image_url ?? "/placeholder.svg";
                  const isHovered = hoveredWineId === wine.id;
                  const hasHover = hoveredWineId !== null;
                  const characteristics = {
                    sweetness: wine.sweetness ?? 0,
                    body: wine.body ?? 0,
                    tannin: wine.tannin ?? 0,
                    acidity: wine.acidity ?? 0,
                    fizzy: wine.fizzy,
                  };
                  const hasCharacteristics = characteristics.sweetness > 0 || characteristics.body > 0 || characteristics.tannin > 0 || characteristics.acidity > 0;
                  const hasFlavorNotes = wine.flavor_notes && wine.flavor_notes.length > 0;
                  
                  return (
                    <div 
                      key={wine.id}
                      className={`opacity-0 animate-slide-up transition-all duration-500 ease-out ${
                        hasHover && !isHovered 
                          ? 'opacity-[0.15] blur-[2px] scale-[0.98]' 
                          : isHovered 
                            ? 'opacity-100 scale-[1.02] z-10 relative' 
                            : ''
                      }`}
                      style={{
                        animationDelay: `${Math.min(index * 0.05, 0.5)}s`,
                        animationFillMode: 'forwards',
                      }}
                    >
                      {/* Ảnh - không trigger hover */}
                      <Link to={`/collection/${wine.id}`} className="group block">
                        <div className="aspect-[3/4] bg-white mb-5 overflow-hidden flex items-end justify-center p-6 rounded-sm">
                          <img
                            src={withImgCacheBust(img, wine.updated_at)}
                            alt={`Rượu vang ${wine.name}`}
                            loading="lazy"
                            className="w-auto h-[280px] object-contain group-hover:scale-105 transition-transform duration-700 ease-in-out"
                          />
                        </div>
                      </Link>

                      {/* Tiêu đề - trigger hover */}
                      <HoverCard openDelay={150} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <Link
                            to={`/collection/${wine.id}`}
                            className="block space-y-2 group"
                            onMouseEnter={() => setHoveredWineId(wine.id)}
                            onMouseLeave={() => setHoveredWineId(null)}
                          >
                            <h3 className="text-base font-serif group-hover:text-primary transition-colors duration-300 leading-tight cursor-pointer">
                              {wine.name}
                              {wine.vintage && (
                                <span className="text-muted-foreground font-normal ml-1">
                                  ({wine.vintage})
                                </span>
                              )}
                            </h3>
                            <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                              {wine.origin}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {wine.grapes}
                            </p>
                            <p className="text-sm font-sans pt-1">{wine.price}</p>
                          </Link>
                        </HoverCardTrigger>
                        
                        {(hasCharacteristics || hasFlavorNotes) && (
                          <HoverCardContent 
                            side="bottom" 
                            align="start"
                            sideOffset={8}
                            className="w-80 p-0 bg-background border-border/50 shadow-2xl hidden md:block rounded-xl overflow-hidden"
                          >
                            {/* Header */}
                            <div className="bg-primary/5 px-5 py-4 border-b border-border/30">
                              <h4 className="font-serif text-base font-medium text-foreground">
                                {wine.name}
                                {wine.vintage && (
                                  <span className="text-muted-foreground font-normal ml-1.5 text-sm">
                                    ({wine.vintage})
                                  </span>
                                )}
                              </h4>
                              <p className="text-[10px] tracking-widest text-muted-foreground uppercase mt-1">
                                {wine.origin}
                              </p>
                            </div>
                            
                            {/* Content */}
                            <div className="p-5 space-y-5">
                              {hasCharacteristics && (
                                <div className="space-y-3">
                                  <p className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase font-medium">
                                    Đặc tính
                                  </p>
                                  <WineCharacteristics characteristics={characteristics} />
                                </div>
                              )}
                              
                              {hasFlavorNotes && (
                                <div className="space-y-3">
                                  <p className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase font-medium">
                                    Nốt hương
                                  </p>
                                  <FlavorNotes notes={wine.flavor_notes!} />
                                </div>
                              )}
                            </div>
                          </HoverCardContent>
                        )}
                      </HoverCard>
                    </div>
                  );
                })}
                
                {/* Personalized Wine Card - appears at the end */}
                <PersonalizedWineCard />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Collection;
