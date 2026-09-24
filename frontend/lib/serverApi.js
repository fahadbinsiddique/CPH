import { cookies, headers } from 'next/headers';

const BASE_URL = process.env.API_BACKEND_URL || 'http://localhost:8000';

async function request(method, path, { body, params, next } = {}) {
  const cookieStore = await cookies();
  const headerStore = await headers();

  // middleware() rotates the session before this render when the access
  // cookie was missing/expired and forwards the freshly minted token via the
  // x-access-token request header — prefer it over the cookie, which still
  // holds the pre-refresh value for this one request.
  const token =
    headerStore.get('x-access-token') || cookieStore.get('access_token')?.value;

  // NOTE: there is deliberately no refresh logic here. cookies().set() is not
  // allowed during a Server Component render in Next.js (it throws), and
  // rotating tokens from a render would blacklist the browser's refresh
  // cookie without ever persisting the replacement — which is exactly how
  // sessions used to die silently. Refresh is owned by middleware (before
  // render) and the axios interceptor (client XHR).
  const url = new URL(path, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null) url.searchParams.set(k, String(v));
    });
  }

  // NB: named reqHeaders — a local `headers` would shadow the headers()
  // import above and throw a TDZ ReferenceError on line 7.
  const reqHeaders = { Accept: 'application/json' };
  if (token) reqHeaders.Authorization = `Bearer ${token}`;

  const isFormData = body instanceof FormData;
  if (body && !isFormData) {
    reqHeaders['Content-Type'] = 'application/json';
  }

  const defaultNext = method === 'GET' ? { revalidate: 60 } : undefined;

  const res = await fetch(url.toString(), {
    method,
    headers: reqHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    next: next ?? defaultNext,
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
