import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, MessageCircle, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navLinks = [
    { name: "Bộ Sưu Tập", href: "/collection" },
    { name: "Về Chúng Tôi", href: "/about" },
    { name: "Liên Hệ", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 -ml-2 text-foreground hover:text-muted-foreground transition-colors"
            aria-label="Mở menu"
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
            <Link to="/chat" aria-label="Trò chuyện">
              <MessageCircle className="h-5 w-5 text-foreground hover:text-muted-foreground transition-colors duration-300" />
            </Link>
            <Link to="/cart" aria-label="Giỏ hàng">
              <ShoppingBag className="h-5 w-5 text-foreground hover:text-muted-foreground transition-colors duration-300" />
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="text-xs text-muted-foreground cursor-default">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-xs cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" aria-label="Đăng nhập">
                <User className="h-5 w-5 text-foreground hover:text-muted-foreground transition-colors duration-300" />
              </Link>
            )}
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
              {!user && (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm font-sans tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors"
                >
                  Đăng Nhập
                </Link>
              )}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block text-sm font-sans tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors"
                >
                  Đăng Xuất
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
