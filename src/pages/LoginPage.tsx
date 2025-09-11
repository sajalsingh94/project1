import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Lock, User, Facebook, Instagram } from 'lucide-react';

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

type RoleType = 'user' | 'seller';

const SocialButtons: React.FC<{ role: RoleType }> = ({ role }) => {
  const startProviderAuth = async (provider: 'google' | 'facebook') => {
    try {
      if (window.ezsite && window.ezsite.apis && typeof window.ezsite.apis.oauthStart === 'function') {
        await window.ezsite.apis.oauthStart(provider, { role, action: 'login' });
        return;
      }
      if (window.ezsite?.apis?.loginWithProvider) {
        await window.ezsite.apis.loginWithProvider(provider, { role, action: 'login' });
        return;
      }
      const base = '/auth';
      const search = new URLSearchParams({ provider, role, action: 'login' }).toString();
      window.location.href = `${base}/oauth/start?${search}`;
    } catch (error) {
      console.error('Social auth start error', error);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        className="w-12 h-12 rounded-full border-2 hover:bg-blue-50"
        onClick={() => startProviderAuth('facebook')}
      >
        <Facebook className="w-5 h-5 text-blue-600" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="w-12 h-12 rounded-full border-2 hover:bg-red-50"
        onClick={() => startProviderAuth('google')}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </Button>
    </div>
  );
};

const RoleToggle: React.FC<{ role: RoleType; onChange: (r: RoleType) => void }> = ({ role, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant={role === 'user' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('user')}
        className={role === 'user' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
      >
        User
      </Button>
      <Button
        type="button"
        variant={role === 'seller' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('seller')}
        className={role === 'seller' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
      >
        Seller
      </Button>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RoleType>('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isValid = 
    emailSchema.safeParse(email).success && 
    passwordSchema.safeParse(password).success;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please check your email format and password length.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await window.ezsite?.apis?.login({ email, password, role });
      if (error) {
        toast({
          title: "Login Failed",
          description: error,
          variant: "destructive"
        });
        return;
      }
      // Persist auth like requested
      if (data && (data as any).token) {
        localStorage.setItem('token', (data as any).token);
      }
      if (data && ((data as any).role || (data as any).Roles)) {
        localStorage.setItem('role', (data as any).role || (data as any).Roles);
      }
      navigate('/');
    } catch (err) {
      console.error('Login error', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="text-sm text-gray-600">
              New to Bihari Delicacies?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-base text-gray-600">Sign in to your account to continue.</p>
          </div>

          {/* Role Toggle */}
          <div className="mb-6">
            <RoleToggle role={role} onChange={setRole} />
          </div>

          {/* Login Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base text-gray-600">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base text-gray-600">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={!isValid || isSubmitting} 
              className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-4">
              <Separator className="flex-1" />
              <span className="text-sm text-gray-500">Or</span>
              <Separator className="flex-1" />
            </div>
            <SocialButtons role={role} />
          </div>

          {/* Language Selector */}
          <div className="mt-8 flex items-center gap-2 text-sm text-gray-600">
            <div className="w-6 h-4 bg-gradient-to-r from-blue-600 to-red-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">
              EN
            </div>
            <span>ENG</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
      </div>

      <Helmet>
        <title>Login | Bihari Delicacies</title>
      </Helmet>
    </div>
  );
};

export default LoginPage;