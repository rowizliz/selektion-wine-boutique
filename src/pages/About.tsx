import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About | SÉLECTION</title>
        <meta 
          name="description" 
          content="Learn about SÉLECTION - our passion for curating exceptional wines from France and Italy." 
        />
      </Helmet>

      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <p className="text-xs font-sans tracking-[0.3em] uppercase text-muted-foreground mb-6">
                Our Story
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-tight mb-12">
                A passion for<br />
                <span className="italic">exceptional wines</span>
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
                  The Beginning
                </h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    Sélection was founded with a simple yet profound belief: that every 
                    wine bottle holds within it a story of its land, its maker, and the 
                    traditions that shaped it.
                  </p>
                  <p>
                    We travel through the renowned wine regions of France and Italy, 
                    from the sun-drenched hills of Bordeaux to the ancient vineyards 
                    of Sardinia, seeking out producers who share our dedication to 
                    authenticity and excellence.
                  </p>
                </div>
              </div>
              <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-serif font-light">
                  Our Philosophy
                </h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    We believe that great wine should be accessible. Our collection 
                    spans from everyday table wines to special occasion bottles, 
                    each carefully selected for its character and value.
                  </p>
                  <p>
                    Whether you're a seasoned connoisseur or just beginning your 
                    wine journey, we're here to guide you to your next favorite bottle.
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
                Our Values
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-center mb-16">
                What We Stand For
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                {[
                  {
                    title: "Quality",
                    description: "Every wine is personally tasted and selected to meet our exacting standards.",
                  },
                  {
                    title: "Authenticity",
                    description: "We work directly with producers who honor traditional winemaking methods.",
                  },
                  {
                    title: "Service",
                    description: "Personal guidance to help you discover wines that match your preferences.",
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
