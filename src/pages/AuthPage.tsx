import React, { useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

type RoleType = 'user' | 'seller';

const SocialButtons: React.FC<{ action: 'login' | 'signup'; role: RoleType }>
  = ({ action, role }) => {
  const startProviderAuth = async (provider: 'google' | 'apple') => {
    try {
      // Prefer built-in ezsite OAuth if available
      if (window.ezsite && window.ezsite.apis && typeof window.ezsite.apis.oauthStart === 'function') {
        // Provide optional context including role and action for backend
        await window.ezsite.apis.oauthStart(provider, { role, action });
        return;
      }
      // Fallback: try method naming variations used by some ezsite versions
      if (window.ezsite?.apis?.loginWithProvider) {
        await window.ezsite.apis.loginWithProvider(provider, { role, action });
        return;
      }
      // Last resort: navigate to provider endpoints if exposed by backend
      const base = '/auth';
      const search = new URLSearchParams({ provider, role, action }).toString();
      window.location.href = `${base}/oauth/start?${search}`;
    } catch (error) {
      console.error('Social auth start error', error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        className="h-11 rounded-xl border-2 hover:bg-red-50"
        onClick={() => startProviderAuth('google')}
      >
        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-[4px] bg-white">
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </span>
        Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-11 rounded-xl border-2 hover:bg-gray-50"
        onClick={() => startProviderAuth('apple')}
      >
        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-[4px] bg-black text-white">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.365 1.43c0 1.14-.46 2.22-1.21 3.03-.77.83-2.05 1.46-3.15 1.35-.12-1.08.5-2.24 1.25-3.06C14.035 1.91 15.235 1.34 16.365 1.43zM19.495 17.04c-.33.76-.72 1.5-1.18 2.21-.62.95-1.13 1.61-1.52 1.97-.61.6-1.26.85-1.92.86-.63.01-1.04-.18-1.48-.39-.36-.17-.73-.35-1.33-.35-.62 0-1 .18-1.38.36-.43.2-.82.39-1.44.4-.69.01-1.29-.32-1.9-.92-.41-.39-.94-1.03-1.57-2-.68-1.02-1.24-2.19-1.67-3.5-.47-1.45-.71-2.84-.71-4.15 0-1.53.33-2.86.98-3.98.5-.89 1.17-1.6 2-2.12.82-.5 1.69-.78 2.6-.79.51 0 1.17.2 1.98.58.79.37 1.3.56 1.53.56.17 0 .7-.22 1.6-.65.86-.39 1.58-.55 2.16-.49 1.6.13 2.81.78 3.6 1.94-1.42.86-2.11 2.06-2.08 3.61.02 1.21.45 2.22 1.28 3.01.38.37.86.66 1.43.86-.12.35-.24.68-.37 1z"/>
          </svg>
        </span>
        Apple
      </Button>
    </div>
  );
};

const RoleToggle: React.FC<{ role: RoleType; onChange: (r: RoleType) => void }>
  = ({ role, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant={role === 'user' ? 'default' : 'outline'}
        onClick={() => onChange('user')}
      >
        User
      </Button>
      <Button
        type="button"
        variant={role === 'seller' ? 'default' : 'outline'}
        onClick={() => onChange('seller')}
      >
        Seller
      </Button>
    </div>
  );
};

const AuthForm: React.FC<{ mode: 'login' | 'signup'; role: RoleType }>
  = ({ mode, role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isValid = useMemo(() => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      if (mode === 'signup') {
        // basic sanity checks for extra fields
        if (!firstName.trim() || !lastName.trim()) return false;
      }
      return true;
    } catch {
      return false;
    }
  }, [email, password, mode, firstName, lastName]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please check your email format and ensure all required fields are filled.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
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
        
        // Trigger auth state refresh across the app
        window.dispatchEvent(new CustomEvent('authStateChanged'));
        
        // Small delay to ensure auth state is updated
        setTimeout(() => {
          if (role === 'seller') {
            navigate('/seller/dashboard');
          } else {
            navigate('/');
          }
        }, 100);
        return;
      } else {
        const payload = { email, password, role, firstName, lastName, phone, address } as any;
        const { error } = await window.ezsite?.apis?.register(payload);
        if (error) {
          toast({
            title: "Registration Failed",
            description: error,
            variant: "destructive"
          });
          return;
        }
        toast({
          title: "Account Created",
          description: "Your account has been created successfully! Please log in to continue."
        });
        
        // Redirect to login page after successful registration
        navigate('/login?mode=login');
      }
    } catch (err) {
      console.error('Auth error', err);
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
    <form onSubmit={onSubmit} className="space-y-6">
      {mode === 'signup' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input id={`${mode}-first-name`} value={firstName} onChange={(e) => setFirstName(e.target.value)} className="peer h-12 pl-10 pt-4 rounded-xl" placeholder=" " />
            <Label htmlFor={`${mode}-first-name`} className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-clay-red peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs">First Name</Label>
          </div>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input id={`${mode}-last-name`} value={lastName} onChange={(e) => setLastName(e.target.value)} className="peer h-12 pl-10 pt-4 rounded-xl" placeholder=" " />
            <Label htmlFor={`${mode}-last-name`} className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-clay-red peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs">Last Name</Label>
          </div>
          <div className="relative sm:col-span-2">
            <Input id={`${mode}-phone`} value={phone} onChange={(e) => setPhone(e.target.value)} className="peer h-12 pl-4 pt-4 rounded-xl" placeholder=" " />
            <Label htmlFor={`${mode}-phone`} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-clay-red peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs">Phone</Label>
          </div>
          <div className="relative sm:col-span-2">
            <Input id={`${mode}-address`} value={address} onChange={(e) => setAddress(e.target.value)} className="peer h-12 pl-4 pt-4 rounded-xl" placeholder=" " />
            <Label htmlFor={`${mode}-address`} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-clay-red peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs">Address</Label>
          </div>
        </div>
      )}

      <div className="relative">
        <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input id={`${mode}-email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="peer h-12 pl-10 pt-4 rounded-xl" placeholder=" " />
        <Label htmlFor={`${mode}-email`} className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-clay-red peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs">Email</Label>
      </div>

      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input id={`${mode}-password`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="peer h-12 pl-10 pt-4 rounded-xl" placeholder=" " />
        <Label htmlFor={`${mode}-password`} className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-clay-red peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs">Password</Label>
        {mode === 'login' && (
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-sm text-indigo hover:text-indigo-dark">Forgot password?</Link>
          </div>
        )}
      </div>

      <Button type="submit" disabled={!isValid || isSubmitting} className="w-full h-12 rounded-xl bg-clay-red text-white hover:bg-clay-red-dark transition-transform duration-200 hover:scale-[1.01]">
        {isSubmitting ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
      </Button>

      {mode === 'signup' && (
        <p className="text-xs text-center text-gray-500">By creating an account, you agree to our <a className="underline hover:text-gray-700" href="#">Terms</a> & <a className="underline hover:text-gray-700" href="#">Privacy Policy</a>.</p>
      )}

      {!isValid && (
        <p className="text-sm text-red-600 text-center">
          Please enter a valid email address and ensure all required fields are filled.
        </p>
      )}
    </form>
  );
};

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const modeParam = (searchParams.get('mode') as 'login' | 'signup') || undefined;
  const roleParam = (searchParams.get('role') as RoleType) || undefined;
  const isRegisterPath = location.pathname.toLowerCase().includes('/register');
  const defaultTab = modeParam || (isRegisterPath ? 'signup' : 'login');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const [role, setRole] = useState<RoleType>(roleParam || 'user');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-warm-white to-cream">
      <Helmet>
        <title>{activeTab === 'login' ? 'Login' : 'Sign Up'} | Bihari Delicacies</title>
      </Helmet>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-lg">
        <Card className="rounded-2xl shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-playfair">
                  {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <CardDescription className="mt-1">Choose role and continue with email or social login.</CardDescription>
              </div>
              <RoleToggle role={role} onChange={setRole} />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid grid-cols-2 w-full rounded-xl">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <div className="mt-6 space-y-6">
                <TabsContent value="login" className="space-y-6">
                  <SocialButtons action="login" role={role} />
                  <div className="flex items-center gap-3"><Separator className="flex-1" /><span className="text-sm text-muted-foreground">or continue with email</span><Separator className="flex-1" /></div>
                  <AuthForm mode="login" role={role} />
                </TabsContent>
                <TabsContent value="signup" className="space-y-6">
                  <SocialButtons action="signup" role={role} />
                  <div className="flex items-center gap-3"><Separator className="flex-1" /><span className="text-sm text-muted-foreground">or sign up with email</span><Separator className="flex-1" /></div>
                  <AuthForm mode="signup" role={role} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;

