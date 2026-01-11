import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedWines from "@/components/home/FeaturedWines";
import FeaturedGifts from "@/components/home/FeaturedGifts";
import AboutSection from "@/components/home/AboutSection";
import LatestBlogPosts from "@/components/home/LatestBlogPosts";
import Newsletter from "@/components/home/Newsletter";

const Index = () => {
  return (
    <>
      <SEO
        title="SÉLECTION - Rượu Vang Cao Cấp & Quà Tặng tại Thủ Đức"
        description="Quà tặng doanh nghiệp sang trọng cao cấp tại Thủ Đức, TP.HCM. Rượu vang tuyển chọn từ Pháp, Ý nhập khẩu. Giao hàng nhanh Bình Dương, Biên Hòa."
        type="website"
        keywords={[
          "rượu vang thủ đức", "rượu vang bình dương", "selection wine",
          "rượu vang cao cấp", "rượu vang tuyển chọn", "showroom rượu vang hcm",
          "cửa hàng rượu vang thủ đức", "mua rượu vang thủ đức"
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "LiquorStore",
          "name": "SÉLECTION Wine Boutique",
          "description": "Showroom rượu vang cao cấp tại Thủ Đức. Chuyên rượu vang tuyển chọn từ Pháp, Ý và quà tặng doanh nghiệp.",
          "image": "https://selection.com.vn/og-thumbnail.jpg",
          "url": "https://selection.com.vn",
          "telephone": "+84-906-777-377",
          "priceRange": "$$-$$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "127/15 Hoàng Diệu 2, Phường Linh Trung",
            "addressLocality": "Thủ Đức",
            "addressRegion": "TP. Hồ Chí Minh",
            "postalCode": "700000",
            "addressCountry": "VN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 10.8700,
            "longitude": 106.7720
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
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
          "areaServed": [
            { "@type": "City", "name": "Thủ Đức" },
            { "@type": "City", "name": "Bình Dương" },
            { "@type": "City", "name": "Biên Hòa" },
            { "@type": "City", "name": "TP. Hồ Chí Minh" }
          ],
          "sameAs": [
            "https://www.facebook.com/selection.wines",
            "https://www.instagram.com/selection.wine.vn",
            "https://www.google.com/maps/search/SÉLECTION+Wine+Boutique"
          ]
        }}
      />

      <Header />
      <main>
        <Hero />
        <FeaturedWines />
        <FeaturedGifts />
        <AboutSection />
        <LatestBlogPosts />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
};

export default Index;
