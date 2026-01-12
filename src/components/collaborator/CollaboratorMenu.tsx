
import { User, Settings, FileText, LayoutDashboard, LogOut, ChevronRight, Landmark, Key } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CollaboratorProfile } from "@/hooks/useCollaborators";

interface CollaboratorMenuProps {
    collaborator: CollaboratorProfile;
    onOpenBankInfo: () => void;
    onOpenProfile: () => void;
    onOpenPasswordChange: () => void;
    onOpenArticles: () => void;
    onLogout: () => void;
}

export const CollaboratorMenu = ({
    collaborator,
    onOpenBankInfo,
    onOpenProfile,
    onOpenPasswordChange,
    onOpenArticles,
    onLogout,
}: CollaboratorMenuProps) => {
    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage src={collaborator.avatar_url || ""} />
                    <AvatarFallback className="text-xl">{collaborator.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-xl font-bold">{collaborator.name}</h2>
                    <p className="text-muted-foreground text-sm">{collaborator.email}</p>
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground px-2 pb-2">Tài khoản</h3>

                <button
                    onClick={onOpenProfile}
                    className="w-full flex items-center justify-between p-4 bg-card hover:bg-accent transition-colors rounded-lg border mb-2"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                            <Settings className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Cài đặt tài khoản</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
                </button>

                <button
                    onClick={onOpenPasswordChange}
                    className="w-full flex items-center justify-between p-4 bg-card hover:bg-accent transition-colors rounded-lg border mb-2"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-500/10 p-2 rounded-full text-purple-500">
                            <Key className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Đổi mật khẩu</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
                </button>

                <button
                    onClick={onOpenBankInfo}
                    className="w-full flex items-center justify-between p-4 bg-card hover:bg-accent transition-colors rounded-lg border mb-2"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500/10 p-2 rounded-full text-blue-500">
                            <Landmark className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Thông tin ngân hàng</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
                </button>
            </div>

            <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground px-2 pb-2">Nội dung</h3>

                <button
                    onClick={onOpenArticles}
                    className="w-full flex items-center justify-between p-4 bg-card hover:bg-accent transition-colors rounded-lg border mb-2"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-500/10 p-2 rounded-full text-orange-500">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <span className="font-medium block">Bài viết của tôi</span>
                            <span className="text-xs text-muted-foreground">Quản lý bài viết blog</span>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
                </button>
            </div>

            <div className="px-2 pt-4">
                <Button
                    variant="destructive"
                    className="w-full h-12 rounded-xl"
                    onClick={onLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                </Button>
            </div>
        </div>
    );
};
