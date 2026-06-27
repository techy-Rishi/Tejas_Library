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
// INITIAL SYSTEM SEED CONFIGURATIONS (2026 Context)
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

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVE ATOMIC COMPONENT BLOCKS
// ─────────────────────────────────────────────────────────────────────────────
const Badge = ({text,color=C.teal,bg=C.tealMid,size=11,px=10,icon}) => (
  <span style={{...sBadge(color,bg,size,px),display:"inline-flex",alignItems:"center",gap:4}}>
    {icon?<Icon name={icon} size={size+1} color={color}/>:null}{text}
  </span>
);

const Btn = ({children,onClick,variant="primary",size="md",disabled=false,full=false,iconName}) => {
  const [hov,setHov]=useState(false);
  const [press,setPress]=useState(false);
  const vs={
    primary: {bg:hov?(press?"#0A6B65":C.tealDark):C.teal,  color:C.white, border:"none"},
    danger:  {bg:hov?(press?"#991B1B":"#B91C1C"):C.red,     color:C.white, border:"none"},
    ghost:   {bg:hov?C.surfaceAlt:"transparent",            color:C.sub,   border:`1px solid ${C.border}`},
    green:   {bg:hov?(press?"#166534":C.green):"#16A34A",   color:C.white, border:"none"},
    purple:  {bg:hov?"#7E22CE":C.purple,                    color:C.white, border:"none"},
    indigo:  {bg:hov?"#4338CA":C.indigo,                    color:C.white, border:"none"},
  };
  const sz={sm:{padding:"6px 13px",fontSize:12,gap:5},md:{padding:"10px 18px",fontSize:14,gap:7}};
  const v=vs[variant]||vs.primary;
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setPress(false);}}
      onMouseDown={()=>setPress(true)} onMouseUp={()=>setPress(false)}
      style={{background:v.bg,color:v.color,border:v.border,...sz[size],borderRadius:RADIUS.md,
        fontWeight:700,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,
        width:full?"100%":"auto",fontFamily:FONT,transition:TR,
        boxShadow:disabled?"none":hov?SH_MD:SH_SM,
        transform:press?"scale(0.97)":"scale(1)",
        display:"inline-flex",alignItems:"center",justifyContent:"center",gap:sz[size].gap}}>
      {iconName?<Icon name={iconName} size={size === "sm"?13:15} color={v.color}/>:null}
      {children}
    </button>
  );
};

const Field = ({label,value,onChange,type="text",placeholder,hint,required,options,disabled=false}) => {
  const [foc,setFoc]=useState(false);
  const base={width:"100%",padding:"10px 12px",borderRadius:RADIUS.md,
    border:`1.5px solid ${foc?C.teal:C.border}`,fontSize:14,
    color:disabled?C.faint:C.text, background:disabled?C.surfaceAlt:C.white,
    outline:"none",boxSizing:"border-box",fontFamily:FONT,
    boxShadow:foc?FOCUS:"none",transition:TR};
  return (
    <div style={{marginBottom:16}}>
      {label?<label style={{display:"block",fontSize:11,fontWeight:700,color:C.sub,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}{required && <span style={{color:C.red}}> *</span>}</label>:null}
      {options
        ?<select value={value} onChange={e=>onChange(e.target.value)} disabled={disabled} onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} style={base}>
            {options.map(o=><option key={o.value??o} value={o.value??o} disabled={o.disabled}>{o.label??o}</option>)}
          </select>
        :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled} onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} style={base}/>
      }
      {hint?<p style={{margin:"4px 0 0",fontSize:11,color:C.faint,lineHeight:1.4}}>{hint}</p>:null}
    </div>
  );
};

