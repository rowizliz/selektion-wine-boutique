import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  Home,
  ShoppingBag,
  History,
  User as UserIcon,
  FileText,
  LogOut,
  Settings,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

// Hooks
import {
  useCurrentCollaborator,
  useCollaboratorOrders,
  useCreateCollaboratorOrder,
  useCommissionTiers,
  useAccumulatedQuantity,
  Collaborator,
} from "@/hooks/useCollaborators";
import { useWines } from "@/hooks/useWines";
import { useMyArticles, useArticleMutations, BlogArticle } from "@/hooks/useBlogArticles";
import { useCollaboratorWithdrawals } from "@/hooks/useWithdrawals";

// Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CollaboratorDashboard } from "@/components/collaborator/CollaboratorDashboard";
import { CollaboratorProducts } from "@/components/collaborator/CollaboratorProducts";
import { CollaboratorHistory } from "@/components/collaborator/CollaboratorHistory";
import { CartDialog } from "@/components/collaborator/CartDialog";

// Dialogs
import { BankInfoDialog } from "@/components/collaborator/BankInfoDialog";
import { WithdrawalDialog } from "@/components/collaborator/WithdrawalDialog";
import { ProfileSettingsDialog } from "@/components/collaborator/ProfileSettingsDialog";
import { PasswordChangeDialog } from "@/components/collaborator/PasswordChangeDialog";
import ArticleFormDialog from "@/components/blog/ArticleFormDialog";

interface LocalCartItem {
  wine_id: string;
  wine_name: string;
  original_price: number;
  collaborator_price: number;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  category: string | null;
  image_url: string | null;
  inventory_quantity: number;
  year: number | null;
  region: string | null;
  country: string | null;
}

