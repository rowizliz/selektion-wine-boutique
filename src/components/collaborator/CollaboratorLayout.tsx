
import { ReactNode } from "react";

interface CollaboratorLayoutProps {
    children: ReactNode;
}

export const CollaboratorLayout = ({ children }: CollaboratorLayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-md mx-auto min-h-screen bg-background shadow-2xl relative overflow-hidden">
                <main className="h-full overflow-y-auto no-scrollbar pb-safe">
                    <div className="p-4 safe-top">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
