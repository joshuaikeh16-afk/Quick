import { NextResponse } from "next/server";
import { createServerClient } from "../../../lib/supabase-server";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const token = auth.slice(7);
  const supabase = createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [{ data: profile }, { data: wallet }] = await Promise.all([
    supabase.from("profiles").select("full_name,phone,avatar_url").eq("id", user.id).single(),
    supabase.from("wallets").select("balance,currency").eq("user_id", user.id).single(),
  ]);
  return NextResponse.json({ user: { id: user.id, email: user.email }, profile, wallet });
}
