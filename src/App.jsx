import { useState, useRef, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE CLIENT INITIALIZATION (Via Environment Variables)
// ─────────────────────────────────────────────────────────────────────────────
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — Premium 2026 SaaS Palette
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg:           "#F0F4F8",
  surface:      "#FFFFFF",
  surfaceAlt:   "#F5F7FA",
  surfaceGlass: "rgba(255,255,255,0.72)",
  border:       "#E2E8F0",
  borderDark:   "#CBD5E1",
  teal:         "#0D9488",
  tealDark:     "#0B7C73",
  tealLight:    "#F0FDFA",
  tealMid:      "#CCFBF1",
  tealGrad:     "linear-gradient(135deg,#0D9488 0%,#0EA5A0 100%)",
  amber:        "#D97706",
  amberLight:   "#FEF3C7",
  red:          "#DC2626",
  redLight:     "#FEE2E2",
  green:        "#16A34A",
  greenLight:   "#DCFCE7",
  purple:       "#9333EA",
  purpleLight:  "#F3E8FF",
  blue:         "#2563EB",
  blueLight:    "#EFF6FF",
  orange:       "#EA580C",
  orangeLight:  "#FFF7ED",
  indigo:       "#4F46E5",
  indigoLight:  "#EEF2FF",
  text:         "#0F172A",
  sub:          "#475569",
  faint:        "#94A3B8",
  white:        "#FFFFFF",
};

const FONT     = "'Inter','Segoe UI',system-ui,sans-serif";
const SH_XS    = "0 1px 2px rgba(0,0,0,0.04)";
const SH_SM    = "0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04)";
const SH       = "0 2px 8px rgba(0,0,0,0.07),0 1px 3px rgba(0,0,0,0.05)";
const SH_MD    = "0 4px 12px rgba(0,0,0,0.09),0 2px 4px rgba(0,0,0,0.06)";
const SH_LG    = "0 12px 36px rgba(0,0,0,0.13),0 4px 8px rgba(0,0,0,0.07)";
const FOCUS    = "0 0 0 3px rgba(13,148,136,0.22)";
const RADIUS   = { sm:8, md:12, lg:16, xl:20, full:9999 };
const TR       = "all 0.18s cubic-bezier(0.4,0,0.2,1)";

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE STYLE GENERATORS
// ─────────────────────────────────────────────────────────────────────────────
const sCard    = (extra={}) => ({ background:C.surface, border:`1px solid ${C.border}`, borderRadius:RADIUS.lg, boxShadow:SH, ...extra });
const sBadge   = (color,bg,size=11,px=10) => ({ background:bg, color, fontSize:size, fontWeight:700, padding:`3px ${px}px`, borderRadius:RADIUS.full, whiteSpace:"nowrap", display:"inline-block", letterSpacing:"0.01em" });
const sStatBox = (color) => ({ background:color+"12", borderLeft:`3px solid ${color}`, borderRadius:RADIUS.md, padding:"14px 16px", flex:1, minWidth:130, boxShadow:SH_XS });
const sAvatar  = (size=46) => ({ width:size, height:size, borderRadius:"50%", background:C.tealGrad, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:Math.round(size*0.42), flexShrink:0, boxShadow:SH_SM });
const sDivider = () => ({ fontSize:10, fontWeight:800, color:C.faint, textTransform:"uppercase", letterSpacing:"0.10em", padding:"6px 0 10px", borderBottom:`1px solid ${C.border}`, marginBottom:16 });
const sTabBtn  = (active,color=C.teal) => ({ padding:"8px 15px", borderRadius:RADIUS.full, fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", background:active?color:C.surface, color:active?C.white:C.sub, border:`1px solid ${active?color:C.border}`, fontFamily:FONT, transition:TR, boxShadow:SH_XS });

// ─────────────────────────────────────────────────────────────────────────────
// SVG VECTOR ICON SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
const Icon = ({ name, size=18, color="currentColor", style={} }) => {
  const paths = {
    home:     <><path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/></>,
    seat:     <><rect x="5" y="3" width="14" height="13" rx="2"/><path d="M3 21h18M5 16v5M19 16v5"/></>,
    users:    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    fee:      <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></>,
    shield:   <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    logout:   <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    check:    <polyline points="20 6 9 17 4 12"/>,
    x:        <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    edit:     <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:    <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    refresh:  <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    print:    <><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    bell:     <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    search:   <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    lock:     <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    info:     <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    warn:     <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    pin:      <><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    person:   <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    phone:    <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.75a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    timeline: <><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    grid:     <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    audit:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    backup:   <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>,
    report:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M16 8h2v12h-2zM12 12h2v8h-2zM8 14h2v6H8z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ display:"block", flexShrink:0, ...style }}>
      {paths[name] || <circle cx="12" cy="12" r="10"/>}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES & STATE TIME-STAMPS
// ─────────────────────────────────────────────────────────────────────────────
const todayStr  = () => new Date().toISOString().split("T")[0];
const timeNow   = () => new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
const fmtDate   = (d) => d?new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—";
const fmtDateSh = (d) => d?new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"—";
const fmtDT     = () => new Date().toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
const daysLeft  = (e) => Math.ceil((new Date(e)-new Date())/86400000);
const addDays   = (b,n) => { const d=new Date(b); d.setDate(d.getDate()+n); return d.toISOString().split("T")[0]; };
const genId     = () => "LIB"+Math.floor(100+Math.random()*900);
const clamp     = (v,lo,hi) => Math.min(Math.max(v,lo),hi);
const toSeatInt = (v) => v===""||v==null?null:parseInt(v,10);

const getMemberStatus = m => {
  if(m.manualInactive) return "inactive";
  const d=daysLeft(m.expiry);
  if(d<0) return "expired";
  if(d<=5) return "expiring";
  return "active";
};
const STATUS_META = {
  active:  {label:"Active",        color:C.green,  bg:C.greenLight,  icon:"active"},
  expiring:{label:"Expiring Soon", color:C.amber,  bg:C.amberLight,  icon:"warn"},
  expired: {label:"Expired",       color:C.red,    bg:C.redLight,    icon:"x"},
  inactive:{label:"Inactive",      color:C.faint,  bg:C.surfaceAlt,  icon:"lock"},
};

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL BACKUP SEED RECORDS (2026 Context)
// ─────────────────────────────────────────────────────────────────────────────
const D = (offset) => addDays(todayStr(), offset);

const DEFAULT_SETTINGS = {
  libraryName:"Tejas Library", totalSeats:35, defaultFee:500,
  address:"Jaunpur, Uttar Pradesh", timing:"6:00 AM – 10:00 PM",
};
const DEFAULT_PLANS = [
  {id:"p1",name:"Daily",    days:1,  price:30  },
  {id:"p2",name:"Monthly",  days:30, price:500 },
  {id:"p3",name:"Quarterly",days:90, price:1299},
  {id:"p4",name:"Annual",   days:365,price:3999},
];
const DEFAULT_MEMBERS = [
  {id:"LIB101",name:"Ravi Kumar",   phone:"9876543210",address:"Jaunpur, UP", firstJoined:D(-60),planId:"p2",seatNo:3,expiry:D(22),paid:true,manualInactive:false,renewals:[{planId:"p2",planName:"Monthly",amount:500,from:D(-60),to:D(-30),paidOn:D(-60),paidTime:"09:00 AM",note:null},{planId:"p2",planName:"Monthly",amount:450,from:D(-30),to:D(22), paidOn:D(-30),paidTime:"09:30 AM",note:"₹50 discount — exam student"}]},
  {id:"LIB102",name:"Priya Sharma", phone:"9812345678",address:"Varanasi, UP", firstJoined:D(-95),planId:"p3",seatNo:7,expiry:D(3),paid:false,manualInactive:false,renewals:[{planId:"p3",planName:"Quarterly",amount:1299,from:D(-95),to:D(3),paidOn:D(-95),paidTime:"11:00 AM",note:null}]},
  {id:"LIB103",name:"Amit Yadav",   phone:"9900112233",address:"Jaunpur, UP", firstJoined:D(-180),planId:"p2",seatNo:null,expiry:D(-10),paid:false,manualInactive:false,renewals:[{planId:"p2",planName:"Monthly",amount:500,from:D(-180),to:D(-150),paidOn:D(-180),paidTime:"08:00 AM",note:null}]},
];

const DEFAULT_STAFF = [
  {id:"S001",name:"Admin Owner",email:"admin@studyspace.com",role:"superadmin",pin:"1234",active:true,createdAt:D(-180)},
  {id:"S002",name:"Rahul Staff", email:"rahul@studyspace.com",role:"staff",    pin:"5678",active:true,createdAt:D(-90)},
];
const ROLE_PERMS = {
  superadmin:["dashboard","seats","members","fees","admin","audit"],
  staff:     ["dashboard","seats","members","fees"],
  readonly:  ["dashboard","members"],
};

const StatusBadge = ({status}) => {
  const sm=STATUS_META[status]||STATUS_META.inactive;
  return <Badge text={sm.label} color={sm.color} bg={sm.bg} icon={sm.icon}/>;
};

// ─────────────────────────────────────────────────────────────────────────────
// RECEIPT GENERATION POPUP
// ─────────────────────────────────────────────────────────────────────────────
const Receipt = ({member,renewal,libName,onClose}) => {
  const rNo=useRef("R"+Math.floor(10000+Math.random()*90000));

  const printReceipt=useCallback(()=>{
    const html=`<!DOCTYPE html><html><head><title>Receipt ${rNo.current}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Courier New',monospace;max-width:280px;margin:20px auto;font-size:12px;color:#000}
.c{text-align:center}.d{border-top:1px dashed #aaa;margin:9px 0}.row{display:flex;justify-content:space-between;margin:3px 0}
h2{font-size:14px}small{font-size:10px;color:#555}</style></head>
<body>
<div class="c"><h2>📚 ${libName}</h2><small>Fee Payment Receipt · ${rNo.current}</small></div>
<div class="d"></div>
<div class="row"><small>Date</small><b>${fmtDate(renewal.paidOn)}</b></div>
<div class="row"><small>Time</small><b>${renewal.paidTime}</b></div>
<div class="d"></div>
<div class="row"><small>Member</small><span>${member.name}</span></div>
<div class="row"><small>ID</small><span>${member.id}</span></div>
<div class="row"><small>Phone</small><span>${member.phone}</span></div>
<div class="row"><small>Seat</small><span>${member.seatNo?"Seat "+member.seatNo:"—"}</span></div>
<div class="row"><small>Plan</small><span>${renewal.planName}</span></div>
<div class="row"><small>Valid</small><span>${fmtDate(renewal.from)} → ${fmtDate(renewal.to)}</span></div>
${renewal.note?`<div class="row"><small>Note</small><span style='font-size:10px'>${renewal.note}</span></div>`:""}
<div class="d"></div>
<div class="row" style="font-size:15px;font-weight:900"><span>Paid Amount</span><span>Rs. ${renewal.amount}</span></div>
<div class="d"></div>
<div class="c" style="font-size:10px;color:#777">Thank You 🙏</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};<\/script>
</body></html>`;
    const win=window.open("","_blank","width=380,height=600");
    if(!win){alert("Popup blocked! Enable popups to print receipts.");return;}
    win.document.write(html);
    win.document.close();
  },[member,renewal,libName]);

  return (
    <Modal title="Payment Receipt" onClose={onClose}>
      <div style={{background:C.surfaceAlt,borderRadius:RADIUS.md,padding:16,marginBottom:16,fontFamily:"monospace",fontSize:12,border:`1px solid ${C.border}`}}>
        <div style={{textAlign:"center",marginBottom:8}}><div style={{fontWeight:900,fontSize:14}}>📚 {libName}</div><div style={{color:C.faint,fontSize:10}}>{rNo.current}</div></div>
        <div style={{borderTop:"1px dashed #ccc",margin:"8px 0"}}/>
        {[["Date",fmtDate(renewal.paidOn)],["Time",renewal.paidTime],["Member",member.name],["ID",member.id],["Plan",renewal.planName],["Valid",`${fmtDateSh(renewal.from)} → ${fmtDateSh(renewal.to)}`]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:C.faint}}>{k}</span><span style={{fontWeight:600}}>{v}</span></div>
        ))}
        {renewal.note ? <div style={{background:C.amberLight,borderRadius:5,padding:"4px 8px",marginTop:6,fontSize:10,color:C.amber}}>📝 {renewal.note}</div> : null}
        <div style={{borderTop:"1px dashed #ccc",margin:"8px 0"}}/>
        <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:15}}><span>Amount Paid</span><span>₹{renewal.amount}</span></div>
      </div>
      <div style={{display:"flex",gap:10}}><Btn onClick={printReceipt} iconName="print" full>Print Receipt</Btn><Btn onClick={onClose} variant="ghost">Close</Btn></div>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: PREMIUM TIMELINE VIEW
