"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase-browser";

export default function Dashboard() {
  const [name, setName] = useState("there");
  const [balance, setBalance] = useState("₦0.00");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (!data.session) { window.location.href = "/login"; return; }
      const res = await fetch("/api/me", { headers: { Authorization: `Bearer ${data.session.access_token}` } });
      if (res.ok) {
        const body = await res.json();
        setName(body.profile?.full_name || "there");
        setBalance(new Intl.NumberFormat("en-NG", { style: "currency", currency: body.wallet?.currency || "NGN" }).format(Number(body.wallet?.balance || 0)));
      }
      setLoading(false);
    };
    run();
  }, []);

  async function logout() { await createClient().auth.signOut(); window.location.href = "/login"; }

  return <main className="main" style={{maxWidth:1100,margin:"0 auto"}}>
    <div className="welcome"><div><h1>Good morning, {loading ? "…" : name.split(" ")[0]} 👋</h1><p>Your Quick account at a glance.</p></div><button className="btn btn-dark" onClick={logout}>Log out</button></div>
    <section className="balance"><div className="balance-label">Available balance</div><div className="balance-value">{loading ? "Loading…" : balance}</div><div className="balance-actions"><button className="btn btn-light">Add money</button><button className="btn btn-dark">Transactions</button></div></section>
    <h2 className="section-title">Your Quick account is ready</h2>
    <div className="grid"><section className="card"><div className="card-head"><h2>Wallet</h2></div><p className="muted">Your balance is stored in your Quick wallet and all movements will appear in your transaction ledger.</p></section><section className="card"><div className="card-head"><h2>Next step</h2></div><p className="muted">Fund your wallet to start using Quick services. Payment verification will be required before any wallet credit.</p></section></div>
  </main>;
}
