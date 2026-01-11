import SEO from "@/components/SEO";
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
      <SEO
        title="SÉLECTION Wine | Rượu Vang Tuyển Lựa Từ Pháp & Ý (Thủ Đức - HCM)"
        description="Khám phá thế giới Selection Wine với những chai vang tuyển lựa kỹ càng từ Pháp và Ý. Showroom rượu vang uy tín tại Thủ Đức, TP.HCM. Chuyên quà tặng doanh nghiệp và các dòng vang tuyển chọn."
        type="website"
      />

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
