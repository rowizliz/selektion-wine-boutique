import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface CollaboratorRouteProps {
  children: React.ReactNode;
}

const CollaboratorRoute = ({ children }: CollaboratorRouteProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isCollaborator, setIsCollaborator] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth?returnTo=/ctv");
        return;
      }

      // Check if user is already linked as collaborator
      const { data: collaborator } = await supabase
        .from("collaborators")
        .select("id, is_active")
        .eq("user_id", session.user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (collaborator) {
        setIsCollaborator(true);
        setIsLoading(false);
        return;
      }

      // If not linked by user_id, try to link via secure database function
      const { data: wasLinked } = await supabase.rpc("link_collaborator_for_current_user");
      if (wasLinked) {
        setIsCollaborator(true);
        setIsLoading(false);
        return;
      }

      // Check if user is admin (admins can also access)
      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (isAdmin) {
        setIsCollaborator(true);
      } else {
        navigate("/");
      }
      
      setIsLoading(false);
    };

    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth?returnTo=/ctv");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isCollaborator) {
    return null;
  }

  return <>{children}</>;
};

export default CollaboratorRoute;
