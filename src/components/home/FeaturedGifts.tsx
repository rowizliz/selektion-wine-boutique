import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { giftSets, formatPrice } from "@/data/giftSets";
import { Gift } from "lucide-react";

// Show 4 featured gifts (mix of categories)
const featuredGiftIds = ["rw28", "rw27", "rw23", "khang-xuan-an"];
const featuredGifts = featuredGiftIds
  .map(id => giftSets.find(gift => gift.id === id))
  .filter((gift): gift is NonNullable<typeof gift> => gift !== undefined);

const FeaturedGifts = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="w-5 h-5 text-primary" />
            <p className="text-xs font-sans tracking-[0.3em] uppercase text-muted-foreground">
              Quà Tặng Doanh Nghiệp
            </p>
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-light mb-4">
            Quà Tặng Rượu Vang
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Bộ sưu tập quà tặng cao cấp kết hợp rượu vang hảo hạng cùng các sản phẩm tinh tuyển,
            hoàn hảo cho đối tác và khách hàng thân quý.
          </p>
        </div>

        {/* Gift grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {featuredGifts.map((gift, index) => (
            <Link
              key={gift.id}
              to="/gifts"
              className={`group opacity-0 animate-slide-up stagger-${Math.min(index + 1, 4)}`}
            >
              <div className="aspect-square bg-white mb-4 overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-500">
                <img
                  src={gift.image}
                  alt={`Set Hộp Quà Tặng Rượu Vang ${gift.name} Cao Cấp - Quà Tết Doanh Nghiệp Sang Trọng - Selection Wine`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-luxury"
                />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-serif group-hover:text-primary transition-colors duration-300">
                  {gift.name}
                </h3>
                <p className="text-xs tracking-wider text-muted-foreground uppercase">
                  {gift.category === "luxury" ? "Cao Cấp" : gift.category === "premium" ? "Đặc Biệt" : "Tiêu Chuẩn"}
                </p>
                <p className="text-sm font-sans font-medium text-primary">
                  {formatPrice(gift.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button asChild variant="luxury" size="lg">
            <Link to="/gifts">
              Xem Tất Cả Quà Tặng
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGifts;
