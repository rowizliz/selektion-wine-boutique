import { useState } from "react";
import { User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useBlogComments, useBlogInteractions } from "@/hooks/useBlogInteractions";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface BlogCommentsProps {
  articleId: string;
  isAuthenticated: boolean;
}

const BlogComments = ({ articleId, isAuthenticated }: BlogCommentsProps) => {
  const [comment, setComment] = useState("");
  const { data: comments, isLoading } = useBlogComments(articleId);
  const { addComment } = useBlogInteractions();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addComment.mutateAsync({ articleId, content: comment.trim() });
      setComment("");
      toast({
        title: "Thành công",
        description: "Bình luận của bạn đã được gửi",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể gửi bình luận",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-serif">Bình Luận ({comments?.length || 0})</h3>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            className="min-h-[100px] resize-none"
          />
          <Button
            type="submit"
            disabled={!comment.trim() || addComment.isPending}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Gửi Bình Luận
          </Button>
        </form>
      ) : (
        <p className="text-muted-foreground text-sm">
          Vui lòng <a href="/auth" className="underline hover:text-foreground">đăng nhập</a> để bình luận.
        </p>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="text-muted-foreground">Đang tải bình luận...</div>
      ) : comments?.length === 0 ? (
        <p className="text-muted-foreground text-sm">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
      ) : (
        <div className="space-y-6">
          {comments?.map((c) => (
            <div key={c.id} className="flex gap-4">
              <div className="flex-shrink-0">
                {c.user?.avatar_url ? (
                  <img
                    src={c.user.avatar_url}
                    alt={c.user.display_name || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {c.user?.display_name || "Ẩn danh"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(c.created_at), "dd MMM yyyy, HH:mm", { locale: vi })}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogComments;
