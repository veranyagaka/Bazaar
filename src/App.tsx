
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Alerts from "./pages/Alerts";
import Markets from "./pages/Markets";
import Buyers from "./pages/Buyers";
import Onboarding from "./pages/Onboarding";
import Chatroom from "@/pages/Chatroom";
import ChatWidget from "./components/ChatWidget";
import FarmerDashboard from "./components/FarmerDashboard";
import BuyerDashboard from "./components/BuyerDashboard";
import DiseaseDetection from "./pages/DiseaseDetection";
import { useUser } from "@clerk/clerk-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/farmer" element={<FarmerDashboard  />} />
          <Route path="/buyer" element={<BuyerDashboard/>} />
          <Route path="/disease-detection" element={<ProtectedRoute><DiseaseDetection /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/buyers" element={<Buyers />} />
          <Route path="/markets" element={<Markets />} />


          <Route path="*" element={<NotFound />} />

          <Route path="/chatroom" element={<Chatroom />} />

        </Routes>
        <ChatWidget />

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  if (!isSignedIn) {
    window.location.href = "/";
    return null;
  }

  return <>{children}</>;
};

export default App;
