import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Package, DollarSign, ShoppingCart, Plus, Minus } from "lucide-react";
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
} from "@/hooks/useCollaborators";
import { useWines } from "@/hooks/useWines";

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
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const { data: collaborator, isLoading: loadingCollaborator } = useCurrentCollaborator();
  const { data: orders } = useCollaboratorOrders(collaborator?.id);
  const { data: commissionTiers } = useCommissionTiers();
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

  const getCollaboratorPrice = (originalPrice: number) => {
    return originalPrice * (1 - collaborator.discount_percent / 100);
  };

  const addToCart = (wine: any) => {
    const originalPrice = parsePrice(wine.price);
    const collaboratorPrice = getCollaboratorPrice(originalPrice);

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
          collaborator_price: collaboratorPrice,
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

  const cartTotal = cart.reduce((sum, item) => sum + item.collaborator_price * item.quantity, 0);
  const cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitOrder = async () => {
    if (!customerInfo.name || cart.length === 0) {
      toast.error("Vui lòng nhập tên khách hàng và thêm sản phẩm");
      return;
    }

    try {
      await createOrder.mutateAsync({
        collaborator_id: collaborator.id,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone || undefined,
        customer_address: customerInfo.address || undefined,
        notes: customerInfo.notes || undefined,
        items: cart,
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

      <main className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif">Xin chào, {collaborator.name}</h1>
              <p className="text-muted-foreground text-sm">
                Giảm giá của bạn: {collaborator.discount_percent}%
              </p>
            </div>
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              Đăng xuất
            </Button>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng doanh số</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(totalSales)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Hoa hồng đã nhận</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(totalCommission)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Đơn đã duyệt</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedOrders.length}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="products" className="space-y-4">
            <TabsList>
              <TabsTrigger value="products">Bảng giá</TabsTrigger>
              <TabsTrigger value="orders">Đơn hàng của tôi</TabsTrigger>
              <TabsTrigger value="commission">Bậc hoa hồng</TabsTrigger>
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

            {/* Commission Tiers Tab */}
            <TabsContent value="commission">
              <Card>
                <CardHeader>
                  <CardTitle>Bậc Hoa Hồng</CardTitle>
                </CardHeader>
                <CardContent>
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
    </>
  );
};

export default CollaboratorPortal;
