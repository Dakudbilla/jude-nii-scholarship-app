import { auth } from "@/lib/firebase/client";

/**
 * Wrapper around fetch that automatically attaches the Firebase ID token
 * as a Bearer token in the Authorization header.
 *
 * Usage:  const data = await authFetch("/api/applications");
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
