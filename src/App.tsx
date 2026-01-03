import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Practice from "./pages/Practice";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <GoogleOAuthProvider clientId="276418971864-ill6hhmk3nut52g75mvdthqhb876i2i6.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/practice" element={<Practice />} />
              </Route>

              <Route path="/leaderboard" element={<Leaderboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes >
          </BrowserRouter >
        </TooltipProvider >
      </AuthProvider >
    </QueryClientProvider >
  </GoogleOAuthProvider >
);

export default App;
