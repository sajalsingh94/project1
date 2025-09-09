import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
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
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.Roles)) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      variant: "destructive"
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;