import Constants from "expo-constants";
import { getStoredToken } from "@/features/auth/authStorage";

export function getApiBaseUrl(): string {
  const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
  return (
    extra?.apiBaseUrl ??
    process.env.EXPO_PUBLIC_API_URL ??
    "http://10.0.2.2:8080"
  ).replace(/\/$/, "");
}

async function readApiError(res: Response): Promise<string> {
  try {
    const text = await res.text();
    if (!text) return res.statusText || `HTTP ${res.status}`;
    try {
      const j = JSON.parse(text) as {
        message?: string;
        detail?: string;
        error?: string;
      };
      return j.message ?? j.detail ?? j.error ?? text;
    } catch {
      return text;
    }
  } catch {
    return res.statusText || `HTTP ${res.status}`;
  }
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers);
  const token = await getStoredToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (
    init.body != null &&
    typeof init.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(url, { ...init, headers });
}

export async function apiFetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, init);
  if (!res.ok) {
    throw new Error(await readApiError(res));
  }
  return res.json() as Promise<T>;
}

export async function throwIfNotOk(res: Response): Promise<void> {
  if (!res.ok) {
    throw new Error(await readApiError(res));
  }
}
