import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { useWines } from "@/hooks/useWines";
import logo from "@/assets/logo2.png";
import PersonalizedWineCard from "@/components/personalized-wine/PersonalizedWineCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WineCharacteristics from "@/components/wine/WineCharacteristics";
import FlavorNotes from "@/components/wine/FlavorNotes";

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
            {/* Grid Filter - Hidden on mobile */}
            <div className="hidden md:flex items-center justify-end gap-4 mb-8 pb-6 border-b border-border/30">
              <div className="flex items-center gap-4">
                <span className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                  Hiển thị
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setColumnsPerRow(num)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                        columnsPerRow === num
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isError ? (
              <div className="text-center text-sm text-muted-foreground">
                Không tải được bộ sưu tập lúc này.
              </div>
            ) : (
              <div 
                className={`grid grid-cols-2 gap-6 transition-all duration-300 ${
                  columnsPerRow === 1 ? 'md:grid-cols-1' : 
                  columnsPerRow === 2 ? 'md:grid-cols-2' : 
                  columnsPerRow === 3 ? 'md:grid-cols-3' : 
                  'md:grid-cols-4'
                } md:gap-8 lg:gap-10`}
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
                      {/* Ảnh */}
                      <Link to={`/collection/${wine.id}`} className="group block">
                        <div className={`aspect-[3/4] bg-white mb-5 overflow-hidden flex items-end justify-center p-6 rounded-sm transition-all duration-300 ${
                          columnsPerRow === 1 ? 'md:aspect-auto md:h-[500px]' : ''
                        }`}>
                          <img
                            src={withImgCacheBust(img, wine.updated_at)}
                            alt={`Rượu vang ${wine.name}`}
                            loading="lazy"
                            className={`w-auto object-contain group-hover:scale-105 transition-transform duration-700 ease-in-out ${
                              columnsPerRow === 1 ? 'h-full max-h-[450px]' : 'h-[280px]'
                            }`}
                          />
                        </div>
                      </Link>

                      {/* Tiêu đề với Tooltip */}
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              to={`/collection/${wine.id}`}
                              className="block space-y-2 group"
                              onMouseEnter={() => setHoveredWineId(wine.id)}
                              onMouseLeave={() => setHoveredWineId(null)}
                            >
                              <h3 className={`font-serif group-hover:text-primary transition-colors duration-300 leading-tight cursor-pointer ${
                                columnsPerRow === 1 ? 'text-xl md:text-2xl' : 'text-base'
                              }`}>
                                {wine.name}
                                {wine.vintage && (
                                  <span className="text-muted-foreground font-normal ml-1.5">
                                    ({wine.vintage})
                                  </span>
                                )}
                              </h3>
                              <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                                {wine.origin}
                              </p>
                              <p className={`text-muted-foreground ${columnsPerRow === 1 ? 'text-sm' : 'text-xs'}`}>
                                {wine.grapes}
                              </p>
                              <p className={`font-sans pt-1 ${columnsPerRow === 1 ? 'text-lg' : 'text-sm'}`}>{wine.price}</p>
                            </Link>
                          </TooltipTrigger>
                          
                          {(hasCharacteristics || hasFlavorNotes) && (
                            <TooltipContent 
                              side="right" 
                              align="start"
                              sideOffset={16}
                              className="w-72 p-0 bg-background border border-border/60 shadow-xl hidden md:block rounded-lg overflow-hidden z-50"
                            >
                              {/* Compact Content */}
                              <div className="p-4 space-y-4">
                                {hasCharacteristics && (
                                  <div className="space-y-2.5">
                                    <p className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase font-medium">
                                      Đặc tính
                                    </p>
                                    <WineCharacteristics characteristics={characteristics} />
                                  </div>
                                )}
                                
                                {hasFlavorNotes && (
                                  <div className="space-y-2.5">
                                    <p className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase font-medium">
                                      Nốt hương
                                    </p>
                                    <FlavorNotes notes={wine.flavor_notes!} />
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
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