export const CollaboratorPortalDesktop = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [isBankInfoOpen, setIsBankInfoOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | undefined>(undefined);

  // Cart state
  const [cart, setCart] = useState<LocalCartItem[]>([]);

  const { data: collaborator, isLoading: isCollaboratorLoading } = useCurrentCollaborator();
  const { data: orders } = useCollaboratorOrders(collaborator?.id);
  const { data: commissionTiers } = useCommissionTiers();
  const { data: accumulatedData } = useAccumulatedQuantity(collaborator?.id);
  const { data: wines } = useWines();
  const createOrder = useCreateCollaboratorOrder();
  const { data: myArticles } = useMyArticles();
  const { deleteArticle } = useArticleMutations();
  const { data: withdrawals } = useCollaboratorWithdrawals(collaborator?.id);

  // Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading || isCollaboratorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!collaborator) {
    return null;
  }

  // Stats
  const accumulatedQuantity = accumulatedData?.quantity || 0;
  const sessionEnd = accumulatedData?.sessionEnd || null;

  // Logic to determine discount percent same as Mobile
  const currentCartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalQuantityInSession = accumulatedQuantity + currentCartQuantity;

  const getDiscountPercentByQuantity = (quantity: number): number => {
    if (!commissionTiers || commissionTiers.length === 0) {
      return collaborator.discount_percent;
    }
    const matchingTier = commissionTiers.find(tier => {
      if (tier.max_quantity) {
        return quantity >= tier.min_quantity && quantity <= tier.max_quantity;
      }
      return quantity >= tier.min_quantity;
    });
    return matchingTier?.commission_percent || collaborator.discount_percent;
  };

  const currentDiscountPercent = getDiscountPercentByQuantity(totalQuantityInSession);

  const approvedOrders = orders?.filter(o => o.status === 'approved' || o.status === 'completed') || [];
  const totalSales = approvedOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalCommission = approvedOrders.reduce((sum, o) => sum + o.commission_amount, 0);

  const getNumericPrice = (price: number | string) => {
    return typeof price === "string" ? parseInt(price.replace(/[^\d]/g, "")) : price;
  };

  const getDiscountedPrice = (price: number) => {
    return price * (1 - currentDiscountPercent / 100);
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.wine_id === product.id);
      if (existing) {
        return prev.map(item =>
          item.wine_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        wine_id: product.id,
        wine_name: product.name,
        original_price: getNumericPrice(product.price),
        collaborator_price: getDiscountedPrice(getNumericPrice(product.price)),
        quantity: 1
      }];
    });
    toast.success("Đã thêm vào giỏ");
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.wine_id === productId) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleSubmitOrder = async (customerInfo: any) => {
    try {
      const items = cart.map(item => ({
        wine_id: item.wine_id,
        wine_name: item.wine_name,
        quantity: item.quantity,
        collaborator_price: getDiscountedPrice(item.original_price),
        original_price: item.original_price,
        commission_amount: 0
      }));

      const totalAmount = cart.reduce((sum, item) => sum + (getDiscountedPrice(item.original_price) * item.quantity), 0);
      const commissionAmount = cart.reduce((sum, item) => {
        const originalTotal = item.original_price * item.quantity;
        const collaboratorTotal = getDiscountedPrice(item.original_price) * item.quantity;
        return sum + (originalTotal - collaboratorTotal);
      }, 0);

      await createOrder.mutateAsync({
        collaborator_id: collaborator.id,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        notes: customerInfo.notes,
        items: items
      });

      setCart([]);
      setIsOrderDialogOpen(false);
      setCurrentTab("history");
      toast.success("Đặt hàng thành công! Đơn hàng đang chờ duyệt.");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng.");
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Tổng quan", icon: Home },
    { id: "products", label: "Sản phẩm", icon: ShoppingBag },
    { id: "history", label: "Lịch sử & Đơn hàng", icon: History },
    { id: "my-articles", label: "Bài viết của tôi", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Helmet>
        <title>Cộng Tác Viên (Desktop) | Sélection</title>
      </Helmet>

      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col shadow-sm z-20">
        <div className="p-6 border-b flex items-center justify-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-purple-600 bg-clip-text text-transparent">
            CTV Portal
          </h1>
        </div>

        <div className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                currentTab === item.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t space-y-2">
          <button
            onClick={() => setIsBankInfoOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg"
          >
            <CreditCard className="h-4 w-4" />
            Ngân hàng
          </button>
          <button
            onClick={() => setIsProfileSettingsOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg"
          >
            <Settings className="h-4 w-4" />
            Cài đặt
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border">
              <AvatarImage src={collaborator.avatar_url || ""} />
              <AvatarFallback>{collaborator.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{collaborator.name}</p>
              <p className="text-xs text-muted-foreground">Chiết khấu: {currentDiscountPercent}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsOrderDialogOpen(true)}>
              Giỏ hàng ({cart.reduce((a, b) => a + b.quantity, 0)})
            </Button>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700" onClick={() => setCurrentTab("my-articles")}>
              Blog
            </Button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className={cn(
            "mx-auto space-y-6",
            currentTab === "products" ? "max-w-none px-4" : "max-w-5xl"
          )}>
            {currentTab === "dashboard" && (
              <div className="grid grid-cols-1 gap-6">
                <CollaboratorDashboard
                  collaborator={collaborator}
                  accumulatedQuantity={accumulatedQuantity}
                  currentCartQuantity={currentCartQuantity}
                  totalQuantity={totalQuantityInSession}
                  sessionEnd={sessionEnd}
                  discountPercent={currentDiscountPercent}
                  totalSales={totalSales}
                  totalCommission={totalCommission}
                  approvedOrdersCount={approvedOrders.length}
                  commissionTiers={commissionTiers || []}
                  onOpenWithdraw={() => setIsWithdrawOpen(true)}
                  onOpenBankInfo={() => setIsBankInfoOpen(true)}
                  onViewArticles={() => setCurrentTab("my-articles")}
                  onCreateArticle={() => setIsArticleDialogOpen(true)}
                />
              </div>
            )}

            {currentTab === "products" && (
              <Card className="border-none shadow-md overflow-hidden h-[calc(100vh-160px)] flex flex-col">
                <CollaboratorProducts
                  products={wines?.map(w => ({
                    ...w,
                    inventory_quantity: (w as any).inventory_quantity || 100,
                    year: (w as any).year || null,
                    region: (w as any).region || null,
                    country: (w as any).country || null
                  })) as Product[] || []}
                  cart={cart}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onViewCart={() => setIsOrderDialogOpen(true)}
                  getDiscountedPrice={getDiscountedPrice}
                />
              </Card>
            )}

            {currentTab === "history" && (
              <Card className="border-none shadow-md overflow-hidden h-[calc(100vh-160px)]">
                <CollaboratorHistory orders={orders || []} withdrawals={withdrawals || []} />
              </Card>
            )}

            {currentTab === "my-articles" && (
              <Card className="p-6 border-none shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Bài viết của tôi</h2>
                  <Button size="sm" onClick={() => { setEditingArticle(undefined); setIsArticleDialogOpen(true); }}>
                    + Viết bài mới
                  </Button>
                </div>
                {myArticles && myArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myArticles.map((article) => (
                      <div key={article.id} className="bg-card rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-base mb-2 line-clamp-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                        <div className="flex gap-2 mt-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => { setEditingArticle(article); setIsArticleDialogOpen(true); }}
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteArticle.mutate(article.id)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-muted-foreground">
                    Chưa có bài viết nào.
                  </div>
                )}
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <BankInfoDialog
        open={isBankInfoOpen}
        onOpenChange={setIsBankInfoOpen}
        collaborator={collaborator}
      />

      <WithdrawalDialog
        open={isWithdrawOpen}
        onOpenChange={setIsWithdrawOpen}
        collaborator={collaborator}
      />

      <ProfileSettingsDialog
        open={isProfileSettingsOpen}
        onOpenChange={setIsProfileSettingsOpen}
        collaborator={collaborator}
      />

      <PasswordChangeDialog
        open={isPasswordChangeOpen}
        onOpenChange={setIsPasswordChangeOpen}
        collaborator={collaborator}
      />

      <CartDialog
        open={isOrderDialogOpen}
        onOpenChange={setIsOrderDialogOpen}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onSubmitOrder={handleSubmitOrder}
        getDiscountedPrice={getDiscountedPrice}
      />

      <ArticleFormDialog
        open={isArticleDialogOpen}
        onOpenChange={setIsArticleDialogOpen}
        article={editingArticle}
      />
    </div>
  );
};
