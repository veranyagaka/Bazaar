
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

export default App;
