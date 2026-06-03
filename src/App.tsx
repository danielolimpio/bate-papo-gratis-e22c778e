import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaCookies from "./pages/PoliticaCookies";
import QuemSomos from "./pages/QuemSomos";
import NamoroSeguro from "./pages/NamoroSeguro";
import BatePapoSemCadastro from "./pages/BatePapoSemCadastro";
import SalaDeBatePapo from "./pages/SalaDeBatePapo";
import ChatGratis from "./pages/ChatGratis";
import BatePapoWebcam from "./pages/BatePapoWebcam";
import BatePapoAmizadeNamoro from "./pages/BatePapoAmizadeNamoro";
import SyncStatus from "./pages/SyncStatus";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAutoResync } from "./hooks/useAutoResync";

function GlobalEffects() {
  useAutoResync();
  return null;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GlobalEffects />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/saladebatepapo" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos-de-uso" element={<TermosDeUso />} />
          <Route path="/politica-de-cookies" element={<PoliticaCookies />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/namoro-seguro" element={<NamoroSeguro />} />
          <Route path="/bate-papo-sem-cadastro" element={<BatePapoSemCadastro />} />
          <Route path="/sala-de-bate-papo" element={<SalaDeBatePapo />} />
          <Route path="/chat-gratis" element={<ChatGratis />} />
          <Route path="/bate-papo-webcam" element={<BatePapoWebcam />} />
          <Route path="/bate-papo-amizade-namoro" element={<BatePapoAmizadeNamoro />} />
          <Route path="/status-sincronizacao" element={<ProtectedRoute><SyncStatus /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
