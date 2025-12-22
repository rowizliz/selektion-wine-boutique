import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Collection", href: "/collection" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 -ml-2 text-foreground hover:text-muted-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-xs font-sans tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link 
            to="/" 
            className="absolute left-1/2 -translate-x-1/2 text-xl md:text-2xl font-serif tracking-wider"
          >
            SÉLECTION
          </Link>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Link to="/chat" aria-label="Chat">
              <MessageCircle className="h-5 w-5 text-foreground hover:text-muted-foreground transition-colors duration-300" />
            </Link>
            <Link to="/cart" aria-label="Shopping bag">
              <ShoppingBag className="h-5 w-5 text-foreground hover:text-muted-foreground transition-colors duration-300" />
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border animate-slide-down">
            <div className="container py-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm font-sans tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
