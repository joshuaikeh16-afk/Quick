import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "../../../lib/supabase-server";
import { buyAirtime } from "../../../lib/ia-cafe";

function ref(prefix: string) { return `${prefix}_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`; }

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = auth.slice(7);
    const authClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: { user } } = await authClient.auth.getUser(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const phone = String(body.phone ?? "").replace(/\s+/g, "");
    const serviceId = String(body.service_id ?? "").toLowerCase();
    const amount = Number(body.amount);
    if (!/^0\d{10}$/.test(phone) || !["mtn", "airtel", "glo", "9mobile"].includes(serviceId) || !Number.isFinite(amount) || amount < 50 || amount > 100000) {
      return NextResponse.json({ error: "Invalid airtime details" }, { status: 400 });
    }

    const db = createServerClient();
    const orderRef = ref("QK_AIRTIME");
    const { data: order, error: orderError } = await db.from("orders").insert({ user_id: user.id, reference: orderRef, service_type: "airtime", amount, recipient: phone, request_payload: { phone, service_id: serviceId, amount } }).select("id,reference,status,amount").single();
    if (orderError || !order) return NextResponse.json({ error: "Could not create order" }, { status: 500 });

    const debitRef = ref("QK_DEBIT");
    const { error: debitError } = await db.rpc("debit_wallet", { p_user_id: user.id, p_amount: amount, p_reference: debitRef, p_description: `Airtime purchase · ${phone}` });
    if (debitError) {
      await db.from("orders").update({ status: "failed", response_payload: { reason: debitError.message } }).eq("id", order.id);
      return NextResponse.json({ error: debitError.message.includes("Insufficient") ? "Insufficient wallet balance" : "Unable to debit wallet" }, { status: 400 });
    }

    await db.from("orders").update({ status: "processing" }).eq("id", order.id);
    const provider = await buyAirtime({ requestId: orderRef, phone, serviceId, amount });
    const providerStatus = provider.data?.data?.status ?? provider.data?.status;

    if (provider.status >= 200 && provider.status < 300) {
      const completed = providerStatus === "completed-api" || providerStatus === "completed";
      await db.from("orders").update({ status: completed ? "completed" : "processing", provider_reference: String(provider.data?.data?.order_id ?? ""), response_payload: provider.data }).eq("id", order.id);
      return NextResponse.json({ success: true, status: completed ? "completed" : "processing", reference: orderRef, provider: provider.data }, { status: completed ? 200 : 202 });
    }

    await db.from("orders").update({ status: "failed", response_payload: provider.data }).eq("id", order.id);
    const refundRef = ref("QK_REFUND");
    await db.rpc("credit_wallet", { p_user_id: user.id, p_amount: amount, p_reference: refundRef, p_description: `Airtime refund · ${orderRef}` });
    return NextResponse.json({ error: "Airtime purchase failed; your wallet has been refunded", reference: orderRef }, { status: 502 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
