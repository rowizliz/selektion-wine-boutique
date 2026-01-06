import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedWines from "@/components/home/FeaturedWines";
import FeaturedGifts from "@/components/home/FeaturedGifts";
import AboutSection from "@/components/home/AboutSection";
import Newsletter from "@/components/home/Newsletter";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>SÉLECTION | Rượu Vang Hảo Hạng Từ Pháp & Ý</title>
        <meta 
          name="description" 
          content="Khám phá những chai rượu vang đặc biệt từ những vườn nho danh tiếng của Pháp và Ý. Bộ sưu tập rượu vang cao cấp tại TP. Hồ Chí Minh." 
        />
      </Helmet>

      <Header />
      <main>
        <Hero />
        <FeaturedWines />
        <FeaturedGifts />
        <AboutSection />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
};

export default Index;