// ─────────────────────────────────────────────────────────────────────────────
const MemberTimeline = ({member,plans,onRenew,onReceipt}) => {
  const renewals  = member.renewals||[];
  const status    = getMemberStatus(member);
  const sm        = STATUS_META[status];
  const totalPaid = renewals.reduce((s,r)=>s+r.amount,0);
  const plan      = plans.find(p=>p.id===member.planId);
  const remaining = daysLeft(member.expiry);
  const remPct    = clamp(Math.round((Math.max(0,remaining)/(plan?.days||30))*100),0,100);
  const barColor  = remPct>50?C.green:remPct>20?C.amber:C.red;

  const events=[];
  for(let i=0; i<renewals.length; i++){
    const r=renewals[i];
    if(i!==0){const gap=Math.round((new Date(r.from)-new Date(renewals[i-1].to))/86400000);if(gap>1)events.push({type:"gap",from:renewals[i-1].to,to:r.from,days:gap});}
    events.push({type:"renewal",...r,index:i+1});
  }

  return (
    <div>
      <div style={{background:`linear-gradient(135deg,${C.teal}12,${C.tealLight})`,border:`1px solid ${C.teal}22`,borderRadius:RADIUS.lg,padding:18,marginBottom:18}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:14}}>
          <div style={{...sAvatar(56),border:`3px solid ${C.white}`,boxShadow:SH_MD}}>{member.name?.[0]}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:18,fontWeight:900,color:C.text,letterSpacing:"-0.3px"}}>{member.name}</div>
            <div style={{display:"flex",alignItems:"center",gap:5,fontSize:13,color:C.sub,marginTop:2}}><Icon name="phone" size={12} color={C.faint}/>{member.phone}</div>
            {member.address && <div style={{fontSize:12,color:C.faint,marginTop:2}}>📍 {member.address}</div>}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}><Badge text={member.id} color={C.sub} bg={C.white} size={10}/><StatusBadge status={status}/></div>
          </div>
        </div>

        {member.seatNo ? (
          <div style={{background:C.white,border:`1.5px solid ${C.teal}35`,borderRadius:RADIUS.md,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:12,boxShadow:SH_XS}}>
            <div style={{width:36,height:36,background:C.tealGrad,borderRadius:RADIUS.sm,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="seat" size={18} color={C.white}/></div>
            <div><div style={{fontSize:10,fontWeight:800,color:C.teal,textTransform:"uppercase"}}>Allocated Grid</div><div style={{fontSize:15,fontWeight:900,color:C.text}}>Seat #{member.seatNo}</div></div>
          </div>
        ) : (
          <div style={{background:"rgba(255,255,255,0.6)",border:`1px dashed ${C.borderDark}`,borderRadius:RADIUS.md,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}><Icon name="seat" size={16} color={C.faint}/><span style={{fontSize:13,color:C.faint}}>No seat allocated</span></div>
        )}

        <div style={{background:C.white,borderRadius:RADIUS.md,padding:"12px 14px",boxShadow:SH_XS}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div><div style={{fontSize:10,fontWeight:800,color:C.sub,textTransform:"uppercase"}}>{plan?.name||"—"} Plan Bundle</div></div>
            <div style={{fontSize:16,fontWeight:900,color:sm.color,fontFamily:"monospace"}}>{remaining<0?`${Math.abs(remaining)}d overdue`:`${remaining}d left`}</div>
          </div>
          <div style={{background:C.surfaceAlt,borderRadius:RADIUS.full,height:7,overflow:"hidden"}}><div style={{width:`${remPct}%`,height:"100%",background:barColor,borderRadius:RADIUS.full,transition:"width 0.4s ease"}}/></div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>
        {[{label:"First Join",val:fmtDateSh(member.firstJoined),color:C.blue,icon:"calendar"},{label:"Sessions",val:`${renewals.length}×`,color:C.purple,icon:"timeline"},{label:"Total Paid",val:`₹${totalPaid}`,color:C.green,icon:"fee"}].map(s=>(
          <div key={s.label} style={{background:s.color+"0E",borderRadius:RADIUS.md,padding:"10px 8px",textAlign:"center",border:`1px solid ${s.color}15`}}>
            <Icon name={s.icon} size={14} color={s.color} style={{margin:"0 auto 4px"}}/><div style={{fontSize:13,fontWeight:900,color:s.color,fontFamily:"monospace"}}>{s.val}</div><div style={{fontSize:10,color:C.sub,marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {(status==="expired"||status==="expiring"||status==="inactive") && <div style={{marginBottom:18}}><Btn onClick={onRenew} variant="purple" iconName="refresh" full>Renew Workspace Cycle</Btn></div>}

      <Divider label={`Cycle History Log — ${renewals.length} entries`}/>
      <div style={{position:"relative",paddingLeft:24}}>
        <div style={{position:"absolute",left:9,top:0,bottom:0,width:2,background:C.border}}/>
        {events.map((e,i)=>{
          if(e.type==="gap") return (
            <div key={"g"+i} style={{position:"relative",marginBottom:14}}><div style={{background:C.surfaceAlt,border:`1px dashed ${C.borderDark}`,borderRadius:RADIUS.sm,padding:"8px 12px",fontSize:12,color:C.faint}}>⏸ Gap Period — {e.days} days inactive</div></div>
          );
          return (
            <div key={"r"+i} style={{position:"relative",marginBottom:14}}>
              <div style={{position:"absolute",left:-20,top:4,width:10,height:12,borderRadius:"50%",background:C.teal}}/>
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:RADIUS.md,padding:"12px",boxShadow:SH_XS}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div><div style={{fontSize:13,fontWeight:800}}>{e.planName} Stream</div><div style={{fontSize:11,color:C.sub,marginTop:2}}>{fmtDateSh(e.from)} → {fmtDateSh(e.to)}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:900,color:C.green,fontFamily:"monospace"}}>₹{e.amount}</div><button onClick={()=>onReceipt(e)} style={{background:"none",border:"none",color:C.teal,fontSize:11,fontWeight:700,cursor:"pointer",marginTop:4}}>Receipt 🖨</button></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RenewModal = ({member,plans,onRenew,onClose}) => {
  const [planId, setPlanId] = useState(member.planId || plans[0]?.id);
  const selPlan = plans.find(p => p.id === planId);
  const baseAmt = selPlan?.price || 0;
  const startDate = todayStr();
  const endDate = selPlan ? addDays(startDate, selPlan.days) : startDate;

  const handleConfirm = () => {
    const renewal = { planId: selPlan.id, planName: selPlan.name, amount: baseAmt, from: startDate, to: endDate, paidOn: todayStr(), paidTime: timeNow(), note: null };
    onRenew(member.id, selPlan, renewal, true, endDate);
    onClose();
  };

  return (
    <Modal title={`Renew — ${member.name}`} onClose={onClose}>
      <Divider label="Select Target Plan Bundle"/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {plans.map(p => (
          <div key={p.id} onClick={() => setPlanId(p.id)} style={{ border: `2px solid ${planId === p.id ? C.purple : C.border}`, borderRadius: RADIUS.md, padding: "10px 12px", cursor: "pointer", background: planId === p.id ? C.purpleLight : C.white, transition: TR }}>
            <div style={{ fontWeight: 900, fontSize: 16, color: C.purple, fontFamily: "monospace" }}>₹{p.price}</div>
            <div style={{ fontWeight: 700, fontSize: 13, marginTop: 2 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: C.sub }}>{p.days} days</div>
          </div>
        ))}
      </div>
      <div style={{ background: C.surfaceAlt, padding: 12, borderRadius: RADIUS.md, marginBottom: 16, fontSize: 13, color: C.sub }}>
        Validity Stream: <b>{fmtDate(startDate)}</b> to <b>{fmtDate(endDate)}</b>
      </div>
      <Btn onClick={handleConfirm} variant="purple" iconName="refresh" full>Confirm Renewal Execution</Btn>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: SYSTEM DASHBOARD ARCHITECTURE
// ─────────────────────────────────────────────────────────────────────────────
const Dashboard = ({members,settings}) => {
  const counts={active:0,expiring:0,expired:0,inactive:0};
  members.forEach(m=>counts[getMemberStatus(m)]++);
  const occupied=members.filter(m=>m.seatNo!=null).length;
  const collected=members.reduce((s,m)=>s+(m.renewals||[]).reduce((a,r)=>a+r.amount,0),0);

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:22,fontWeight:900,color:C.text,letterSpacing:"-0.4px"}}>{settings.libraryName}</div>
        <div style={{fontSize:13,color:C.sub,marginTop:3}}>{settings.address} · {settings.timing}</div>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <StatBox icon="seat" label="Seats Occupied" value={`${occupied}/${settings.totalSeats}`} sub={`${settings.totalSeats-occupied} available`} color={C.teal}/>
        <StatBox icon="fee" label="Ledger Capital" value={`₹${collected.toLocaleString()}`} sub="All lifetime balances" color={C.green}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {Object.entries(STATUS_META).map(([k,sm])=>(
          <div key={k} style={{background:sm.bg,borderLeft:`3px solid ${sm.color}`,borderRadius:RADIUS.md,padding:14,boxShadow:SH_XS}}>
            <Icon name={sm.icon} size={18} color={sm.color} style={{marginBottom:6}}/>
            <div style={{fontSize:20,fontWeight:900,color:sm.color,fontFamily:"monospace"}}>{counts[k]}</div>
            <div style={{fontSize:13,fontWeight:700,color:C.text,marginTop:2}}>{sm.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: SEATS OPERATIONS INTERFACE
// ─────────────────────────────────────────────────────────────────────────────
const SeatsScreen = ({members,setMembers,settings,addAudit,currentUser,saveToDatabase}) => {
  const [sel,setSel]=useState(null);
  const [mt,setMt]=useState(null);
  const [search,setSearch]=useState("");
  const [pickedId,setPickedId]=useState("");
  const [vacGuard,setVacGuard]=useState(null);

  const seatMap={};
  members.forEach(m=>{if(m.seatNo!=null) seatMap[parseInt(m.seatNo,10)]=m;});
  const unassigned=members.filter(m=>m.seatNo==null);
  const filtered=unassigned.filter(m=>m.name.toLowerCase().includes(search.toLowerCase())||m.id.toLowerCase().includes(search.toLowerCase()));

  const assignSeat=async()=> {
    if(!pickedId||!sel)return;
    const m=members.find(x=>x.id===pickedId);
    const updated = members.map(x=>x.id===pickedId?{...x,seatNo:sel}:x);
    setMembers(updated);
    addAudit(currentUser,`Seat Space #${sel} mapped to core occupant ${m?.name}`);
    await saveToDatabase(updated, "members");
    setMt(null);setSel(null);setPickedId("");
  };

  const doVacate=async(seatNo)=> {
    const updated = members.map(x=>parseInt(x.seatNo,10)===seatNo?{...x,seatNo:null}:x);
    setMembers(updated);
    addAudit(currentUser,`Vacated seat layout index #${seatNo}`);
    await saveToDatabase(updated, "members");
    setVacGuard(null);setMt(null);setSel(null);
  };

  return (
    <div>
      <div style={{marginBottom:14}}><div style={{fontSize:20,fontWeight:900,letterSpacing:"-0.3px"}}>Spatial Inventory Interface Map</div></div>
      <Card style={{padding:16,marginBottom:14}}>
        <div style={{textAlign:"center",marginBottom:14}}><span style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:RADIUS.sm,padding:"5px 24px",fontSize:11,fontWeight:700,color:C.sub,letterSpacing:"0.06em"}}>MAIN ACCESS GATEWAY</span></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
          {Array.from({length:settings.totalSeats},(_,i)=>{
            const num=i+1; const m=seatMap[num]; const isOccupied=!!m; const expired=m&&getMemberStatus(m)==="expired";
            return (
              <div key={num} onClick={()=>{setSel(num); setSearch(""); setPickedId(""); setMt(isOccupied?"occupied":"assign");}} style={{aspectRatio:"1",borderRadius:8,background:isOccupied?(expired?C.redLight:C.tealGrad):C.surfaceAlt,border:`2px solid ${sel===num?C.blue:isOccupied?(expired?C.red:C.teal):C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:isOccupied?(expired?C.red:C.white):C.text,fontWeight:700,fontSize:11,transition:TR,transform:sel===num?"scale(1.15)":"scale(1)"}}>
                {num}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:14}}>Active Core Allocations ({Object.keys(seatMap).length})</div>
        {Object.entries(seatMap).sort(([a],[b])=>Number(a)-Number(b)).map(([num,m])=>(
          <div key={num} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:32,height:32,borderRadius:RADIUS.sm,background:C.tealGrad,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>{num}</div>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{m.name}</div><div style={{fontSize:11,color:C.sub}}>{m.id}</div></div>
            <StatusBadge status={getMemberStatus(m)}/>
            <Btn onClick={()=>setVacGuard(parseInt(num,10))} variant="ghost" size="sm">Vacate</Btn>
          </div>
        ))}
      </Card>

      {mt==="assign" && (
        <Modal title={`Allocate Empty Spatial Node #${sel}`} onClose={()=>setMt(null)}>
          <div style={{position:"relative",marginBottom:12}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search client dataset profile name..." style={{width:"100%",padding:"10px 12px",borderRadius:RADIUS.md,border:`1px solid ${C.border}`,outline:"none"}}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:220,overflowY:"auto",marginBottom:14}}>
            {filtered.map(m=>(
              <div key={m.id} onClick={()=>setPickedId(pickedId===m.id?"":m.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:10,background:pickedId===m.id?C.tealLight:C.surfaceAlt,borderRadius:RADIUS.sm,cursor:"pointer",border:`1px solid ${pickedId===m.id?C.teal:C.border}`}}>
                <div><b>{m.name}</b> ({m.id})</div>
                {pickedId===m.id && <Icon name="check" size={16} color={C.teal}/>}
              </div>
            ))}
          </div>
          <Btn onClick={assignSeat} disabled={!pickedId} iconName="check" full>Confirm Grid Allocation Location</Btn>
        </Modal>
      )}

      {vacGuard && <DestructiveConfirm message={`Are you absolute sure you want to clear structural tracking mapping partition node space unit #${vacGuard}?`} onConfirm={()=>doVacate(vacGuard)} onCancel={()=>setVacGuard(null)}/>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: DIRECTORY CONTROL FILE
// ─────────────────────────────────────────────────────────────────────────────
const MembersScreen = ({members,setMembers,plans,settings,addAudit,currentUser,saveToDatabase}) => {
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  const [modal,setModal]=useState(false);
  const [editing,setEditing]=useState(null);
  const [viewing,setViewing]=useState(null);
  const [renewFor,setRenewFor]=useState(null);
  const [receipt,setReceipt]=useState(null);

  const blank={name:"",phone:"",address:"",planId:plans[0]?.id||"",seatNo:"",paid:false};
  const [form,setForm]=useState(blank);

  const takenSeats=members.filter(m=>m.seatNo!=null&&(!editing||m.id!==editing)).map(m=>parseInt(m.seatNo,10));
  const seatOpts=[{value:"",label:"— No space allocated —"},...Array.from({length:settings.totalSeats},(_,i)=>i+1).map(n=>({value:String(n),label:takenSeats.includes(n)?`Unit Space ${n} (Occupied)`:`Unit Space ${n}`,disabled:takenSeats.includes(n)}))];

  const save=async()=> {
    if(!form.name.trim()||!form.phone.trim())return;
    const plan=plans.find(p=>p.id===form.planId);
    const seatNum=toSeatInt(form.seatNo);

    let updated;
    if(editing){
      updated = members.map(m=>{
        if(m.id===editing) return {...m,name:form.name,phone:form.phone,address:form.address,planId:form.planId,seatNo:seatNum,paid:form.paid};
        if(seatNum!=null && parseInt(m.seatNo,10)===seatNum) return {...m,seatNo:null};
        return m;
      });
      addAudit(currentUser,`Overwrote properties definition configurations for: ${form.name}`);
    } else {
      const newM={id:genId(),name:form.name,phone:form.phone,address:form.address,planId:form.planId,seatNo:seatNum,firstJoined:todayStr(),expiry:addDays(todayStr(),plan?.days||30),paid:form.paid,manualInactive:false,renewals:form.paid&&plan?[{planId:plan.id,planName:plan.name,amount:plan.price,from:todayStr(),to:addDays(todayStr(),plan.days),paidOn:todayStr(),paidTime:timeNow(),note:null}]:[]};
      updated = [...members.map(m=>(seatNum!=null && parseInt(m.seatNo,10)===seatNum)?{...m,seatNo:null}:m),newM];
      addAudit(currentUser,`Enrolled entity identity context trace block: ${form.name}`);
    }

    setMembers(updated);
    await saveToDatabase(updated, "members");
    setModal(false);
  };

  const handleRenew=async(id,plan,renewal,paid,newExpiry)=>{
    const updated = members.map(m=>m.id!==id?m:{...m,planId:plan.id,expiry:newExpiry,paid,manualInactive:false,renewals:[...(m.renewals||[]),renewal]});
    setMembers(updated);
    await saveToDatabase(updated, "members");
  };

  const filtered=members
    .filter(m=>filter==="all"?true:getMemberStatus(m)===filter)
    .filter(m=>m.name.toLowerCase().includes(search.toLowerCase())||m.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div><div style={{fontSize:20,fontWeight:900,letterSpacing:"-0.3px"}}>Structural Registry Logs</div></div>
        <Btn onClick={()=>{setEditing(null); setForm(blank); setModal(true);}} iconName="plus">Add Token</Btn>
      </div>

      <div style={{position:"relative",marginBottom:10}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search via tag identifier attributes..." style={{width:"100%",padding:"10px 12px",borderRadius:RADIUS.md,border:`1px solid ${C.border}`,outline:"none"}}/>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
        {[["all","All Records"],["active","Active Stream"],["expiring","Alert Warnings"],["expired","Dead Terminations"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={sTabBtn(filter===v)}>{l}</button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(m=>(
          <Card key={m.id} style={{padding:14}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div><div style={{fontWeight:850,fontSize:15}}>{m.name}</div><div style={{fontSize:12,color:C.sub,marginTop:2}}>{m.id} · Terminal Ref: {m.phone}</div></div>
              <StatusBadge status={getMemberStatus(m)}/>
            </div>
            <div style={{display:"flex",gap:4,marginTop:12}}>
              <Btn onClick={()=>setViewing(m)} variant="ghost" size="sm" iconName="timeline">Profile</Btn>
              <Btn onClick={()=>{setEditing(m.id); setForm({name:m.name,phone:m.phone,address:m.address||"",planId:m.planId,seatNo:m.seatNo!=null?String(m.seatNo):"",paid:m.paid}); setModal(true);}} variant="ghost" size="sm" iconName="edit">Modify</Btn>
              <Btn onClick={async()=>{
                const updated = members.filter(x=>x.id!==m.id);
                setMembers(updated);
                await saveToDatabase(updated, "members");
              }} variant="danger" size="sm" iconName="trash"/>
            </div>
          </Card>
        ))}
      </div>

      {modal && (
        <Modal title={editing?"Modify Profile Attributes":"Provision New Security Identity Profile"} onClose={()=>setModal(false)}>
          <Field label="Client Structural Full Name" value={form.name} onChange={v=>setForm({...form,name:v})} required/>
          <Field label="Communications Data Payload String (Phone)" value={form.phone} onChange={v=>setForm({...form,phone:v})} required/>
          <Field label="Physical Address Metadata Location" value={form.address} onChange={v=>setForm({...form,address:v})}/>
          <Field label="Spatial Floor Assignment Grid Index" value={form.seatNo} onChange={v=>setForm({...form,seatNo:v})} options={seatOpts}/>
          <Field label="Selected Dynamic Core Fee Plan Bundle" value={form.planId} onChange={v=>setForm({...form,planId:v})} options={plans.map(p=>({value:p.id,label:`${p.name} Package (₹${p.price})`}))}/>
          <label style={{display:"flex",alignItems:"center",gap:10,background:form.paid?C.greenLight:C.surfaceAlt,borderRadius:RADIUS.md,padding:"12px 14px",marginBottom:16,cursor:"pointer"}}>
            <input type="checkbox" checked={form.paid} onChange={e=>setForm({...form,paid:e.target.checked})} style={{width:16,height:16}}/>
            <div><div style={{fontWeight:700,fontSize:13}}>Mark Token Invoice Capital Paid Ledger Stream</div></div>
          </label>
          <Btn onClick={save} iconName="check" full>Commit Entity Block State</Btn>
        </Modal>
      )}

      {viewing && <Modal title="Dynamic Context Data Matrix Ledger" onClose={()=>setViewing(null)} wide><MemberTimeline member={members.find(x=>x.id===viewing.id)||viewing} plans={plans} onRenew={()=>{ setRenewFor(viewing); setViewing(null); }} onReceipt={(r)=>setReceipt({member:viewing,renewal:r})}/></Modal>}
      {renewFor && <RenewModal member={renewFor} plans={plans} onRenew={handleRenew} onClose={()=>setRenewFor(null)}/>}
      {receipt && <Receipt member={receipt.member} renewal={receipt.renewal} libName={settings.libraryName} onClose={()=>setReceipt(null)}/>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: FINANCIAL BALANCING LEDGERS & REPORT DOWNLOAD ENGINE
// ─────────────────────────────────────────────────────────────────────────────
const FeesScreen = ({members,setMembers,plans,settings,saveToDatabase}) => {
  const [filter, setFilter] = useState("all");
  const [renewFor, setRenewFor] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const allPaid=members.reduce((s,m)=>s+(m.renewals||[]).reduce((a,r)=>a+r.amount,0),0);
  const pending=members.filter(m=>!m.paid).reduce((s,m)=>s+(plans.find(p=>p.id===m.planId)?.price||0),0);
  const filtered=filter==="paid"?members.filter(m=>m.paid):filter==="unpaid"?members.filter(m=>!m.paid):members;

  // EXECUTIVE MONTHLY REPORT COMPILATION HOOK
  const printMonthlyReport = () => {
    const currentMonthStr = new Date().toISOString().slice(0, 7); 
    const monthName = new Date().toLocaleString("en-IN", { month: "long", year: "numeric" });
    
    let monthlyRevenue = 0;
    const tableRows = members.map(m => {
      const status = getMemberStatus(m);
      const plan = plans.find(p => p.id === m.planId);
      
      const thisMonthPaid = (m.renewals || []).reduce((sum, r) => {
        if (r.paidOn && r.paidOn.startsWith(currentMonthStr)) {
          return sum + r.amount;
        }
        return sum;
      }, 0);
      monthlyRevenue += thisMonthPaid;

      return `
        <tr>
          <td style="padding:10px; border-bottom:1px solid #e2e8f0;"><b>${m.name}</b><br><small style="color:#64748b">${m.id}</small></td>
          <td style="padding:10px; border-bottom:1px solid #e2e8f0; font-family:monospace;">${m.phone}</td>
          <td style="padding:10px; border-bottom:1px solid #e2e8f0; text-align:center; font-weight:bold;">${m.seatNo ? `#${m.seatNo}` : '—'}</td>
          <td style="padding:10px; border-bottom:1px solid #e2e8f0;">${plan ? plan.name : '—'}</td>
          <td style="padding:10px; border-bottom:1px solid #e2e8f0; text-align:center;"><span style="padding:3px 8px; font-size:11px; font-weight:700; border-radius:12px; background:${STATUS_META[status].bg}; color:${STATUS_META[status].color}; border:1px solid ${STATUS_META[status].color}30">${STATUS_META[status].label}</span></td>
          <td style="padding:10px; border-bottom:1px solid #e2e8f0; text-align:right; font-family:monospace; font-weight:700; color:#16a34a;">₹${thisMonthPaid.toLocaleString()}</td>
        </tr>
      `;
    }).join("");

    const reportHtml = `<!DOCTYPE html><html><head><title>Monthly Report - ${monthName}</title>
    <style>
      body{font-family:'Segoe UI',system-ui,sans-serif; margin:40px; color:#0f172a; background:#fff;}
      table{width:100%; border-collapse:collapse; margin-top:24px;}
      th{background:#f8fafc; text-align:left; padding:12px 10px; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:#475569; border-bottom:2px solid #cbd5e1;}
      .box{flex:1; background:#f8fafc; border:1px solid #e2e8f0; padding:16px; border-radius:12px;}
    </style></head>
    <body>
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #0d9488; padding-bottom:14px;">
        <div><h1 style="margin:0; font-size:24px; color:#0f172a;">📚 ${settings.libraryName}</h1><p style="margin:4px 0 0; color:#475569; font-size:14px;">Monthly Executive Operations & Financial Ledger</p></div>
        <div style="text-align:right; font-size:13px; color:#475569;"><b>Report Period:</b> ${monthName}<br><b>Generated:</b> ${new Date().toLocaleString("en-IN")}</div>
      </div>
      
      <div style="display:flex; gap:16px; margin:24px 0;">
        <div class="box" style="border-left:4px solid #16a34a; background:#f0fdf4;">
          <span style="font-size:11px; color:#166534; font-weight:800; text-transform:uppercase; letter-spacing:0.05em;">Collections (This Month)</span>
          <h2 style="margin:6px 0 0; font-size:24px; color:#15803d; font-family:monospace;">₹${monthlyRevenue.toLocaleString()}</h2>
        </div>
        <div class="box" style="border-left:4px solid #2563eb; background:#eff6ff;">
          <span style="font-size:11px; color:#1e40af; font-weight:800; text-transform:uppercase; letter-spacing:0.05em;">Active Roster Strength</span>
          <h2 style="margin:6px 0 0; font-size:24px; color:#1d4ed8; font-family:monospace;">${members.length} Users</h2>
        </div>
        <div class="box" style="border-left:4px solid #0d9488; background:#f0fdf4;">
          <span style="font-size:11px; color:#0f766e; font-weight:800; text-transform:uppercase; letter-spacing:0.05em;">Space Density Mapped</span>
          <h2 style="margin:6px 0 0; font-size:24px; color:#0f766e; font-family:monospace;">${members.filter(m=>m.seatNo).length}/${settings.totalSeats}</h2>
        </div>
      </div>

      <h3 style="font-size:16px; margin-top:32px; color:#1e293b; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">Student Ledger Allocation Index</h3>
      <table>
        <thead>
          <tr><th>Student Identity</th><th>Contact info</th><th style="text-align:center;">Seat No</th><th>Package Plan</th><th style="text-align:center;">Status</th><th style="text-align:right;">Deposit (This Month)</th></tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
      <div style="margin-top:40px; text-align:center; font-size:11px; color:#94a3b8; border-top:1px dashed #e2e8f0; padding-top:16px;">StudySpace Cloud Ledger System Core Matrix Verification Complete.</div>
      <script>window.onload=function(){window.print();};<\/script>
    </body></html>`;

    const reportWin = window.open("", "_blank", "width=850,height=700,scrollbars=yes");
    if (!reportWin) { alert("Popup blocker active! Please allow popups to compile document."); return; }
    reportWin.document.write(reportHtml);
    reportWin.document.close();
  };

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
        <div>
          <div style={{fontSize:20,fontWeight:900,color:C.text,letterSpacing:"-0.4px"}}>Financial Ledgers</div>
          <div style={{fontSize:12,color:C.sub,marginTop:2}}>Track collections & accounts state</div>
        </div>
        <Btn onClick={printMonthlyReport} iconName="report" variant="primary" size="sm">Monthly Report</Btn>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <StatBox icon="fee" label="Revenue Balance Value" value={`₹${allPaid.toLocaleString()}`} color={C.green}/>
        <StatBox icon="bell" label="Invoice Receivables" value={`₹${pending.toLocaleString()}`} color={C.red}/>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {[[ "all", "All Matrix Logs" ],[ "paid", "Cleared Invoices" ],[ "unpaid", "Outstanding Balance" ]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={sTabBtn(filter===v)}>{l}</button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(m=>{
          const p = plans.find(x=>x.id===m.planId);
          const last = (m.renewals||[]).slice(-1)[0];
          return (
            <Card key={m.id} style={{padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div><div style={{fontWeight:800}}>{m.name}</div><div style={{fontSize:12,color:C.sub,marginTop:2}}>{m.id} · Assigned Node: {m.seatNo?`Space Unit #${m.seatNo}`:"None"}</div></div>
                <div style={{textalign:"right"}}><div style={{fontWeight:900,fontFamily:"monospace",color:C.teal}}>₹{p?.price||0}</div><div style={{fontSize:10,color:C.faint}}>{p?.name} Package</div></div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,gap:4,flexWrap:"wrap"}}>
                <div style={{display:"flex",gap:4}}><Badge text={m.paid?"Invoice Cleared":"Outstanding Balance"} color={m.paid?C.green:C.red} bg={m.paid?C.greenLight:C.redLight}/><StatusBadge status={getMemberStatus(m)}/></div>
                <div style={{display:"flex",gap:4}}>
                  <Btn onClick={async()=>{
                    const updated = members.map(x=>{
                      if(x.id!==m.id) return x;
                      const nextPaid = !x.paid;
                      let rArr = [...(x.renewals||[])];
                      if(nextPaid && p) rArr.push({planId:p.id,planName:p.name,amount:p.price,from:todayStr(),to:addDays(todayStr(),p.days),paidOn:todayStr(),paidTime:timeNow(),note:"Direct reconciliation mark paid override link logic"});
                      return {...x, paid:nextPaid, renewals:rArr};
                    });
                    setMembers(updated);
                    await saveToDatabase(updated, "members");
                  }} variant={m.paid?"ghost":"green"} size="sm">{m.paid?"Unlink Cleared Status":"Clear Balance Cash"}</Btn>
                  {(getMemberStatus(m)==="expired"||getMemberStatus(m)==="expiring") && <Btn onClick={()=>setRenewFor(m)} variant="purple" size="sm">Renew</Btn>}
                  {last && <Btn onClick={()=>setReceipt({member:m,renewal:last})} variant="ghost" size="sm" iconName="print"/>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {renewFor && <RenewModal member={renewFor} plans={plans} onRenew={async(id,p,r,pd,exp)=>{
        const updated = members.map(x=>x.id===id?{...x,expiry:exp,planId:p.id,paid:pd,renewals:[...(x.renewals||[]),r]}:x);
        setMembers(updated);
        await saveToDatabase(updated, "members");
      }} onClose={()=>setRenewFor(null)}/>}
      {receipt && <Receipt member={receipt.member} renewal={receipt.renewal} libName={settings.libraryName} onClose={()=>setReceipt(null)}/>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: ADMIN SYSTEM INFRASTRUCTURE PANEL
// ─────────────────────────────────────────────────────────────────────────────
const AdminPanel = ({settings,setSettings,plans,setPlans,members,staff,setStaff,auditLog,addAudit,currentUser,saveToDatabase}) => {
  const [tab,setTab]=useState("library");
  const [s,setS]=useState({...settings});
  const [origS] = useState({...settings});
  const [savedStatusAlert, setSavedStatusAlert] = useState(false);

  const [pModal, setPModal] = useState(false);
  const [editPlanId, setEditPlanId] = useState(null);
  const [pForm, setPForm] = useState({name:"",days:"",price:""});

  const [sfModal, setStaffModal] = useState(false);
  const [editSfId, setEditStaffId] = useState(null);
  const [sfForm, setSfForm] = useState({name:"",email:"",role:"staff",pin:""});

  const settingsDirty=JSON.stringify(s)!==JSON.stringify(origS);

  const commitGlobalConfigurationSettings=async()=> {
    setSettings(s);
    setSavedStatusAlert(true);
    setTimeout(()=>setSavedStatusAlert(false),2000);
    addAudit(currentUser,"Calibrated system matrix boundary constants metadata variables definitions");
    await supabase.from("studyspace_kv").upsert([{ key: "settings", value: s }]);
  };

  const savePackagePlanBundle=async()=> {
    if(!pForm.name||!pForm.days||!pForm.price)return;
    const data={name:pForm.name,days:Number(pForm.days),price:Number(pForm.price)};
    let updated;
    if(editPlanId){
      updated = plans.map(p=>p.id===editPlanId?{...p,...data}:p);
      addAudit(currentUser,`Modified tariff metrics parameters configuration schema token: ${pForm.name}`);
    }else{
      updated = [...plans,{id:"p"+Date.now(),...data}];
      addAudit(currentUser,`Appended target subscription schema matrix pack index allocation bundle: ${pForm.name}`);
    }
    setPlans(updated);
    await supabase.from("studyspace_kv").upsert([{ key: "plans", value: updated }]);
    setPModal(false);
  };

  const saveStaffAccount=async()=> {
    if(!sfForm.name||!sfForm.email||!sfForm.pin)return;
    let updated;
    if(editSfId){
      updated = staff.map(sf=>sf.id===editSfId?{...sf,...sfForm}:sf);
      addAudit(currentUser,`Overwrote terminal security mapping role profile attributes permissions parameters for target`);
    }else{
      updated = [...staff,{id:"S"+Date.now(),...sfForm,active:true,createdAt:todayStr()}];
      addAudit(currentUser,`Provisioned structural security account tracking entity metadata parameters signature entry block`);
    }
    setStaff(updated);
    await supabase.from("studyspace_kv").upsert([{ key: "staff", value: updated }]);
    setStaffModal(false);
  };

  const exportSystemDumpDownloadFile=()=> {
    const backupDataPayloadBlock={exportedAt:fmtDT(),settings,plans,members,staff:staff.map(({pin,...rest})=>rest),auditLog};
    const blob=new Blob([JSON.stringify(backupDataPayloadBlock,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`tejas-ledger-dump-${todayStr()}.json`;a.click();
    addAudit(currentUser,"Dispatched standard cloud infrastructure storage package dump serialization execution trace sync backup file download");
  };

  return (
    <div>
      <div style={{display:"flex",gap:4,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {[[ "library", "Config" ],[ "plans", "Plans Setup" ],[ "staff", "Staff Control" ],[ "audit", "Logs Feed" ],[ "backup", "Data Engine" ]].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={sTabBtn(tab===v,C.indigo)}>{l}</button>
        ))}
      </div>

      {tab CONTAINER_VIEW === "library" && (
        <Card style={{padding:16}}>
          <Divider label="System Configuration Parameters"/>
          <Field label="Enterprise Domain System Label" value={s.libraryName} onChange={v=>setS({...s,libraryName:v})}/>
          <Field label="Spatial Boundary Ceiling Limit (Total Space Seats)" type="number" value={String(s.totalSeats)} onChange={v=>setS({...s,totalSeats:Number(v)})}/>
          <Field label="Geographical Infrastructure Location Label" value={s.address} onChange={v=>setS({...s,address:v})}/>
          {settingsDirty && <Alert color={C.amber} bg={C.amberLight} iconName="warn" style={{marginBottom:12}}>Calibrations data modifications mismatch detected.</Alert>}
          {savedStatusAlert && <Alert color={C.green} bg={C.greenLight} iconName="check" style={{marginBottom:12}}>Structural calibration variables saved successfully.</Alert>}
          <Btn onClick={commitGlobalConfigurationSettings} iconName="check" full>Save Configurations</Btn>
        </Card>
      )}

      {tab === "plans" && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontWeight:800}}>Tariff Matrices Bundles</div><Btn onClick={()=>{setEditPlanId(null); setPForm({name:"",days:"",price:""}); setPModal(true);}} size="sm" iconName="plus">Add</Btn></div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {plans.map(p=>(
              <Card key={p.id} style={{padding:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><b style={{fontSize:14}}>{p.name} Package</b><div style={{fontSize:11,color:C.sub}}>{p.days} days parameter cycle</div></div>
                <div style={{display:"flex",alignItems:"center",gap:10}}><b style={{fontFamily:"monospace"}}>₹{p.price}</b><button onClick={()=>{setEditPlanId(p.id); setPForm({name:p.name,days:String(p.days),price:String(p.price)}); setPModal(true);}} style={{background:"none",border:"none",color:C.indigo,cursor:"pointer",fontWeight:700}}>Edit</button></div>
              </Card>
            ))}
          </div>
          {pModal && (
            <Modal title="Configure Pricing Index Tariff Schema" onClose={()=>setPModal(false)}>
              <Field label="Profile Pack Label Name" value={pForm.name} onChange={v=>setPForm({...pForm,name:v})}/>
              <Field label="Tariff Price Token Baseline Cost Value (₹)" type="number" value={pForm.price} onChange={v=>setPForm({...pForm,price:v})}/>
              <Field label="Lifespan Temporal Parameter Threshold Limit Count (Days)" type="number" value={pForm.days} onChange={v=>setPForm({...pForm,days:v})}/>
              <Btn onClick={savePackagePlanBundle} full>Commit Pricing Matrix Package</Btn>
            </Modal>
          )}
        </div>
      )}

      {tab === "staff" && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontWeight:800}}>Operational Terminal Roles Access</div><Btn onClick={()=>{setEditStaffId(null); setSfForm({name:"",email:"",role:"staff",pin:""}); setStaffModal(true);}} size="sm" iconName="plus">Add Staff</Btn></div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {staff.map(sf=>(
              <Card key={sf.id} style={{padding:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><b>{sf.name}</b><div style={{fontSize:11,color:C.sub}}>{sf.email} · Identity: {sf.id}</div></div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}><Badge text={sf.role} color={C.purple} bg={C.purpleLight}/><button onClick={()=>{setEditStaffId(sf.id); setSfForm({name:sf.name,email:sf.email,role:sf.role,pin:sf.pin}); setStaffModal(true);}} style={{background:"none",border:"none",color:C.indigo,cursor:"pointer",fontSize:12,fontWeight:700}}>Edit Profile</button></div>
              </Card>
            ))}
          </div>
          {sfModal && (
            <Modal title="Calibrate Authorization Credentials Profile" onClose={()=>setStaffModal(false)}>
              <Field label="Staff Member Legal Full Identity Name" value={sfForm.name} onChange={v=>setSfForm({...sfForm,name:v})}/>
              <Field label="Access Mapping Authentication Address Identity (Email)" value={sfForm.email} onChange={v=>setSfForm({...sfForm,email:v})}/>
              <Field label="Access Framework Permission Assignment Matrix Level" value={sfForm.role} onChange={v=>setSfForm({...sfForm,role:v})} options={[{value:"staff",label:"Staff Unit Operations Execution access"},{value:"superadmin",label:"Superadmin Universal Override core access"}]}/>
              <Field label="4-Digit Numerical Decryption Passcode Entry String Token" type="password" value={sfForm.pin} onChange={v=>setSfForm({...sfForm,pin:v.slice(0,4)})} placeholder="••••"/>
              <Btn onClick={saveStaffAccount} full>Commit Security Profile Credentials Entity</Btn>
            </Modal>
          )}
        </div>
      )}

      {tab === "audit" && <div style={{maxHeight:340,overflowY:"auto",background:C.white,border:`1px solid ${C.border}`,borderRadius:RADIUS.md,padding:10}}>{auditLog.slice().reverse().map((l,i)=>(<div key={i} style={{fontSize:11,padding:"8px 6px",borderBottom:`1px solid ${C.border}`,lineHeight:1.4}}><b>{l.by}</b>: {l.action} <span style={{color:C.faint,float:"right",fontSize:10}}>{l.at}</span></div>))}</div>}
      {tab === "backup" && <Card style={{padding:20,textAlign:"center"}}><Icon name="backup" size={32} color={C.indigo} style={{margin:"0 auto 10px"}}/><div style={{fontSize:15,fontWeight:800,marginBottom:6}}>Download Structural System State Payload Ledgers Dump</div><div style={{fontSize:12,color:C.sub,marginBottom:16}}>Dispatches single comprehensive unencrypted serialization JSON file entity structure trace.</div><Btn onClick={exportSystemDumpDownloadFile} variant="indigo" iconName="download" full>Download Engine JSON Dump</Btn></Card>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: SECURITY SYSTEM SIGN-IN GATEWAY
// ─────────────────────────────────────────────────────────────────────────────
const LoginScreen = ({staff,onLogin}) => {
  const [email,setEmail]=useState("");
  const [pin,setPin]=useState("");
  const [error,setError]=useState("");
  const doLogin=()=> {
    const sf=staff.find(s=>s.email.toLowerCase()===email.toLowerCase()&&s.pin===pin&&s.active);
    sf?onLogin(sf):setError("Authorization security signature clearance mapping verification failed.");
  };
  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.teal}18,${C.bg})`,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:FONT}}>
      <Card style={{padding:32,width:"100%",maxWidth:360}}>
        <div style={{textAlign:"center",marginBottom:24}}><div style={{width:54,height:54,background:C.tealGrad,borderRadius:RADIUS.md,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px"}}><Icon name="shield" size={24} color={C.white}/></div><div style={{fontSize:22,fontWeight:950,color:C.text,letterSpacing:"-0.5px"}}>Tejas Library</div><div style={{fontSize:13,color:C.sub,marginTop:4}}>Secure Authentication Access Framework Gateway</div></div>
        <Field label="System Account Mapping Email Address Identity" value={email} onChange={setEmail}/>
        <Field label="4-Digit Secure Verification Decryption Passcode PIN" value={pin} type="password" onChange={setPin} placeholder="••••"/>
        {error?<Alert color={C.red} bg={C.redLight} iconName="warn" style={{marginBottom:14}}>{error}</Alert>:null}
        <div style={{marginTop:12}}><Btn onClick={doLogin} full>Verify Matrix Identity Credentials Signature Token</Btn></div>
        <div style={{marginTop:20,padding:12,background:C.surfaceAlt,borderRadius:RADIUS.md,fontSize:10,color:C.sub,lineHeight:1.6}}>
          <b>Default Initial Bypass Signatures:</b><br/>
          Owner: admin@studyspace.com | Passcode PIN: 1234<br/>
          Staff Member: rahul@studyspace.com | Passcode PIN: 5678
        </div>
      </Card>
    </div>
  );
};

const BottomNav = ({page,setPage,perms}) => {
  const tabs=[
    {id:"dashboard",icon:"home",    label:"Home",    perm:"dashboard"},
    {id:"seats",    icon:"seat",    label:"Seats",   perm:"seats"},
    {id:"members",  icon:"users",   label:"Members", perm:"members"},
    {id:"fees",     icon:"fee",     label:"Fees",    perm:"fees"},
    {id:"admin",    icon:"shield",  label:"Admin",   perm:"admin"},
  ].filter(t=>perms.includes(t.perm));
  return(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(255,255,255,0.96)",backdropFilter:"blur(12px)",borderTop:`1px solid ${C.border}`,display:"flex",zIndex:100,boxShadow:SH_LG}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setPage(t.id)} style={{flex:1,padding:"12px 0 10px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <Icon name={t.icon} size={20} color={page===t.id?C.teal:C.faint}/>
          <span style={{fontSize:10,fontWeight:page===t.id?800:500,color:page===t.id?C.teal:C.faint,fontFamily:FONT}}>{t.label}</span>
        </button>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ROOT ENVIRONMENT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser,setCurrentUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [members,setMembers]=useState([]);
  const [plans,setPlans]=useState(DEFAULT_PLANS);
  const [settings,setSettings]=useState(DEFAULT_SETTINGS);
  const [staff,setStaff]=useState(DEFAULT_STAFF);
  const [auditLog,setAuditLog]=useState([{by:"System",action:"System core online",at:fmtDT()}]);
  const [loading, setLoading] = useState(true);

  const addAudit=useCallback((user,action)=>{
    const newLog = {by:user?.name||"System Operations",action,at:fmtDT()};
    setAuditLog(prev=> {
      const updated = [...prev, newLog];
      if (supabase) supabase.from("studyspace_logs").insert([newLog]).then();
      return updated;
    });
  },[]);

  const saveToDatabase = async (payload, table) => {
    if (!supabase) return;
    try {
      if (table === "settings") {
        await supabase.from("studyspace_kv").upsert([{ key: "settings", value: payload }]);
      } else if (table === "members") {
        await supabase.from("studyspace_kv").upsert([{ key: "members", value: payload }]);
      }
    } catch (e) {
      console.error("Database sync delay: ", e);
    }
  };

  useEffect(() => {
    async function initDatabaseBootstrapPipeline() {
      if (!supabase) {
        setMembers(DEFAULT_MEMBERS);
        setLoading(false);
        return;
      }
      try {
        const { data: kvData } = await supabase.from("studyspace_kv").select("*");
        let dbMembers = kvData?.find(x => x.key === "members")?.value;
        let dbSettings = kvData?.find(x => x.key === "settings")?.value;
        const { data: logs } = await supabase.from("studyspace_logs").select("*");

        if (!dbMembers) {
          await supabase.from("studyspace_kv").insert([
            { key: "members", value: DEFAULT_MEMBERS },
            { key: "settings", value: DEFAULT_SETTINGS }
          ]);
          setMembers(DEFAULT_MEMBERS);
        } else {
          setMembers(dbMembers);
          if (dbSettings) setSettings(dbSettings);
        }
        if (logs && logs.length > 0) setAuditLog(logs);
      } catch (err) {
        setMembers(DEFAULT_MEMBERS);
      } finally {
        setLoading(false);
      }
    }
    initDatabaseBootstrapPipeline();
  }, []);

  const handleLogin=sf=>{setCurrentUser(sf); addAudit(sf,`Session initialized (${sf.role})`);};

  if (loading) {
    return <div style={{display:"flex",minHeight:"100vh",alignItems:"center",justifyContent:"center",fontFamily:FONT,background:C.bg,color:C.teal,fontWeight:700}}>Syncing Global Cloud Network Ledgers...</div>;
  }

  if(!currentUser) return <LoginScreen staff={staff} onLogin={handleLogin}/>;
  const perms=ROLE_PERMS[currentUser.role]||[];
  const sharedProps={members,plans,settings,addAudit,currentUser,setMembers,setSettings,setPlans,staff,setStaff,auditLog,saveToDatabase};

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:FONT,maxWidth:480,margin:"0 auto",position:"relative",boxShadow:SH_LG}}>
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:90,boxShadow:SH_SM}}>
        <div style={{flex:1}}><div style={{fontWeight:800,fontSize:14}}>{settings.libraryName}</div></div>
        <Btn onClick={()=>{setCurrentUser(null); setPage("dashboard");}} variant="ghost" size="sm">Exit Space</Btn>
      </div>
      <div style={{padding:"16px 14px 90px"}}>
        {page === "dashboard" ? <Dashboard members={members} settings={settings}/> : null}
        {page === "seats" && perms.includes("seats") ? <SeatsScreen {...sharedProps}/> : null}
        {page === "members" && perms.includes("members") ? <MembersScreen {...sharedProps}/> : null}
        {page === "fees" && perms.includes("fees") ? <FeesScreen {...sharedProps}/> : null}
        {page === "admin" && perms.includes("admin") ? <AdminPanel {...sharedProps}/> : null}
      </div>
      <BottomNav page={page} setPage={setPage} perms={perms}/>
    </div>
  );
}
