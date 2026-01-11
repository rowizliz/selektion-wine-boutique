import { useState, useMemo, useEffect, useCallback } from "react";
import SEO from "@/components/SEO";
import { Gift, Wine, Sparkles, Phone, CheckCircle, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Building, Cake, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatPrice } from "@/data/giftSets";
import { useActiveGiftSets, GiftSetDB } from "@/hooks/useGiftSets";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import BirthdayGiftForm from "@/components/gifts/BirthdayGiftForm";

type FilterCategory = "all" | "standard" | "premium" | "luxury";
type GiftType = "corporate" | "birthday";

interface SelectedImage {
  src: string;
  name: string;
  index: number;
}

const Gifts = () => {
  const [giftType, setGiftType] = useState<GiftType>("corporate");
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const { data: giftSets, isLoading } = useActiveGiftSets();

  const filteredGifts = useMemo(() => {
    if (!giftSets) return [];
    if (filter === "all") return giftSets;
    return giftSets.filter((gift) => gift.category === filter);
  }, [filter, giftSets]);

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
        src: prevGift.image_url || '',
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
        src: nextGift.image_url || '',
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
      <SEO
        title="Quà Tặng Rượu Vang Doanh Nghiệp & Sinh Nhật | SÉLECTION"
        description="Bộ sưu tập quà tặng rượu vang cao cấp, set quà tặng doanh nghiệp sang trọng, quà tặng sếp, đối tác tại TP.HCM. Thiết kế hộp quà tinh tế, in logo theo yêu cầu."
      />

      <Header />

      <main className="min-h-screen bg-background">
        {/* Gift Type Tabs */}
        <section className="pt-24 lg:pt-32 pb-8">
          <div className="container">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setGiftType("corporate")}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${giftType === "corporate"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                <Building className="w-4 h-4" />
                <span className="hidden sm:inline">Quà tặng</span> Doanh nghiệp
              </button>
              <button
                onClick={() => setGiftType("birthday")}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${giftType === "birthday"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                <Cake className="w-4 h-4" />
                <span className="hidden sm:inline">Quà tặng</span> Sinh nhật
              </button>
            </div>
          </div>
        </section>

        {giftType === "birthday" ? (
          <BirthdayGiftForm />
        ) : (
          <>
            {/* Hero Section with Background Image */}
            <section className="relative pb-12 lg:pb-24 overflow-hidden">
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
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 lg:mb-6">
                    <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                    <span className="text-[clamp(9px,2.5vw,12px)] font-medium tracking-wider uppercase text-primary">
                      Quà tặng doanh nghiệp
                    </span>
                  </div>

                  <h1 className="text-[clamp(28px,8vw,60px)] font-serif mb-4 tracking-tight leading-[1.1]">
                    Quà Tặng
                    <span className="block text-primary/80 mt-1 lg:mt-2">Rượu Vang</span>
                  </h1>

                  <p className="text-muted-foreground text-[clamp(14px,3.5vw,20px)] leading-relaxed max-w-2xl mx-auto">
                    Bộ sưu tập quà tặng cao cấp kết hợp rượu vang hảo hạng cùng các
                    đặc sản tinh tuyển. Lựa chọn hoàn hảo để gửi gắm tâm ý đến đối
                    tác và khách hàng.
                  </p>

                  {/* USP Section */}
                  <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 mt-6 pt-6 lg:mt-10 lg:pt-8 border-t border-border/30">
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
            <section className="py-12 lg:py-20">
              <div className="container">
                {/* Elegant Filter Tabs */}
                <div className="flex items-center justify-center gap-1 mb-16 p-1.5 bg-secondary/50 rounded-full max-w-lg mx-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setFilter(cat.value)}
                      className={`relative px-5 py-2.5 text-xs font-medium tracking-wider uppercase rounded-full transition-all duration-300 ${filter === cat.value
                        ? "bg-foreground text-background shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Gift Sets Grid - 3 columns max for better card size */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
                    {sortedGifts.map((gift, index) => (
                      <GiftCard
                        key={gift.id}
                        gift={gift}
                        index={index}
                        onImageClick={(image) => handleImageClick({ ...image, index })}
                      />
                    ))}
                  </div>
                )}

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
          </>
        )}
      </main>

      <Footer />

      {/* Image Zoom Modal */}
      <Dialog open={!!selectedImage} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-5xl w-[95vw] sm:w-[95vw] h-[100dvh] sm:h-auto sm:max-h-[95vh] p-0 bg-background/95 backdrop-blur-lg border-border/50 overflow-hidden flex flex-col">
          {/* Header with title and controls - Stacked on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 px-4 py-3 border-b border-border/30 bg-background/80">
            {/* Title row */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <DialogTitle className="font-serif text-sm sm:text-base lg:text-lg line-clamp-1 flex-1 sm:flex-none">
                {selectedImage?.name}
              </DialogTitle>
              {/* Image counter */}
              <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full whitespace-nowrap">
                {selectedImage ? selectedImage.index + 1 : 0} / {sortedGifts.length}
              </span>
            </div>

            {/* Zoom controls row - Centered on mobile */}
            <div className="flex items-center justify-center sm:justify-end gap-2">
              {/* Zoom Out Button */}
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className="p-2.5 sm:p-2 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Thu nhỏ"
              >
                <ZoomOut className="w-5 h-5 sm:w-4 sm:h-4" />
              </button>

              {/* Zoom Level Indicator */}
              <span className="text-xs font-medium w-12 text-center text-muted-foreground">
                {Math.round(zoomLevel * 100)}%
              </span>

              {/* Zoom In Button */}
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="p-2.5 sm:p-2 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Phóng to"
              >
                <ZoomIn className="w-5 h-5 sm:w-4 sm:h-4" />
              </button>

              {/* Reset Button */}
              <button
                onClick={handleResetZoom}
                className="p-2.5 sm:p-2 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground transition-colors ml-1"
                aria-label="Đặt lại"
              >
                <RotateCcw className="w-5 h-5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative overflow-auto flex-1 flex items-center justify-center p-4 bg-secondary/20">
            {/* Desktop Navigation Arrows */}
            <button
              onClick={handlePrevious}
              disabled={!selectedImage || selectedImage.index === 0}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background border border-border/50 shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-background/90"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={selectedImage?.src}
              alt={selectedImage ? `Chi tiết set quà ${selectedImage.name} - Quà tặng rượu vang cao cấp - Selection Wine` : ""}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center",
              }}
              className="max-w-full max-h-[60vh] sm:max-h-[80vh] object-contain transition-transform duration-200 rounded-lg shadow-xl"
            />

            {/* Desktop Next Arrow */}
            <button
              onClick={handleNext}
              disabled={!selectedImage || selectedImage.index === sortedGifts.length - 1}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background border border-border/50 shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-background/90"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation Bar - Bottom */}
          <div className="flex sm:hidden items-center justify-between px-4 py-3 border-t border-border/30 bg-background/80">
            <button
              onClick={handlePrevious}
              disabled={!selectedImage || selectedImage.index === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary/80 hover:bg-secondary text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Trước</span>
            </button>

            <span className="text-xs text-muted-foreground">
              Vuốt để xem
            </span>

            <button
              onClick={handleNext}
              disabled={!selectedImage || selectedImage.index === sortedGifts.length - 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary/80 hover:bg-secondary text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Ảnh tiếp theo"
            >
              <span className="text-sm font-medium">Tiếp</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface GiftCardProps {
  gift: GiftSetDB;
  index: number;
  onImageClick: (image: { src: string; name: string }) => void;
}

const GiftCard = ({ gift, index, onImageClick }: GiftCardProps) => {
  const categoryLabel: Record<string, string> = {
    standard: "Tiêu chuẩn",
    premium: "Cao cấp",
    luxury: "Sang trọng",
  };

  const categoryStyles: Record<string, { badge: string; accent: string }> = {
    standard: {
      badge: "bg-stone-100 text-stone-700 border-stone-200",
      accent: "from-stone-400/20 to-stone-300/10",
    },
    premium: {
      badge: "bg-gradient-to-r from-amber-100 to-yellow-50 text-amber-800 border-amber-300/50",
      accent: "from-amber-400/30 to-yellow-300/20",
    },
    luxury: {
      badge: "bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 text-amber-900 border-amber-400/60 shadow-sm shadow-amber-500/20",
      accent: "from-amber-500/40 via-yellow-400/30 to-amber-500/40",
    },
  };

  const styles = categoryStyles[gift.category] || categoryStyles.standard;

  return (
    <article
      className="group relative animate-fade-in h-full"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Card Container with elegant border */}
      <div className="relative h-full bg-card rounded-xl overflow-hidden border border-border/40 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 flex flex-col">

        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
          <button
            onClick={() => onImageClick({ src: gift.image_url || '', name: gift.name })}
            className="w-full h-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-inset"
            aria-label={`Xem ảnh ${gift.name}`}
          >
            <img
              src={gift.image_url || ''}
              alt={`Set Hộp Quà Tặng ${gift.name} - Quà Tết Doanh Nghiệp - Selection Wine`}
              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-1000 ease-out"
            />

            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </div>

            {/* Zoom indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 p-4 rounded-full bg-white/90 backdrop-blur-sm shadow-xl">
                <ZoomIn className="w-5 h-5 text-foreground" />
              </div>
            </div>
          </button>

          {/* Category Badge - Top Left */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <span className={`px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border backdrop-blur-sm ${styles.badge}`}>
              {categoryLabel[gift.category] || gift.category}
            </span>
          </div>

          {/* Price - Bottom of image, elegant overlay */}
          <div className="absolute bottom-0 inset-x-0 p-4 pointer-events-none">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-serif text-xl lg:text-2xl text-white font-medium drop-shadow-lg leading-tight mb-1">
                  {gift.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Wine className="w-3.5 h-3.5 text-white/80" />
                  <span className="text-white/80 text-xs font-medium">{gift.wine}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-white/60 text-[10px] uppercase tracking-wider block mb-0.5">Giá</span>
                <span className="text-white text-lg font-semibold drop-shadow-lg">
                  {formatPrice(gift.price)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Fixed height */}
        <div className="p-5 flex flex-col flex-1">
          {/* Items as elegant pills - fixed height container */}
          <div className="flex flex-wrap gap-1.5 mb-5 min-h-[52px] content-start">
            {gift.items.slice(0, 3).map((item, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full bg-secondary/80 text-[10px] text-muted-foreground font-medium h-fit"
              >
                {item.length > 18 ? item.slice(0, 18) + "..." : item}
              </span>
            ))}
            {gift.items.length > 3 && (
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-[10px] text-primary font-medium h-fit">
                +{gift.items.length - 3}
              </span>
            )}
          </div>

          {/* CTA Button - Luxury style, pushed to bottom */}
          <a
            href="https://zalo.me/0906777377"
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-foreground text-background text-sm font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-foreground/20 mt-auto"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            <Gift className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Đặt hàng ngay</span>
          </a>
        </div>

        {/* Decorative corner accent for luxury items */}
        {gift.category === "luxury" && (
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-amber-400/40 to-yellow-300/20 rotate-45" />
          </div>
        )}
      </div>
    </article>
  );
};

export default Gifts;
