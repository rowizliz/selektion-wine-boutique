import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <>
      <Helmet>
        <title>Về Chúng Tôi | SÉLECTION</title>
        <meta 
          name="description" 
          content="Tìm hiểu về SÉLECTION - niềm đam mê tuyển chọn những chai rượu vang đặc biệt từ Pháp và Ý." 
        />
      </Helmet>

      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <p className="text-xs font-sans tracking-[0.3em] uppercase text-muted-foreground mb-6">
                Câu Chuyện Của Chúng Tôi
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-tight mb-12">
                Niềm đam mê về<br />
                <span className="italic">rượu vang đặc biệt</span>
              </h1>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-serif font-light">
                  Khởi Đầu
                </h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    Sélection được thành lập với một niềm tin đơn giản nhưng sâu sắc: 
                    mỗi chai rượu vang đều chứa đựng trong đó một câu chuyện về vùng đất, 
                    về người làm rượu và những truyền thống đã định hình nên nó.
                  </p>
                  <p>
                    Chúng tôi đi qua những vùng rượu nổi tiếng của Pháp và Ý, 
                    từ những ngọn đồi đầy nắng của Bordeaux đến những vườn nho 
                    cổ kính của Sardinia, tìm kiếm những nhà sản xuất chia sẻ 
                    sự cống hiến của chúng tôi cho sự chân thực và xuất sắc.
                  </p>
                </div>
              </div>
              <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-serif font-light">
                  Triết Lý Của Chúng Tôi
                </h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    Chúng tôi tin rằng rượu vang tuyệt vời nên dễ tiếp cận. 
                    Bộ sưu tập của chúng tôi trải dài từ rượu bàn hàng ngày 
                    đến những chai đặc biệt cho các dịp quan trọng, mỗi chai 
                    được chọn lọc cẩn thận vì tính cách và giá trị của nó.
                  </p>
                  <p>
                    Dù bạn là người sành rượu hay mới bắt đầu hành trình 
                    khám phá rượu vang, chúng tôi ở đây để hướng dẫn bạn 
                    tìm đến chai rượu yêu thích tiếp theo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <p className="text-xs font-sans tracking-[0.3em] uppercase text-muted-foreground mb-6 text-center">
                Giá Trị Của Chúng Tôi
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-center mb-16">
                Những Gì Chúng Tôi Đại Diện
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                {[
                  {
                    title: "Chất Lượng",
                    description: "Mỗi chai rượu đều được thử nếm và chọn lọc cá nhân để đáp ứng tiêu chuẩn khắt khe của chúng tôi.",
                  },
                  {
                    title: "Chân Thực",
                    description: "Chúng tôi làm việc trực tiếp với các nhà sản xuất tôn vinh phương pháp làm rượu truyền thống.",
                  },
                  {
                    title: "Dịch Vụ",
                    description: "Hướng dẫn cá nhân để giúp bạn khám phá những chai rượu phù hợp với sở thích của bạn.",
                  },
                ].map((value, index) => (
                  <div 
                    key={value.title} 
                    className="text-center opacity-0 animate-slide-up"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <h3 className="text-xl font-serif mb-4">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
