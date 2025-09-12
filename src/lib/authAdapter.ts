import { api } from './api';

async function register(payload: any) {
  if (typeof window !== 'undefined' && (window as any).ezsite?.apis?.register) {
    return (window as any).ezsite.apis.register(payload);
  }
  return api.auth.register(payload);
}

async function login(payload: any) {
  if (typeof window !== 'undefined' && (window as any).ezsite?.apis?.login) {
    return (window as any).ezsite.apis.login(payload);
  }
  return api.auth.login(payload);
}

async function me() {
  if (typeof window !== 'undefined' && (window as any).ezsite?.apis?.getUserInfo) {
    return (window as any).ezsite.apis.getUserInfo();
  }
  return api.auth.me();
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
  return api.auth.logout();
}

export default { register, login, me, logout };

