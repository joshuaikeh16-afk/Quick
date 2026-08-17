"use client";

import { FormEvent, useState } from "react";

const networks = ["mtn", "airtel", "glo", "9mobile"];

export default function AirtimePage() {
  const [network, setNetwork] = useState("mtn");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState("");

  function submit(e: FormEvent) { e.preventDefault(); setMessage("Airtime checkout is ready for the secure wallet/API step."); }

  return <main className="main" style={{maxWidth:760,margin:"0 auto"}}><a href="/" className="muted">← Back to dashboard</a><div className="card" style={{marginTop:18}}><div className="brand" style={{marginBottom:24}}><div className="brand-mark">Q</div>Quick</div><h1 style={{fontSize:26,margin:"0 0 7px"}}>Buy airtime</h1><p className="muted" style={{marginBottom:26}}>Instant top-up for every major Nigerian network.</p><form onSubmit={submit}><label className="muted">Network</label><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,margin:"8px 0 20px"}}>{networks.map(n=><button type="button" key={n} onClick={()=>setNetwork(n)} className={network===n?"btn btn-dark":"btn"} style={{background:network===n?undefined:"#f3f4f6"}}>{n.toUpperCase()}</button>)}</div><label className="muted">Phone number</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="08012345678" inputMode="numeric" required style={{width:"100%",padding:13,border:"1px solid #e5e7eb",borderRadius:9,margin:"7px 0 18px"}}/><label className="muted">Amount</label><div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"8px 0 18px"}}>{[100,200,500,1000,2000,5000].map(v=><button type="button" key={v} onClick={()=>setAmount(v)} className={amount===v?"btn btn-dark":"btn"} style={{background:amount===v?undefined:"#f3f4f6"}}>₦{v.toLocaleString()}</button>)}</div><input type="number" min="50" value={amount} onChange={e=>setAmount(Number(e.target.value))} required style={{width:"100%",padding:13,border:"1px solid #e5e7eb",borderRadius:9,marginBottom:20}}/><button className="btn btn-dark" style={{width:"100%"}}>Continue · ₦{amount.toLocaleString()}</button>{message&&<p style={{color:"#16a34a",fontSize:13,marginTop:14}}>{message}</p>}</form></div></main>;
}
