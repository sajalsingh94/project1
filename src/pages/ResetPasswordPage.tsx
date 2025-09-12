import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import PasswordStrength from '@/components/PasswordStrength';
import { Helmet } from 'react-helmet-async';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const valid = password.length >= 8 && password === confirm && Boolean(token);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !token) return;
    setIsSubmitting(true);
    try {
      const { error } = await api.auth.resetPassword(token, { password });
      if (error) {
        toast({ title: 'Error', description: String(error), variant: 'destructive' });
      } else {
        toast({ title: 'Password reset', description: 'Your password has been updated.' });
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-2">Reset Password</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Enter a new password for your account.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input id="password" type={show1 ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" />
              <button type="button" onClick={() => setShow1((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {show1 ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input id="confirm" type={show2 ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="pl-10 pr-10" />
              <button type="button" onClick={() => setShow2((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {show2 ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={!valid || isSubmitting} className="w-full">
            {isSubmitting ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      </div>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
    </div>
  );
};

export default ResetPasswordPage;

