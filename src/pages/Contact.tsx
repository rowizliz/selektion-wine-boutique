import { useState } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSubmitContactMessage } from "@/hooks/useContactMessages";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const submitMessage = useSubmitContactMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitMessage.mutateAsync(formData);
      toast({
        title: "Đã gửi tin nhắn",
        description: "Chúng tôi sẽ phản hồi bạn sớm nhất có thể.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi tin nhắn. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Liên Hệ | SÉLECTION Wine - Rượu Vang & Quà Tặng"
        description="Liên hệ với SÉLECTION. Showroom rượu vang tại Thủ Đức, TP.HCM. Giải đáp thắc mắc, tư vấn đặt hàng và quà tặng doanh nghiệp."
      />

      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                {/* Contact Info */}
                <div>
                  <p className="text-xs font-sans tracking-[0.3em] uppercase text-muted-foreground mb-4">
                    Liên Hệ Với Chúng Tôi
                  </p>
                  <h1 className="text-4xl md:text-5xl font-serif font-light mb-8">Liên Hệ</h1>
                  <p className="text-muted-foreground leading-relaxed mb-12">
                    Chúng tôi rất vui được nghe từ bạn. Dù bạn có câu hỏi về rượu vang, muốn đặt hàng, hay chỉ muốn trò
                    chuyện về rượu, chúng tôi luôn sẵn sàng hỗ trợ.
                  </p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-sans tracking-widest uppercase mb-3">Địa Chỉ</h3>
                      <p className="text-muted-foreground">
                        127/15 Hoàng Diệu 2<br />
                        Phường Linh Trung, Thủ Đức
                        <br />
                        TP. Hồ Chí Minh
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-sans tracking-widest uppercase mb-3">Liên Hệ</h3>
                      <p className="text-muted-foreground">
                        <a
                          href="https://zalo.me/0906777377"
                          className="hover:text-foreground transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Zalo: 0906 777 377
                        </a>
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-sans tracking-widest uppercase mb-3">Giờ Làm Việc</h3>
                      <p className="text-muted-foreground">
                        Thứ Hai – Thứ Bảy: 9:00 – 21:00
                        <br />
                        Chủ Nhật: 10:00 – 18:00
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-secondary p-8 md:p-12">
                  <h2 className="text-2xl font-serif mb-8">Gửi Tin Nhắn</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-xs tracking-widest uppercase mb-3">
                        Họ Tên
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-background border-border h-12"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs tracking-widest uppercase mb-3">
                        Email hoặc Số Điện Thoại
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-background border-border h-12"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-xs tracking-widest uppercase mb-3">
                        Nội Dung
                      </label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-background border-border min-h-[150px] resize-none"
                        required
                      />
                    </div>
                    <Button type="submit" variant="luxury" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Đang gửi..." : "Gửi Tin Nhắn"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Google Map Section */}
        <section className="w-full h-[400px] md:h-[500px] bg-secondary/20">
          <iframe
            title="SÉLECTION Wine Boutique Location"
            src="https://maps.google.com/maps?q=S%C3%A9lection%20%7C%20R%C6%B0%E1%BB%A3u%20Vang%20%26%20Qu%C3%A0%20T%E1%BA%B7ng%20127%2F15%20Ho%C3%A0ng%20Di%E1%BB%87u%202&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
