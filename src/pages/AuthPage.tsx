import React, { useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';

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
    <div className="grid grid-cols-1 gap-2">
      <Button variant="outline" onClick={() => startProviderAuth('google')}>
        Continue with Google
      </Button>
      <Button variant="outline" onClick={() => startProviderAuth('apple')}>
        Continue with Apple
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isValid = useMemo(() => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      return true;
    } catch {
      return false;
    }
  }, [email, password]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        if (window.ezsite?.apis?.login) {
          await window.ezsite.apis.login({ email, password, role });
        } else {
          await window.ezsite?.apis?.auth?.login?.({ email, password, role });
        }
      } else {
        if (window.ezsite?.apis?.register) {
          await window.ezsite.apis.register({ email, password, role });
        } else {
          await window.ezsite?.apis?.auth?.register?.({ email, password, role });
        }
      }
      navigate('/');
    } catch (err) {
      console.error('Auth error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${mode}-email`}>Email</Label>
        <Input
          id={`${mode}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${mode}-password`}>Password</Label>
        <Input
          id={`${mode}-password`}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      <Button type="submit" disabled={!isValid || isSubmitting} className="w-full">
        {mode === 'login' ? 'Log in' : 'Create account'}
      </Button>
    </form>
  );
};

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = (searchParams.get('mode') as 'login' | 'signup') || 'login';
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const [role, setRole] = useState<RoleType>('user');

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <Helmet>
        <title>{activeTab === 'login' ? 'Login' : 'Sign Up'} | Bihari Delicacies</title>
      </Helmet>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
          </CardTitle>
          <CardDescription>
            Choose role and continue with email or social login.
          </CardDescription>
          <RoleToggle role={role} onChange={setRole} />
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <div className="mt-4 space-y-4">
              <TabsContent value="login" className="space-y-4">
                <SocialButtons action="login" role={role} />
                <div className="flex items-center gap-2"><Separator className="flex-1" /><span className="text-sm text-muted-foreground">or</span><Separator className="flex-1" /></div>
                <AuthForm mode="login" role={role} />
              </TabsContent>
              <TabsContent value="signup" className="space-y-4">
                <SocialButtons action="signup" role={role} />
                <div className="flex items-center gap-2"><Separator className="flex-1" /><span className="text-sm text-muted-foreground">or</span><Separator className="flex-1" /></div>
                <AuthForm mode="signup" role={role} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;

