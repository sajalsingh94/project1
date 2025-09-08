import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Layout from "./components/Layout";
import SellerLayout from "./components/SellerLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRedirect from "./components/RoleBasedRedirect";
import HomePage from "./pages/HomePage";
import ShopsPage from "./pages/ShopsPage";
import SellerDetailPage from "./pages/SellerDetailPage";
import RecipesPage from "./pages/RecipesPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import BecomeSellerPage from "./pages/BecomeSellerPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 2
    }
  }
});

const App = () =>
<QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <BrowserRouter>
          <RoleBasedRedirect>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shops" element={<ShopsPage />} />
                <Route path="/seller/:sellerId" element={<SellerDetailPage />} />
                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
                <Route path="/become-seller" element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <BecomeSellerPage />
                  </ProtectedRoute>
                } />
                <Route path="/seller/dashboard" element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <SellerLayout>
                      <SellerDashboardPage />
                    </SellerLayout>
                  </ProtectedRoute>
                } />
                <Route path="/seller/dashboard/:tab" element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <SellerLayout>
                      <SellerDashboardPage />
                    </SellerLayout>
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </RoleBasedRedirect>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>;


export default App;