const Divider = ({label}) => <div style={sDivider()}>{label}</div>;
const Card = ({children,style={},onClick}) => <div onClick={onClick} style={sCard(style)}>{children}</div>;
const StatBox = ({icon,label,value,sub,color=C.teal}) => (
  <div style={sStatBox(color)}>
    <Icon name={icon} size={20} color={color} style={{marginBottom:8}}/>
    <div style={{fontSize:21,fontWeight:900,color,fontFamily:"monospace",letterSpacing:"-0.5px"}}>{value}</div>
    <div style={{fontSize:12,fontWeight:700,color:C.text,marginTop:3,lineHeight:1.3}}>{label}</div>
    {sub?<div style={{fontSize:11,color:C.sub,marginTop:2}}>{sub}</div>:null}
  </div>
);
const Alert = ({children,color,bg,iconName,style={}}) => (
  <div style={{background:bg,border:`1px solid ${color}25`,borderLeft:`3px solid ${color}`,borderRadius:RADIUS.md,padding:"11px 14px",display:"flex",gap:10,alignItems:"flex-start",boxShadow:SH_XS,...style}}>
    {iconName?<Icon name={iconName} size={15} color={color} style={{marginTop:1,flexShrink:0}}/>:null}
    <div style={{flex:1,fontSize:13,color:C.sub,lineHeight:1.5}}>{children}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: MEMBER LIFETIME EXPIRY TIMELINE
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
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
          <div style={sAvatar(54)}>{member.name?.[0]}</div>
          <div>
            <div style={{fontSize:18,fontWeight:900,color:C.text}}>{member.name}</div>
            <div style={{fontSize:13,color:C.sub}}>{member.phone} · {member.id}</div>
            <div style={{marginTop:6}}><StatusBadge status={status}/></div>
          </div>
        </div>
        <div style={{background:C.white,borderRadius:RADIUS.md,padding:12,boxShadow:SH_XS}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,marginBottom:4}}>
            <span>{plan?.name} Plan Progress</span>
            <span style={{color:sm.color}}>{remaining<0?`${Math.abs(remaining)}d overdue`:`${remaining}d left`}</span>
          </div>
          <div style={{background:C.surfaceAlt,height:6,borderRadius:RADIUS.full,overflow:"hidden"}}>
            <div style={{width:`${remPct}%`,height:"100%",background:sm.color}}/>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <StatBox icon="fee" label="Total Collected" value={`₹${totalPaid}`} color={C.green}/>
      </div>
      {(status==="expired"||status==="expiring") && <Btn onClick={onRenew} variant="purple" iconName="refresh" full>Renew Space Now</Btn>}
      <Divider label={`Activity Ledger — ${renewals.length} entries`}/>
      <div style={{position:"relative",paddingLeft:24}}>
        <div style={{position:"absolute",left:9,top:0,bottom:0,width:2,background:C.border}}/>
        {events.map((e,idx)=>(
          <div key={idx} style={{position:"relative",marginBottom:14}}>
            <div style={{position:"absolute",left:-21,top:4,width:12,height:12,borderRadius:"50%",background:C.teal,border:`2px solid ${C.white}`}}/>
            <div style={{background:C.surface,border:`1px solid ${C.border}',borderRadius:RADIUS.md,padding:"11px 13px",boxShadow:SH_XS`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:800}}>{e.planName} Session</div>
                  <div style={{fontSize:11,color:C.faint}}>{fmtDateSh(e.from)} → {fmtDateSh(e.to)}</div>
                </div>
                <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:900,color:C.green,fontFamily:"monospace"}}>₹{e.amount}</div><button onClick={()=>onReceipt(e)} style={{background:"none",border:"none",color:C.teal,fontWeight:700,fontSize:11,cursor:"pointer"}}>Print</button></div>
              </div>
            </div>
          </div>
        ))}
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
          <div key={p.id} onClick={() => setPlanId(p.id)} style={{ border: `2px solid ${planId === p.id ? C.purple : C.border}`, borderRadius: RADIUS.md, padding: "10px 12px", cursor: "pointer", background: planId === p.id ? C.purpleLight : C.white }}>
            <div style={{ fontWeight: 900, fontSize: 16, color: C.purple }}>₹{p.price}</div>
            <div>{p.name} ({p.days} days)</div>
          </div>
        ))}
      </div>
      <Btn onClick={handleConfirm} variant="purple" full>Confirm Allocation</Btn>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: CORE MANAGEMENT OVERVIEW DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const Dashboard = ({members,settings}) => {
  const counts={active:0,expiring:0,expired:0,inactive:0};
  members.forEach(m=>counts[getMemberStatus(m)]++);
  const occupied=members.filter(m=>m.seatNo!=null).length;
  const collected=members.reduce((s,m)=>s+(m.renewals||[]).reduce((a,r)=>a+r.amount,0),0);

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:22,fontWeight:900,color:C.text}}>{settings.libraryName}</div>
        <div style={{fontSize:13,color:C.sub,marginTop:3}}>{settings.address} · {settings.timing}</div>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <StatBox icon="seat" label="Seats Occupied" value={`${occupied}/${settings.totalSeats}`} color={C.teal}/>
        <StatBox icon="fee" label="Ledger Value" value={`₹${collected}`} color={C.green}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {Object.entries(STATUS_META).map(([k,sm])=>(
          <div key={k} style={{background:sm.bg,borderLeft:`3px solid ${sm.color}`,borderRadius:RADIUS.md,padding:14}}>
            <div style={{fontSize:20,fontWeight:900,color:sm.color,fontFamily:"monospace"}}>{counts[k]}</div>
            <div style={{fontSize:13,fontWeight:700}}>{sm.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: SEATING MAP CONTROL FLOORPLAN GRID
// ─────────────────────────────────────────────────────────────────────────────
const SeatsScreen = ({members,setMembers,settings,addAudit,currentUser,saveToDatabase}) => {
  const [sel,setSel]=useState(null);
  const [mt,setMt]=useState(null);
  const [pickedId,setPickedId]=useState("");
  const seatMap={};
  members.forEach(m=> {if(m.seatNo!=null) seatMap[parseInt(m.seatNo,10)]=m;});

  const assignSeat=async()=>{
    if(!pickedId||!sel)return;
    const updated = members.map(x=>x.id===pickedId?{...x,seatNo:sel}:x);
    setMembers(updated);
    addAudit(currentUser,`Seat ${sel} allocated manually`);
    await saveToDatabase(updated, "members");
    setMt(null);setSel(null);setPickedId("");
  };

  return (
    <div>
      <Divider label="Interactive Floor Plan"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8,background:C.white,padding:16,borderRadius:RADIUS.lg,boxShadow:SH}}>
        {Array.from({length:settings.totalSeats},(_,i)=>{
          const num=i+1; const m=seatMap[num]; const isOccupied=!!m;
          return (
            <div key={num} onClick={()=>{setSel(num); setMt(isOccupied?"occupied":"assign");}} style={{aspectRatio:"1",borderRadius:8,background:isOccupied?C.tealGrad:C.surfaceAlt,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:isOccupied?C.white:C.text,fontWeight:700,fontSize:12,transition:TR}}>
              {num}
            </div>
          );
        })}
      </div>
      {mt==="assign" && (
        <Modal title={`Allocate Seat #${sel}`} onClose={()=>setMt(null)}>
          <Field label="Enter Member ID" value={pickedId} onChange={setPickedId}/>
          <Btn onClick={assignSeat} full>Assign Space</Btn>
        </Modal>
      )}
      {mt==="occupied" && (
        <Modal title={`Space Allocation #${sel}`} onClose={()=>setMt(null)}>
          <Alert color={C.teal} bg={C.tealLight}>Allocated to: {seatMap[sel]?.name}</Alert>
          <div style={{marginTop:12}}>
            <Btn onClick={async()=>{
              const updated = members.map(x=>x.seatNo===sel?{...x,seatNo:null}:x);
              setMembers(updated);
              await saveToDatabase(updated, "members");
              setMt(null);
            }} variant="danger" full>Vacate Space</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: STUDENT MEMBERS DIRECTORY CONTROL
// ─────────────────────────────────────────────────────────────────────────────
const MembersScreen = ({members,setMembers,plans,settings,addAudit,currentUser,saveToDatabase}) => {
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState(false);
  const [viewing,setViewing]=useState(null);
  const [deleteGuard,setDeleteGuard]=useState(null);
  const [renewFor,setRenewFor]=useState(null);
  const [receipt,setReceipt]=useState(null);

  const blank={name:"",phone:"",address:"",planId:plans[0]?.id||"",seatNo:"",paid:false};
  const [form,setForm]=useState(blank);

  const save=async()=>{
    if(!form.name||!form.phone) return;
    const plan=plans.find(p=>p.id===form.planId);
    const newM={id:genId(),name:form.name,phone:form.phone,address:form.address,planId:form.planId,seatNo:toSeatInt(form.seatNo),firstJoined:todayStr(),expiry:addDays(todayStr(),plan?.days||30),paid:form.paid,manualInactive:false,renewals:[]};
    const updated = [...members, newM];
    setMembers(updated);
    addAudit(currentUser,`Registered member: ${form.name}`);
    await saveToDatabase(updated, "members");
    setModal(false);
  };

  const handleRenew=async(id,p,r,pd,exp)=>{
    const updated = members.map(x=>x.id===id?{...x,expiry:exp,planId:p.id,paid:pd,renewals:[...(x.renewals||[]),r]}:x);
    setMembers(updated);
    await saveToDatabase(updated, "members");
  };

  const filtered=members.filter(m=>m.name.toLowerCase().includes(search.toLowerCase())||m.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><input placeholder="Search directory..." value={search} onChange={e=>setSearch(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${C.border}`,width:"70%",outline:"none",fontFamily:FONT}}/><Btn onClick={()=>setModal(true)} iconName="plus">Add</Btn></div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(m=>(
          <Card key={m.id} style={{padding:14}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div><div style={{fontWeight:850}}>{m.name}</div><div style={{fontSize:12,color:C.sub}}>{m.id} · Space: {m.seatNo||"Unassigned"}</div></div>
              <div style={{display:"flex",gap:4}}><Btn onClick={()=>setViewing(m)} variant="ghost" size="sm">View</Btn><Btn onClick={()=>setRenewFor(m)} variant="purple" size="sm">Renew</Btn><Btn onClick={()=>setDeleteGuard(m)} variant="danger" size="sm">✕</Btn></div>
            </div>
          </Card>
        ))}
      </div>
      {modal && (
        <Modal title="Register New Space Asset" onClose={()=>setModal(false)}>
          <Field label="Full Name" value={form.name} onChange={v=>setForm({...form,name:v})}/>
          <Field label="Phone Contact" value={form.phone} onChange={v=>setForm({...form,phone:v})}/>
          <Btn onClick={save} full>Save Member</Btn>
        </Modal>
      )}
      {deleteGuard && <DestructiveConfirm message="Record permanent purge ho jayega." confirmLabel="Purge" onConfirm={async()=>{
        const updated = members.filter(x=>x.id!==deleteGuard.id);
        setMembers(updated);
        await saveToDatabase(updated, "members");
        setDeleteGuard(null);
      }} onCancel={()=>setDeleteGuard(null)}/>}
      {viewing && <Modal title="Data Profile Matrix" onClose={()=>setViewing(null)}><MemberTimeline member={members.find(x=>x.id===viewing.id)||viewing} plans={plans} onRenew={()=>{}} onReceipt={(r)=>setReceipt({member:viewing,renewal:r})}/></Modal>}
      {renewFor && <RenewModal member={renewFor} plans={plans} onRenew={handleRenew} onClose={()=>setRenewFor(null)}/>}
      {receipt && <Receipt member={receipt.member} renewal={receipt.renewal} libName={settings.libraryName} onClose={()=>setReceipt(null)}/>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: ACCOUNT BALANCING LEDGERS & MANAGEMENT MONTHLY REPORTS
// ─────────────────────────────────────────────────────────────────────────────
const FeesScreen = ({members,setMembers,plans,settings,saveToDatabase}) => {
  const [filter, setFilter] = useState("all");
  const [receipt, setReceipt] = useState(null);

  const allPaid=members.reduce((s,m)=>s+(m.renewals||[]).reduce((a,r)=>a+r.amount,0),0);
  const pending=members.filter(m=>!m.paid).reduce((s,m)=>s+(plans.find(p=>p.id===m.planId)?.price||0),0);
  const filtered=filter==="paid"?members.filter(m=>m.paid):filter==="unpaid"?members.filter(m=>!m.paid):members;

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
                <div style={{textAlign:"right"}}><div style={{fontWeight:900,fontFamily:"monospace",color:C.teal}}>₹{p?.price||0}</div><div style={{fontSize:10,color:C.faint}}>{p?.name} Package</div></div>
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
                  {last && <Btn onClick={()=>setReceipt({member:m,renewal:last})} variant="ghost" size="sm" iconName="print"/>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {receipt && <Receipt member={receipt.member} renewal={receipt.renewal} libName={settings.libraryName} onClose={()=>setReceipt(null)}/>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: ADMIN SYSTEM INFRASTRUCTURE PANEL
// ─────────────────────────────────────────────────────────────────────────────
const AdminPanel = ({settings,setSettings,auditLog,saveToDatabase}) => {
  const [tab,setTab]=useState("library");
  const [s,setS]=useState({...settings});
  return(
    <div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>{[["library","System Profile"],["audit","Real-time Audits"]].map(([v,l])=>(<button key={v} onClick={()=>setTab(v)} style={sTabBtn(tab===v,C.indigo)}>{l}</button>))}</div>
      {tab === "library" && (
        <Card style={{padding:16}}>
          <Divider label="System Configuration Parameters"/>
          <Field label="Enterprise Domain System Label" value={s.libraryName} onChange={v=>setS({...s,libraryName:v})}/>
          <Field label="Spatial Boundary Ceiling Limit (Total Space Seats)" type="number" value={String(s.totalSeats)} onChange={v=>setS({...s,totalSeats:Number(v)})}/>
          <Field label="Geographical Infrastructure Location Label" value={s.address} onChange={v=>setS({...s,address:v})}/>
          <Btn onClick={async()=>{setSettings(s); await saveToDatabase(s, "settings");}} full>Commit Config</Btn>
        </Card>
      )}
      {tab==="audit"&&<div style={{maxHeight:300,overflowY:"auto"}}>{auditLog.map((l,i)=>(<div key={i} style={{fontSize:12,padding:6,borderBottom:`1px solid ${C.border}`}}><b>{l.by}</b>: {l.action} <span style={{color:C.faint}}>{l.at}</span></div>))}</div>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: SECURITY ACCESS SIGN-IN PORTAL
// ─────────────────────────────────────────────────────────────────────────────
const LoginScreen = ({staff,onLogin}) => {
  const [email,setEmail]=useState("");
  const [pin,setPin]=useState("");
  const [error,setError]=useState("");
  const doLogin=()=>{
    const sf=staff.find(s=>s.email.toLowerCase()===email.toLowerCase()&&s.pin===pin&&s.active);
    sf?onLogin(sf):setError("Invalid Security Credentials.");
  };
  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.teal}18,${C.bg})`,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <Card style={{padding:32,width:"100%",maxWidth:360}}>
        <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:22,fontWeight:950,color:C.text,letterSpacing:"-0.5px"}}>Tejas Library</div><div style={{fontSize:13,color:C.sub,marginTop:4}}>Secure Authentication Access Gateway</div></div>
        <Field label="System Access Email" value={email} onChange={setEmail}/>
        <Field label="4-Digit Secure PIN" value={pin} type="password" onChange={setPin}/>
        {error?<Alert color={C.red} bg={C.redLight}>{error}</Alert>:null}
        <div style={{marginTop:12}}><Btn onClick={doLogin} full>Authenticate Session</Btn></div>
      </Card>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: NAVIGATION BAR TAB STRUCTURE
// ─────────────────────────────────────────────────────────────────────────────
const BottomNav = ({page,setPage,perms}) => {
  const tabs=[
    {id:"dashboard",icon:"home",    label:"Home",    perm:"dashboard"},
    {id:"seats",    icon:"seat",    label:"Seats",   perm:"seats"},
    {id:"members",  icon:"users",   label:"Members", perm:"members"},
    {id:"fees",     icon:"fee",     label:"Fees",    perm:"fees"},
    {id:"admin",    icon:"shield",  label:"Admin",   perm:"admin"},
  ].filter(t=>perms.includes(t.perm));
  return(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(8px)",borderTop:`1px solid ${C.border}`,display:"flex",zIndex:100,boxShadow:SH_LG}}>
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
// DYNAMIC COMPILATION APPS ENGINE ROOT CONTEXT
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
