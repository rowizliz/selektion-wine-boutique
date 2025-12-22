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
import chateauCivracLagrangeImg from "@/assets/wines/chateau-civrac-lagrange.jpg";
import tempoAngelusImg from "@/assets/wines/tempo-angelus.jpg";
import closLunellesImg from "@/assets/wines/clos-lunelles.jpg";
import chateauFrancPipeauImg from "@/assets/wines/chateau-franc-pipeau.jpg";
import eremoSanQuiricoImg from "@/assets/wines/eremo-san-quirico.jpg";
import anniversaryImg from "@/assets/wines/anniversary.jpg";
import eremoSanQuiricoGoldImg from "@/assets/wines/eremo-san-quirico-gold.jpg";
import bicento53Img from "@/assets/wines/bicento-53.jpg";
import spanellaRossoImg from "@/assets/wines/spanella-rosso.jpg";
import bubblesMoscatoImg from "@/assets/wines/bubbles-moscato.jpg";
import auraDelSolImg from "@/assets/wines/aura-del-sol.jpg";
import armadorSauvignonBlancImg from "@/assets/wines/armador-sauvignon-blanc.jpg";
import odfjellOrzadaImg from "@/assets/wines/odfjell-orzada.jpg";
import odfjellAliaraImg from "@/assets/wines/odfjell-aliara.jpg";
import santeroAstiImg from "@/assets/wines/santero-asti.jpg";
import confidentChardonnayImg from "@/assets/wines/confident-chardonnay.jpg";
import confidentZinfandelImg from "@/assets/wines/confident-zinfandel.jpg";

