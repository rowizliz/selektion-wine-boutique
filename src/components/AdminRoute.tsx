import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const location = useLocation();

  // undefined = chưa biết session (đang load), null = chưa đăng nhập, Session = đã đăng nhập
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const userId = useMemo(() => session?.user?.id ?? null, [session?.user?.id]);

  // Keep session in sync with auth state.
  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setSessionLoaded(true);
    });

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;
        setSession(session);
        setSessionLoaded(true);
      })
      .catch(() => {
        if (!mounted) return;
        setSession(null);
        setSessionLoaded(true);
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
      if (!sessionLoaded) return;

      setAdminLoading(true);
      setAdminChecked(false);

      if (!userId) {
        setIsAdmin(false);
        setAdminChecked(true);
        setAdminLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc("is_admin");

      if (cancelled) return;
      setIsAdmin(!error && Boolean(data));
      setAdminChecked(true);
      setAdminLoading(false);
    };

    // Defer to avoid calling backend methods inside auth callbacks.
    setTimeout(() => {
      void checkAdmin();
    }, 0);

    return () => {
      cancelled = true;
    };
  }, [sessionLoaded, userId]);

  if (!sessionLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const returnTo = `${location.pathname}${location.search}`;

  if (!session) {
    return (
      <Navigate
        to={`/auth?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    );
  }

  if (adminLoading || !adminChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;


