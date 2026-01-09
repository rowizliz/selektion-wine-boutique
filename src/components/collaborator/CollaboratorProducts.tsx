import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, ShoppingCart, Plus, Minus, ImageIcon, X } from "lucide-react";

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

interface LocalCartItem {
    wine_id: string;
    wine_name: string;
    original_price: number;
    collaborator_price: number;
    quantity: number;
}

interface CollaboratorProductsProps {
    products: Product[];
    cart: LocalCartItem[];
    onAddToCart: (product: Product) => void;
    onUpdateQuantity: (id: string, delta: number) => void;
    onViewCart: () => void;
    getDiscountedPrice: (price: number) => number;
}

export const CollaboratorProducts = ({
    products,
    cart,
    onAddToCart,
    onUpdateQuantity,
    onViewCart,
    getDiscountedPrice,
}: CollaboratorProductsProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);

    const filteredProducts = useMemo(() => {
        if (!searchTerm.trim()) return products;
        const term = searchTerm.toLowerCase();
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(term) ||
                p.category?.toLowerCase().includes(term) ||
                p.country?.toLowerCase().includes(term)
        );
    }, [products, searchTerm]);

    const getCartQuantity = (productId: string) => {
        return cart.find((item) => item.wine_id === productId)?.quantity || 0;
    };

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === "string" ? parseInt(price.replace(/[^\d]/g, "")) : price;
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(numPrice);
    };

    const getNumericPrice = (price: number | string) => {
        return typeof price === "string" ? parseInt(price.replace(/[^\d]/g, "")) : price;
    };

    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="flex-1 overflow-y-auto pb-16">
            {/* Search & Cart Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-3 py-2 border-b">
                <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm..."
                            className="pl-7 h-8 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" className="h-8 px-2 relative" onClick={onViewCart}>
                        <ShoppingCart className="h-4 w-4" />
                        {totalCartItems > 0 && (
                            <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 text-[10px] flex items-center justify-center">
                                {totalCartItems}
                            </Badge>
                        )}
                    </Button>
                </div>
            </div>

            {/* Product Grid - Responsive */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-card rounded-lg overflow-hidden border shadow-sm">
                        {/* Fixed height image container */}
                        <div
                            className="relative h-24 w-full bg-muted/30 flex items-center justify-center p-1.5 cursor-pointer"
                            onClick={() => product.image_url && setSelectedImage({ url: product.image_url, name: product.name })}
                        >
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-full w-auto object-contain"
                                />
                            ) : (
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            )}
                            {product.inventory_quantity <= 0 && (
                                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                    <Badge variant="destructive" className="text-[9px] px-1 h-4">Hết</Badge>
                                </div>
                            )}
                        </div>

                        {/* Fixed height text/action container */}
                        <div className="p-1.5 h-[72px] flex flex-col">
                            {/* Product name - fixed 2 lines */}
                            <h3 className="font-medium text-[10px] leading-tight line-clamp-2 h-[24px] mb-1">
                                {product.name}
                            </h3>

                            {/* Price row */}
                            <div className="flex items-baseline gap-1 mb-1.5">
                                <span className="text-[11px] font-bold text-primary">
                                    {formatPrice(getDiscountedPrice(getNumericPrice(product.price)))}
                                </span>
                                <span className="text-[8px] text-muted-foreground line-through">
                                    {formatPrice(product.price)}
                                </span>
                            </div>

                            {/* Action buttons */}
                            <div className="mt-auto">
                                {getCartQuantity(product.id) > 0 ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            className="h-5 w-5 rounded-full border border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                            onClick={() => onUpdateQuantity(product.id, -1)}
                                        >
                                            <Minus className="h-2.5 w-2.5" />
                                        </button>
                                        <span className="font-semibold text-[10px] w-3 text-center">
                                            {getCartQuantity(product.id)}
                                        </span>
                                        <button
                                            className="h-5 w-5 rounded-full border border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40"
                                            onClick={() => onUpdateQuantity(product.id, 1)}
                                            disabled={product.inventory_quantity <= getCartQuantity(product.id)}
                                        >
                                            <Plus className="h-2.5 w-2.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="w-full h-5 flex items-center justify-center gap-1 text-[9px] font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        onClick={() => onAddToCart(product)}
                                        disabled={product.inventory_quantity <= 0}
                                    >
                                        <Plus className="h-3 w-3" />
                                        <span>Thêm</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredProducts.length === 0 && (
                    <div className="col-span-3 text-center py-8 text-muted-foreground text-sm">
                        Không tìm thấy sản phẩm nào
                    </div>
                )}
            </div>

            {/* Image Zoom Dialog */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-[90vw] max-h-[90vh] p-2 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
                    {selectedImage && (
                        <>
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.name}
                                className="max-w-full max-h-[70vh] object-contain"
                            />
                            <p className="text-sm font-medium mt-2 text-center px-4">{selectedImage.name}</p>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
