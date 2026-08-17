const BASE_URL = "https://iacafe.com.ng/devapi/v1";

function key() {
  if (!process.env.IA_CAFE_API_KEY) throw new Error("IA_CAFE_API_KEY is not configured");
  return process.env.IA_CAFE_API_KEY;
}

export async function buyAirtime(input: { requestId: string; phone: string; serviceId: string; amount: number }) {
  const response = await fetch(`${BASE_URL}/airtime`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ request_id: input.requestId, phone: input.phone, service_id: input.serviceId, amount: input.amount }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok || response.status === 202, status: response.status, data };
}
