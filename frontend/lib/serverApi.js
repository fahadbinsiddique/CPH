import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function request(method, path, { body, params, next } = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  const url = new URL(path, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null) url.searchParams.set(k, String(v));
    });
  }

  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const isFormData = body instanceof FormData;
  if (body && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    next,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const error = new Error(data?.detail || data?.error || `Request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  if (res.status === 204) return null;
  return res.json();
}

const serverApi = {
  get: (path, opts) => request('GET', path, opts),
  post: (path, body, opts) => request('POST', path, { ...opts, body }),
  patch: (path, body, opts) => request('PATCH', path, { ...opts, body }),
  delete: (path, opts) => request('DELETE', path, opts),
};

export default serverApi;
