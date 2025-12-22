import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedWines from "@/components/home/FeaturedWines";
import AboutSection from "@/components/home/AboutSection";
import Newsletter from "@/components/home/Newsletter";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>SÉLECTION | Fine Wines from France & Italy</title>
        <meta 
          name="description" 
          content="Discover exceptional wines from the finest vineyards of France and Italy. Curated selection of premium wines in Ho Chi Minh City." 
        />
      </Helmet>

      <Header />
      <main>
        <Hero />
        <FeaturedWines />
        <AboutSection />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
};

export default Index;
