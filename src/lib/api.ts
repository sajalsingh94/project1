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
    register: (payload: { email: string; password: string; role?: string }) =>
      request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload: { email: string; password: string; role?: string }) =>
      request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    logout: () => request('/api/auth/logout', { method: 'POST' }),
    me: () => request('/api/auth/me')
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

  apis.register = async ({ email, password, role }: any) => api.auth.register({ email, password, role });
  apis.login = async ({ email, password }: any) => api.auth.login({ email, password });
  apis.logout = async () => api.auth.logout();
  apis.getUserInfo = async () => api.auth.me();

  apis.tablePage = async (tableId: number, payload: TablePageRequest) => api.table.page(tableId, payload);
  apis.tableCreate = async (tableId: number, payload: any) => api.table.create(tableId, payload);
}

