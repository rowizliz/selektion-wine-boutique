import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isCollaborator, setIsCollaborator] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          checkCollaboratorStatus(session.user.id);
        } else {
          setIsCollaborator(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkCollaboratorStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkCollaboratorStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from('collaborators')
      .select('id, is_active')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!error && data && data.is_active) {
      setIsCollaborator(true);
    } else {
      setIsCollaborator(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsCollaborator(false);
    navigate("/");
  };

  // Links shown in hamburger menu (all views)
  const menuLinks = [
    { name: "Bộ Sưu Tập", href: "/collection", hideOnDesktop: true },
    { name: "Quà Tặng", href: "/gifts", hideOnDesktop: true },
    { name: "Tư Vấn Cá Nhân Hoá", href: "/tu-van-ca-nhan" },
    { name: "Về Chúng Tôi", href: "/about" },
    { name: "Liên Hệ", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left side: Hamburger (mobile/tablet) or "Bộ Sưu Tập" (desktop) */}
          <div className="flex items-center">
            {/* Mobile/Tablet: hamburger button on left */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-foreground hover:text-muted-foreground transition-colors"
              aria-label="Mở menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Desktop: "Bộ Sưu Tập" và "Quà Tặng" links on left */}
            <div className="hidden lg:flex items-center gap-6">
              <Link
                to="/collection"
                className="text-xs font-sans tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors duration-300"
              >
                Bộ Sưu Tập
              </Link>
              <Link
                to="/gifts"
                className="text-xs font-sans tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors duration-300"
              >
                Quà Tặng
              </Link>
            </div>
          </div>

          {/* Logo - centered */}
          <Link 
            to="/" 
            className="absolute left-1/2 -translate-x-1/2 text-xl lg:text-2xl font-serif tracking-wider"
          >
            SÉLECTION
          </Link>

          {/* Right side: Hamburger (desktop only) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hidden lg:block p-2 -mr-2 text-foreground hover:text-muted-foreground transition-colors"
            aria-label="Mở menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Empty spacer for mobile/tablet to balance the layout */}
          <div className="lg:hidden w-9" />
        </div>

        {/* Dropdown menu - all screen sizes */}
        {isMenuOpen && (
          <div className="absolute top-16 lg:top-20 left-0 right-0 bg-background border-b border-border animate-slide-down">
            <div className="container py-8 space-y-6">
              {menuLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-sm font-sans tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors ${
                    link.hideOnDesktop ? "lg:hidden" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Profile section */}
              <div className="border-t border-border pt-6 mt-6">
                {user ? (
                  <>
                    {isCollaborator && (
                      <Link
                        to="/ctv"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center text-sm font-sans tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors mb-4"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Cộng Tác Viên
                      </Link>
                    )}
                    <p className="text-xs text-muted-foreground mb-4 truncate">{user.email}</p>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center text-sm font-sans tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng Xuất
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm font-sans tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors"
                  >
                    Đăng Nhập
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
