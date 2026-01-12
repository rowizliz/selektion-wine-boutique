// App root component
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";

// Critical pages - load immediately
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import WineDetail from "./pages/WineDetail";

// Lazy load non-critical pages
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const Gifts = lazy(() => import("./pages/Gifts"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Recruitment = lazy(() => import("./pages/Recruitment"));
const PersonalizedWineConsultation = lazy(() => import("./pages/PersonalizedWineConsultation"));
const CustomerWineRecommendation = lazy(() => import("./pages/CustomerWineRecommendation"));
const PublicInvitation = lazy(() => import("./pages/PublicInvitation"));

// Admin pages - lazy load
const AdminRoute = lazy(() => import("./components/AdminRoute"));
const CollaboratorRoute = lazy(() => import("./components/CollaboratorRoute"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminWines = lazy(() => import("./pages/AdminWines"));
const AdminGiftSets = lazy(() => import("./pages/AdminGiftSets"));
const AdminImportWines = lazy(() => import("./pages/AdminImportWines"));
const AdminFlavorIcons = lazy(() => import("./pages/AdminFlavorIcons"));
const AdminBirthdayGifts = lazy(() => import("./pages/AdminBirthdayGifts"));
const AdminPersonalizedWine = lazy(() => import("./pages/AdminPersonalizedWine"));
const AdminInvitations = lazy(() => import("./pages/AdminInvitations"));
const AdminInventory = lazy(() => import("./pages/AdminInventory"));
const AdminCollaborators = lazy(() => import("./pages/AdminCollaborators"));
const AdminProfileUpdates = lazy(() => import("./pages/AdminProfileUpdates"));
const AdminExportData = lazy(() => import("./pages/AdminExportData"));
const AdminRecruitment = lazy(() => import("./pages/AdminRecruitment"));
const AdminContactMessages = lazy(() => import("./pages/AdminContactMessages"));
const AdminBlog = lazy(() => import("./pages/AdminBlog"));
const CollaboratorPortal = lazy(() => import("./pages/CollaboratorPortal"));

const queryClient = new QueryClient();

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Đang tải...</div>
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Critical routes - no suspense needed */}
              <Route path="/" element={<Index />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/collection/:id" element={<WineDetail />} />

              {/* Public routes */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gifts" element={<Gifts />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/tu-van-ca-nhan" element={<PersonalizedWineConsultation />} />
              <Route path="/tuyen-dung" element={<Recruitment />} />
              <Route path="/tuvan/:slug" element={<CustomerWineRecommendation />} />
              <Route path="/thiep/:slug" element={<PublicInvitation />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />

              {/* Admin routes */}
              <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminRoute><Admin /></AdminRoute></Suspense>} />
              <Route path="/admin/wines" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminWines /></AdminRoute></Suspense>} />
              <Route path="/admin/gift-sets" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminGiftSets /></AdminRoute></Suspense>} />
              <Route path="/admin/import-wines" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminImportWines /></AdminRoute></Suspense>} />
              <Route path="/admin/flavor-icons" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminFlavorIcons /></AdminRoute></Suspense>} />
              <Route path="/admin/birthday-gifts" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminBirthdayGifts /></AdminRoute></Suspense>} />
              <Route path="/admin/tu-van" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminPersonalizedWine /></AdminRoute></Suspense>} />
              <Route path="/admin/invitations" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminInvitations /></AdminRoute></Suspense>} />
              <Route path="/admin/inventory" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminInventory /></AdminRoute></Suspense>} />
              <Route path="/admin/collaborators" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminCollaborators /></AdminRoute></Suspense>} />
              <Route path="/admin/profile-updates" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminProfileUpdates /></AdminRoute></Suspense>} />
              <Route path="/admin/export-data" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminExportData /></AdminRoute></Suspense>} />
              <Route path="/admin/tuyen-dung" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminRecruitment /></AdminRoute></Suspense>} />
              <Route path="/admin/contact-messages" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminContactMessages /></AdminRoute></Suspense>} />
              <Route path="/admin/blog" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminBlog /></AdminRoute></Suspense>} />
              <Route path="/ctv" element={<Suspense fallback={<PageLoader />}><CollaboratorRoute><CollaboratorPortal /></CollaboratorRoute></Suspense>} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

