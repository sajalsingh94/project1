import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        className={role === 'user' ? 'bg-clay-red hover:bg-clay-red-dark text-white' : ''}
      >
        User
      </Button>
      <Button
        type="button"
        variant={role === 'seller' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('seller')}
        className={role === 'seller' ? 'bg-clay-red hover:bg-clay-red-dark text-white' : ''}
      >
        Seller
      </Button>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<RoleType>('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isValid = emailSchema.safeParse(email).success && passwordSchema.safeParse(password).success;

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
      const { error } = await window.ezsite?.apis?.login({ email, password, role });
      if (error) {
        toast({
          title: "Login Failed",
          description: error,
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Login Successful",
        description: "Welcome back!"
      });
      
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      
      setTimeout(() => {
        if (role === 'seller') {
          navigate('/seller/dashboard');
        } else {
          navigate('/');
        }
      }, 100);
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
    <div className="min-h-screen bg-gradient-to-br from-warm-white to-cream flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-clay-red hover:text-clay-red-dark font-medium">
                Sign up
              </Link>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue your culinary journey</p>
          </div>

          {/* Role Toggle */}
          <div className="mb-6">
            <RoleToggle role={role} onChange={setRole} />
          </div>

          {/* Login Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                />
                {email && emailSchema.safeParse(email).success && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={!isValid || isSubmitting} 
              className="w-full bg-clay-red hover:bg-clay-red-dark text-white h-12 text-lg font-semibold"
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
      </div>

      {/* Right Panel - Illustrative Elements */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo via-indigo-dark to-clay-red relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-turmeric-yellow/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-16 w-48 h-48 bg-clay-red/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-leaf-green/20 rounded-full blur-xl"></div>
        </div>

        {/* Cards */}
        <div className="relative z-10 p-12 flex flex-col justify-center space-y-8">
          {/* Inbox Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Inbox</h3>
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                45
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">176,18</div>
            <div className="w-full h-16 bg-gradient-to-r from-orange-400 to-blue-500 rounded-lg flex items-center justify-center">
              <div className="text-white text-sm font-medium">Analytics Chart</div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
          </div>

          {/* Data Security Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your data, your rules</h3>
                <p className="text-sm text-gray-600">Your data belongs to you, and our encryption ensures that.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Helmet>
        <title>Login | Bihari Delicacies</title>
      </Helmet>
    </div>
  );
};

export default LoginPage;