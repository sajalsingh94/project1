import axios from 'axios';

async function register(payload: any) {
  if (typeof window !== 'undefined' && (window as any).ezsite?.apis?.register) {
    return (window as any).ezsite.apis.register(payload);
  }
  const res = await axios.post('/api/auth/register', payload, { headers: { 'Content-Type': 'application/json' } });
  return res.data;
}

async function login(payload: any) {
  if (typeof window !== 'undefined' && (window as any).ezsite?.apis?.login) {
    return (window as any).ezsite.apis.login(payload);
  }
  const res = await axios.post('/api/auth/login', payload, { headers: { 'Content-Type': 'application/json' } });
  return res.data;
}

async function me() {
  if (typeof window !== 'undefined' && (window as any).ezsite?.apis?.getUserInfo) {
    return (window as any).ezsite.apis.getUserInfo();
  }
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await axios.get('/api/auth/me', { headers });
  return res.data;
}

async function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.dispatchEvent(new CustomEvent('authStateChanged'));
  }
  if ((window as any)?.ezsite?.apis?.logout) {
    return (window as any).ezsite.apis.logout();
  }
  return { success: true };
}

export default { register, login, me, logout };

