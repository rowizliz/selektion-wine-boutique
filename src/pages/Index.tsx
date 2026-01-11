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
        title="SÉLECTION - Rượu Vang Cao Cấp & Quà Tặng tại Thủ Đức"
        description="Quà tặng doanh nghiệp sang trọng cao cấp tại Thủ Đức, TP.HCM. Rượu vang tuyển chọn từ Pháp, Ý nhập khẩu. Giao hàng nhanh Bình Dương, Biên Hòa."
        type="website"
        schema={{
          "@context": "https://schema.org",
          "@type": "LiquorStore",
          "name": "SÉLECTION Wine Boutique",
          "image": "https://selection.com.vn/og-thumbnail.jpg",
          "url": "https://selection.com.vn",
          "telephone": "+84906777377",
          "priceRange": "$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "127/15 Hoàng Diệu 2, Phường Linh Trung",
            "addressLocality": "Thủ Đức",
            "addressRegion": "Thành phố Hồ Chí Minh",
            "postalCode": "700000",
            "addressCountry": "VN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 10.8521,
            "longitude": 106.7725
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
              ],
              "opens": "09:00",
              "closes": "21:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": "Sunday",
              "opens": "10:00",
              "closes": "18:00"
            }
          ],
          "sameAs": [
            "https://www.facebook.com/selection.wines",
            "https://www.instagram.com/selection.wine.vn"
          ]
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
