import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Wine } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const returnTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const rt = params.get("returnTo");

    // Security: prevent open redirects.
    if (!rt) return "/";
    if (!rt.startsWith("/")) return "/";
    return rt;
  }, [location.search]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate(returnTo, { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate(returnTo, { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, returnTo]);

  const validateForm = () => {
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Đăng nhập thất bại",
              description: "Email hoặc mật khẩu không đúng",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Lỗi",
              description: error.message,
              variant: "destructive",
            });
          }
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${returnTo}`,
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Email đã được đăng ký",
              description: "Vui lòng đăng nhập hoặc sử dụng email khác",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Lỗi",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Đăng ký thành công!",
            description: "Chào mừng bạn đến với Sélection",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Đăng nhập | Sélection</title>
        <meta
          name="description"
          content="Đăng nhập hoặc đăng ký để quản lý bộ sưu tập rượu vang Sélection."
        />
        <link rel="canonical" href={`${window.location.origin}/auth`} />
      </Helmet>

      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <header className="text-center mb-12">
            <Wine className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-serif tracking-wider">SÉLECTION</h1>
            <p className="text-muted-foreground mt-2 text-sm tracking-wide">
              Bộ sưu tập rượu vang cao cấp
            </p>
          </header>

          {/* Form */}
          <section className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-xl font-serif text-center mb-6">
              {isLogin ? "Đăng Nhập" : "Đăng Ký"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs tracking-widest uppercase">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-background"
                  disabled={isLoading}
                />
                {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs tracking-widest uppercase">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-background pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full tracking-widest uppercase text-xs py-6"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : isLogin ? "Đăng Nhập" : "Đăng Ký"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin
                  ? "Chưa có tài khoản? Đăng ký ngay"
                  : "Đã có tài khoản? Đăng nhập"}
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Auth;

