export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

async function getCsrfToken(): Promise<string | undefined> {
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}/csrf-token`, {
      credentials: "include",
    });
    const data = await res.json();
    return data.csrfToken as string | undefined;
  } catch {
    return undefined;
  }
}

export async function api<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const method = (init?.method || "GET").toUpperCase();
  const isFormData = init?.body instanceof FormData;
  const isJson = init?.body && !isFormData;
  const headers: Record<string, string> = isJson
    ? { "Content-Type": "application/json" }
    : {};

  let body = init?.body;

  if (method !== "GET" && method !== "HEAD" && !path.startsWith("/auth/")) {
    const token = await getCsrfToken();
    if (token) {
      headers["csrf-token"] = token;
      headers["X-CSRF-Token"] = token;
      if (isFormData && body instanceof FormData) {
        const newFormData = new FormData();
        for (const [key, value] of body.entries()) {
          newFormData.append(key, value);
        }
        newFormData.append("_csrf", token);
        body = newFormData;
      }
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { ...headers, ...(init?.headers || {}) },
    ...init,
    body,
  });
  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const json = await res.json();
      throw new Error(JSON.stringify(json));
    }
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.headers.get("content-type")?.includes("application/json")
    ? ((await res.json()) as T)
    : (undefined as unknown as T);
}
