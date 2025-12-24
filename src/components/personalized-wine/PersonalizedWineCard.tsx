import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const PersonalizedWineCard = () => {
  return (
    <Link
      to="/tu-van-ca-nhan"
      className="group opacity-0 animate-slide-up"
      style={{ animationDelay: "0.6s" }}
    >
      <div className="aspect-[3/4] bg-gradient-to-br from-foreground/5 to-foreground/10 mb-5 overflow-hidden flex flex-col items-center justify-center p-8 rounded-sm border-2 border-dashed border-foreground/20 group-hover:border-foreground/40 transition-all duration-500 group-hover:bg-foreground/10">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-foreground/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
          <Sparkles className="w-10 h-10 text-foreground/60 group-hover:text-foreground transition-colors duration-500" />
        </div>

        {/* Text */}
        <div className="text-center space-y-3">
          <h3 className="text-xl font-serif text-foreground/80 group-hover:text-foreground transition-colors duration-500">
            Chưa tìm được<br />rượu ưng ý?
          </h3>
          <p className="text-sm text-muted-foreground max-w-[200px]">
            Để chúng tôi gợi ý chai rượu phù hợp với gu của bạn
          </p>
        </div>

        {/* CTA */}
        <div className="mt-6 px-6 py-3 border border-foreground/30 rounded-none text-sm font-sans tracking-wide group-hover:bg-foreground group-hover:text-background transition-all duration-500">
          Tư vấn cá nhân hoá
        </div>
      </div>
    </Link>
  );
};

export default PersonalizedWineCard;
