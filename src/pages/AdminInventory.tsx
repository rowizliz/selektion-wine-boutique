import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Gift, Plus, Percent, Upload, FileSpreadsheet, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventory } from "@/hooks/useInventory";
import { useOrders, calculateOrderFinancials } from "@/hooks/useOrders";
import { useActiveProfile, useInventoryProfiles, InventoryProfile } from "@/hooks/useInventoryProfiles";
import { useIsMobile } from "@/hooks/use-mobile";
import InventoryTable from "@/components/inventory/InventoryTable";
import OrdersTable from "@/components/inventory/OrdersTable";
import AddInventoryDialog from "@/components/inventory/AddInventoryDialog";
import CreateOrderDialog from "@/components/inventory/CreateOrderDialog";
import ProfileSelector from "@/components/inventory/ProfileSelector";
import ImportOrdersDialog from "@/components/inventory/ImportOrdersDialog";
import ImportInventoryDialog from "@/components/inventory/ImportInventoryDialog";
import MobileInventoryCard from "@/components/inventory/MobileInventoryCard";
import MobileOrderCard from "@/components/inventory/MobileOrderCard";
import MobileActionsDrawer from "@/components/inventory/MobileActionsDrawer";
import EditOrderDialog from "@/components/inventory/EditOrderDialog";
import { Order } from "@/hooks/useOrders";
import { Skeleton } from "@/components/ui/skeleton";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCompact(amount: number) {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}tỷ`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}tr`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}k`;
  }
  return amount.toString();
}

const AdminInventory = () => {
  const [selectedProfile, setSelectedProfile] = useState<InventoryProfile | null>(null);
  const { data: activeProfile, isLoading: profileLoading } = useActiveProfile();
  const { data: profiles } = useInventoryProfiles();
  const isMobile = useIsMobile();
  const [statsExpanded, setStatsExpanded] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

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
  const [showImportInventory, setShowImportInventory] = useState(false);

  const financials = orders ? calculateOrderFinancials(orders) : null;

  const totalInventoryValue = inventory?.reduce((sum, item) => {
    return sum + item.quantity_in_stock * item.purchase_price;
  }, 0) ?? 0;

  const totalStock = inventory?.reduce((sum, item) => sum + item.quantity_in_stock, 0) ?? 0;

  const isLoading = profileLoading || !selectedProfile;

  // Stats data for easier rendering
  const stats = [
    {
      icon: Package,
      label: "Tồn Kho",
      value: totalStock.toString(),
      subtext: "chai",
      color: "",
    },
    {
      icon: DollarSign,
      label: "Giá Trị Kho",
      value: isMobile ? formatCompact(totalInventoryValue) : formatCurrency(totalInventoryValue),
      subtext: "giá nhập",
      color: "",
    },
    {
      icon: ShoppingCart,
      label: "Đơn Bán",
      value: (financials?.salesCount ?? 0).toString(),
      subtext: "đơn hàng",
      color: "",
    },
    {
      icon: Gift,
      label: "Đơn Tặng",
      value: (financials?.giftCount ?? 0).toString(),
      subtext: "đơn tặng",
      color: "",
    },
    {
      icon: TrendingDown,
      label: "Đã Bán/Tặng",
      value: (financials?.totalBottlesSold ?? 0).toString(),
      subtext: "chai",
      color: "text-blue-600",
    },
    {
      icon: Percent,
      label: "Chiết Khấu",
      value: isMobile ? formatCompact(financials?.totalDiscount ?? 0) : formatCurrency(financials?.totalDiscount ?? 0),
      subtext: "",
      color: "text-orange-600",
    },
    {
      icon: TrendingUp,
      label: "Doanh Thu",
      value: isMobile ? formatCompact(financials?.netRevenue ?? 0) : formatCurrency(financials?.netRevenue ?? 0),
      subtext: "sau chiết khấu",
      color: "text-green-600",
    },
    {
      icon: (financials?.profit ?? 0) >= 0 ? TrendingUp : TrendingDown,
      label: "Lợi Nhuận",
      value: isMobile ? formatCompact(financials?.profit ?? 0) : formatCurrency(financials?.profit ?? 0),
      subtext: "",
      color: (financials?.profit ?? 0) >= 0 ? "text-green-600" : "text-red-600",
    },
  ];

  const visibleStats = isMobile && !statsExpanded ? stats.slice(0, 4) : stats;

  return (
    <>
      <Helmet>
        <title>Quản Lý Kho Hàng | Admin</title>
      </Helmet>

      <main className="min-h-screen bg-background p-3 md:p-6 pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          {/* Header */}
          <header className="space-y-3">
            <div className="flex items-center gap-3">
              <Link to="/admin">
                <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                  <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-serif truncate">Quản Lý Kho Hàng</h1>
                <p className="text-muted-foreground text-xs md:text-sm hidden sm:block">
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
              <Skeleton className="h-10 w-48" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards - Mobile optimized */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
                  {visibleStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <Card key={index}>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                            <Icon className="h-3 w-3" />
                            <span className="text-xs font-medium truncate">{stat.label}</span>
                          </div>
                          <p className={`text-lg md:text-xl font-bold truncate ${stat.color}`}>
                            {stat.value}
                          </p>
                          {stat.subtext && (
                            <p className="text-xs text-muted-foreground truncate">{stat.subtext}</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {/* Show more/less button on mobile */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground"
                    onClick={() => setStatsExpanded(!statsExpanded)}
                  >
                    {statsExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Thu gọn
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Xem thêm thống kê
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="inventory" className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <TabsList className="flex-shrink-0">
                    <TabsTrigger value="inventory" className="text-sm">Kho Hàng</TabsTrigger>
                    <TabsTrigger value="orders" className="text-sm">Đơn Hàng</TabsTrigger>
                  </TabsList>

                  {/* Desktop action buttons */}
                  <div className="hidden md:flex gap-2">
                    <Button onClick={() => setShowAddInventory(true)} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Tồn Kho
                    </Button>
                    <Button onClick={() => setShowImportInventory(true)} variant="outline" size="sm">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Import Kho
                    </Button>
                    <Button onClick={() => setShowImportOrders(true)} variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Đơn
                    </Button>
                    <Button onClick={() => setShowCreateOrder(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Tạo Đơn Hàng
                    </Button>
                  </div>
                </div>

                <TabsContent value="inventory" className="mt-4">
                  {isMobile ? (
                    // Mobile card view
                    <div className="space-y-2">
                      {inventoryLoading ? (
                        [1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)
                      ) : inventory?.length === 0 ? (
                        <Card>
                          <CardContent className="p-8 text-center text-muted-foreground">
                            Chưa có dữ liệu kho hàng
                          </CardContent>
                        </Card>
                      ) : (
                        inventory?.map((item) => (
                          <MobileInventoryCard key={item.id} item={item} />
                        ))
                      )}
                    </div>
                  ) : (
                    <InventoryTable inventory={inventory ?? []} isLoading={inventoryLoading} />
                  )}
                </TabsContent>

                <TabsContent value="orders" className="mt-4">
                  {isMobile ? (
                    // Mobile card view
                    <div className="space-y-2">
                      {ordersLoading ? (
                        [1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)
                      ) : orders?.length === 0 ? (
                        <Card>
                          <CardContent className="p-8 text-center text-muted-foreground">
                            Chưa có đơn hàng nào
                          </CardContent>
                        </Card>
                      ) : (
                        orders?.map((order) => (
                          <MobileOrderCard 
                            key={order.id} 
                            order={order} 
                            onEdit={setEditingOrder}
                          />
                        ))
                      )}
                    </div>
                  ) : (
                    <OrdersTable orders={orders ?? []} isLoading={ordersLoading} />
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>

      {/* Mobile floating action button */}
      {isMobile && (
        <MobileActionsDrawer
          onAddInventory={() => setShowAddInventory(true)}
          onImportInventory={() => setShowImportInventory(true)}
          onImportOrders={() => setShowImportOrders(true)}
          onCreateOrder={() => setShowCreateOrder(true)}
        />
      )}

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

      <ImportInventoryDialog
        open={showImportInventory}
        onOpenChange={setShowImportInventory}
        profileId={profileId}
      />

      <EditOrderDialog
        order={editingOrder}
        open={!!editingOrder}
        onOpenChange={(open) => !open && setEditingOrder(null)}
      />
    </>
  );
};

export default AdminInventory;
