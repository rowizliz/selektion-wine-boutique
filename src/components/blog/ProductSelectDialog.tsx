import { useState } from "react";
import { Search, Wine, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWines, WineDB } from "@/hooks/useWines";

interface ProductSelectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (product: {
        productId: string;
        productName: string;
        productImage?: string;
        productPrice?: string;
        productOrigin?: string;
        productGrapes?: string;
        productDescription?: string;
        productTastingNotes?: string;
        productFlavorNotes?: string[];
    }) => void;
}

const ProductSelectDialog = ({ open, onOpenChange, onSelect }: ProductSelectDialogProps) => {
    const { data: wines = [], isLoading } = useWines();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredWines = wines.filter((wine) =>
        wine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (wine: WineDB) => {
        onSelect({
            productId: wine.id,
            productName: wine.name,
            productImage: wine.image_url || undefined,
            productPrice: wine.price,
            productOrigin: wine.origin,
            productGrapes: wine.grapes,
            productDescription: wine.description,
            productTastingNotes: wine.tasting_notes || undefined,
            productFlavorNotes: wine.flavor_notes || undefined,
        });
        onOpenChange(false);
        setSearchTerm("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wine className="h-5 w-5" />
                        Chọn sản phẩm rượu vang
                    </DialogTitle>
                </DialogHeader>

                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm rượu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    {searchTerm && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                            onClick={() => setSearchTerm("")}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Wine List */}
                <ScrollArea className="h-[400px] pr-4">
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Đang tải danh sách sản phẩm...
                        </div>
                    ) : filteredWines.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Không tìm thấy sản phẩm nào
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredWines.map((wine) => (
                                <button
                                    key={wine.id}
                                    onClick={() => handleSelect(wine)}
                                    className="w-full flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                                >
                                    {wine.image_url ? (
                                        <img
                                            src={wine.image_url}
                                            alt={wine.name}
                                            className="w-20 h-20 object-contain rounded bg-muted flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
                                            <Wine className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm">{wine.name}</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">{wine.origin} • {wine.grapes}</p>
                                        {wine.flavor_notes && wine.flavor_notes.length > 0 && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                🍷 {wine.flavor_notes.slice(0, 3).join(", ")}
                                            </p>
                                        )}
                                        <p className="text-sm font-semibold text-primary mt-1">{wine.price}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ProductSelectDialog;
