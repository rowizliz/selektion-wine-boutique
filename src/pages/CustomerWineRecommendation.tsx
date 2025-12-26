import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Phone, MessageCircle, MapPin, Wine, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        {/* Header */}
        <header className="bg-background/95 backdrop-blur-md border-b sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-5 flex items-center justify-center">
            <Link to="/">
              <img src={logo} alt="SÉLECTION" className="h-14 w-auto" />
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-10 max-w-2xl">
          {/* Greeting */}
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
              Kính gửi Anh/Chị {data.customer_name}
            </h1>
            {data.recommendation_message && (
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {data.recommendation_message}
              </p>
            )}
          </div>

          {/* Wine Recommendations */}
          <div className="space-y-5 mb-12">
            {data.wines.map((wine, index) => (
              <Card key={wine.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-0 bg-card">
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    {/* Wine Image */}
                    <div className="w-24 shrink-0 flex items-center justify-center">
                      {wine.wine_image_url ? (
                        <img
                          src={wine.wine_image_url}
                          alt={wine.wine_name}
                          className="w-full h-32 object-contain drop-shadow-lg"
                        />
                      ) : (
                        <div className="w-full h-32 bg-muted/50 rounded-lg flex items-center justify-center">
                          <Wine className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Wine Info */}
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2">
                        Gợi ý #{index + 1}
                      </span>
                      <h3 className="text-base font-bold leading-tight mb-1">
                        {wine.wine_name}
                      </h3>
                      <p className="text-lg font-bold text-primary mb-3">
                        {wine.wine_price}
                      </p>
                      
                      {wine.recommendation_reason && (
                        <div className="bg-muted/50 rounded-lg p-2.5 mb-3">
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            <span className="font-semibold text-foreground">💡 </span>
                            {wine.recommendation_reason}
                          </p>
                        </div>
                      )}
                      
                      <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                        <Link to={`/collection/${wine.wine_id}`}>
                          <ExternalLink className="w-3 h-3 mr-1.5" />
                          Xem chi tiết
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator className="my-10" />

          {/* Contact Section */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Liên hệ đặt hàng</h2>
            <p className="text-muted-foreground mb-6">
              SÉLECTION sẵn sàng hỗ trợ bạn 24/7
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                onClick={handleCall}
                size="lg" 
                className="gap-2"
              >
                <Phone className="w-5 h-5" />
                Gọi 0906.777.377
              </Button>
              <Button 
                onClick={handleZalo}
                size="lg" 
                variant="outline"
                className="gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <MessageCircle className="w-5 h-5" />
                Chat Zalo
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Showroom: 123 ABC, Quận 1, TP.HCM</span>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/30 py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <Link to="/">
              <img src={logo} alt="SÉLECTION" className="h-8 mx-auto mb-3" />
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SÉLECTION - Rượu Vang & Quà Tặng Cao Cấp
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default CustomerWineRecommendation;
