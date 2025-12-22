import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { wines, WINES_DATA_TIMESTAMP } from "@/data/wines";

const parsePrice = (price: string): number => {
  // Remove currency symbol and commas, parse as number
  return parseInt(price.replace(/[^\d]/g, ""), 10) || 0;
};

const Collection = () => {
  const withImgCacheBust = (url: string) =>
    `${url}${url.includes("?") ? "&" : "?"}v=${WINES_DATA_TIMESTAMP}`;

  // Sort wines by price from high to low
  const sortedWines = [...wines].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

  return (
    <>
      <Helmet>
        <title>Bộ Sưu Tập Rượu Vang | SÉLECTION</title>
        <meta 
          name="description" 
          content="Khám phá bộ sưu tập hơn 25 loại rượu vang hảo hạng từ Pháp, Ý, Chile và Mỹ. Rượu vang đỏ, trắng và sủi bọt cao cấp." 
        />
      </Helmet>

      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        {/* Page Header */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container text-center">
            <p className="text-xs font-sans tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Bộ Sưu Tập
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-light">
              Rượu Vang Hảo Hạng
            </h1>
            <p className="mt-6 text-muted-foreground text-sm">
              {wines.length} loại rượu vang đặc biệt từ khắp nơi trên thế giới
            </p>
          </div>
        </section>

        {/* Wine Grid */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {sortedWines.map((wine, index) => (
                <Link
                  key={wine.id}
                  to={`/collection/${wine.id}`}
                  className={`group opacity-0 animate-slide-up`}
                  style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
                >
                  <div className="aspect-[3/4] bg-white mb-5 overflow-hidden flex items-end justify-center p-6 rounded-sm">
                    <img 
                      src={withImgCacheBust(wine.image)} 
                      alt={wine.name}
                      className="w-auto h-[280px] object-contain group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-serif group-hover:text-muted-foreground transition-colors duration-300 leading-tight">
                      {wine.name}
                    </h3>
                    <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                      {wine.origin}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {wine.grapes}
                    </p>
                    <p className="text-sm font-sans pt-1">
                      {wine.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Collection;
