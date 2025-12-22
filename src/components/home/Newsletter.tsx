import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Cảm ơn bạn đã đăng ký",
        description: "Bạn sẽ nhận được thông tin về các loại rượu mới nhất.",
      });
      setEmail("");
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
              type="email"
              placeholder="Địa chỉ email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-background/30 text-background placeholder:text-background/50 focus:border-background h-12 px-4"
              required
            />
            <Button 
              type="submit" 
              variant="outline"
              className="bg-background text-foreground hover:bg-background/90 border-background h-12"
            >
              Đăng Ký
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
