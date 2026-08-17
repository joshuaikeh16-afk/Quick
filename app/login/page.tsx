"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else window.location.href = "/";
    setLoading(false);
  }

  return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:20}}><div className="card" style={{width:"100%",maxWidth:430}}><div className="brand" style={{marginBottom:28}}><div className="brand-mark">Q</div>Quick</div><h1 style={{fontSize:26,margin:"0 0 8px"}}>Welcome back</h1><p className="muted" style={{marginBottom:24}}>Sign in to manage your wallet and payments.</p><form onSubmit={submit}><label className="muted">Email</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required style={{width:"100%",padding:13,border:"1px solid #e5e7eb",borderRadius:9,margin:"7px 0 16px"}}/><label className="muted">Password</label><input value={password} onChange={e=>setPassword(e.target.value)} type="password" required style={{width:"100%",padding:13,border:"1px solid #e5e7eb",borderRadius:9,margin:"7px 0 18px"}}/>{error&&<p style={{color:"#dc2626",fontSize:13}}>{error}</p>}<button className="btn btn-dark" disabled={loading} style={{width:"100%"}}>{loading?"Signing in…":"Sign in"}</button></form></div></main>;
}
