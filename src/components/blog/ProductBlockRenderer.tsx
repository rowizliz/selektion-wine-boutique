import { Link } from "react-router-dom";
import { Wine, ArrowRight } from "lucide-react";
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
}: ProductBlockRendererProps) => {
    const { data: wine, isLoading } = useWine(productId);

    const name = wine?.name || fallbackName || "Sản phẩm";
    const image = wine?.image_url || fallbackImage;
    const price = wine?.price;
    const origin = wine?.origin;
    const grapes = wine?.grapes;
    const vintage = wine?.vintage;
    const flavorNotes = wine?.flavor_notes;

    if (isLoading) {
        return (
            <div className="my-8 not-prose">
                <div className="border border-border/50 rounded-xl p-5 animate-pulse">
                    <div className="flex gap-6">
                        <div className="w-28 h-36 bg-muted rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-3 py-2">
                            <div className="h-5 bg-muted rounded w-2/3" />
                            <div className="h-3 bg-muted rounded w-1/4" />
                            <div className="h-3 bg-muted rounded w-full" />
                            <div className="h-6 bg-muted rounded w-1/3 mt-3" />
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
                className="block border border-border/40 rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300 group bg-card"
            >
                <div className="flex">
                    {/* Ảnh chai rượu - nền gradient nhẹ */}
                    <div className="w-32 sm:w-40 flex-shrink-0 bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center p-4">
                        {image ? (
                            <img
                                src={image}
                                alt={`Rượu vang ${name}`}
                                className="w-auto h-40 sm:h-48 object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <Wine className="h-16 w-16 text-neutral-300" />
                        )}
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center">
                        {/* Tên rượu */}
                        <h3 className="font-serif text-lg sm:text-xl text-foreground leading-tight group-hover:text-primary transition-colors">
                            {name}
                            {vintage && (
                                <span className="text-muted-foreground font-light ml-2">
                                    {vintage}
                                </span>
                            )}
                        </h3>

                        {/* Origin */}
                        {origin && (
                            <p className="text-xs tracking-[0.2em] text-primary/70 uppercase mt-2 font-medium">
                                {origin}
                            </p>
                        )}

                        {/* Grapes */}
                        {grapes && (
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                                {grapes}
                            </p>
                        )}

                        {/* Flavor notes - compact badges */}
                        {flavorNotes && flavorNotes.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {flavorNotes.slice(0, 3).map((note, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-0.5 text-[10px] bg-muted text-muted-foreground rounded-full"
                                    >
                                        {note}
                                    </span>
                                ))}
                                {flavorNotes.length > 3 && (
                                    <span className="text-[10px] text-muted-foreground px-1">
                                        +{flavorNotes.length - 3}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Price + CTA */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                            <span className="text-xl font-semibold text-foreground">
                                {price}
                            </span>
                            <span className="text-sm text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Xem chi tiết
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductBlockRenderer;
