import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from '@/lib/api';

interface RoleBasedRedirectProps {
  children: React.ReactNode;
}

const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthStateChange = () => {
      checkAuth();
    };

    window.addEventListener('authStateChanged', handleAuthStateChange);
    return () => window.removeEventListener('authStateChanged', handleAuthStateChange);
  }, []);

  const checkAuth = async () => {
    try {
      const getUserInfo = window.ezsite?.apis?.getUserInfo;
      const { data, error } = getUserInfo
        ? await getUserInfo()
        : await api.auth.me();
      if (error || !data) {
        setUser(null);
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return <>{children}</>;
  }

  // Do not auto-redirect sellers; allow normal navigation to home

  // For regular users, check if they're trying to access a seller-only route
  const sellerRoutes = ['/seller/dashboard', '/become-seller'];
  const isSellerRoute = sellerRoutes.some(route => location.pathname.startsWith(route));
  
  if (isSellerRoute && user.Roles !== 'seller') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRedirect;