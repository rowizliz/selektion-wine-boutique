import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wine, Gift, Palette, Upload, ArrowLeft, Sparkles, Mail, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePendingRequestCounts } from "@/hooks/usePendingRequestCounts";
import { useNotificationSound } from "@/hooks/useNotificationSound";

interface AdminModule {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  badgeKey?: 'birthdayGiftsPending' | 'personalizedWinePending';
}

const adminModules: AdminModule[] = [
  {
    title: "Quản Lý Kho Hàng",
    description: "Tồn kho, đơn hàng, lợi nhuận",
    icon: Package,
    href: "/admin/inventory",
    color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
  },
  {
    title: "Quản lý Rượu Vang",
    description: "Thêm, sửa, xóa thông tin rượu vang",
    icon: Wine,
    href: "/admin/wines",
    color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
  },
  {
    title: "Quà Tặng Sinh Nhật",
    description: "Xem và xử lý các yêu cầu đặt quà",
    icon: Gift,
    href: "/admin/birthday-gifts",
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    badgeKey: 'birthdayGiftsPending'
  },
  {
    title: "Tư Vấn Cá Nhân Hoá",
    description: "Xem và xử lý các yêu cầu tư vấn rượu",
    icon: Sparkles,
    href: "/admin/tu-van",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    badgeKey: 'personalizedWinePending'
  },
  {
    title: "Thiệp Mời Online",
    description: "Tạo thiệp mời sự kiện với RSVP",
    icon: Mail,
    href: "/admin/invitations",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
  },
  {
    title: "Flavor Icons",
    description: "Quản lý icon cho hương vị rượu",
    icon: Palette,
    href: "/admin/flavor-icons",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
  },
  {
    title: "Import Rượu",
    description: "Import dữ liệu rượu từ file tĩnh",
    icon: Upload,
    href: "/admin/import-wines",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
  }
];

const Admin = () => {
  const { data: pendingCounts } = usePendingRequestCounts();
  
  const totalPending = (pendingCounts?.birthdayGiftsPending ?? 0) + (pendingCounts?.personalizedWinePending ?? 0);
  useNotificationSound(totalPending > 0);

  const getBadgeCount = (badgeKey?: 'birthdayGiftsPending' | 'personalizedWinePending') => {
    if (!badgeKey || !pendingCounts) return 0;
    return pendingCounts[badgeKey];
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Sélection</title>
        <meta name="description" content="Bảng điều khiển quản trị Sélection" />
      </Helmet>

      <main className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <header className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" aria-label="Về trang chủ">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-serif">Bảng điều khiển Admin</h1>
              <p className="text-muted-foreground text-sm">
                Quản lý nội dung website Sélection
              </p>
            </div>
          </header>

          {/* Module Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminModules.map((module) => {
              const badgeCount = getBadgeCount(module.badgeKey);
              return (
                <Link key={module.href} to={module.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className={`relative p-3 rounded-lg ${module.color}`}>
                        <module.icon className="h-6 w-6" />
                        {badgeCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse">
                            {badgeCount > 99 ? "99+" : badgeCount}
                          </span>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default Admin;
