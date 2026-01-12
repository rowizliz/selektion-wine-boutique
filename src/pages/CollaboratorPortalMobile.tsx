import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

// Hooks
import {
  useCurrentCollaborator,
  useCollaboratorOrders,
  useCreateCollaboratorOrder,
  useCommissionTiers,
  useAccumulatedQuantity,
  CollaboratorProfile,
} from "@/hooks/useCollaborators";
import { useWines } from "@/hooks/useWines";
import { useMyArticles, useArticleMutations, BlogArticle } from "@/hooks/useBlogArticles";

// Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CollaboratorLayout } from "@/components/collaborator/CollaboratorLayout";
import { MobileNav } from "@/components/collaborator/MobileNav";
import { CollaboratorDashboard } from "@/components/collaborator/CollaboratorDashboard";
import { CollaboratorProducts } from "@/components/collaborator/CollaboratorProducts";
import { CollaboratorHistory } from "@/components/collaborator/CollaboratorHistory";
import { CollaboratorMenu } from "@/components/collaborator/CollaboratorMenu";
import { CartDialog } from "@/components/collaborator/CartDialog";
import { useCollaboratorWithdrawals } from "@/hooks/useWithdrawals";

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

// Temporary interface until Product type is unified
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

const CollaboratorPortalMobile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("dashboard");

  // Dialog States
  const [isBankInfoOpen, setIsBankInfoOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false); // Reused for "Cart" view

  const [cart, setCart] = useState<LocalCartItem[]>([]);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | undefined>(undefined);

  // Data Fetching
  const { data: collaborator, isLoading: loadingCollaborator } = useCurrentCollaborator();
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading || loadingCollaborator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-primary rounded-full mb-2"></div>
          <p className="text-muted-foreground text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!collaborator) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Tài khoản của bạn chưa được kích hoạt làm cộng tác viên.
            </p>
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              Đăng xuất
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Logic Calculations
  const accumulatedQuantity = accumulatedData?.quantity || 0;
  const sessionEnd = accumulatedData?.sessionEnd;
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

  const getDiscountedPrice = (originalPrice: number) => {
    return originalPrice * (1 - currentDiscountPercent / 100);
  };

  // Cart Actions
  const addToCart = (product: Product) => {
    const originalPrice = typeof product.price === 'string' ? parseInt(product.price.replace(/[^\d]/g, "")) : product.price;

    setCart((prev) => {
      const existing = prev.find((item) => item.wine_id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.wine_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          wine_id: product.id,
          wine_name: product.name,
          original_price: originalPrice,
          collaborator_price: originalPrice, // will be discounted on calculate
          quantity: 1,
        },
      ];
    });
    toast.success(`Đã thêm ${product.name} vào giỏ`);
  };

  const updateCartQuantity = (wineId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.wine_id === wineId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleSubmitOrder = async (customer: any) => {
    if (!collaborator || cart.length === 0) return;

    try {
      const orderItems = cart.map(item => ({
        wine_id: item.wine_id,
        wine_name: item.wine_name,
        quantity: item.quantity,
        collaborator_price: getDiscountedPrice(item.original_price),
        original_price: item.original_price,
        commission_amount: 0
      }));

      const totalAmount = orderItems.reduce((sum, item) => sum + item.collaborator_price * item.quantity, 0);

      await createOrder.mutateAsync({
        collaborator_id: collaborator.id,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_address: customer.address,
        notes: customer.notes,
        items: orderItems
      });

      toast.success("Đặt hàng thành công!");
      setCart([]);
      setIsOrderDialogOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo đơn hàng");
      console.error(error);
    }
  };

  const approvedOrders = orders?.filter((o) => o.status === "approved") || [];
  const totalSales = approvedOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalCommission = approvedOrders.reduce((sum, o) => sum + o.commission_amount, 0);

  // Content Switching
  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
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
        );
      case "products":
        // Type casting wines to Product[] to satisfy the interface temporarily
        // Ideally we should fix the WineDB vs Product type mismatch in a separate task
        const products = wines?.map(w => ({
          ...w,
          inventory_quantity: (w as any).inventory_quantity || 100, // Fallback if missing
          year: (w as any).year || null,
          region: (w as any).region || null,
          country: (w as any).country || null
        })) as Product[] || [];

        return (
          <CollaboratorProducts
            products={products}
            cart={cart}
            onAddToCart={addToCart}
            onUpdateQuantity={updateCartQuantity}
            onViewCart={() => setIsOrderDialogOpen(true)}
            getDiscountedPrice={getDiscountedPrice}
          />
        );
      case "history":
        return <CollaboratorHistory orders={orders || []} withdrawals={withdrawals || []} />;
      case "my-articles":
        return (
          <div className="space-y-3 pb-20">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Bài viết của tôi</h2>
              <Button size="sm" onClick={() => { setEditingArticle(undefined); setIsArticleDialogOpen(true); }}>
                + Viết bài mới
              </Button>
            </div>
            {myArticles && myArticles.length > 0 ? (
              <div className="space-y-2">
                {myArticles.map((article) => (
                  <div key={article.id} className="bg-card rounded-lg p-3 border shadow-sm">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{article.excerpt}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => { setEditingArticle(article); setIsArticleDialogOpen(true); }}
                      >
                        Chỉnh sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={() => deleteArticle.mutate(article.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground text-sm">
                Bạn chưa có bài viết nào. Hãy viết bài đầu tiên!
              </div>
            )}
            <Button variant="outline" className="w-full" onClick={() => setCurrentTab("dashboard")}>
              ← Quay lại Dashboard
            </Button>
          </div>
        );
      case "menu":
        return (
          <CollaboratorMenu
            collaborator={collaborator}
            onOpenBankInfo={() => setIsBankInfoOpen(true)}
            onOpenProfile={() => setIsProfileSettingsOpen(true)}
            onOpenPasswordChange={() => setIsPasswordChangeOpen(true)}
            onOpenArticles={() => setIsArticleDialogOpen(true)}
            onLogout={() => supabase.auth.signOut()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Cộng Tác Viên | Sélection</title>
      </Helmet>

      <CollaboratorLayout>
        {renderContent()}
      </CollaboratorLayout>

      <MobileNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        cartItemCount={currentCartQuantity}
      />

      <CartDialog
        open={isOrderDialogOpen}
        onOpenChange={setIsOrderDialogOpen}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onSubmitOrder={handleSubmitOrder}
        getDiscountedPrice={getDiscountedPrice}
      />

      {/* Helper Dialogs */}
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

      <ArticleFormDialog
        open={isArticleDialogOpen}
        onOpenChange={setIsArticleDialogOpen}
        article={editingArticle}
      />
    </>
  );
};

export default CollaboratorPortalMobile;
