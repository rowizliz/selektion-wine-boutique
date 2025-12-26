import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Phone, MessageCircle, MapPin, Wine, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo3.png";

interface WineRecommendation {
  id: string;
  wine_id: string;
  wine_name: string;
  wine_price: string;
  wine_image_url: string | null;
  recommendation_reason: string | null;
  display_order: number;
}

interface RecommendationData {
  request_id: string;
  customer_name: string;
  recommendation_message: string | null;
  recommendation_published_at: string;
  wines: WineRecommendation[];
}

const CustomerWineRecommendation = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["wine-recommendation", slug],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_wine_recommendation_by_slug", {
        p_url_slug: slug,
      });

      if (error) throw error;
      if (!data || data.length === 0) return null;

      const row = data[0];
      const result: RecommendationData = {
        request_id: row.request_id,
        customer_name: row.customer_name,
        recommendation_message: row.recommendation_message,
        recommendation_published_at: row.recommendation_published_at,
        wines: (row.wines as unknown as WineRecommendation[]) || [],
      };
      return result;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Đang tải gợi ý rượu...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Wine className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy gợi ý</h1>
          <p className="text-muted-foreground mb-6">
            Link này không hợp lệ hoặc chưa được publish. Vui lòng liên hệ SÉLECTION để được hỗ trợ.
          </p>
          <Button asChild>
            <Link to="/">Về trang chủ</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleCall = () => {
    window.location.href = "tel:0906777377";
  };

  const handleZalo = () => {
    window.open("https://zalo.me/0906777377", "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Gợi ý rượu vang dành cho bạn | SÉLECTION</title>
        <meta name="description" content="Gợi ý rượu vang được cá nhân hoá dành riêng cho bạn từ SÉLECTION" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#faf9f7]">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-6 flex items-center justify-center">
            <Link to="/">
              <img src={logo} alt="SÉLECTION" className="h-16 md:h-20 w-auto" />
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12 max-w-2xl">
          {/* Greeting Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 md:p-10 mb-10">
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-neutral-800 text-center mb-8">
              Kính gửi {data.customer_name}
            </h1>
            
            {data.recommendation_message && (
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-600 whitespace-pre-line leading-relaxed text-[15px]">
                  {data.recommendation_message}
                </p>
              </div>
            )}
          </div>

          {/* Wine Recommendations */}
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-neutral-800 mb-6 text-center">
              Rượu vang gợi ý cho bạn
            </h2>
            
            <div className="space-y-4">
              {data.wines.map((wine, index) => (
                <div 
                  key={wine.id} 
                  className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-stretch">
                    {/* Wine Image */}
                    <div className="w-28 md:w-36 shrink-0 bg-gradient-to-b from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
                      {wine.wine_image_url ? (
                        <img
                          src={wine.wine_image_url}
                          alt={wine.wine_name}
                          className="w-full h-36 md:h-44 object-contain drop-shadow-md"
                        />
                      ) : (
                        <Wine className="w-12 h-12 text-neutral-300" />
                      )}
                    </div>
                    
                    {/* Wine Info */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                          #{index + 1}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-neutral-800 leading-snug mb-2">
                        {wine.wine_name}
                      </h3>
                      
                      <p className="text-xl font-bold text-primary mb-4">
                        {wine.wine_price}
                      </p>
                      
                      {wine.recommendation_reason && (
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
                          <p className="text-sm text-neutral-600 leading-relaxed">
                            <span className="text-amber-600">💡</span> {wine.recommendation_reason}
                          </p>
                        </div>
                      )}
                      
                      <Button asChild variant="outline" size="sm" className="w-fit">
                        <Link to={`/collection/${wine.wine_id}`}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 text-center">
            <h2 className="text-xl font-semibold text-neutral-800 mb-2">Liên hệ đặt hàng</h2>
            <p className="text-neutral-500 mb-6">
              Đội ngũ SÉLECTION sẵn sàng hỗ trợ bạn
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Button 
                onClick={handleCall}
                size="lg" 
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Phone className="w-5 h-5" />
                Gọi 0906.777.377
              </Button>
              <Button 
                onClick={handleZalo}
                size="lg" 
                variant="outline"
                className="gap-2 border-[#0068ff] text-[#0068ff] hover:bg-[#0068ff]/5"
              >
                <MessageCircle className="w-5 h-5" />
                Chat Zalo
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
              <MapPin className="w-4 h-4" />
              <span>Showroom: 123 ABC, Quận 1, TP.HCM</span>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-200 bg-white py-8 mt-12">
          <div className="container mx-auto px-6 text-center">
            <Link to="/">
              <img src={logo} alt="SÉLECTION" className="h-10 mx-auto mb-4" />
            </Link>
            <p className="text-sm text-neutral-400">
              © {new Date().getFullYear()} SÉLECTION - Rượu Vang & Quà Tặng Cao Cấp
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default CustomerWineRecommendation;
