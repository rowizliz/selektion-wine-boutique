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
        title="Rượu Vang Thủ Đức | Selection Wine - Vang Cao Cấp Pháp & Ý"
        description="Showroom rượu vang cao cấp tại Thủ Đức, TP.HCM. Rượu vang tuyển chọn từ Pháp, Ý nhập khẩu chính hãng. Giao hàng nhanh Thủ Đức, Bình Dương, Biên Hòa. Quà tặng doanh nghiệp sang trọng."
        type="website"
        keywords={[
          "rượu vang thủ đức", "rượu vang bình dương", "selection wine",
          "rượu vang cao cấp", "rượu vang tuyển chọn", "showroom rượu vang hcm",
          "cửa hàng rượu vang thủ đức", "mua rượu vang thủ đức"
        ]}
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "name": "SÉLECTION Wine Boutique",
              "url": "https://selection.com.vn",
              "logo": "https://selection.com.vn/favicon.png",
              "sameAs": [
                "https://www.facebook.com/selection.wines",
                "https://www.instagram.com/selection.wine.vn"
              ]
            },
            {
              "@type": "LocalBusiness",
              "@id": "https://selection.com.vn/#business",
              "name": "SÉLECTION - Rượu Vang & Quà Tặng",
              "description": "Showroom rượu vang cao cấp tại Thủ Đức. Chuyên rượu vang tuyển chọn từ Pháp, Ý và quà tặng doanh nghiệp.",
              "url": "https://selection.com.vn",
              "telephone": "+84-906-777-377",
              "priceRange": "$$-$$$",
              "image": "https://selection.com.vn/og-thumbnail.jpg",
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
              ]
            }
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
