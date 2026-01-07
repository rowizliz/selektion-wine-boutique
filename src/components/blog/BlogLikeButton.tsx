import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserLike, useLikesCount, useBlogInteractions } from "@/hooks/useBlogInteractions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface BlogLikeButtonProps {
  articleId: string;
  className?: string;
}

const BlogLikeButton = ({ articleId, className }: BlogLikeButtonProps) => {
  const { data: userLike, isLoading: isLoadingLike } = useUserLike(articleId);
  const { data: likesCount } = useLikesCount(articleId);
  const { toggleLike } = useBlogInteractions();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);

  const isLiked = !!userLike;

  const handleClick = async () => {
    try {
      setIsAnimating(true);
      await toggleLike.mutateAsync({ articleId, isLiked });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thực hiện",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleClick}
      disabled={isLoadingLike || toggleLike.isPending}
      className={cn(
        "gap-2 transition-all",
        isLiked && "bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:border-red-800",
        className
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all",
          isLiked && "fill-red-500 text-red-500",
          isAnimating && "scale-125"
        )}
      />
      <span>{likesCount || 0}</span>
    </Button>
  );
};

export default BlogLikeButton;
