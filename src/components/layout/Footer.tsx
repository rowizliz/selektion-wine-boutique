import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, ...props }, ref) => {
    const navItems = [
      { name: "Bộ Sưu Tập", href: "/collection" },
      { name: "Về Chúng Tôi", href: "/about" },
      { name: "Liên Hệ", href: "/contact" },
    ];

    return (
      <footer
        ref={ref}
        className={cn("border-t border-border bg-background", className)}
        {...props}
      >
        <div className="container py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link to="/" className="text-2xl font-serif tracking-wider">
                SÉLECTION
              </Link>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
                Rượu vang hảo hạng được tuyển chọn từ những vườn nho danh tiếng của Pháp và Ý.
                Mỗi chai rượu là một câu chuyện về di sản và nghệ thuật làm rượu.
              </p>
              <p className="mt-6 text-xs text-muted-foreground tracking-wider uppercase">
                127/15 Hoàng Diệu 2, Thủ Đức, TP. Hồ Chí Minh
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-xs font-sans tracking-widest uppercase mb-6">
                Điều Hướng
              </h4>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-sans tracking-widest uppercase mb-6">
                Liên Hệ
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
              © 2024 SÉLECTION. Bảo lưu mọi quyền.
            </p>
            <p className="text-xs text-muted-foreground tracking-wider">
              Rượu vang nhập khẩu từ Pháp & Ý
            </p>
          </div>
        </div>
      </footer>
    );
  },
);

Footer.displayName = "Footer";

export default Footer;
