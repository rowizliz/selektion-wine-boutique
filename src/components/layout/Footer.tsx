import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-serif tracking-wider">
              SÉLECTION
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Curated wines from the finest vineyards of France and Italy. 
              Each bottle tells a story of heritage and craftsmanship.
            </p>
            <p className="mt-6 text-xs text-muted-foreground tracking-wider uppercase">
              127/15 Hoang Dieu 2, Thu Duc, Ho Chi Minh City
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-sans tracking-widest uppercase mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {["Collection", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-sans tracking-widest uppercase mb-6">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a 
                  href="https://zalo.me/0906777377" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors duration-300"
                >
                  Zalo: 0906 777 377
                </a>
              </li>
              <li>
                <a 
                  href="mailto:hello@selection.vn"
                  className="hover:text-foreground transition-colors duration-300"
                >
                  hello@selection.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground tracking-wider">
            © 2024 SÉLECTION. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground tracking-wider">
            Fine wines imported from France & Italy
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
