import { auth } from "@/lib/firebase/client";

/**
 * A centralized, typed API client.
 *
 * - Automatically attaches the Firebase ID token.
 * - Centralizes JSON error parsing — callers never check `if (!res.ok)` manually.
 * - Throws a typed `ApiError` on non-2xx responses for consistent error handling.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function getToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new ApiError("Not authenticated", 401, "UNAUTHENTICATED");
  return user.getIdToken();
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = json?.error?.message || json?.message || `Request failed (${res.status})`;
    const code = json?.error?.code;
    throw new ApiError(message, res.status, code);
  }

  return json.data as T;
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),

  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};
