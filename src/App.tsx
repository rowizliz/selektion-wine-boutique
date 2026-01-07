// App root component
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import AdminRoute from "./components/AdminRoute";
import CollaboratorRoute from "./components/CollaboratorRoute";
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import WineDetail from "./pages/WineDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Gifts from "./pages/Gifts";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminFlavorIcons from "./pages/AdminFlavorIcons";
import AdminWines from "./pages/AdminWines";
import AdminImportWines from "./pages/AdminImportWines";
import AdminBirthdayGifts from "./pages/AdminBirthdayGifts";
import AdminPersonalizedWine from "./pages/AdminPersonalizedWine";
import AdminInvitations from "./pages/AdminInvitations";
import AdminInventory from "./pages/AdminInventory";
import AdminCollaborators from "./pages/AdminCollaborators";
import AdminProfileUpdates from "./pages/AdminProfileUpdates";
import AdminExportData from "./pages/AdminExportData";
import PersonalizedWineConsultation from "./pages/PersonalizedWineConsultation";
import CustomerWineRecommendation from "./pages/CustomerWineRecommendation";
import PublicInvitation from "./pages/PublicInvitation";
import CollaboratorPortal from "./pages/CollaboratorPortal";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/collection/:id" element={<WineDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gifts" element={<Gifts />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="/admin/wines" element={<AdminRoute><AdminWines /></AdminRoute>} />
            <Route path="/admin/import-wines" element={<AdminRoute><AdminImportWines /></AdminRoute>} />
            <Route path="/admin/flavor-icons" element={<AdminRoute><AdminFlavorIcons /></AdminRoute>} />
            <Route path="/admin/birthday-gifts" element={<AdminRoute><AdminBirthdayGifts /></AdminRoute>} />
            <Route path="/admin/tu-van" element={<AdminRoute><AdminPersonalizedWine /></AdminRoute>} />
            <Route path="/admin/invitations" element={<AdminRoute><AdminInvitations /></AdminRoute>} />
            <Route path="/admin/inventory" element={<AdminRoute><AdminInventory /></AdminRoute>} />
            <Route path="/admin/collaborators" element={<AdminRoute><AdminCollaborators /></AdminRoute>} />
            <Route path="/admin/profile-updates" element={<AdminRoute><AdminProfileUpdates /></AdminRoute>} />
            <Route path="/admin/export-data" element={<AdminRoute><AdminExportData /></AdminRoute>} />
            <Route path="/tu-van-ca-nhan" element={<PersonalizedWineConsultation />} />
            <Route path="/tuvan/:slug" element={<CustomerWineRecommendation />} />
            <Route path="/thiep/:slug" element={<PublicInvitation />} />
            <Route path="/ctv" element={<CollaboratorRoute><CollaboratorPortal /></CollaboratorRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
