import { auth } from './firebase';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
      headers['X-User-Id'] = auth.currentUser.uid;
    } catch (err) {
      console.error('Failed to get auth token', err);
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data ?? json;
}

// ─── News API ───
export const newsApi = {
  getLatest: (limit = 20) => request<any[]>(`/news?limit=${limit}`),
  getByCategory: (category: string, limit = 20) =>
    request<any[]>(`/news/category/${category}?limit=${limit}`),
  getByDistrict: (district: string, limit = 20) =>
    request<any[]>(`/news/district/${district}?limit=${limit}`),
  search: (query: string, limit = 20) =>
    request<any[]>(`/news/search?q=${encodeURIComponent(query)}&limit=${limit}`),
  getById: (id: string) => request<any>(`/news/${id}`),
};

// ─── Government Services API ───
export const servicesApi = {
  getAll: () => request<any[]>('/services'),
  getById: (id: string) => request<any>(`/services/${id}`),
};

// ─── Chat API ───
export const chatApi = {
  sendMessage: (message: string, sessionId?: string, language = 'en') =>
    request<any>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId, language }),
    }),
  getSessions: () => request<any[]>('/chat/sessions'),
  getSession: (sessionId: string) => request<any>(`/chat/sessions/${sessionId}`),
  deleteSession: (sessionId: string) =>
    request<any>(`/chat/sessions/${sessionId}`, { method: 'DELETE' }),
};

// ─── User API ───
export const userApi = {
  get: (userId: string) => request<any>(`/users/${userId}`),
  createOrUpdate: (userId: string, data: { name: string; email: string; preferredLanguage: string }) =>
    request<any>(`/users/${userId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateLanguage: (userId: string, language: string) =>
    request<any>(`/users/${userId}/language`, {
      method: 'PATCH',
      body: JSON.stringify({ language }),
    }),
};
