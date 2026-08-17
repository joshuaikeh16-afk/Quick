const BASE_URL = "https://iacafe.com.ng/devapi/v1";

export async function iacafeRequest<T>(path: string, init: RequestInit = {}) {
  const key = process.env.IACAFE_API_KEY;
  if (!key) throw new Error("IACAFE_API_KEY is not configured");
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error?.message || body?.message || `IA-Café request failed (${response.status})`);
  return body as T;
}

export function makeRequestId(prefix = "quick") {
  return `${prefix}_${Date.now()}_${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`;
}
