import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
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
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import SellerBankingPage from "./pages/SellerBankingPage";
import BecomeSellerPage from "./pages/BecomeSellerPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import './styles/design-system.css';
import Dashboard from './pages/Dashboard';
import ShopDetails from './pages/ShopDetails';
import BankingDetails from './pages/BankingDetails';

function ProtectedSellerRoute({ children }: { children: React.ReactElement }) {
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  if (role !== 'seller') {
    return <Navigate to="/" replace />;
  }
  return children;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 2
    }
  }
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider>
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
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<SignUpPage />} />
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
                    <Route path="/payment" element={
                      <ProtectedRoute>
                        <PaymentPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/order-confirmation" element={
                      <ProtectedRoute>
                        <OrderConfirmationPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/seller/banking" element={
                      <ProtectedRoute allowedRoles={['seller']}>
                        <SellerBankingPage />
                      </ProtectedRoute>
                    } />
                    {/* Additional simple seller routes */}
                    <Route path="/dashboard" element={
                      <ProtectedSellerRoute>
                        <Dashboard />
                      </ProtectedSellerRoute>
                    } />
                    <Route path="/dashboard/shop-details" element={
                      <ProtectedSellerRoute>
                        <ShopDetails />
                      </ProtectedSellerRoute>
                    } />
                    <Route path="/dashboard/banking-details" element={
                      <ProtectedSellerRoute>
                        <BankingDetails />
                      </ProtectedSellerRoute>
                    } />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </RoleBasedRedirect>
            </BrowserRouter>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);


export default App;