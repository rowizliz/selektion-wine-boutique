import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ZALO_LINK = "https://zalo.me/0906777377";

const SuccessScreen = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16">
      <div className="text-center max-w-2xl mx-auto px-6">
        
        {/* Gold Wine Bottle with Glow */}
        <div className="mb-10">
          <div 
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #D4AF37 100%)',
              boxShadow: '0 0 40px rgba(212, 175, 55, 0.5), 0 0 80px rgba(212, 175, 55, 0.3), 0 0 120px rgba(212, 175, 55, 0.15)'
            }}
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-12 h-12"
              fill="none"
              stroke="#5C4033"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 2v4.5c0 1-1 2-2 3s-2 2.5-2 5.5c0 3 2 5 6 5s6-2 6-5c0-3-1-4.5-2-5.5s-2-2-2-3V2" />
              <path d="M8.5 2h7" />
              <path d="M8 15c0 1.5 1.5 2 4 2s4-.5 4-2" />
            </svg>
          </div>
        </div>

        {/* Main Heading - Single Line */}
        <h2 
          className="text-2xl md:text-3xl font-serif tracking-wide text-foreground mb-4"
          style={{ whiteSpace: 'nowrap' }}
        >
          Xin trân trọng cảm ơn Quý Khách
        </h2>
        
        <p className="text-muted-foreground text-base mb-8">
          Chúng tôi đã tiếp nhận yêu cầu tư vấn
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
          <div style={{ color: '#D4AF37' }} className="text-sm">◆</div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
        </div>

        {/* Contact CTA */}
        <p className="text-muted-foreground mb-6">
          Vui lòng liên hệ qua Zalo để được hỗ trợ ngay
        </p>

        <Button 
          asChild 
          size="lg" 
          className="gap-3 px-10 py-6 text-base border-0"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #C9A962 100%)',
            color: '#1a1a1a'
          }}
        >
          <a href={ZALO_LINK} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-5 h-5" />
            Liên Hệ Qua Zalo
          </a>
        </Button>

        {/* Secondary Action */}
        <div className="mt-10">
          <Link 
            to="/collection"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span className="text-sm tracking-wide">Khám phá bộ sưu tập</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SuccessScreen;
