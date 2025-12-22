import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Đã gửi tin nhắn",
      description: "Chúng tôi sẽ phản hồi bạn sớm nhất có thể.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Helmet>
        <title>Liên Hệ | SÉLECTION</title>
        <meta 
          name="description" 
          content="Liên hệ với SÉLECTION. Gửi câu hỏi về rượu vang, đặt hàng hoặc tìm hiểu thêm về bộ sưu tập của chúng tôi." 
        />
      </Helmet>

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
                  <h1 className="text-4xl md:text-5xl font-serif font-light mb-8">
                    Liên Hệ
                  </h1>
                  <p className="text-muted-foreground leading-relaxed mb-12">
                    Chúng tôi rất vui được nghe từ bạn. Dù bạn có câu hỏi về 
                    rượu vang, muốn đặt hàng, hay chỉ muốn trò chuyện về rượu, 
                    chúng tôi luôn sẵn sàng hỗ trợ.
                  </p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-sans tracking-widest uppercase mb-3">
                        Địa Chỉ
                      </h3>
                      <p className="text-muted-foreground">
                        127/15 Hoàng Diệu 2<br />
                        Linh Xuân, Thủ Đức<br />
                        TP. Hồ Chí Minh
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-sans tracking-widest uppercase mb-3">
                        Liên Hệ
                      </h3>
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
                      <h3 className="text-xs font-sans tracking-widest uppercase mb-3">
                        Giờ Làm Việc
                      </h3>
                      <p className="text-muted-foreground">
                        Thứ Hai – Thứ Bảy: 9:00 – 21:00<br />
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
                      <label 
                        htmlFor="name" 
                        className="block text-xs tracking-widest uppercase mb-3"
                      >
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
                      <label 
                        htmlFor="email" 
                        className="block text-xs tracking-widest uppercase mb-3"
                      >
                        Email
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
                      <label 
                        htmlFor="message" 
                        className="block text-xs tracking-widest uppercase mb-3"
                      >
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
                    <Button type="submit" variant="luxury" className="w-full">
                      Gửi Tin Nhắn
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
