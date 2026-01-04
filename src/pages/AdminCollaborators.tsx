import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, UserCheck, UserX, Settings, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  useCollaborators,
  useAddCollaborator,
  useUpdateCollaborator,
  useDeleteCollaborator,
  useCommissionTiers,
  useUpdateCommissionTier,
  useAddCommissionTier,
  useDeleteCommissionTier,
  useCollaboratorOrders,
  useUpdateCollaboratorOrderStatus,
  useUpdateCollaboratorOrder,
  useUpdateCollaboratorOrderItems,
  calculateCommission,
  Collaborator,
  CommissionTier,
  CollaboratorOrder,
  CollaboratorOrderItem,
} from "@/hooks/useCollaborators";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdminWithdrawals } from "@/components/admin/AdminWithdrawals";

const AdminCollaborators = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAddTierDialogOpen, setIsAddTierDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<CommissionTier | null>(null);
  const [editingOrder, setEditingOrder] = useState<CollaboratorOrder | null>(null);

  const { data: collaborators, isLoading: loadingCollaborators } = useCollaborators();
  const { data: commissionTiers, isLoading: loadingTiers } = useCommissionTiers();
  const { data: orders, isLoading: loadingOrders } = useCollaboratorOrders();

  const addCollaborator = useAddCollaborator();
  const updateCollaborator = useUpdateCollaborator();
  const deleteCollaborator = useDeleteCollaborator();
  const addTier = useAddCommissionTier();
  const updateTier = useUpdateCommissionTier();
  const deleteTier = useDeleteCommissionTier();
  const updateOrderStatus = useUpdateCollaboratorOrderStatus();
  const updateOrder = useUpdateCollaboratorOrder();
  const updateOrderItems = useUpdateCollaboratorOrderItems();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    discount_percent: 15,
  });
  const [tierFormData, setTierFormData] = useState({
    min_quantity: 1,
    max_quantity: null as number | null,
    commission_percent: 5,
  });
  const [orderFormData, setOrderFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    notes: "",
    status: "pending",
    commission_amount: 0,
  });
  const [orderItemsDraft, setOrderItemsDraft] = useState<CollaboratorOrderItem[]>([]);
  const [commissionManuallyEdited, setCommissionManuallyEdited] = useState(false);

  const handleAddCollaborator = async () => {
    try {
      await addCollaborator.mutateAsync(formData);
      toast.success("Đã thêm cộng tác viên thành công!");
      setIsAddDialogOpen(false);
      setFormData({ name: "", email: "", phone: "", discount_percent: 15 });
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi thêm cộng tác viên");
    }
  };

  const handleUpdateCollaborator = async () => {
    if (!editingCollaborator) return;
    try {
      await updateCollaborator.mutateAsync({
        id: editingCollaborator.id,
        ...formData,
      });
      toast.success("Đã cập nhật cộng tác viên!");
      setEditingCollaborator(null);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi cập nhật");
    }
  };

  const handleToggleActive = async (collab: Collaborator) => {
    try {
      await updateCollaborator.mutateAsync({
        id: collab.id,
        is_active: !collab.is_active,
      });
      toast.success(collab.is_active ? "Đã vô hiệu hóa CTV" : "Đã kích hoạt CTV");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteCollaborator.mutateAsync(deleteId);
      toast.success("Đã xóa cộng tác viên");
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleApproveOrder = async (order: CollaboratorOrder) => {
    if (!commissionTiers) return;
    const totalQuantity = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const commission = calculateCommission(commissionTiers, totalQuantity, order.total_amount);
    
    try {
      await updateOrderStatus.mutateAsync({
        id: order.id,
        status: "approved",
        commission_amount: commission,
      });
      toast.success("Đã duyệt đơn hàng");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      await updateOrderStatus.mutateAsync({
        id: orderId,
        status: "rejected",
      });
      toast.success("Đã từ chối đơn hàng");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openEditDialog = (collab: Collaborator) => {
    setFormData({
      name: collab.name,
      email: collab.email,
      phone: collab.phone || "",
      discount_percent: collab.discount_percent,
    });
    setEditingCollaborator(collab);
  };

  const openEditOrderDialog = (order: CollaboratorOrder) => {
    setCommissionManuallyEdited(false);
    setOrderFormData({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone || "",
      customer_address: order.customer_address || "",
      notes: order.notes || "",
      status: order.status,
      commission_amount: order.commission_amount,
    });
    setOrderItemsDraft((order.items || []) as CollaboratorOrderItem[]);
    setEditingOrder(order);
  };

  // Live recalculation: commission follows quantity changes unless admin edits it manually
  useEffect(() => {
    if (!editingOrder) return;
    if (commissionManuallyEdited) return;
    if (!commissionTiers) return;

    const totalQty = orderItemsDraft.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
    const totalAmount = orderItemsDraft.reduce(
      (sum, it) => sum + it.collaborator_price * (Number(it.quantity) || 0),
      0
    );

    const nextCommission =
      orderFormData.status === "rejected" ? 0 : calculateCommission(commissionTiers, totalQty, totalAmount);

    setOrderFormData((prev) => ({ ...prev, commission_amount: nextCommission }));
  }, [editingOrder, commissionManuallyEdited, commissionTiers, orderItemsDraft, orderFormData.status]);

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;

    const normalizedItems = orderItemsDraft
      .map((it) => ({ ...it, quantity: Math.max(1, Number(it.quantity) || 1) }))
      .filter((it) => it.id);

    const newTotalAmount = normalizedItems.reduce(
      (sum, it) => sum + it.collaborator_price * it.quantity,
      0
    );
    const newTotalQty = normalizedItems.reduce((sum, it) => sum + it.quantity, 0);

    const nextCommissionAmount =
      commissionManuallyEdited || !commissionTiers
        ? orderFormData.commission_amount
        : orderFormData.status === "rejected"
          ? 0
          : calculateCommission(commissionTiers, newTotalQty, newTotalAmount);

    try {
      // Update item quantities first
      await updateOrderItems.mutateAsync({
        order_id: editingOrder.id,
        items: normalizedItems.map((it) => ({ id: it.id, quantity: it.quantity })),
      });

      // Update order fields + totals
      await updateOrder.mutateAsync({
        id: editingOrder.id,
        customer_name: orderFormData.customer_name,
        customer_phone: orderFormData.customer_phone || null,
        customer_address: orderFormData.customer_address || null,
        notes: orderFormData.notes || null,
        status: orderFormData.status,
        commission_amount: nextCommissionAmount,
        total_amount: newTotalAmount,
      });

      toast.success("Đã cập nhật đơn hàng!");
      setEditingOrder(null);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi cập nhật đơn hàng");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const getCollaboratorName = (collaboratorId: string) => {
    return collaborators?.find(c => c.id === collaboratorId)?.name || "N/A";
  };

  return (
    <>
      <Helmet>
        <title>Quản Lý CTV | Admin</title>
      </Helmet>

      <main className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-serif">Quản Lý Cộng Tác Viên</h1>
              <p className="text-muted-foreground text-sm">
                Thêm, sửa, xóa và quản lý CTV
              </p>
            </div>
          </header>

          <Tabs defaultValue="collaborators" className="space-y-4">
            <TabsList>
              <TabsTrigger value="collaborators">Danh sách CTV</TabsTrigger>
              <TabsTrigger value="orders">Đơn hàng CTV</TabsTrigger>
              <TabsTrigger value="withdrawals">Yêu cầu rút tiền</TabsTrigger>
              <TabsTrigger value="commission">Bậc hoa hồng</TabsTrigger>
            </TabsList>

            {/* Collaborators Tab */}
            <TabsContent value="collaborators">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Danh sách Cộng Tác Viên</CardTitle>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm CTV
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingCollaborators ? (
                    <p className="text-center py-8 text-muted-foreground">Đang tải...</p>
                  ) : !collaborators?.length ? (
                    <p className="text-center py-8 text-muted-foreground">Chưa có CTV nào</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>SĐT</TableHead>
                          <TableHead>Giảm giá</TableHead>
                          <TableHead>Số dư ví</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {collaborators.map((collab) => (
                          <TableRow key={collab.id}>
                            <TableCell className="font-medium">{collab.name}</TableCell>
                            <TableCell>{collab.email}</TableCell>
                            <TableCell>{collab.phone || "-"}</TableCell>
                            <TableCell>{collab.discount_percent}%</TableCell>
                            <TableCell className="font-semibold text-primary">
                              {formatPrice(collab.wallet_balance)}
                            </TableCell>
                            <TableCell>
                              {collab.is_active ? (
                                <Badge variant="default">Hoạt động</Badge>
                              ) : (
                                <Badge variant="secondary">Vô hiệu</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleActive(collab)}
                              >
                                {collab.is_active ? (
                                  <UserX className="h-4 w-4" />
                                ) : (
                                  <UserCheck className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(collab)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteId(collab.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Đơn hàng từ CTV</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <p className="text-center py-8 text-muted-foreground">Đang tải...</p>
                  ) : !orders?.length ? (
                    <p className="text-center py-8 text-muted-foreground">Chưa có đơn hàng nào</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>CTV</TableHead>
                          <TableHead>Khách hàng</TableHead>
                          <TableHead>SĐT</TableHead>
                          <TableHead>Số SP</TableHead>
                          <TableHead>Tổng tiền</TableHead>
                          <TableHead>Hoa hồng</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{getCollaboratorName(order.collaborator_id)}</TableCell>
                            <TableCell className="font-medium">{order.customer_name}</TableCell>
                            <TableCell>{order.customer_phone || "-"}</TableCell>
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
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditOrderDialog(order)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              {order.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveOrder(order)}
                                  >
                                    Duyệt
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRejectOrder(order.id)}
                                  >
                                    Từ chối
                                  </Button>
                                </>
                              )}
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
              <AdminWithdrawals />
            </TabsContent>

            {/* Commission Tiers Tab */}
            <TabsContent value="commission">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Bậc Hoa Hồng</CardTitle>
                  <Button onClick={() => setIsAddTierDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm bậc
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingTiers ? (
                    <p className="text-center py-8 text-muted-foreground">Đang tải...</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Từ (SP)</TableHead>
                          <TableHead>Đến (SP)</TableHead>
                          <TableHead>% Hoa hồng</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {commissionTiers?.map((tier) => (
                          <TableRow key={tier.id}>
                            <TableCell>{tier.min_quantity}</TableCell>
                            <TableCell>{tier.max_quantity ?? "∞"}</TableCell>
                            <TableCell>{tier.commission_percent}%</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setTierFormData({
                                    min_quantity: tier.min_quantity,
                                    max_quantity: tier.max_quantity,
                                    commission_percent: tier.commission_percent,
                                  });
                                  setEditingTier(tier);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteTier.mutate(tier.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Add/Edit Collaborator Dialog */}
      <Dialog
        open={isAddDialogOpen || !!editingCollaborator}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingCollaborator(null);
            setFormData({ name: "", email: "", phone: "", discount_percent: 15 });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCollaborator ? "Sửa Cộng Tác Viên" : "Thêm Cộng Tác Viên"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tên</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                disabled={!!editingCollaborator}
              />
              {!editingCollaborator && (
                <p className="text-xs text-muted-foreground mt-1">
                  CTV sẽ dùng email này để đăng nhập
                </p>
              )}
            </div>
            <div>
              <Label>Số điện thoại</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0901234567"
              />
            </div>
            <div>
              <Label>Giảm giá cho CTV (%)</Label>
              <Input
                type="number"
                value={formData.discount_percent}
                onChange={(e) =>
                  setFormData({ ...formData, discount_percent: Number(e.target.value) })
                }
                min={0}
                max={100}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={editingCollaborator ? handleUpdateCollaborator : handleAddCollaborator}
              disabled={!formData.name || !formData.email}
            >
              {editingCollaborator ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Commission Tier Dialog */}
      <Dialog
        open={isAddTierDialogOpen || !!editingTier}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddTierDialogOpen(false);
            setEditingTier(null);
            setTierFormData({ min_quantity: 1, max_quantity: null, commission_percent: 5 });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTier ? "Sửa Bậc Hoa Hồng" : "Thêm Bậc Hoa Hồng"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Từ (số sản phẩm)</Label>
              <Input
                type="number"
                value={tierFormData.min_quantity}
                onChange={(e) =>
                  setTierFormData({ ...tierFormData, min_quantity: Number(e.target.value) })
                }
                min={1}
              />
            </div>
            <div>
              <Label>Đến (số sản phẩm, để trống = không giới hạn)</Label>
              <Input
                type="number"
                value={tierFormData.max_quantity ?? ""}
                onChange={(e) =>
                  setTierFormData({
                    ...tierFormData,
                    max_quantity: e.target.value ? Number(e.target.value) : null,
                  })
                }
                min={1}
              />
            </div>
            <div>
              <Label>% Hoa hồng</Label>
              <Input
                type="number"
                value={tierFormData.commission_percent}
                onChange={(e) =>
                  setTierFormData({ ...tierFormData, commission_percent: Number(e.target.value) })
                }
                min={0}
                max={100}
                step={0.5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                try {
                  if (editingTier) {
                    await updateTier.mutateAsync({ id: editingTier.id, ...tierFormData });
                  } else {
                    await addTier.mutateAsync(tierFormData);
                  }
                  toast.success(editingTier ? "Đã cập nhật bậc" : "Đã thêm bậc");
                  setIsAddTierDialogOpen(false);
                  setEditingTier(null);
                } catch (error: any) {
                  toast.error(error.message);
                }
              }}
            >
              {editingTier ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog
        open={!!editingOrder}
        onOpenChange={(open) => {
          if (!open) {
            setEditingOrder(null);
            setOrderItemsDraft([]);
            setCommissionManuallyEdited(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Order Items */}
            <div>
              <Label className="text-base font-semibold">Sản phẩm trong đơn</Label>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead className="text-right">SL</TableHead>
                      <TableHead className="text-right">Giá gốc</TableHead>
                      <TableHead className="text-right">Giá CTV</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItemsDraft.map((item, index) => (
                      <TableRow key={item.id || index}>
                        <TableCell className="font-medium">{item.wine_name}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min={1}
                            className="h-8 w-20 ml-auto text-right"
                            value={item.quantity}
                            onChange={(e) => {
                              const nextQty = Math.max(1, Number(e.target.value) || 1);
                              setOrderItemsDraft((prev) =>
                                prev.map((p) => (p.id === item.id ? { ...p, quantity: nextQty } : p))
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatPrice(item.original_price)}
                        </TableCell>
                        <TableCell className="text-right text-primary">
                          {formatPrice(item.collaborator_price)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(item.collaborator_price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="bg-muted/50 px-4 py-2 flex justify-between text-sm">
                  <span>
                    Tổng: {orderItemsDraft.reduce((sum, it) => sum + it.quantity, 0)} sản phẩm
                  </span>
                  <span className="font-semibold">
                    {formatPrice(
                      orderItemsDraft.reduce((sum, it) => sum + it.collaborator_price * it.quantity, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tên khách hàng</Label>
                <Input
                  value={orderFormData.customer_name}
                  onChange={(e) => setOrderFormData({ ...orderFormData, customer_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Số điện thoại</Label>
                <Input
                  value={orderFormData.customer_phone}
                  onChange={(e) => setOrderFormData({ ...orderFormData, customer_phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Địa chỉ</Label>
              <Input
                value={orderFormData.customer_address}
                onChange={(e) => setOrderFormData({ ...orderFormData, customer_address: e.target.value })}
              />
            </div>
            <div>
              <Label>Ghi chú</Label>
              <Textarea
                value={orderFormData.notes}
                onChange={(e) => setOrderFormData({ ...orderFormData, notes: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Trạng thái</Label>
                <Select
                  value={orderFormData.status}
                  onValueChange={(value) => setOrderFormData({ ...orderFormData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ duyệt</SelectItem>
                    <SelectItem value="approved">Đã duyệt</SelectItem>
                    <SelectItem value="rejected">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Hoa hồng (đ)</Label>
              <Input
                type="number"
                value={orderFormData.commission_amount}
                onChange={(e) => {
                  setCommissionManuallyEdited(true);
                  setOrderFormData({ ...orderFormData, commission_amount: Number(e.target.value) });
                }}
              />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingOrder(null)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateOrder} disabled={!orderFormData.customer_name}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác này không thể hoàn tác. CTV và tất cả đơn hàng liên quan sẽ bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminCollaborators;
