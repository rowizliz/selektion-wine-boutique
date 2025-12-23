import { useState, useMemo, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Gift, Wine, Sparkles, Phone, CheckCircle, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { giftSets, formatPrice, GiftSet } from "@/data/giftSets";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type FilterCategory = "all" | "standard" | "premium" | "luxury";

interface SelectedImage {
  src: string;
  name: string;
  index: number;
}

const Gifts = () => {
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

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

  const handleImageClick = (image: SelectedImage) => {
    setSelectedImage(image);
    setZoomLevel(1);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel((z) => Math.min(3, z + 0.25));
  };

  const handleZoomOut = () => {
    setZoomLevel((z) => Math.max(0.5, z - 0.25));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handlePrevious = useCallback(() => {
    if (selectedImage && selectedImage.index > 0) {
      const prevGift = sortedGifts[selectedImage.index - 1];
      setSelectedImage({
        src: prevGift.image,
        name: prevGift.name,
        index: selectedImage.index - 1,
      });
      setZoomLevel(1);
    }
  }, [selectedImage, sortedGifts]);

  const handleNext = useCallback(() => {
    if (selectedImage && selectedImage.index < sortedGifts.length - 1) {
      const nextGift = sortedGifts[selectedImage.index + 1];
      setSelectedImage({
        src: nextGift.image,
        name: nextGift.name,
        index: selectedImage.index + 1,
      });
      setZoomLevel(1);
    }
  }, [selectedImage, sortedGifts]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, handlePrevious, handleNext]);

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
        {/* Hero Section with Background Image */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <img
              src="/gifts/rw20.jpg"
              alt=""
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary/3 rounded-full blur-2xl" />

          <div className="container relative">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
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

              {/* USP Section */}
              <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 mt-10 pt-8 border-t border-border/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Nhập khẩu chính hãng</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-border/50" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>In logo theo yêu cầu</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-border/50" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Giao hàng toàn quốc</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {sortedGifts.map((gift, index) => (
                <GiftCard
                  key={gift.id}
                  gift={gift}
                  index={index}
                  onImageClick={(image) => handleImageClick({ ...image, index })}
                />
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-16 lg:mt-24 text-center">
              <div className="relative p-8 lg:p-12 rounded-3xl overflow-hidden border border-border/30">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/40 to-transparent" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />

                <div className="relative">
                  <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-xl lg:text-2xl font-serif mb-3">
                    Đặt hàng số lượng lớn?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Liên hệ ngay để nhận báo giá ưu đãi và dịch vụ in logo theo
                    yêu cầu doanh nghiệp
                  </p>
                  <a
                    href="https://zalo.me/0906777377"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full text-sm font-medium tracking-wider uppercase hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg shadow-primary/25"
                  >
                    <Phone className="w-4 h-4" />
                    Liên hệ tư vấn ngay
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Image Zoom Modal */}
      <Dialog open={!!selectedImage} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[95vh] p-0 bg-background/95 backdrop-blur-lg border-border/50 overflow-hidden">
          {/* Header with title and controls */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-background/80">
            <div className="flex items-center gap-3">
              <DialogTitle className="font-serif text-base lg:text-lg truncate pr-4">
                {selectedImage?.name}
              </DialogTitle>
              {/* Image counter */}
              <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
                {selectedImage ? selectedImage.index + 1 : 0} / {sortedGifts.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Zoom Out Button */}
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className="p-2 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              {/* Zoom Level Indicator */}
              <span className="text-xs font-medium w-12 text-center text-muted-foreground">
                {Math.round(zoomLevel * 100)}%
              </span>

              {/* Zoom In Button */}
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="p-2 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Reset Button */}
              <button
                onClick={handleResetZoom}
                className="p-2 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground transition-colors ml-1"
                aria-label="Đặt lại"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Container with Navigation Arrows */}
          <div className="relative overflow-auto max-h-[calc(95vh-60px)] flex items-center justify-center p-4 bg-secondary/20">
            {/* Previous Arrow */}
            <button
              onClick={handlePrevious}
              disabled={!selectedImage || selectedImage.index === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background border border-border/50 shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-background/90"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={selectedImage?.src}
              alt={selectedImage?.name || ""}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center",
              }}
              className="max-w-full max-h-[80vh] object-contain transition-transform duration-200 rounded-lg shadow-xl"
            />

            {/* Next Arrow */}
            <button
              onClick={handleNext}
              disabled={!selectedImage || selectedImage.index === sortedGifts.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background border border-border/50 shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-background/90"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface GiftCardProps {
  gift: GiftSet;
  index: number;
  onImageClick: (image: { src: string; name: string }) => void;
}

const GiftCard = ({ gift, index, onImageClick }: GiftCardProps) => {
  const categoryLabel = {
    standard: "Tiêu chuẩn",
    premium: "Cao cấp",
    luxury: "Sang trọng",
  };

  const categoryColor = {
    standard: "bg-secondary text-foreground",
    premium: "bg-primary/10 text-primary border border-primary/20",
    luxury:
      "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-700 border border-amber-500/30",
  };

  return (
    <article
      className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 animate-fade-in flex flex-col"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
        <button
          onClick={() => onImageClick({ src: gift.image, name: gift.name })}
          className="w-full h-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-inset"
          aria-label={`Xem ảnh ${gift.name}`}
        >
          <img
            src={gift.image}
            alt={gift.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          />
          {/* Hover overlay with zoom icon */}
          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 rounded-full bg-background/80 backdrop-blur-sm shadow-lg">
              <ZoomIn className="w-5 h-5 text-foreground" />
            </div>
          </div>
        </button>
        {/* Category Badge */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <span
            className={`px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wider uppercase ${categoryColor[gift.category]}`}
          >
            {categoryLabel[gift.category]}
          </span>
        </div>
        {/* Price Badge */}
        <div className="absolute top-4 right-4 pointer-events-none">
          <span className="px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold shadow-lg border border-border/50">
            {formatPrice(gift.price)}
          </span>
        </div>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-5 lg:p-6 flex flex-col flex-1">
        <h3 className="font-serif text-lg lg:text-xl leading-tight group-hover:text-primary transition-colors mb-4">
          {gift.name}
        </h3>

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />

        {/* Wine Info */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-sm mb-4 w-fit">
          <Wine className="w-4 h-4 text-primary" />
          <span className="text-foreground/80">{gift.wine}</span>
        </div>

        {/* Items List */}
        <ul className="space-y-1.5 flex-1">
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
        <a
          href="https://zalo.me/0906777377"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-medium hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md shadow-primary/20"
        >
          <Gift className="w-4 h-4" />
          Đặt hàng ngay
        </a>
      </div>
    </article>
  );
};

export default Gifts;
