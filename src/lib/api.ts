export type TablePageRequest = {
  PageNo?: number;
  PageSize?: number;
  OrderByField?: string;
  IsAsc?: boolean;
  Filters?: Array<{ name: string; op: string; value: any }>;
};

async function request<T>(url: string, options: RequestInit = {}): Promise<{ data?: T; error?: any }> {
  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { error: json?.error || res.statusText };
    return { data: json.data as T };
  } catch (error) {
    return { error };
  }
}

export const api = {
  auth: {
    register: (payload: { email: string; password: string; role?: string; firstName?: string; lastName?: string; phone?: string; address?: string }) =>
      request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload: { email: string; password: string; role?: string }) =>
      request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    logout: () => request('/api/auth/logout', { method: 'POST' }),
    me: () => request('/api/auth/me')
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
        const res = await fetch('/api/sellers', { method: 'POST', body: form, credentials: 'include' });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) return { error: json?.error || res.statusText } as any;
        return { data: json.data } as any;
      } catch (error) {
        return { error } as any;
      }
    },
    getMe: () => request('/api/sellers/me')
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
        const res = await fetch('/api/products', { method: 'POST', body: form, credentials: 'include' });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) return { error: json?.error || res.statusText } as any;
        return { data: json.data } as any;
      } catch (error) {
        return { error } as any;
      }
    },
    getMe: () => request('/api/products/me')
  },
  upload: {
    image: async (file: File) => {
      const form = new FormData();
      form.append('image', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: form, credentials: 'include' });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) return { error: json?.error || res.statusText } as any;
        return { data: json.data } as any;
      } catch (error) {
        return { error } as any;
      }
    }
  },
  orders: {
    create: (payload: any) => request('/api/orders', { method: 'POST', body: JSON.stringify(payload) })
  },
  table: {
    page: (tableId: number, payload: TablePageRequest) =>
      request(`/api/table/page/${tableId}`, { method: 'POST', body: JSON.stringify(payload) }),
    create: (tableId: number, payload: any) =>
      request(`/api/table/create/${tableId}`, { method: 'POST', body: JSON.stringify(payload) })
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
  apis.login = async ({ email, password }: any) => api.auth.login({ email, password });
  apis.logout = async () => api.auth.logout();
  apis.getUserInfo = async () => api.auth.me();

  apis.tablePage = async (tableId: number, payload: TablePageRequest) => api.table.page(tableId, payload);
  apis.tableCreate = async (tableId: number, payload: any) => api.table.create(tableId, payload);
}

