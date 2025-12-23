import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import AdminRoute from "./components/AdminRoute";
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import WineDetail from "./pages/WineDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Gifts from "./pages/Gifts";
import NotFound from "./pages/NotFound";
import AdminFlavorIcons from "./pages/AdminFlavorIcons";
import AdminWines from "./pages/AdminWines";
import AdminImportWines from "./pages/AdminImportWines";

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
            <Route path="/admin/wines" element={<AdminRoute><AdminWines /></AdminRoute>} />
            <Route path="/admin/import-wines" element={<AdminRoute><AdminImportWines /></AdminRoute>} />
            <Route path="/admin/flavor-icons" element={<AdminRoute><AdminFlavorIcons /></AdminRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
