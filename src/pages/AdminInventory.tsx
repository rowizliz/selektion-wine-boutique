import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Gift, Plus, Percent, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventory } from "@/hooks/useInventory";
import { useOrders, calculateOrderFinancials } from "@/hooks/useOrders";
import { useActiveProfile, useInventoryProfiles, InventoryProfile } from "@/hooks/useInventoryProfiles";
import InventoryTable from "@/components/inventory/InventoryTable";
import OrdersTable from "@/components/inventory/OrdersTable";
import AddInventoryDialog from "@/components/inventory/AddInventoryDialog";
import CreateOrderDialog from "@/components/inventory/CreateOrderDialog";
import ProfileSelector from "@/components/inventory/ProfileSelector";
import ImportOrdersDialog from "@/components/inventory/ImportOrdersDialog";
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

const AdminInventory = () => {
  const [selectedProfile, setSelectedProfile] = useState<InventoryProfile | null>(null);
  const { data: activeProfile, isLoading: profileLoading } = useActiveProfile();
  const { data: profiles } = useInventoryProfiles();

  // Set selected profile when active profile loads
  useEffect(() => {
    if (!selectedProfile) {
      if (activeProfile) {
        setSelectedProfile(activeProfile);
      } else if (profiles && profiles.length > 0) {
        // Fallback to first profile if no active one
        setSelectedProfile(profiles[0]);
      }
    }
  }, [activeProfile, profiles, selectedProfile]);

  const profileId = selectedProfile?.id ?? null;

  const { data: inventory, isLoading: inventoryLoading } = useInventory(profileId);
  const { data: orders, isLoading: ordersLoading } = useOrders(profileId);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showImportOrders, setShowImportOrders] = useState(false);

  const financials = orders ? calculateOrderFinancials(orders) : null;

  const totalInventoryValue = inventory?.reduce((sum, item) => {
    return sum + item.quantity_in_stock * item.purchase_price;
  }, 0) ?? 0;

  const totalStock = inventory?.reduce((sum, item) => sum + item.quantity_in_stock, 0) ?? 0;

  const isLoading = profileLoading || !selectedProfile;

  return (
    <>
      <Helmet>
        <title>Quản Lý Kho Hàng | Admin</title>
      </Helmet>

      <main className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between flex-wrap gap-4">
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
            <ProfileSelector
              selectedProfileId={selectedProfile?.id ?? null}
              onSelectProfile={setSelectedProfile}
            />
          </header>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                <Card>
                  <CardHeader className="pb-2 px-3 pt-3">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      Tồn Kho
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <p className="text-xl font-bold">{totalStock}</p>
                    <p className="text-xs text-muted-foreground">chai</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 px-3 pt-3">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Giá Trị Kho
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <p className="text-lg font-bold">
                      {formatCurrency(totalInventoryValue)}
                    </p>
                    <p className="text-xs text-muted-foreground">giá nhập</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 px-3 pt-3">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3" />
                      Đơn Bán
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <p className="text-xl font-bold">{financials?.salesCount ?? 0}</p>
                    <p className="text-xs text-muted-foreground">đơn hàng</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 px-3 pt-3">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Gift className="h-3 w-3" />
                      Đơn Tặng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <p className="text-xl font-bold">{financials?.giftCount ?? 0}</p>
                    <p className="text-xs text-muted-foreground">đơn tặng</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 px-3 pt-3">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      Đã Bán/Tặng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <p className="text-xl font-bold text-blue-600">
                      {(financials?.totalBottlesSold ?? 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">chai</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 px-3 pt-3">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Percent className="h-3 w-3" />
                      Chiết Khấu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <p className="text-lg font-bold text-orange-600">
                      {formatCurrency(financials?.totalDiscount ?? 0)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 px-3 pt-3">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Doanh Thu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(financials?.netRevenue ?? 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">sau chiết khấu</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 px-3 pt-3">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      {(financials?.profit ?? 0) >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      Lợi Nhuận
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <p
                      className={`text-lg font-bold ${
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
                    <Button onClick={() => setShowImportOrders(true)} variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import CSV
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
            </>
          )}
        </div>
      </main>

      <AddInventoryDialog
        open={showAddInventory}
        onOpenChange={setShowAddInventory}
        profileId={profileId}
      />

      <CreateOrderDialog
        open={showCreateOrder}
        onOpenChange={setShowCreateOrder}
        profileId={profileId}
      />

      <ImportOrdersDialog
        open={showImportOrders}
        onOpenChange={setShowImportOrders}
        profileId={profileId}
      />
    </>
  );
};

export default AdminInventory;
