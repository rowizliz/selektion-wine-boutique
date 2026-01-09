import { useIsMobile } from "@/hooks/use-mobile";
import CollaboratorPortalMobile from "./CollaboratorPortalMobile";
import { CollaboratorPortalDesktop } from "./CollaboratorPortalDesktop";

const CollaboratorPortal = () => {
  const isMobile = useIsMobile();

  return isMobile ? <CollaboratorPortalMobile /> : <CollaboratorPortalDesktop />;
};

export default CollaboratorPortal;
