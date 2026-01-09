import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface LocalCartItem {
    wine_id: string;
    wine_name: string;
    original_price: number;
    collaborator_price: number;
    quantity: number;
}

interface CartDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cart: LocalCartItem[];
    onUpdateQuantity: (id: string, delta: number) => void;
    onSubmitOrder: (customerInfo: any) => Promise<void>;
    getDiscountedPrice: (price: number) => number;
}

export const CartDialog = ({
    open,
    onOpenChange,
    cart,
    onUpdateQuantity,
    onSubmitOrder,
    getDiscountedPrice,
}: CartDialogProps) => {
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        phone: "",
        address: "",
        notes: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalAmount = cart.reduce(
        (sum, item) => sum + getDiscountedPrice(item.original_price) * item.quantity,
        0
    );

    const totalOriginal = cart.reduce(
        (sum, item) => sum + item.original_price * item.quantity,
        0
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    const handleSubmit = async () => {
        if (!customerInfo.name || !customerInfo.phone) {
            toast.error("Vui lòng nhập tên và số điện thoại khách hàng");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmitOrder(customerInfo);
            setCustomerInfo({ name: "", phone: "", address: "", notes: "" });
            onOpenChange(false);
        } catch (error) {
            // Error handling usually done in parent but good to catch here too if needed
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-4 py-3 border-b">
                    <DialogTitle>Giỏ hàng ({cart.reduce((a, b) => a + b.quantity, 0)})</DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 px-4">
                    <div className="space-y-4 py-4">
                        {cart.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                Giỏ hàng trống
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cart.map((item) => (
                                    <div key={item.wine_id} className="flex gap-3 bg-muted/30 p-2 rounded-lg border">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm line-clamp-1">{item.wine_name}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {formatPrice(getDiscountedPrice(item.original_price))}
                                                {getDiscountedPrice(item.original_price) < item.original_price &&
                                                    <span className="ml-1 line-through opacity-70">{formatPrice(item.original_price)}</span>
                                                }
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => onUpdateQuantity(item.wine_id, -1)}
                                            >
                                                {item.quantity === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                                            </Button>
                                            <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => onUpdateQuantity(item.wine_id, 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>Tạm tính:</span>
                                        <span>{formatPrice(totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                        <span>Tiết kiệm:</span>
                                        <span>{formatPrice(totalOriginal - totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {cart.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <h3 className="font-medium text-sm">Thông tin khách hàng</h3>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="name" className="text-xs">Tên khách hàng *</Label>
                                            <Input
                                                id="name"
                                                className="h-8 text-sm"
                                                value={customerInfo.name}
                                                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="phone" className="text-xs">Số điện thoại *</Label>
                                            <Input
                                                id="phone"
                                                className="h-8 text-sm"
                                                value={customerInfo.phone}
                                                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="address" className="text-xs">Địa chỉ giao hàng</Label>
                                        <Input
                                            id="address"
                                            className="h-8 text-sm"
                                            value={customerInfo.address}
                                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="notes" className="text-xs">Ghi chú</Label>
                                        <Textarea
                                            id="notes"
                                            className="min-h-[60px] text-sm"
                                            value={customerInfo.notes}
                                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {cart.length > 0 && (
                    <div className="p-4 border-t bg-background">
                        <Button
                            className="w-full"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                `Đặt hàng • ${formatPrice(totalAmount)}`
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
