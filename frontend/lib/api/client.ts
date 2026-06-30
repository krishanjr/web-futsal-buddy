// Server-only fetch wrapper around the Futsal Buddy Express API.
// Never import this from a client component.

export const API_BASE_URL =
  process.env.API_BASE_URL || "http://localhost:5000/api/v1";

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number };
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  token?: string;
  body?: unknown;
  // skip Next.js fetch caching for dynamic admin data
  cache?: RequestCache;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", token, body, cache = "no-store" } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache,
    });
  } catch {
    return {
      status: 0,
      success: false,
      message:
        "Could not reach the Futsal Buddy API. Is the backend server running?",
      data: null as T,
    };
  }

  let json: ApiResponse<T>;
  try {
    json = await res.json();
  } catch {
    return {
      status: res.status,
      success: false,
      message: "Unexpected response from server",
      data: null as T,
    };
  }

  return json;
}
