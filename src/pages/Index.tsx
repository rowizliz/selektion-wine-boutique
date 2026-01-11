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
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "SÉLECTION Wine Boutique",
          "url": "https://selection.com.vn",
          "logo": "https://selection.com.vn/favicon.png",
          "sameAs": [
            "https://www.facebook.com/selection.wines",
            "https://www.instagram.com/selection.wine.vn"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+84-906-777-377",
            "contactType": "customer service",
            "areaServed": "VN"
          }
        }}
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
