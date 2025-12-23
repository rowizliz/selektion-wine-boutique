import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Gift, Wine, Sparkles, Phone } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { giftSets, formatPrice, GiftSet } from "@/data/giftSets";

type FilterCategory = "all" | "standard" | "premium" | "luxury";

const Gifts = () => {
  const [filter, setFilter] = useState<FilterCategory>("all");

  const filteredGifts = useMemo(() => {
    if (filter === "all") return giftSets;
    return giftSets.filter((gift) => gift.category === filter);
  }, [filter]);

  const sortedGifts = useMemo(() => {
    return [...filteredGifts].sort((a, b) => a.price - b.price);
  }, [filteredGifts]);

  const categories: { value: FilterCategory; label: string }[] = [
    { value: "all", label: "Tất cả" },
    { value: "standard", label: "Tiêu chuẩn" },
    { value: "premium", label: "Cao cấp" },
    { value: "luxury", label: "Sang trọng" },
  ];

  return (
    <>
      <Helmet>
        <title>Quà Tặng Rượu Vang | SÉLECTION</title>
        <meta
          name="description"
          content="Khám phá bộ sưu tập quà tặng rượu vang cao cấp dành cho doanh nghiệp. Set quà sang trọng, ý nghĩa cho đối tác và khách hàng."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary/3 rounded-full blur-2xl" />

          <div className="container relative">
            <div className="text-center max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium tracking-wider uppercase text-primary">
                  Quà tặng doanh nghiệp
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-serif mb-6 tracking-tight">
                Quà Tặng
                <span className="block text-primary/80 mt-2">Rượu Vang</span>
              </h1>

              <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
                Bộ sưu tập quà tặng cao cấp kết hợp rượu vang hảo hạng cùng các
                đặc sản tinh tuyển. Lựa chọn hoàn hảo để gửi gắm tâm ý đến đối
                tác và khách hàng.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 lg:gap-12 mt-10 pt-8 border-t border-border/50">
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-serif text-primary">
                    {giftSets.length}+
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    Set quà
                  </p>
                </div>
                <div className="w-px h-10 bg-border/50" />
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-serif text-primary">
                    100%
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    Nhập khẩu
                  </p>
                </div>
                <div className="w-px h-10 bg-border/50" />
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-serif text-primary">
                    In Logo
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    Theo yêu cầu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Grid Section */}
        <section className="py-12 lg:py-16">
          <div className="container">
            {/* Filter Tabs */}
            <div className="flex items-center justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  className={`px-4 py-2 text-xs font-medium tracking-wider uppercase rounded-full transition-all duration-300 ${
                    filter === cat.value
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Gift Sets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {sortedGifts.map((gift, index) => (
                <GiftCard key={gift.id} gift={gift} index={index} />
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-16 lg:mt-24 text-center">
              <div className="inline-block p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-secondary/60 via-secondary/30 to-transparent border border-border/30">
                <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl lg:text-2xl font-serif mb-3">
                  Đặt hàng số lượng lớn?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Liên hệ ngay để nhận báo giá ưu đãi và dịch vụ in logo theo
                  yêu cầu doanh nghiệp
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium tracking-wider uppercase hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  <Phone className="w-4 h-4" />
                  Liên hệ tư vấn
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

const GiftCard = ({ gift, index }: { gift: GiftSet; index: number }) => {
  const categoryLabel = {
    standard: "Tiêu chuẩn",
    premium: "Cao cấp",
    luxury: "Sang trọng",
  };

  const categoryColor = {
    standard: "bg-secondary text-foreground",
    premium: "bg-primary/10 text-primary border border-primary/20",
    luxury: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-700 border border-amber-500/30",
  };

  return (
    <article
      className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
        <img
          src={gift.image}
          alt={gift.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wider uppercase ${categoryColor[gift.category]}`}
          >
            {categoryLabel[gift.category]}
          </span>
        </div>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-5 lg:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="font-serif text-lg lg:text-xl leading-tight group-hover:text-primary transition-colors">
            {gift.name}
          </h3>
          <p className="text-primary font-semibold whitespace-nowrap">
            {formatPrice(gift.price)}
          </p>
        </div>

        {/* Wine Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Wine className="w-4 h-4 text-primary/60" />
          <span>{gift.wine}</span>
        </div>

        {/* Items List */}
        <ul className="space-y-1.5">
          {gift.items.slice(0, 4).map((item, i) => (
            <li
              key={i}
              className="text-xs text-muted-foreground flex items-start gap-2"
            >
              <span className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 flex-shrink-0" />
              {item}
            </li>
          ))}
          {gift.items.length > 4 && (
            <li className="text-xs text-primary/70">
              +{gift.items.length - 4} sản phẩm khác
            </li>
          )}
        </ul>

        {/* Contact Button */}
        <Link
          to="/contact"
          className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary/50 text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 group-hover:bg-primary/10"
        >
          <Gift className="w-4 h-4" />
          Đặt hàng
        </Link>
      </div>
    </article>
  );
};

export default Gifts;
