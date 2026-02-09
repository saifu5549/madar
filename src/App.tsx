import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import MadarsaList from "./pages/MadarsaList";
import MadarsaDetail from "./pages/MadarsaDetail";
import Auth from "./pages/Auth";
import About from "./pages/About";
import AddMadarsa from "./pages/AddMadarsa";
import MyMadarsa from "./pages/MyMadarsa";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/madarsas" element={<MadarsaList />} />
            <Route path="/madarsa/:id" element={<MadarsaDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/add-madarsa" element={<AddMadarsa />} />
            <Route path="/about" element={<About />} />
            <Route path="/my-madarsa" element={<MyMadarsa />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
