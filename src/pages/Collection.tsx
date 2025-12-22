import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

// Wine images
import terresRaresImg from "@/assets/wines/terres-rares.jpg";
import vigneLouracImg from "@/assets/wines/vigne-lourac.jpg";
import beauMaraisImg from "@/assets/wines/beau-marais.jpg";
import robertoRigaImg from "@/assets/wines/roberto-riga.jpg";
import berviniBrutImg from "@/assets/wines/bervini-brut.jpg";
import chateauHautBazignanImg from "@/assets/wines/chateau-haut-bazignan.jpg";
import chateauLeBordieuImg from "@/assets/wines/chateau-le-bordieu.jpg";
import massoAnticoImg from "@/assets/wines/masso-antico.jpg";

interface Wine {
  id: string;
  name: string;
  origin: string;
  grapes: string;
  price: string;
  description: string;
  image: string;
}

const wines: Wine[] = [
  {
    id: "1",
    name: "Terres Rares 2022",
    origin: "Côtes du Tarn, France",
    grapes: "Gamay, Braucol",
    price: "780,000₫",
    description: "Elegant red wine with notes of strawberry, cherry, banana, and raspberry.",
    image: terresRaresImg,
  },
  {
    id: "2",
    name: "Vigné-Lourac Merlot Prestige",
    origin: "Gaillac, France",
    grapes: "Merlot",
    price: "780,000₫",
    description: "Deep ruby color with aromas of black fruits, plum, raspberry, and cocoa.",
    image: vigneLouracImg,
  },
  {
    id: "3",
    name: "Beau Marais Reserve Selection",
    origin: "Costières de Nîmes, France",
    grapes: "Blend",
    price: "450,000₫",
    description: "Approachable wine with honey and earthy notes, perfect for daily enjoyment.",
    image: beauMaraisImg,
  },
  {
    id: "4",
    name: "Roberto Riga Rosso",
    origin: "Sardegna, Italy",
    grapes: "Cannonau",
    price: "520,000₫",
    description: "Traditional Italian style with cherry, wild herbs, and tobacco undertones.",
    image: robertoRigaImg,
  },
  {
    id: "5",
    name: "Bervini Brut",
    origin: "Friuli-Venezia Giulia, Italy",
    grapes: "Glera",
    price: "680,000₫",
    description: "Elegant sparkling wine with citrus, honey, orange peel, and green apple.",
    image: berviniBrutImg,
  },
  {
    id: "6",
    name: "Château Haut Bazignan 2020",
    origin: "Bordeaux, France",
    grapes: "Cabernet Sauvignon, Merlot",
    price: "650,000₫",
    description: "Classic Bordeaux with raspberry, blackberry, and musk notes.",
    image: chateauHautBazignanImg,
  },
  {
    id: "7",
    name: "Château Le Bordieu 2020",
    origin: "Bordeaux Supérieur, France",
    grapes: "Merlot, Cabernet Sauvignon",
    price: "650,000₫",
    description: "Rich with black plum, cedar, butter, tobacco, and cherry complexity.",
    image: chateauLeBordieuImg,
  },
  {
    id: "8",
    name: "Masso Antico Primitivo",
    origin: "Puglia, Italy",
    grapes: "Primitivo",
    price: "650,000₫",
    description: "Lush Appassimento style with dried fruit intensity and velvety texture.",
    image: massoAnticoImg,
  },
];

const Collection = () => {
  return (
    <>
      <Helmet>
        <title>Wine Collection | SÉLECTION</title>
        <meta 
          name="description" 
          content="Browse our curated collection of fine wines from France and Italy. Premium reds, whites, and sparkling wines." 
        />
      </Helmet>

      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        {/* Page Header */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container text-center">
            <p className="text-xs font-sans tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Our Collection
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-light">
              Fine Wines
            </h1>
          </div>
        </section>

        {/* Wine Grid */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {wines.map((wine, index) => (
                <Link
                  key={wine.id}
                  to={`/collection/${wine.id}`}
                  className={`group opacity-0 animate-slide-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-[3/4] bg-secondary mb-5 overflow-hidden flex items-center justify-center p-6">
                    <img 
                      src={wine.image} 
                      alt={wine.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-serif group-hover:text-muted-foreground transition-colors duration-300 leading-tight">
                      {wine.name}
                    </h3>
                    <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                      {wine.origin}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {wine.grapes}
                    </p>
                    <p className="text-sm font-sans pt-1">
                      {wine.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Collection;
