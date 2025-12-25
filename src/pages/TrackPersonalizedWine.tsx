import { useState } from "react";
import { Search, Package, Clock, CheckCircle, Loader2, AlertCircle, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface RequestStatus {
  tracking_token: string;
  status: string;
  created_at: string;
  customer_name: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline"; icon: React.ElementType }> = {
  pending: { label: "Đang chờ xử lý", variant: "secondary", icon: Clock },
  processing: { label: "Đang xử lý", variant: "default", icon: Package },
  completed: { label: "Hoàn thành", variant: "outline", icon: CheckCircle },
};

const TrackPersonalizedWine = () => {
  const [trackingToken, setTrackingToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingToken.trim()) {
      setError("Vui lòng nhập mã tra cứu");
      return;
    }

    // Basic UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(trackingToken.trim())) {
      setError("Mã tra cứu không hợp lệ");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRequestStatus(null);

    try {
      const { data, error: rpcError } = await supabase
        .rpc('get_personalized_wine_request_status', { p_tracking_token: trackingToken.trim() });

      if (rpcError) throw rpcError;

      if (data && data.length > 0) {
        setRequestStatus(data[0]);
      } else {
        setError("Không tìm thấy yêu cầu với mã tra cứu này");
      }
    } catch (err) {
      console.error("Error fetching request status:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    return statusConfig[status] || statusConfig.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 lg:py-20">
        <div className="container max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wine-light border border-wine/20 mb-6">
              <Wine className="w-4 h-4 text-wine" />
              <span className="text-xs font-medium tracking-wider uppercase text-wine">
                Tra cứu tư vấn
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif mb-4">
              Tra Cứu Yêu Cầu Tư Vấn
            </h1>
            <p className="text-muted-foreground">
              Nhập mã tra cứu để kiểm tra trạng thái yêu cầu tư vấn cá nhân hoá của bạn
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Nhập mã tra cứu</CardTitle>
              <CardDescription>
                Mã tra cứu được gửi cho bạn sau khi gửi yêu cầu tư vấn thành công
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="trackingToken" className="sr-only">
                    Mã tra cứu
                  </Label>
                  <Input
                    id="trackingToken"
                    placeholder="Ví dụ: a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                    value={trackingToken}
                    onChange={(e) => setTrackingToken(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span className="ml-2 hidden sm:inline">Tra cứu</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="border-destructive/50 bg-destructive/5 mb-8">
              <CardContent className="flex items-center gap-3 py-4">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Result */}
          {requestStatus && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Thông tin yêu cầu tư vấn</CardTitle>
                  {(() => {
                    const statusInfo = getStatusInfo(requestStatus.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <Badge variant={statusInfo.variant} className="gap-1.5">
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusInfo.label}
                      </Badge>
                    );
                  })()}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Khách hàng</p>
                  <p className="font-medium">{requestStatus.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày gửi yêu cầu</p>
                  <p className="font-medium">{formatDate(requestStatus.created_at)}</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    Có thắc mắc về yêu cầu tư vấn?
                  </p>
                  <Button variant="outline" asChild>
                    <a href="https://zalo.me/0906777377" target="_blank" rel="noopener noreferrer">
                      Liên hệ Zalo
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Back Link */}
          <div className="text-center mt-8">
            <Link to="/tu-van-ca-nhan" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Quay lại trang tư vấn cá nhân hoá
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackPersonalizedWine;
