import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import selectionCover from "@/assets/selection-cover.jpg";

const AboutSection = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div className="aspect-[4/5] overflow-hidden order-2 lg:order-1 group">
            <img 
              src={selectionCover} 
              alt="Sélection Wine & Gift Catalog" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <p className="text-xs font-sans tracking-[0.3em] uppercase text-muted-foreground">
              Triết Lý Của Chúng Tôi
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light leading-tight">
              Cam kết về<br />
              <span className="italic">sự xuất sắc</span>
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Sélection được sinh ra từ niềm đam mê khám phá những chai rượu vang 
                đặc biệt, mang trong mình câu chuyện về vùng đất. Chúng tôi đến tận 
                trái tim của Pháp và Ý, tìm kiếm những nhà sản xuất thủ công tạo ra 
                rượu vang với sự tận tâm và chân thực.
              </p>
              <p>
                Mỗi chai rượu trong bộ sưu tập đều được chọn lọc cá nhân, đảm bảo 
                rằng mọi chai đều đáp ứng tiêu chuẩn khắt khe về chất lượng, 
                đặc tính và giá trị.
              </p>
            </div>
            <div className="pt-4">
              <Button asChild variant="minimal" size="default">
                <Link to="/about">
                  Tìm Hiểu Thêm
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
