
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Individual from "./pages/Individual";
import IndividualResults from "./pages/IndividualResults";
import Firm from "./pages/Firm";
import FirmClientDetail from "./pages/FirmClientDetail";
import Integrations from "./pages/Integrations";
import NotFound from "./pages/NotFound";
import LanguageSelector from "./components/LanguageSelector";

const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className="fixed top-4 right-4 z-50">
              <LanguageSelector />
            </div>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/individual" element={<Individual />} />
              <Route path="/individual/results" element={<IndividualResults />} />
              <Route path="/firm" element={<Firm />} />
              <Route path="/firm/client/:id" element={<FirmClientDetail />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
