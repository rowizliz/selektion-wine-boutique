import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    CreditCard,
    Wallet,
    TrendingUp,
    Package,
    ChevronRight,
    Copy,
    CheckCircle2,
    ShoppingCart,
    DollarSign,
    Landmark,
    Award
} from "lucide-react";
import { toast } from "sonner";
import { CollaboratorProfile } from "@/hooks/useCollaborators";

interface CommissionTier {
    id: string;
    min_quantity: number;
    max_quantity: number | null;
    commission_percent: number;
}

interface CollaboratorDashboardProps {
    collaborator: CollaboratorProfile;
    accumulatedQuantity: number;
    currentCartQuantity: number;
    totalQuantity: number;
    sessionEnd: string | null;
    discountPercent: number;
    totalSales: number;
    totalCommission: number;
    approvedOrdersCount: number;
    commissionTiers: CommissionTier[];
    onOpenWithdraw: () => void;
    onOpenBankInfo: () => void;
    onViewArticles: () => void;
    onCreateArticle: () => void;
}

export const CollaboratorDashboard = ({
    collaborator,
    accumulatedQuantity,
    currentCartQuantity,
    totalQuantity,
    sessionEnd,
    discountPercent,
    totalSales,
    totalCommission,
    approvedOrdersCount,
    commissionTiers,
    onOpenWithdraw,
    onOpenBankInfo,
    onViewArticles,
    onCreateArticle,
}: CollaboratorDashboardProps) => {
    const [isTiersModalOpen, setIsTiersModalOpen] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN").format(price) + "đ";
    };

    const copyRefLink = () => {
        // Placeholder for ref link if we had one, or just copy ID
        navigator.clipboard.writeText(collaborator.id);
        toast.success("Đã sao chép mã CTV");
    };

    return (
        <div className="space-y-3 pb-20">
            {/* Header Profile Card */}
            <div className="bg-primary/5 rounded-xl p-3 space-y-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={collaborator.avatar_url || ""} />
                        <AvatarFallback>{collaborator.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-base font-bold truncate">{collaborator.name}</h2>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-[4px] font-medium">
                                CTV
                            </span>
                            <span>Chiết khấu: {discountPercent}%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg shadow-sm space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Tích lũy phiên này</span>
                        <span className="font-bold text-primary">{totalQuantity} SP</span>
                    </div>
                    <Progress value={(totalQuantity / 20) * 100} className="h-1.5" />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Đã có: {accumulatedQuantity}</span>
                        <span>Đang chọn: {currentCartQuantity}</span>
                    </div>
                    {sessionEnd && (
                        <p className="text-[10px] text-muted-foreground pt-1 border-t mt-1">
                            Kết thúc phiên: {new Date(sessionEnd).toLocaleDateString("vi-VN")}
                        </p>
                    )}
                </div>
            </div>

            {/* Wallet Card */}
            <Card className="border-none shadow-md bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xs font-medium opacity-90">Số dư khả dụng</h3>
                        <Wallet className="h-3.5 w-3.5 opacity-80" />
                    </div>
                    <div className="text-2xl font-bold mb-3">
                        {formatPrice(collaborator.wallet_balance)}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1 h-8 text-xs bg-white/20 hover:bg-white/30 border-none text-white"
                            onClick={onOpenWithdraw}
                        >
                            <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                            Rút tiền
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1 h-8 text-xs bg-white/20 hover:bg-white/30 border-none text-white"
                            onClick={onOpenBankInfo}
                        >
                            <Landmark className="h-3.5 w-3.5 mr-1.5" />
                            Ngân hàng
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
                <Card className="bg-card shadow-sm rounded-lg">
                    <CardHeader className="p-3 pb-1">
                        <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Doanh số</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 relative">
                        <div className="text-base font-bold">{formatPrice(totalSales)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-card shadow-sm rounded-lg">
                    <CardHeader className="p-3 pb-1">
                        <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Hoa hồng</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 relative">
                        <div className="text-base font-bold">{formatPrice(totalCommission)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-card shadow-sm rounded-lg col-span-2">
                    <CardHeader className="p-3 pb-1">
                        <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Đơn đã duyệt</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <div className="flex items-center justify-between">
                            <div className="text-xl font-bold">{approvedOrdersCount}</div>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Blog Section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                <h3 className="font-semibold mb-1 text-sm text-amber-800 dark:text-amber-200">Blog của tôi về rượu vang</h3>
                <p className="text-xs text-muted-foreground mb-2">Quản lý bài viết</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                        onClick={onViewArticles}
                    >
                        Bài viết của tôi
                    </Button>
                    <Button
                        size="sm"
                        className="flex-1 h-8 text-xs bg-amber-500 hover:bg-amber-600 text-white"
                        onClick={onCreateArticle}
                    >
                        + Viết bài mới
                    </Button>
                </div>
            </div>

            {/* Commission Tiers Button */}
            <button
                onClick={() => setIsTiersModalOpen(true)}
                className="w-full bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-lg p-3 border border-violet-200 dark:border-violet-800 flex items-center justify-between hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/40 dark:hover:to-purple-900/40 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    <span className="font-semibold text-sm text-violet-800 dark:text-violet-200">Bậc Hoa Hồng</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{discountPercent}%</span>
                    <ChevronRight className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
            </button>

            {/* Commission Tiers Modal */}
            <Dialog open={isTiersModalOpen} onOpenChange={setIsTiersModalOpen}>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            Bậc Hoa Hồng
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 p-3 rounded-lg">
                            <p className="font-medium">📌 Lưu ý về tích lũy hoa hồng:</p>
                            <ul className="list-disc list-inside ml-2 space-y-0.5">
                                <li>Số lượng sản phẩm được cộng dồn qua các đơn hàng</li>
                                <li>Phiên tích lũy có hiệu lực trong 30 ngày kể từ đơn hàng đầu tiên</li>
                                <li>Sau 30 ngày, phiên mới sẽ bắt đầu và số lượng tích lũy được đặt lại về 0</li>
                                <li>Mức giảm giá được áp dụng theo bậc cao nhất mà bạn đạt được</li>
                            </ul>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left px-3 py-2 font-medium">Số lượng sản phẩm</th>
                                        <th className="text-right px-3 py-2 font-medium">% Hoa hồng</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {commissionTiers.map((tier) => {
                                        const isCurrentTier = totalQuantity >= tier.min_quantity &&
                                            (tier.max_quantity === null || totalQuantity <= tier.max_quantity);
                                        return (
                                            <tr
                                                key={tier.id}
                                                className={isCurrentTier ? "bg-primary/10 font-medium" : ""}
                                            >
                                                <td className="px-3 py-2.5">
                                                    {tier.max_quantity
                                                        ? `${tier.min_quantity} - ${tier.max_quantity} sản phẩm`
                                                        : `Từ ${tier.min_quantity} sản phẩm trở lên`
                                                    }
                                                    {isCurrentTier && <span className="ml-1.5 text-primary text-xs">● Bậc hiện tại</span>}
                                                </td>
                                                <td className="px-3 py-2.5 text-right font-bold text-primary">
                                                    {tier.commission_percent}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="text-center text-xs text-muted-foreground">
                            Bạn đã tích lũy <span className="font-bold text-primary">{totalQuantity}</span> sản phẩm trong phiên này
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
