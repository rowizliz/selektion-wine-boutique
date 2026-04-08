import SEO from "@/components/SEO";
import { useMemo, useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { useWines } from "@/hooks/useWines";
import logo from "@/assets/logo2.png";
import PersonalizedWineCard from "@/components/personalized-wine/PersonalizedWineCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "@/components/ui/popover";
import { Info } from "lucide-react";
import WineCharacteristics from "@/components/wine/WineCharacteristics";
import FlavorNotes from "@/components/wine/FlavorNotes";

const parsePrice = (price: string): number => {
  // Remove currency symbol and commas, parse as number
  return parseInt(price.replace(/[^\d]/g, ""), 10) || 0;
};

const Collection = () => {
  const { data: wines = [], isLoading, isError } = useWines();
  const [hoveredWineId, setHoveredWineId] = useState<string | null>(null);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  // Close popover on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (openPopoverId) {
        setOpenPopoverId(null);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [openPopoverId]);

  // Close popover when hovering a different product
  useEffect(() => {
    if (openPopoverId && hoveredWineId && hoveredWineId !== openPopoverId) {
      setOpenPopoverId(null);
    }
  }, [hoveredWineId, openPopoverId]);

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
      <SEO
        title="Bộ Sưu Tập Rượu Vang Cao Cấp | Vang Pháp, Ý Tuyển Chọn"
        description="Khám phá hơn 25 loại rượu vang cao cấp tuyển chọn từ Pháp, Ý, Chile. Rượu vang đỏ, trắng, sủi bọt nhập khẩu chính hãng. Giao hàng nhanh Thủ Đức, Bình Dương, Biên Hòa."
        url={canonicalUrl}
        schema={itemListSchema}
        keywords={[
          "rượu vang cao cấp", "rượu vang tuyển chọn", "vang pháp nhập khẩu",
          "vang ý chính hãng", "rượu vang selection", "bộ sưu tập rượu vang",
          "rượu vang thủ đức", "mua rượu vang hcm"
        ]}
      />

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
            {isError ? (
              <div className="text-center text-sm text-muted-foreground">
                Không tải được bộ sưu tập lúc này.
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 transition-all duration-300"
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
                      className="opacity-0 animate-slide-up transition-all duration-500 ease-out group relative"
                      style={{
                        animationDelay: `${Math.min(index * 0.05, 0.5)}s`,
                        animationFillMode: 'forwards',
                      }}
                      onMouseEnter={() => setHoveredWineId(wine.id)}
                      onMouseLeave={() => setHoveredWineId(null)}
                    >
                      {/* Ảnh */}
                      <Link to={`/collection/${wine.id}`} className="block">
                        <div className="aspect-[3/4] bg-white mb-5 overflow-hidden flex items-end justify-center p-6 rounded-sm">
                          <img
                            src={withImgCacheBust(img, wine.updated_at)}
                            alt={`Mua Rượu vang ${wine.name} ${wine.origin} - Vang Ngon Tuyển Chọn - Shop Rượu Vang Selection Thủ Đức`}
                            loading="lazy"
                            className="w-auto h-[280px] object-contain group-hover:scale-105 transition-transform duration-700 ease-in-out"
                          />
                        </div>
                      </Link>

                      {/* Thông tin sản phẩm */}
                      <div className="space-y-2">
                        {(hasCharacteristics || hasFlavorNotes) ? (
                          <Popover open={openPopoverId === wine.id} onOpenChange={(open) => setOpenPopoverId(open ? wine.id : null)}>
                            <PopoverAnchor asChild>
                              <div className="flex items-start justify-between gap-2">
                                <Link
                                  to={`/collection/${wine.id}`}
                                  className="block flex-1"
                                >
                                  <h3 className="text-base font-serif group-hover:text-primary transition-colors duration-300 leading-tight cursor-pointer">
                                    {wine.name}
                                    {wine.vintage && (
                                      <span className="text-muted-foreground font-normal ml-1">
                                        ({wine.vintage})
                                      </span>
                                    )}
                                  </h3>
                                </Link>
                                <PopoverTrigger asChild>
                                  <button
                                    className="text-muted-foreground hover:text-primary transition-colors p-1 -mt-1 -mr-1 rounded-full hover:bg-muted/50 focus:outline-none shrink-0"
                                    onMouseEnter={() => setOpenPopoverId(wine.id)}
                                  >
                                    <Info className="h-4 w-4" />
                                    <span className="sr-only">Thông tin</span>
                                  </button>
                                </PopoverTrigger>
                              </div>
                            </PopoverAnchor>
                            <PopoverContent
                              side="bottom"
                              align="start"
                              sideOffset={8}
                              className="w-[calc(100vw-2rem)] sm:w-72 max-w-[300px] p-0 bg-background/95 backdrop-blur-sm border-border/40 shadow-xl rounded-lg overflow-hidden"
                            >
                              {/* Header nhỏ gọn */}
                              <div className="bg-primary/5 px-3 py-2 border-b border-border/20">
                                <h4 className="font-serif text-sm font-medium text-foreground truncate">
                                  {wine.name}
                                  {wine.vintage && (
                                    <span className="text-muted-foreground font-normal ml-1 text-xs">
                                      ({wine.vintage})
                                    </span>
                                  )}
                                </h4>
                              </div>

                              {/* Nội dung compact */}
                              <div className="p-3 space-y-3 max-h-[336px] overflow-y-auto">
                                {hasCharacteristics && (
                                  <div className="space-y-2">
                                    <p className="text-[9px] tracking-[0.15em] text-muted-foreground uppercase font-medium">
                                      Đặc tính
                                    </p>
                                    <WineCharacteristics characteristics={characteristics} />
                                  </div>
                                )}

                                {hasFlavorNotes && (
                                  <div className="space-y-2">
                                    <p className="text-[9px] tracking-[0.15em] text-muted-foreground uppercase font-medium">
                                      Nốt hương
                                    </p>
                                    <FlavorNotes notes={wine.flavor_notes!} />
                                  </div>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/collection/${wine.id}`}
                              className="block flex-1"
                            >
                              <h3 className="text-base font-serif group-hover:text-primary transition-colors duration-300 leading-tight cursor-pointer">
                                {wine.name}
                                {wine.vintage && (
                                  <span className="text-muted-foreground font-normal ml-1">
                                    ({wine.vintage})
                                  </span>
                                )}
                              </h3>
                            </Link>
                          </div>
                        )}

                        <Link
                          to={`/collection/${wine.id}`}
                          className="block"
                        >
                          <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                            {wine.origin}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {wine.grapes}
                          </p>
                          <p className="text-sm font-sans pt-1">{wine.price}</p>
                        </Link>
                      </div>
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
