import { Helmet } from "react-helmet-async";
import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getWineById } from "@/data/wines";
import { useWine, useWines, type WineDB } from "@/hooks/useWines";
import {
  ArrowLeft,
  Thermometer,
  Wine as WineIcon,
  UtensilsCrossed,
  Sparkles,
  MapPin,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import WineCharacteristicsBar from "@/components/wine/WineCharacteristicsBar";
import FlavorNotes from "@/components/wine/FlavorNotes";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const parsePrice = (price: string): number => {
  return parseInt(price.replace(/[^\d]/g, ""), 10) || 0;
};

const absolutizeUrl = (url: string) => {
  if (typeof window === "undefined") return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
};

const withImgCacheBust = (url: string, version?: string) => {
  const v = version ?? "1";
  return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(v)}`;
};

const WineDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const paramId = id ?? "";
  const isUuid = UUID_REGEX.test(paramId);

  // We always load the full list once (also used for related wines + legacy ID mapping)
  const winesQuery = useWines();

  // Only query by ID when it looks like a UUID, otherwise PostgREST will error
  const wineByUuidQuery = useWine(isUuid ? paramId : "");

  const wineDB: WineDB | null = useMemo(() => {
    if (isUuid) return wineByUuidQuery.data ?? null;

    const legacy = paramId ? getWineById(paramId) : undefined;
    if (!legacy) return null;

    const all = winesQuery.data ?? [];
    return (
      all.find(
        (w) => w.name.trim().toLowerCase() === legacy.name.trim().toLowerCase()
      ) ?? null
    );
  }, [isUuid, wineByUuidQuery.data, winesQuery.data, paramId]);

  const wine = useMemo(() => {
    if (!wineDB) return null;

    const hasCharacteristics = [
      wineDB.sweetness,
      wineDB.body,
      wineDB.tannin,
      wineDB.acidity,
      wineDB.fizzy,
    ].some((v) => v !== null && v !== undefined);

    return {
      id: wineDB.id,
      name: wineDB.name,
      origin: wineDB.origin,
      grapes: wineDB.grapes,
      price: wineDB.price,
      description: wineDB.description,
      story: wineDB.story ?? undefined,
      image: wineDB.image_url ?? "/placeholder.svg",
      category: wineDB.category,
      temperature: wineDB.temperature ?? undefined,
      alcohol: wineDB.alcohol ?? undefined,
      pairing: wineDB.pairing ?? undefined,
      tastingNotes: wineDB.tasting_notes ?? undefined,
      flavorNotes: wineDB.flavor_notes ?? undefined,
      vintage: wineDB.vintage ?? undefined,
      region: wineDB.region ?? undefined,
      updatedAt: wineDB.updated_at,
      characteristics: hasCharacteristics
        ? {
            sweetness: wineDB.sweetness ?? 0,
            body: wineDB.body ?? 0,
            tannin: wineDB.tannin ?? 0,
            acidity: wineDB.acidity ?? 0,
            ...(wineDB.category === "sparkling" && wineDB.fizzy != null
              ? { fizzy: wineDB.fizzy }
              : {}),
          }
        : undefined,
    };
  }, [wineDB]);

  const relatedWines = useMemo(() => {
    if (!wineDB) return [];
    const all = winesQuery.data ?? [];
    return all
      .filter((w) => w.category === wineDB.category && w.id !== wineDB.id)
      .slice(0, 4);
  }, [winesQuery.data, wineDB]);

  const isLoading = isUuid ? wineByUuidQuery.isLoading : winesQuery.isLoading;

  const canonicalUrl = useMemo(() => {
    if (typeof window === "undefined") return "/collection";
    if (!wineDB) return window.location.href;
    return `${window.location.origin}/collection/${wineDB.id}`;
  }, [wineDB]);

  const productSchema = useMemo(() => {
    if (!wine) return null;
    const priceValue = parsePrice(wine.price);
    const imageAbs = absolutizeUrl(wine.image);

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: wine.name,
      description: wine.description,
      image: [imageAbs],
      brand: { "@type": "Brand", name: "SÉLECTION" },
      offers: {
        "@type": "Offer",
        url: canonicalUrl,
        priceCurrency: "VND",
        price: priceValue > 0 ? priceValue : undefined,
        availability: "https://schema.org/InStock",
      },
    };
  }, [wine, canonicalUrl]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="pt-20 md:pt-24 min-h-screen flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Đang tải…</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!wine) {
    return (
      <>
        <Header />
        <main className="pt-20 md:pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif mb-4">Không tìm thấy rượu vang</h1>
            <Button variant="outline" onClick={() => navigate("/collection")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay Lại Bộ Sưu Tập
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isSparklingWine = wine.category === "sparkling";

  return (
    <>
      <Helmet>
        <title>{wine.name} | SÉLECTION</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta
          name="description"
          content={`${wine.name} - ${wine.origin}. ${wine.description.slice(0, 150)}...`}
        />
        {productSchema && (
          <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        )}
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
              Quay Lại Bộ Sưu Tập
            </Link>
          </div>
        </section>

        {/* Wine Detail - Hero Section */}
        <section className="py-8 md:py-16 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.2fr] gap-8 lg:gap-16 items-start">
              {/* Image - Sticky on desktop */}
              <div className="lg:sticky lg:top-28">
                <div className="flex items-center justify-center min-h-[500px] lg:min-h-[700px]">
                  <img
                    src={withImgCacheBust(wine.image, wine.updatedAt)}
                    alt={`Rượu vang ${wine.name}`}
                    className="w-auto h-full max-h-[420px] lg:max-h-[600px] object-contain animate-fade-in"
                  />
                </div>
              </div>

              {/* Info */}
              <div
                className="flex flex-col animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                {/* Category Badge */}
                <div className="inline-flex self-start mb-4">
                  <span className="px-3 py-1 text-[10px] tracking-[0.25em] uppercase bg-primary/5 border border-primary/10 rounded-full text-primary/80">
                    {wine.category === "red"
                      ? "Vang Đỏ"
                      : wine.category === "white"
                        ? "Vang Trắng"
                        : "Vang Sủi Bọt"}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-3 leading-tight">
                  {wine.name}
                </h1>

                <p className="text-sm tracking-[0.2em] text-muted-foreground uppercase mb-6 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {wine.origin}
                </p>

                <div className="flex items-baseline gap-3 mb-8">
                  <p className="text-3xl md:text-4xl font-serif text-foreground">
                    {wine.price}
                  </p>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div
                    className={`flex items-start gap-3 p-4 bg-secondary/30 rounded-xl border border-border/30 hover:bg-secondary/40 transition-colors ${
                      wine.grapes.split(",").length > 2 ? "col-span-2" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <WineIcon className="w-5 h-5 text-primary/70" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                        Giống Nho
                      </p>
                      {wine.grapes.split(",").length > 2 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {wine.grapes.split(",").map((grape, index) => (
                            <span
                              key={index}
                              className="inline-block px-2.5 py-1 text-xs font-medium bg-primary/5 border border-primary/10 rounded-full text-foreground/90"
                            >
                              {grape.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm font-medium">{wine.grapes}</p>
                      )}
                    </div>
                  </div>

                  {wine.temperature && (
                    <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl border border-border/30 hover:bg-secondary/40 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Thermometer className="w-5 h-5 text-primary/70" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Nhiệt Độ
                        </p>
                        <p className="text-sm font-medium">{wine.temperature}</p>
                      </div>
                    </div>
                  )}

                  {wine.alcohol && (
                    <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl border border-border/30 hover:bg-secondary/40 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Percent className="w-5 h-5 text-primary/70" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Nồng Độ Cồn
                        </p>
                        <p className="text-sm font-medium">{wine.alcohol}</p>
                      </div>
                    </div>
                  )}

                  {wine.region && (
                    <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl border border-border/30 hover:bg-secondary/40 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary/70" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Vùng
                        </p>
                        <p className="text-sm font-medium">{wine.region}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Flavor Notes */}
                {wine.flavorNotes && wine.flavorNotes.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs font-serif mb-4 uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary/70" />
                      Nốt Hương
                    </h3>
                    <FlavorNotes notes={wine.flavorNotes} />
                  </div>
                )}

                {/* Wine Characteristics */}
                {wine.characteristics && (
                  <div className="mb-8 p-6 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-xl border border-border/30">
                    <h3 className="text-xs font-serif mb-5 uppercase tracking-[0.2em] text-muted-foreground">
                      Đặc Tính Rượu
                    </h3>
                    <div className="space-y-4">
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
                      {isSparklingWine &&
                        wine.characteristics.fizzy !== undefined && (
                          <WineCharacteristicsBar
                            label="Độ Sủi / Fizzy"
                            value={wine.characteristics.fizzy}
                          />
                        )}
                    </div>
                  </div>
                )}

                {/* Contact CTA */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-border/30">
                  <Button
                    asChild
                    size="lg"
                    className="flex-1 sm:flex-none min-w-[180px]"
                  >
                    <a
                      href="https://zalo.me/0906777377"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Đặt Hàng Qua Zalo
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="flex-1 sm:flex-none min-w-[120px]"
                  >
                    <Link to="/contact">Liên Hệ</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                    {wine.story.split("\n\n").map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-muted-foreground leading-relaxed mb-4"
                      >
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
                {relatedWines.map((relatedWine, index) => {
                  const img = relatedWine.image_url ?? "/placeholder.svg";
                  return (
                    <Link
                      key={relatedWine.id}
                      to={`/collection/${relatedWine.id}`}
                      className="group opacity-0 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="aspect-[3/4] bg-white mb-4 overflow-hidden flex items-center justify-center p-4 rounded-sm shadow-sm">
                        <img
                          src={withImgCacheBust(img, relatedWine.updated_at)}
                          alt={`Rượu vang ${relatedWine.name}`}
                          loading="lazy"
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
                  );
                })}
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

