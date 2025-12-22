import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = useMemo(() => session?.user?.id ?? null, [session?.user?.id]);

  // Keep session in sync with auth state.
  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!mounted) return;
        setSession(nextSession);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Check admin role when user changes.
  useEffect(() => {
    let cancelled = false;

    const checkAdmin = async () => {
      setLoading(true);

      if (!userId) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc("is_admin");

      if (cancelled) return;
      setIsAdmin(!error && Boolean(data));
      setLoading(false);
    };

    // Defer to avoid calling backend methods inside auth callbacks.
    setTimeout(() => {
      void checkAdmin();
    }, 0);

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;

