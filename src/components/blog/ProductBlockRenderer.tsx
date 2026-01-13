import { Link } from "react-router-dom";
import { Wine, ExternalLink } from "lucide-react";
import { useWine } from "@/hooks/useWines";

interface ProductBlockRendererProps {
    productId: string;
    fallbackName?: string;
    fallbackImage?: string;
    fallbackPrice?: string;
}

const ProductBlockRenderer = ({
    productId,
    fallbackName,
    fallbackImage,
    fallbackPrice
}: ProductBlockRendererProps) => {
    const { data: wine, isLoading } = useWine(productId);

    // Use live data if available, otherwise fallback
    const name = wine?.name || fallbackName || "Sản phẩm";
    const image = wine?.image_url || fallbackImage;
    const price = wine?.price || fallbackPrice;
    const origin = wine?.origin;
    const grapes = wine?.grapes;
    const tastingNotes = wine?.tasting_notes;
    const flavorNotes = wine?.flavor_notes;

    if (isLoading) {
        return (
            <div className="my-8 not-prose">
                <div className="border border-border rounded-lg overflow-hidden bg-card animate-pulse p-4">
                    <div className="flex gap-4 items-start">
                        <div className="w-20 h-28 bg-muted rounded flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-5 bg-muted rounded w-2/3" />
                            <div className="h-4 bg-muted rounded w-1/2" />
                            <div className="flex gap-1">
                                <div className="h-5 bg-muted rounded-full w-14" />
                                <div className="h-5 bg-muted rounded-full w-14" />
                            </div>
                            <div className="h-5 bg-muted rounded w-20" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="my-8 not-prose">
            <Link
                to={`/collection/${productId}`}
                className="block border border-border rounded-lg bg-card hover:border-primary/50 hover:shadow-md transition-all group overflow-hidden"
            >
                <div className="flex gap-4 p-4">
                    {/* Wine Image - Compact */}
                    <div className="w-20 flex-shrink-0 flex items-center justify-center">
                        {image ? (
                            <img
                                src={image}
                                alt={name}
                                className="w-full h-28 object-contain"
                            />
                        ) : (
                            <div className="w-full h-28 bg-muted/50 rounded flex items-center justify-center">
                                <Wine className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                        )}
                    </div>

                    {/* Wine Details - Compact */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        {/* Name */}
                        <h4 className="font-serif text-base sm:text-lg font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {name}
                        </h4>

                        {/* Origin & Grapes */}
                        {(origin || grapes) && (
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1">
                                {origin}{origin && grapes && " • "}{grapes}
                            </p>
                        )}

                        {/* Flavor Notes - Compact badges */}
                        {flavorNotes && flavorNotes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {flavorNotes.slice(0, 4).map((note, i) => (
                                    <span
                                        key={i}
                                        className="px-1.5 py-0.5 text-[10px] sm:text-xs bg-muted text-muted-foreground rounded"
                                    >
                                        {note}
                                    </span>
                                ))}
                                {flavorNotes.length > 4 && (
                                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                                        +{flavorNotes.length - 4}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Tasting Notes - One line */}
                        {tastingNotes && (
                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1 italic">
                                {tastingNotes}
                            </p>
                        )}

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                            <span className="text-base sm:text-lg font-bold text-primary">
                                {price}
                            </span>
                            <span className="text-xs font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className="h-3 w-3" />
                                Xem chi tiết
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductBlockRenderer;
