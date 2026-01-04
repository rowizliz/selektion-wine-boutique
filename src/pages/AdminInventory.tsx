import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Gift, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventory } from "@/hooks/useInventory";
import { useOrders, calculateOrderFinancials } from "@/hooks/useOrders";
import InventoryTable from "@/components/inventory/InventoryTable";
import OrdersTable from "@/components/inventory/OrdersTable";
import AddInventoryDialog from "@/components/inventory/AddInventoryDialog";
import CreateOrderDialog from "@/components/inventory/CreateOrderDialog";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

const AdminInventory = () => {
  const { data: inventory, isLoading: inventoryLoading } = useInventory();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  const financials = orders ? calculateOrderFinancials(orders) : null;

  const totalInventoryValue = inventory?.reduce((sum, item) => {
    return sum + item.quantity_in_stock * item.purchase_price;
  }, 0) ?? 0;

  const totalStock = inventory?.reduce((sum, item) => sum + item.quantity_in_stock, 0) ?? 0;

  return (
    <>
      <Helmet>
        <title>Quản Lý Kho Hàng | Admin</title>
      </Helmet>

      <main className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-serif">Quản Lý Kho Hàng</h1>
                <p className="text-muted-foreground text-sm">
                  Theo dõi tồn kho, đơn hàng và lợi nhuận
                </p>
              </div>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Tổng Tồn Kho
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalStock}</p>
                <p className="text-xs text-muted-foreground">chai</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Giá Trị Kho
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(totalInventoryValue)}</p>
                <p className="text-xs text-muted-foreground">giá nhập</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Đơn Bán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{financials?.salesCount ?? 0}</p>
                <p className="text-xs text-muted-foreground">đơn hàng</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Đơn Tặng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{financials?.giftCount ?? 0}</p>
                <p className="text-xs text-muted-foreground">đơn tặng</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Doanh Thu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(financials?.totalRevenue ?? 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  {(financials?.profit ?? 0) >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  Lợi Nhuận
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-2xl font-bold ${
                    (financials?.profit ?? 0) >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(financials?.profit ?? 0)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="inventory" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="inventory">Kho Hàng</TabsTrigger>
                <TabsTrigger value="orders">Đơn Hàng</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button onClick={() => setShowAddInventory(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Tồn Kho
                </Button>
                <Button onClick={() => setShowCreateOrder(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo Đơn Hàng
                </Button>
              </div>
            </div>

            <TabsContent value="inventory">
              <InventoryTable
                inventory={inventory ?? []}
                isLoading={inventoryLoading}
              />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersTable orders={orders ?? []} isLoading={ordersLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AddInventoryDialog
        open={showAddInventory}
        onOpenChange={setShowAddInventory}
      />

      <CreateOrderDialog
        open={showCreateOrder}
        onOpenChange={setShowCreateOrder}
      />
    </>
  );
};

export default AdminInventory;
