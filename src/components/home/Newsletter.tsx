import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSubmitContactMessage } from "@/hooks/useContactMessages";

const Newsletter = () => {
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const submitMessage = useSubmitContactMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setIsSubmitting(true);
    try {
      await submitMessage.mutateAsync({
        name: "Khách đăng ký nhận tin",
        email: contact.trim(),
        message: "user đăng ký nhận tin",
      });

      toast({
        title: "Cảm ơn bạn đã đăng ký",
        description: "Bạn sẽ nhận được thông tin về các loại rượu mới nhất.",
      });
      setContact("");
    } catch (error) {
      toast({
        title: "Đã xảy ra lỗi",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-foreground text-background">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-sans tracking-[0.3em] uppercase text-background/60 mb-4">
            Cập Nhật Tin Tức
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">
            Tham Gia Cộng Đồng
          </h2>
          <p className="text-background/70 mb-10 leading-relaxed">
            Đăng ký để nhận thông tin độc quyền về sản phẩm mới, 
            ưu đãi đặc biệt và gợi ý rượu vang.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Email hoặc số Zalo của bạn"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="flex-1 bg-transparent border-background/30 text-background placeholder:text-background/50 focus:border-background h-12 px-4"
              required
            />
            <Button 
              type="submit" 
              variant="outline"
              className="bg-background text-foreground hover:bg-background/90 border-background h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang gửi..." : "Đăng Ký"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
