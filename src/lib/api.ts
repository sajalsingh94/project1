export type TablePageRequest = {
  PageNo?: number;
  PageSize?: number;
  OrderByField?: string;
  IsAsc?: boolean;
  Filters?: Array<{ name: string; op: string; value: any }>;
};

type ApiResult<T> = { data?: T; error?: any };

const BASE_URL: string = (typeof window !== 'undefined' && (window as any).VITE_API_BASE_URL)
  ? (window as any).VITE_API_BASE_URL
  : (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) || '/api';

function buildUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith('/')) return `${BASE_URL}${path.replace(/^\/+/, '/')}`;
  return `${BASE_URL}/${path}`;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {} as any;
    const res = await fetch(buildUrl(url), {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...authHeader, ...(options.headers || {}) },
      ...options
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { error: json?.error || json?.message || res.statusText };
    const data = (json?.data !== undefined ? json.data : json) as T;
    return { data };
  } catch (error) {
    return { error };
  }
}

export const api = {
  auth: {
    register: (payload: { email: string; password: string; role?: string; firstName?: string; lastName?: string; phone?: string; address?: string }) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload: { email: string; password: string; role?: string }) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    me: () => request('/auth/me')
  },
  sellers: {
    create: async (payload: any) => {
      const form = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'profile_image' || key === 'banner_image') {
            form.append(key, value as any);
          } else {
            form.append(key, String(value));
          }
        }
      });
      try {
        const res = await fetch(buildUrl('/sellers'), { method: 'POST', body: form, credentials: 'include' });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) return { error: json?.error || res.statusText } as any;
        return { data: json.data } as any;
      } catch (error) {
        return { error } as any;
      }
    },
    getMe: () => request('/sellers/me')
  },
  products: {
    create: async (payload: any) => {
      const form = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'main_image' || key === 'additional_images') {
            if (Array.isArray(value)) {
              value.forEach(file => form.append(key, file));
            } else {
              form.append(key, value as any);
            }
          } else {
            form.append(key, String(value));
          }
        }
      });
      try {
        const res = await fetch(buildUrl('/products'), { method: 'POST', body: form, credentials: 'include' });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) return { error: json?.error || res.statusText } as any;
        return { data: json.data } as any;
      } catch (error) {
        return { error } as any;
      }
    },
    getMe: () => request('/products/me')
  },
  upload: {
    image: async (file: File) => {
      const form = new FormData();
      form.append('image', file);
      try {
        const res = await fetch(buildUrl('/upload'), { method: 'POST', body: form, credentials: 'include' });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) return { error: json?.error || res.statusText } as any;
        return { data: json.data } as any;
      } catch (error) {
        return { error } as any;
      }
    }
  },
  orders: {
    create: (payload: any) => request('/orders', { method: 'POST', body: JSON.stringify(payload) })
  },
  payments: {
    simulate: (payload: any) => request('/payments/simulate', { method: 'POST', body: JSON.stringify(payload) })
  },
  sellerBanking: {
    get: () => request('/sellers/banking'),
    save: (payload: any) => request('/sellers/banking', { method: 'POST', body: JSON.stringify(payload) })
  },
  table: {
    page: (tableId: number, payload: TablePageRequest) =>
      request(`/table/page/${tableId}`, { method: 'POST', body: JSON.stringify(payload) }),
    create: (tableId: number, payload: any) =>
      request(`/table/create/${tableId}`, { method: 'POST', body: JSON.stringify(payload) })
  }
};

declare global {
  interface Window {
    ezsite?: any;
  }
}

// Provide a drop-in polyfill for existing code that uses window.ezsite.apis
if (typeof window !== 'undefined') {
  window.ezsite = window.ezsite || {};
  window.ezsite.apis = window.ezsite.apis || {};
  const apis = window.ezsite.apis;

  apis.register = async (payload: any) => api.auth.register(payload);
  apis.login = async (payload: any) => api.auth.login(payload);
  apis.logout = async () => api.auth.logout();
  apis.getUserInfo = async () => api.auth.me();

  apis.tablePage = async (tableId: number, payload: TablePageRequest) => api.table.page(tableId, payload);
  apis.tableCreate = async (tableId: number, payload: any) => api.table.create(tableId, payload);
}

