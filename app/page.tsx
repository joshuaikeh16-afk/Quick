import { ArrowDownLeft, ArrowUpRight, Cable, CreditCard, Database, Droplets, Gamepad2, Lightbulb, Smartphone, Wifi } from "lucide-react";

const services = [
  ["Airtime", "Top up any network", Smartphone],
  ["Data", "Fast data bundles", Wifi],
  ["Electricity", "Pay your power bill", Lightbulb],
  ["Cable TV", "Renew your subscription", Cable],
  ["Betting", "Fund your wallet", Gamepad2],
  ["ePINs", "Digital vouchers", CreditCard],
  ["Water", "Pay utility bills", Droplets],
  ["More", "More services coming", Database],
] as const;

const transactions = [
  ["MTN Airtime", "Today · 10:42 AM", "−₦1,000"],
  ["Wallet funding", "Yesterday · 7:18 PM", "+₦10,000"],
  ["Data bundle", "Yesterday · 2:05 PM", "−₦2,500"],
];

export default function Home() {
  return <div className="shell">
    <header className="topbar"><div className="brand"><div className="brand-mark">Q</div>Quick</div><div className="user-chip"><div><strong style={{fontSize:13}}>Welcome back</strong><div className="muted">Your account</div></div><div className="avatar">Q</div></div></header>
    <div className="layout">
      <aside className="sidebar"><div className="nav-title">Menu</div><a className="nav-item active" href="#"><span>⌂</span><span>Dashboard</span></a><a className="nav-item" href="#services"><span>◈</span><span>Services</span></a><a className="nav-item" href="#transactions"><span>↔</span><span>Transactions</span></a><a className="nav-item" href="#wallet"><span>₦</span><span>Wallet</span></a><div className="nav-title">Account</div><a className="nav-item" href="#"><span>♙</span><span>Profile</span></a><a className="nav-item" href="#"><span>⚙</span><span>Settings</span></a></aside>
      <main className="main">
        <div className="welcome"><div><h1>Good morning 👋</h1><p>Everything you need, right when you need it.</p></div></div>
        <section className="balance" id="wallet"><div className="balance-label">Available balance</div><div className="balance-value">₦0.00</div><div className="balance-actions"><button className="btn btn-light">Add money</button><button className="btn btn-dark">Withdraw</button></div></section>
        <h2 className="section-title" id="services">Quick services</h2>
        <div className="services">{services.map(([name,desc,Icon])=><a className="service" href="#" key={name}><div className="service-icon"><Icon size={20}/></div><strong>{name}</strong><span>{desc}</span></a>)}</div>
        <div className="grid" id="transactions"><section className="card"><div className="card-head"><h2>Recent transactions</h2><span className="muted">View all</span></div>{transactions.map(([name,date,amount],i)=><div className="transaction" key={i}><div className="tx-left"><div className="tx-icon">{amount.startsWith("+")?<ArrowDownLeft size={16}/>:<ArrowUpRight size={16}/>}</div><div><div className="tx-name">{name}</div><div className="tx-date">{date}</div></div></div><div className={`amount ${amount.startsWith("+")?"positive":""}`}>{amount}</div></div>)}</section><section className="card"><div className="card-head"><h2>Quick tip</h2></div><p style={{fontSize:14,lineHeight:1.7,color:"#4b5563",margin:0}}>Keep enough balance in your Quick wallet to make instant purchases without leaving the checkout.</p></section></div>
      </main>
    </div>
  </div>;
}