interface Wine {
  id: string;
  name: string;
  origin: string;
  grapes: string;
  price: string;
  description: string;
  image: string;
  category: "red" | "white" | "sparkling";
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
    category: "red",
  },
  {
    id: "2",
    name: "Vigné-Lourac Merlot Prestige",
    origin: "Gaillac, France",
    grapes: "Merlot",
    price: "780,000₫",
    description: "Deep ruby color with aromas of black fruits, plum, raspberry, and cocoa.",
    image: vigneLouracImg,
    category: "red",
  },
  {
    id: "3",
    name: "Beau Marais Reserve Selection",
    origin: "Costières de Nîmes, France",
    grapes: "Blend",
    price: "450,000₫",
    description: "Approachable wine with honey and earthy notes, perfect for daily enjoyment.",
    image: beauMaraisImg,
    category: "red",
  },
  {
    id: "4",
    name: "Roberto Riga Rosso",
    origin: "Sardegna, Italy",
    grapes: "Cannonau",
    price: "520,000₫",
    description: "Traditional Italian style with cherry, wild herbs, and tobacco undertones.",
    image: robertoRigaImg,
    category: "red",
  },
  {
    id: "5",
    name: "Bervini Brut",
    origin: "Friuli-Venezia Giulia, Italy",
    grapes: "Glera",
    price: "680,000₫",
    description: "Elegant sparkling wine with citrus, honey, orange peel, and green apple.",
    image: berviniBrutImg,
    category: "sparkling",
  },
  {
    id: "6",
    name: "Château Haut Bazignan 2020",
    origin: "Bordeaux, France",
    grapes: "Cabernet Sauvignon, Merlot",
    price: "650,000₫",
    description: "Classic Bordeaux with raspberry, blackberry, and musk notes.",
    image: chateauHautBazignanImg,
    category: "red",
  },
  {
    id: "7",
    name: "Château Le Bordieu 2020",
    origin: "Bordeaux Supérieur, France",
    grapes: "Merlot, Cabernet Sauvignon",
    price: "650,000₫",
    description: "Rich with black plum, cedar, butter, tobacco, and cherry complexity.",
    image: chateauLeBordieuImg,
    category: "red",
  },
  {
    id: "8",
    name: "Masso Antico Primitivo",
    origin: "Puglia, Italy",
    grapes: "Primitivo",
    price: "650,000₫",
    description: "Lush Appassimento style with dried fruit intensity and velvety texture.",
    image: massoAnticoImg,
    category: "red",
  },
  {
    id: "9",
    name: "Château Civrac-Lagrange 2018",
    origin: "Pessac-Léognan, France",
    grapes: "Merlot, Cabernet Sauvignon, Petit Verdot",
    price: "1,550,000₫",
    description: "Elegant Bordeaux with raspberry, plum, mocha, blackberry, and violet notes.",
    image: chateauCivracLagrangeImg,
    category: "red",
  },
  {
    id: "10",
    name: "Tempo d'Angélus 2020",
    origin: "Bordeaux, France",
    grapes: "Cabernet Franc, Merlot",
    price: "1,550,000₫",
    description: "From Château Angélus, vanilla, chocolate, mocha, cedar, and plum aromas.",
    image: tempoAngelusImg,
    category: "red",
  },
  {
    id: "11",
    name: "Clos Lunelles 2012",
    origin: "Castillon, Bordeaux, France",
    grapes: "Merlot, Cabernet Franc, Cabernet Sauvignon",
    price: "1,550,000₫",
    description: "Complex Bordeaux with vanilla, plum, black cherry, and violet notes.",
    image: closLunellesImg,
    category: "red",
  },
  {
    id: "12",
    name: "Château Franc Pipeau Descombes",
    origin: "Saint-Émilion Grand Cru, France",
    grapes: "Merlot, Cabernet Franc",
    price: "1,520,000₫",
    description: "Grand Cru with plum, black cherry, black currant, and strawberry notes.",
    image: chateauFrancPipeauImg,
    category: "red",
  },
  {
    id: "13",
    name: "Eremo San Quirico DOC",
    origin: "Irpinia, Campania, Italy",
    grapes: "Aglianico",
    price: "2,650,000₫",
    description: "Magnum 1.5L with black cherry, black currant, strawberry, and cream notes.",
    image: eremoSanQuiricoImg,
    category: "red",
  },
  {
    id: "14",
    name: "Anniversary Limited Edition",
    origin: "Irpinia, Campania, Italy",
    grapes: "Aglianico",
    price: "1,150,000₫",
    description: "Special edition with vanilla, chocolate, strawberry, and cherry notes.",
    image: anniversaryImg,
    category: "red",
  },
  {
    id: "15",
    name: "Eremo San Quirico Gold",
    origin: "Irpinia, Campania, Italy",
    grapes: "Aglianico",
    price: "1,750,000₫",
    description: "Premium selection with strawberry, black fruit, cream, and 99/100 Luca Maroni.",
    image: eremoSanQuiricoGoldImg,
    category: "red",
  },
  {
    id: "16",
    name: "Bicento 53",
    origin: "Irpinia, Campania, Italy",
    grapes: "Aglianico",
    price: "1,820,000₫",
    description: "From 200-year-old vines, vanilla, chocolate, strawberry, and blackberry.",
    image: bicento53Img,
    category: "red",
  },
  {
    id: "17",
    name: "Spanella Rosso",
    origin: "Puglia, Italy",
    grapes: "Primitivo, Negroamaro",
    price: "497,000₫",
    description: "Full-bodied with black fruit, raspberry, strawberry, and licorice.",
    image: spanellaRossoImg,
    category: "red",
  },
  {
    id: "18",
    name: "Bubbles Moscato d'Asti DOCG",
    origin: "Piemonte, Italy",
    grapes: "Moscato",
    price: "630,000₫",
    description: "Sweet sparkling with citrus, honey, orange peel, peach, and green apple.",
    image: bubblesMoscatoImg,
    category: "sparkling",
  },
  {
    id: "19",
    name: "Aura Del Sol Icon 2011",
    origin: "Maule Valley, Chile",
    grapes: "Cabernet Sauvignon",
    price: "1,570,000₫",
    description: "Icon wine with black cherry, potpourri, and licorice, aged 18 months in oak.",
    image: auraDelSolImg,
    category: "red",
  },
  {
    id: "20",
    name: "Armador Sauvignon Blanc",
    origin: "Casablanca Valley, Chile",
    grapes: "Sauvignon Blanc",
    price: "625,000₫",
    description: "Organic wine with tangerine, citrus, peach, green apple, and jasmine.",
    image: armadorSauvignonBlancImg,
    category: "white",
  },
  {
    id: "21",
    name: "Odfjell Orzada Carménère",
    origin: "Maule Valley, Chile",
    grapes: "Carménère",
    price: "825,000₫",
    description: "Organic with vanilla, tobacco, leather, cherry, and blackberry notes.",
    image: odfjellOrzadaImg,
    category: "red",
  },
  {
    id: "22",
    name: "Odfjell Aliara",
    origin: "Chile",
    grapes: "Carignan, Syrah, Malbec",
    price: "2,500,000₫",
    description: "Icon blend with 93+ points, aged 18 months in new French oak.",
    image: odfjellAliaraImg,
    category: "red",
  },
  {
    id: "23",
    name: "958 Santero Asti",
    origin: "Piemonte, Italy",
    grapes: "Moscato",
    price: "600,000₫",
    description: "Sweet sparkling with orange peel, peach, plum, and ginger notes.",
    image: santeroAstiImg,
    category: "sparkling",
  },
  {
    id: "24",
    name: "Confident Chardonnay Lodi",
    origin: "California, USA",
    grapes: "Chardonnay",
    price: "750,000₫",
    description: "Award-winning with vanilla, butter, cream, pineapple, and green apple.",
    image: confidentChardonnayImg,
    category: "white",
  },
  {
    id: "25",
    name: "Confident Zinfandel Lodi",
    origin: "California, USA",
    grapes: "Zinfandel",
    price: "750,000₫",
    description: "Full-bodied with blackberry, plum, vanilla, and baking spices.",
    image: confidentZinfandelImg,
    category: "red",
  },
];

const Collection = () => {
  return (
    <>
      <Helmet>
        <title>Wine Collection | SÉLECTION</title>
        <meta 
          name="description" 
          content="Browse our curated collection of 25+ fine wines from France, Italy, Chile, and USA. Premium reds, whites, and sparkling wines." 
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
            <p className="mt-6 text-muted-foreground text-sm">
              {wines.length} exceptional wines from around the world
            </p>
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
                  style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
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
