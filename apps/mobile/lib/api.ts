const API_BASE = process.env.EXPO_PUBLIC_BACKEND_API_URL || 'http://localhost:8080/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data ?? json;
}

export const newsApi = {
  getLatest: (limit = 20) => request<any[]>(`/news?limit=${limit}`),
  getByCategory: (category: string, limit = 20) =>
    request<any[]>(`/news/category/${category}?limit=${limit}`),
  search: (query: string, limit = 20) =>
    request<any[]>(`/news/search?q=${encodeURIComponent(query)}&limit=${limit}`),
};

export const servicesApi = {
  getAll: () => request<any[]>('/services'),
  getById: (id: string) => request<any>(`/services/${id}`),
};

export const chatApi = {
  sendMessage: (message: string, sessionId?: string, language = 'en') =>
    request<any>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId, language }),
    }),
};

export const userApi = {
  get: (userId: string) => request<any>(`/users/${userId}`),
  createOrUpdate: (userId: string, data: { name: string; email: string; preferredLanguage: string }) =>
    request<any>(`/users/${userId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
