/**
 * A fetch wrapper for public API routes that do not require Firebase auth.
 * Mirrors the shape of apiClient so callers look identical.
 */

export class PublicApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "PublicApiError";
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = json?.error?.message || json?.message || `Request failed (${res.status})`;
    throw new PublicApiError(message, res.status);
  }

  return json.data as T;
}

export const publicClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
};
