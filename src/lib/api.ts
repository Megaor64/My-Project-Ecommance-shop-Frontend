const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3005";

export function getApiBaseUrl(): string {
  return API_URL;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<Response> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  return fetch(url, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });
}

export async function apiJson<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const res = await apiFetch(path, options, token);
  const json = (await res.json()) as T & { message?: string };
  if (!res.ok) {
    throw new Error(
      (json as { message?: string }).message ?? `Request failed: ${res.status}`
    );
  }
  return json;
}
