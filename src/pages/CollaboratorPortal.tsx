import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Package, DollarSign, ShoppingCart, Plus, Minus, Wallet, CreditCard, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  useCurrentCollaborator,
  useCollaboratorOrders,
  useCreateCollaboratorOrder,
  useCommissionTiers,
  useAccumulatedQuantity,
} from "@/hooks/useCollaborators";
import { useWines } from "@/hooks/useWines";
import { BankInfoDialog } from "@/components/collaborator/BankInfoDialog";
import { WithdrawalDialog } from "@/components/collaborator/WithdrawalDialog";
import { WithdrawalHistory } from "@/components/collaborator/WithdrawalHistory";

interface CartItem {
  wine_id: string;
  wine_name: string;
  original_price: number;
  collaborator_price: number;
  quantity: number;
}

const CollaboratorPortal = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [enlargedWine, setEnlargedWine] = useState<{ name: string; image_url: string | null } | null>(null);
  const [isBankInfoOpen, setIsBankInfoOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const { data: collaborator, isLoading: loadingCollaborator } = useCurrentCollaborator();
  const { data: orders } = useCollaboratorOrders(collaborator?.id);
  const { data: commissionTiers } = useCommissionTiers();
  const { data: accumulatedData } = useAccumulatedQuantity(collaborator?.id);
  const { data: wines } = useWines();
  const createOrder = useCreateCollaboratorOrder();

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
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  if (!collaborator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const parsePrice = (priceStr: string): number => {
    return parseInt(priceStr.replace(/[^\d]/g, "")) || 0;
  };

  // Get accumulated quantity from previous orders in 20-day session
  const accumulatedQuantity = accumulatedData?.quantity || 0;
  const sessionEnd = accumulatedData?.sessionEnd;
  
  // Get discount percent based on total quantity (accumulated + current cart)
  const getDiscountPercentByQuantity = (quantity: number): number => {
    if (!commissionTiers || commissionTiers.length === 0) {
      return collaborator.discount_percent; // Fallback to personal discount
    }
    
    // Find matching tier for the quantity
    const matchingTier = commissionTiers.find(tier => {
      if (tier.max_quantity) {
        return quantity >= tier.min_quantity && quantity <= tier.max_quantity;
      }
      return quantity >= tier.min_quantity;
    });
    
    return matchingTier?.commission_percent || collaborator.discount_percent;
  };

  // Current cart quantity
  const currentCartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Total quantity = accumulated from previous orders + current cart
  const totalQuantityInSession = accumulatedQuantity + currentCartQuantity;
  const currentDiscountPercent = getDiscountPercentByQuantity(totalQuantityInSession);

  const getCollaboratorPrice = (originalPrice: number) => {
    return originalPrice * (1 - currentDiscountPercent / 100);
  };

  const addToCart = (wine: any) => {
    const originalPrice = parsePrice(wine.price);

    setCart((prev) => {
      const existing = prev.find((item) => item.wine_id === wine.id);
      if (existing) {
        return prev.map((item) =>
          item.wine_id === wine.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          wine_id: wine.id,
          wine_name: wine.name,
          original_price: originalPrice,
          collaborator_price: originalPrice, // Will be recalculated based on total quantity
          quantity: 1,
        },
      ];
    });
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

  // Calculate cart total with current discount
  const cartTotal = cart.reduce((sum, item) => {
    const discountedPrice = item.original_price * (1 - currentDiscountPercent / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);
  const cartQuantity = currentCartQuantity;

  const handleSubmitOrder = async () => {
    if (!customerInfo.name || cart.length === 0) {
      toast.error("Vui lòng nhập tên khách hàng và thêm sản phẩm");
      return;
    }

    // Calculate items with current discount applied
    const itemsWithDiscount = cart.map(item => ({
      ...item,
      collaborator_price: item.original_price * (1 - currentDiscountPercent / 100),
    }));

    try {
      await createOrder.mutateAsync({
        collaborator_id: collaborator.id,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone || undefined,
        customer_address: customerInfo.address || undefined,
        notes: customerInfo.notes || undefined,
        items: itemsWithDiscount,
      });
      toast.success("Đơn hàng đã được gửi, chờ admin duyệt");
      setCart([]);
      setCustomerInfo({ name: "", phone: "", address: "", notes: "" });
      setIsOrderDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tạo đơn hàng");
    }
  };

  // Calculate stats
  const approvedOrders = orders?.filter((o) => o.status === "approved") || [];
  const totalCommission = approvedOrders.reduce((sum, o) => sum + o.commission_amount, 0);
  const totalSales = approvedOrders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <>
      <Helmet>
        <title>Cộng Tác Viên | Sélection</title>
      </Helmet>

      <main className="min-h-screen bg-background px-3 py-4 sm:p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-serif truncate">Xin chào, {collaborator.name}</h1>
              <p className="text-muted-foreground text-xs sm:text-sm">
                <span className="font-medium">Giảm giá: {currentDiscountPercent}%</span>
                <span className="hidden sm:inline ml-2">
                  (Tích lũy: {accumulatedQuantity} + Giỏ: {currentCartQuantity} = {totalQuantityInSession} SP)
                </span>
              </p>
              <p className="text-muted-foreground text-xs sm:hidden">
                Tích lũy: {totalQuantityInSession} SP
              </p>
              {sessionEnd && (
                <p className="text-xs text-muted-foreground">
                  Phiên kết thúc: {new Date(sessionEnd).toLocaleDateString("vi-VN")}
                </p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()} className="self-start sm:self-auto">
              Đăng xuất
            </Button>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium">Doanh số</CardTitle>
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="text-lg sm:text-2xl font-bold truncate">{formatPrice(totalSales)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium">Hoa hồng</CardTitle>
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="text-lg sm:text-2xl font-bold truncate">{formatPrice(totalCommission)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium">Đơn duyệt</CardTitle>
                <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="text-lg sm:text-2xl font-bold">{approvedOrders.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20 col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium">Số dư ví</CardTitle>
                <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="text-xl sm:text-2xl font-bold text-primary truncate">
                  {formatPrice(collaborator.wallet_balance)}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsBankInfoOpen(true)}
                    className="h-8 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <Landmark className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Ngân hàng</span>
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setIsWithdrawOpen(true)}
                    className="h-8 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <CreditCard className="h-3 w-3 sm:mr-1" />
                    <span className="hidden xs:inline">Rút tiền</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="products" className="space-y-4">
            <TabsList className="w-full sm:w-auto flex overflow-x-auto">
              <TabsTrigger value="products" className="flex-1 sm:flex-none text-xs sm:text-sm">Bảng giá</TabsTrigger>
              <TabsTrigger value="orders" className="flex-1 sm:flex-none text-xs sm:text-sm">Đơn hàng</TabsTrigger>
              <TabsTrigger value="withdrawals" className="flex-1 sm:flex-none text-xs sm:text-sm">Rút tiền</TabsTrigger>
              <TabsTrigger value="commission" className="flex-1 sm:flex-none text-xs sm:text-sm">Hoa hồng</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Bảng giá CTV</CardTitle>
                  {cart.length > 0 && (
                    <Button onClick={() => setIsOrderDialogOpen(true)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Giỏ hàng ({cartQuantity})
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Ảnh</TableHead>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Giá gốc</TableHead>
                        <TableHead>Giá CTV</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wines?.map((wine) => {
                        const originalPrice = parsePrice(wine.price);
                        const collaboratorPrice = getCollaboratorPrice(originalPrice);
                        const cartItem = cart.find((item) => item.wine_id === wine.id);

                        return (
                          <TableRow key={wine.id}>
                            <TableCell>
                              <div 
                                className="w-16 h-12 bg-white rounded border overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                                onClick={() => setEnlargedWine({ name: wine.name, image_url: wine.image_url })}
                              >
                                <img 
                                  src={wine.image_url || "/placeholder.svg"} 
                                  alt={wine.name}
                                  className="h-full w-auto object-contain"
                                  style={{ transform: "rotate(-90deg)", maxHeight: "60px" }}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{wine.name}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatPrice(originalPrice)}
                            </TableCell>
                            <TableCell className="text-primary font-semibold">
                              {formatPrice(collaboratorPrice)}
                            </TableCell>
                            <TableCell className="text-right">
                              {cartItem ? (
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateCartQuantity(wine.id, -1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center">{cartItem.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateCartQuantity(wine.id, 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button size="sm" onClick={() => addToCart(wine)}>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Thêm
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Đơn hàng của tôi</CardTitle>
                </CardHeader>
                <CardContent>
                  {!orders?.length ? (
                    <p className="text-center py-8 text-muted-foreground">Chưa có đơn hàng nào</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ngày tạo</TableHead>
                          <TableHead>Khách hàng</TableHead>
                          <TableHead>Số SP</TableHead>
                          <TableHead>Tổng tiền</TableHead>
                          <TableHead>Hoa hồng</TableHead>
                          <TableHead>Trạng thái</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>
                              {new Date(order.created_at).toLocaleDateString("vi-VN")}
                            </TableCell>
                            <TableCell className="font-medium">{order.customer_name}</TableCell>
                            <TableCell>
                              {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                            </TableCell>
                            <TableCell>{formatPrice(order.total_amount)}</TableCell>
                            <TableCell>{formatPrice(order.commission_amount)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.status === "approved"
                                    ? "default"
                                    : order.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {order.status === "pending"
                                  ? "Chờ duyệt"
                                  : order.status === "approved"
                                  ? "Đã duyệt"
                                  : "Từ chối"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Withdrawals Tab */}
            <TabsContent value="withdrawals">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <CardTitle className="text-base sm:text-lg">Lịch sử rút tiền</CardTitle>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsBankInfoOpen(true)}
                      size="sm"
                      className="flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                      <Landmark className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Ngân hàng
                    </Button>
                    <Button 
                      onClick={() => setIsWithdrawOpen(true)}
                      size="sm"
                      className="flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                      <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Rút tiền
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  {/* Bank Info Summary */}
                  {collaborator.bank_account_number && (
                    <div className="mb-4 p-3 sm:p-4 bg-muted/50 rounded-lg flex items-center gap-3 sm:gap-4">
                      {collaborator.qr_code_url && (
                        <img
                          src={collaborator.qr_code_url}
                          alt="QR Code"
                          className="h-12 w-12 sm:h-16 sm:w-16 rounded border object-contain flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{collaborator.bank_name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          STK: {collaborator.bank_account_number}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {collaborator.bank_account_holder}
                        </p>
                      </div>
                    </div>
                  )}
                  <WithdrawalHistory collaboratorId={collaborator.id} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Commission Tiers Tab */}
            <TabsContent value="commission">
              <Card>
                <CardHeader>
                  <CardTitle>Bậc Hoa Hồng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Info note */}
                  <div className="bg-muted/50 border rounded-lg p-4 text-sm">
                    <p className="font-medium mb-2">📌 Lưu ý về tích lũy hoa hồng:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Số lượng sản phẩm được <strong>cộng dồn</strong> qua các đơn hàng</li>
                      <li>Phiên tích lũy có hiệu lực trong <strong>30 ngày</strong> kể từ đơn hàng đầu tiên</li>
                      <li>Sau 30 ngày, phiên mới sẽ bắt đầu và số lượng tích lũy được đặt lại về 0</li>
                      <li>Mức giảm giá được áp dụng theo bậc cao nhất mà bạn đạt được</li>
                    </ul>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Số lượng sản phẩm</TableHead>
                        <TableHead>% Hoa hồng</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissionTiers?.map((tier) => (
                        <TableRow key={tier.id}>
                          <TableCell>
                            {tier.max_quantity
                              ? `${tier.min_quantity} - ${tier.max_quantity} sản phẩm`
                              : `Từ ${tier.min_quantity} sản phẩm trở lên`}
                          </TableCell>
                          <TableCell className="font-semibold text-primary">
                            {tier.commission_percent}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Order Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tạo đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tên khách hàng *</Label>
              <Input
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <Label>Số điện thoại</Label>
              <Input
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                placeholder="0901234567"
              />
            </div>
            <div>
              <Label>Địa chỉ</Label>
              <Input
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                placeholder="123 Đường ABC, Quận 1, TP.HCM"
              />
            </div>
            <div>
              <Label>Ghi chú</Label>
              <Textarea
                value={customerInfo.notes}
                onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                placeholder="Ghi chú thêm..."
              />
            </div>

            {/* Cart summary */}
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Sản phẩm ({cartQuantity})</h4>
              {cart.map((item) => (
                <div key={item.wine_id} className="flex justify-between text-sm">
                  <span>
                    {item.wine_name} x{item.quantity}
                  </span>
                  <span>{formatPrice(item.collaborator_price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Tổng cộng</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmitOrder} disabled={createOrder.isPending}>
              {createOrder.isPending ? "Đang gửi..." : "Gửi đơn hàng"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enlarged Wine Image Dialog */}
      <Dialog open={!!enlargedWine} onOpenChange={() => setEnlargedWine(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{enlargedWine?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center bg-white rounded-lg p-4">
            <img
              src={enlargedWine?.image_url || "/placeholder.svg"}
              alt={enlargedWine?.name || "Wine"}
              className="max-h-[400px] w-auto object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Bank Info Dialog */}
      {collaborator && (
        <BankInfoDialog
          open={isBankInfoOpen}
          onOpenChange={setIsBankInfoOpen}
          collaborator={collaborator}
        />
      )}

      {/* Withdrawal Dialog */}
      {collaborator && (
        <WithdrawalDialog
          open={isWithdrawOpen}
          onOpenChange={setIsWithdrawOpen}
          collaborator={collaborator}
        />
      )}
    </>
  );
};

export default CollaboratorPortal;
