import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;




import { useState, useRef, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
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

const FONT   = "'Inter','Segoe UI',system-ui,sans-serif";
const SH_XS  = "0 1px 2px rgba(0,0,0,0.04)";
const SH_SM  = "0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04)";
const SH     = "0 2px 8px rgba(0,0,0,0.07),0 1px 3px rgba(0,0,0,0.05)";
const SH_MD  = "0 4px 12px rgba(0,0,0,0.09),0 2px 4px rgba(0,0,0,0.06)";
const SH_LG  = "0 12px 36px rgba(0,0,0,0.13),0 4px 8px rgba(0,0,0,0.07)";
const FOCUS  = "0 0 0 3px rgba(13,148,136,0.22)";
const RADIUS = { sm:8, md:12, lg:16, xl:20, full:9999 };
const TR     = "all 0.18s cubic-bezier(0.4,0,0.2,1)";

// ─────────────────────────────────────────────────────────────────────────────
// STYLE GENERATORS
// ─────────────────────────────────────────────────────────────────────────────
const sCard    = (extra={}) => ({ background:C.surface, border:`1px solid ${C.border}`, borderRadius:RADIUS.lg, boxShadow:SH, ...extra });
const sBadge   = (color,bg,size=11,px=10) => ({ background:bg, color, fontSize:size, fontWeight:700, padding:`3px ${px}px`, borderRadius:RADIUS.full, whiteSpace:"nowrap", display:"inline-block", letterSpacing:"0.01em" });
const sStatBox = (color) => ({ background:color+"12", borderLeft:`3px solid ${color}`, borderRadius:RADIUS.md, padding:"14px 16px", flex:1, minWidth:130, boxShadow:SH_XS });
const sAvatar  = (size=46) => ({ width:size, height:size, borderRadius:"50%", background:C.tealGrad, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:Math.round(size*0.42), flexShrink:0, boxShadow:SH_SM });
const sDivider = () => ({ fontSize:10, fontWeight:800, color:C.faint, textTransform:"uppercase", letterSpacing:"0.10em", padding:"6px 0 10px", borderBottom:`1px solid ${C.border}`, marginBottom:16 });
const sTabBtn  = (active,color=C.teal) => ({ padding:"8px 15px", borderRadius:RADIUS.full, fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", background:active?color:C.surface, color:active?C.white:C.sub, border:`1px solid ${active?color:C.border}`, fontFamily:FONT, transition:TR, boxShadow:SH_XS });

// ─────────────────────────────────────────────────────────────────────────────
// ICON SYSTEM
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
    crown:    <><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><line x1="5" y1="20" x2="19" y2="20"/></>,
    key:      <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></>,
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
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
const todayStr  = () => new Date().toISOString().split("T")[0];
const timeNow   = () => new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
const fmtDate   = (d) => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";
const fmtDateSh = (d) => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : "—";
const fmtDT     = () => new Date().toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
const daysLeft  = (e) => Math.ceil((new Date(e) - new Date()) / 86400000);
const addDays   = (b, n) => { const d = new Date(b); d.setDate(d.getDate()+n); return d.toISOString().split("T")[0]; };
const genId     = () => "LIB" + Math.floor(100 + Math.random()*900);
const clamp     = (v, lo, hi) => Math.min(Math.max(v,lo), hi);
const toSeatInt = (v) => v===""||v==null ? null : parseInt(v, 10);

const getMemberStatus = m => {
  if (m.manualInactive) return "inactive";
  const d = daysLeft(m.expiry);
  if (d < 0)  return "expired";
  if (d <= 5) return "expiring";
  return "active";
};

const STATUS_META = {
  active:   { label:"Active",        color:C.green,  bg:C.greenLight,  icon:"check" },
  expiring: { label:"Expiring Soon", color:C.amber,  bg:C.amberLight,  icon:"warn"  },
  expired:  { label:"Expired",       color:C.red,    bg:C.redLight,    icon:"x"     },
  inactive: { label:"Inactive",      color:C.faint,  bg:C.surfaceAlt,  icon:"lock"  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT DATA
// ─────────────────────────────────────────────────────────────────────────────
const D = (offset) => addDays(todayStr(), offset);

const DEFAULT_SETTINGS = {
  libraryName: "Tejas Library", totalSeats: 35, defaultFee: 500,
  address: "Jaunpur, Uttar Pradesh", timing: "6:00 AM – 10:00 PM",
};

const DEFAULT_PLANS = [
  { id:"p1", name:"Daily",     days:1,   price:30   },
  { id:"p2", name:"Monthly",   days:30,  price:500  },
  { id:"p3", name:"Quarterly", days:90,  price:1299 },
  { id:"p4", name:"Annual",    days:365, price:3999 },
];

const DEFAULT_MEMBERS = [
  { id:"LIB101", name:"Ravi Kumar",   phone:"9876543210", address:"Jaunpur, UP",
    firstJoined:D(-60),  planId:"p2", seatNo:3,  expiry:D(22),  paid:true,  manualInactive:false,
    renewals:[
      { planId:"p2", planName:"Monthly",  amount:500, from:D(-60),  to:D(-30), paidOn:D(-60),  paidTime:"09:00 AM", note:null },
      { planId:"p2", planName:"Monthly",  amount:450, from:D(-30),  to:D(22),  paidOn:D(-30),  paidTime:"09:30 AM", note:"₹50 discount — exam student" },
    ]},
  { id:"LIB102", name:"Priya Sharma", phone:"9812345678", address:"Varanasi, UP",
    firstJoined:D(-95),  planId:"p3", seatNo:7,  expiry:D(3),   paid:false, manualInactive:false,
    renewals:[
      { planId:"p3", planName:"Quarterly", amount:1299, from:D(-95), to:D(3), paidOn:D(-95), paidTime:"11:00 AM", note:null },
    ]},
  { id:"LIB103", name:"Amit Yadav",   phone:"9900112233", address:"Jaunpur, UP",
    firstJoined:D(-180), planId:"p2", seatNo:null, expiry:D(-10), paid:false, manualInactive:false,
    renewals:[
      { planId:"p2", planName:"Monthly", amount:500, from:D(-180), to:D(-150), paidOn:D(-180), paidTime:"08:00 AM", note:null },
      { planId:"p2", planName:"Monthly", amount:500, from:D(-150), to:D(-120), paidOn:D(-150), paidTime:"09:00 AM", note:null },
      { planId:"p2", planName:"Monthly", amount:500, from:D(-40),  to:D(-10),  paidOn:D(-40),  paidTime:"10:00 AM", note:null },
    ]},
  { id:"LIB104", name:"Sneha Singh",  phone:"9911223344", address:"Allahabad, UP",
    firstJoined:D(-200), planId:"p4", seatNo:14, expiry:D(165), paid:true, manualInactive:false,
    renewals:[
      { planId:"p4", planName:"Annual", amount:3999, from:D(-200), to:D(165), paidOn:D(-200), paidTime:"10:00 AM", note:null },
    ]},
  { id:"LIB105", name:"Mohit Gupta",  phone:"9988776655", address:"Jaunpur, UP",
    firstJoined:D(-300), planId:"p2", seatNo:null, expiry:D(-60), paid:false, manualInactive:true,
    renewals:[
      { planId:"p2", planName:"Monthly", amount:500, from:D(-300), to:D(-270), paidOn:D(-300), paidTime:"11:30 AM", note:null },
    ]},
];

const DEFAULT_STAFF = [
  { id:"S001", name:"Admin Owner", email:"admin@tejaslib.com", role:"superadmin", pin:"1234", active:true, createdAt:D(-180) },
  { id:"S002", name:"Rahul Staff", email:"rahul@tejaslib.com", role:"staff",      pin:"5678", active:true, createdAt:D(-90)  },
];

const ROLE_PERMS = {
  superadmin: ["dashboard","seats","members","fees","admin","audit"],
  staff:      ["dashboard","seats","members","fees"],
  readonly:   ["dashboard","members"],
};

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const Badge = ({ text, color=C.teal, bg=C.tealMid, size=11, px=10, icon }) => (
  <span style={{ ...sBadge(color,bg,size,px), display:"inline-flex", alignItems:"center", gap:4 }}>
    {icon ? <Icon name={icon} size={size+1} color={color}/> : null}{text}
  </span>
);

const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.inactive;
  return <Badge text={m.label} color={m.color} bg={m.bg} icon={m.icon}/>;
};

const Btn = ({ children, onClick, variant="primary", size="md", disabled=false, full=false, iconName }) => {
  const [hov, setHov]   = useState(false);
  const [press, setPress] = useState(false);
  const vs = {
    primary: { bg: hov?(press?"#0A6B65":C.tealDark):C.teal,    color:C.white, border:"none" },
    danger:  { bg: hov?(press?"#991B1B":"#B91C1C"):C.red,       color:C.white, border:"none" },
    ghost:   { bg: hov?C.surfaceAlt:"transparent",              color:C.sub,   border:`1px solid ${C.border}` },
    green:   { bg: hov?(press?"#166534":C.green):"#16A34A",     color:C.white, border:"none" },
    amber:   { bg: hov?"#B45309":C.amber,                       color:C.white, border:"none" },
    purple:  { bg: hov?"#7E22CE":C.purple,                      color:C.white, border:"none" },
    blue:    { bg: hov?"#1D4ED8":C.blue,                        color:C.white, border:"none" },
    indigo:  { bg: hov?"#4338CA":C.indigo,                      color:C.white, border:"none" },
    orange:  { bg: hov?"#C2410C":C.orange,                      color:C.white, border:"none" },
  };
  const sz = { sm:{ padding:"6px 13px", fontSize:12, gap:5 }, md:{ padding:"10px 18px", fontSize:14, gap:7 } };
  const v  = vs[variant] || vs.primary;
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setPress(false);}}
      onMouseDown={()=>setPress(true)} onMouseUp={()=>setPress(false)}
      style={{ background:v.bg, color:v.color, border:v.border, ...sz[size], borderRadius:RADIUS.md,
        fontWeight:700, cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1,
        width:full?"100%":"auto", fontFamily:FONT, transition:TR,
        boxShadow:disabled?"none":hov?SH_MD:SH_SM,
        transform:press?"scale(0.97)":"scale(1)",
        display:"inline-flex", alignItems:"center", justifyContent:"center", gap:sz[size].gap }}>
      {iconName ? <Icon name={iconName} size={size==="sm"?13:15} color={v.color}/> : null}
      {children}
    </button>
  );
};

const Field = ({ label, value, onChange, type="text", placeholder, hint, required, options, disabled=false, readOnly=false }) => {
  const [foc, setFoc] = useState(false);
  const base = {
    width:"100%", padding:"10px 12px", borderRadius:RADIUS.md,
    border:`1.5px solid ${foc?C.teal:C.border}`, fontSize:14,
    color:disabled||readOnly?C.faint:C.text,
    background:disabled||readOnly?C.surfaceAlt:C.white,
    outline:"none", boxSizing:"border-box", fontFamily:FONT,
    boxShadow:foc?FOCUS:"none", transition:TR,
    cursor:readOnly?"not-allowed":"text",
  };
  return (
    <div style={{ marginBottom:16 }}>
      {label ? <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.sub, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>
        {label}{required ? <span style={{ color:C.red }}> *</span> : null}
      </label> : null}
      {options
        ? <select value={value} onChange={e=>onChange(e.target.value)} disabled={disabled}
            onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} style={base}>
            {options.map(o => <option key={o.value??o} value={o.value??o} disabled={o.disabled}>{o.label??o}</option>)}
          </select>
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)}
            placeholder={placeholder} disabled={disabled} readOnly={readOnly}
            onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} style={base}/>
      }
      {hint ? <p style={{ margin:"4px 0 0", fontSize:11, color:C.faint, lineHeight:1.4 }}>{hint}</p> : null}
    </div>
  );
};

const Divider = ({ label }) => <div style={sDivider()}>{label}</div>;

const Card = ({ children, style={}, onClick }) => (
  <div onClick={onClick} style={sCard(style)}>{children}</div>
);

const StatBox = ({ icon, label, value, sub, color=C.teal }) => (
  <div style={sStatBox(color)}>
    <Icon name={icon} size={20} color={color} style={{ marginBottom:8 }}/>
    <div style={{ fontSize:21, fontWeight:900, color, fontFamily:"monospace", letterSpacing:"-0.5px" }}>{value}</div>
    <div style={{ fontSize:12, fontWeight:700, color:C.text, marginTop:3, lineHeight:1.3 }}>{label}</div>
    {sub ? <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{sub}</div> : null}
  </div>
);

const Alert = ({ children, color, bg, iconName, style={} }) => (
  <div style={{ background:bg, border:`1px solid ${color}25`, borderLeft:`3px solid ${color}`, borderRadius:RADIUS.md, padding:"11px 14px", display:"flex", gap:10, alignItems:"flex-start", boxShadow:SH_XS, ...style }}>
    {iconName ? <Icon name={iconName} size={15} color={color} style={{ marginTop:1, flexShrink:0 }}/> : null}
    <div style={{ flex:1, fontSize:13, color:C.sub, lineHeight:1.5 }}>{children}</div>
  </div>
);

const Modal = ({ title, onClose, children, wide=false }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.52)", zIndex:1000, display:"flex", alignItems:"flex-end", justifyContent:"center", backdropFilter:"blur(2px)" }}
    onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
    <div style={{ background:C.surface, borderRadius:`${RADIUS.xl}px ${RADIUS.xl}px 0 0`, width:"100%", maxWidth:wide?680:520, maxHeight:"92vh", overflowY:"auto", boxShadow:SH_LG }}>
      <div style={{ display:"flex", justifyContent:"center", padding:"14px 0 0" }}>
        <div style={{ width:36, height:4, borderRadius:2, background:C.border }}/>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 20px 14px", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, background:C.surface, zIndex:1 }}>
        <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:C.text, letterSpacing:"-0.2px" }}>{title}</h2>
        <button onClick={onClose} style={{ background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:"50%", width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:C.sub, transition:TR }}>
          <Icon name="x" size={15} color={C.sub}/>
        </button>
      </div>
      <div style={{ padding:"18px 20px 20px" }}>{children}</div>
    </div>
  </div>
);

const DestructiveConfirm = ({ message, onConfirm, onCancel, confirmLabel="Confirm", variant="danger" }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.58)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:24, backdropFilter:"blur(3px)" }}>
    <div style={{ background:C.surface, borderRadius:RADIUS.xl, padding:28, maxWidth:320, width:"100%", boxShadow:SH_LG, textAlign:"center" }}>
      <div style={{ width:52, height:52, background:variant==="danger"?C.redLight:C.amberLight, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
        <Icon name="warn" size={24} color={variant==="danger"?C.red:C.amber}/>
      </div>
      <p style={{ fontSize:14, color:C.text, marginBottom:22, lineHeight:1.5 }}>{message}</p>
      <div style={{ display:"flex", gap:10 }}>
        <Btn onClick={onCancel} variant="ghost" full>Cancel</Btn>
        <Btn onClick={onConfirm} variant={variant==="green"?"green":"danger"} full>{confirmLabel}</Btn>
      </div>
    </div>
  </div>
);

const UnsavedWarn = ({ onDiscard, onContinue }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.58)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
    <div style={{ background:C.surface, borderRadius:RADIUS.xl, padding:28, maxWidth:300, width:"100%", boxShadow:SH_LG, textAlign:"center" }}>
      <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:8 }}>Unsaved Changes</div>
      <p style={{ fontSize:13, color:C.sub, marginBottom:20 }}>Kya aap bina save kiye band karna chahte hain?</p>
      <div style={{ display:"flex", gap:10 }}>
        <Btn onClick={onDiscard} variant="danger" full>Discard</Btn>
        <Btn onClick={onContinue} variant="ghost" full>Continue Editing</Btn>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// RECEIPT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const Receipt = ({ member, renewal, libName, onClose }) => (
  <Modal title="Payment Receipt" onClose={onClose}>
    <div style={{ textAlign:"center", marginBottom:18 }}>
      <div style={{ fontSize:18, fontWeight:900, color:C.teal }}>{libName}</div>
      <div style={{ fontSize:12, color:C.faint }}>Official Payment Receipt</div>
    </div>
    <div style={{ background:C.surfaceAlt, borderRadius:RADIUS.md, padding:16, marginBottom:16 }}>
      {[
        ["Member", member.name],
        ["ID", member.id],
        ["Phone", member.phone],
        ["Plan", renewal.planName],
        ["Amount", `₹${renewal.amount}`],
        ["From", fmtDate(renewal.from)],
        ["To", fmtDate(renewal.to)],
        ["Paid On", `${fmtDate(renewal.paidOn)} ${renewal.paidTime||""}`],
      ].map(([k,v]) => (
        <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
          <span style={{ color:C.sub, fontWeight:600 }}>{k}</span>
          <span style={{ color:C.text, fontWeight:700 }}>{v}</span>
        </div>
      ))}
      {renewal.note && <div style={{ marginTop:8, fontSize:12, color:C.amber }}>Note: {renewal.note}</div>}
    </div>
    <Btn onClick={()=>window.print()} variant="ghost" iconName="print" full>Print Receipt</Btn>
  </Modal>
);

// ─────────────────────────────────────────────────────────────────────────────
// RENEW MODAL
// ─────────────────────────────────────────────────────────────────────────────
const RenewModal = ({ member, plans, onRenew, onClose }) => {
  const [selPlanId, setSelPlanId] = useState(member.planId || plans[0]?.id);
  const [amount, setAmount]       = useState("");
  const [note, setNote]           = useState("");
  const [paid, setPaid]           = useState(true);

  const selPlan = plans.find(p => p.id === selPlanId);

  useEffect(() => {
    if (selPlan) setAmount(String(selPlan.price));
  }, [selPlanId]);

  const handleRenew = () => {
    if (!selPlan) return;
    const from = todayStr();
    const to   = addDays(from, selPlan.days);
    const renewal = {
      planId: selPlan.id, planName: selPlan.name,
      amount: Number(amount) || selPlan.price,
      from, to, paidOn: from, paidTime: timeNow(), note: note||null,
    };
    onRenew(member.id, selPlan, renewal, paid, to);
    onClose();
  };

  return (
    <Modal title={`Renew — ${member.name}`} onClose={onClose}>
      <Divider label="Select Plan"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
        {plans.map(p => (
          <div key={p.id} onClick={()=>setSelPlanId(p.id)}
            style={{ border:`2px solid ${selPlanId===p.id?C.teal:C.border}`, borderRadius:RADIUS.md, padding:"10px 12px", cursor:"pointer", background:selPlanId===p.id?C.tealLight:C.white, transition:TR, boxShadow:selPlanId===p.id?FOCUS:"none" }}>
            <div style={{ fontWeight:900, color:C.teal, fontSize:17, fontFamily:"monospace" }}>₹{p.price}</div>
            <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>{p.name}</div>
            <div style={{ fontSize:11, color:C.sub }}>{p.days} days</div>
          </div>
        ))}
      </div>
      <Field label="Amount (₹)" value={amount} onChange={setAmount} type="number" hint="Custom amount allowed"/>
      <Field label="Note (optional)" value={note} onChange={setNote} placeholder="e.g. ₹50 discount"/>
      <label style={{ display:"flex", alignItems:"center", gap:10, background:paid?C.greenLight:C.surfaceAlt, borderRadius:RADIUS.md, padding:"12px 14px", marginBottom:16, cursor:"pointer", border:`1px solid ${paid?C.green:C.border}`, transition:TR }}>
        <input type="checkbox" checked={paid} onChange={e=>setPaid(e.target.checked)} style={{ width:17, height:17, accentColor:C.green }}/>
        <div>
          <div style={{ fontWeight:700, color:paid?C.green:C.text, fontSize:14 }}>Fee collect kar li ✓</div>
          <div style={{ fontSize:11, color:C.sub }}>Timeline mein record hoga</div>
        </div>
      </label>
      <Btn onClick={handleRenew} variant="purple" iconName="refresh" full>Renew Now</Btn>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MEMBER TIMELINE
// ─────────────────────────────────────────────────────────────────────────────
const MemberTimeline = ({ member, plans, onRenew, onReceipt }) => {
  const renewals   = member.renewals || [];
  const status     = getMemberStatus(member);
  const sm         = STATUS_META[status];
  const totalPaid  = renewals.reduce((s,r) => s+r.amount, 0);
  const plan       = plans.find(p => p.id===member.planId);
  const remaining  = daysLeft(member.expiry);
  const remPct     = clamp(Math.round((Math.max(0,remaining)/(plan?.days||30))*100), 0, 100);

  const events = [];
  for (let i=0; i<renewals.length; i++) {
    const r = renewals[i];
    if (i!==0) {
      const gap = Math.round((new Date(r.from)-new Date(renewals[i-1].to))/86400000);
      if (gap>1) events.push({ type:"gap", from:renewals[i-1].to, to:r.from, days:gap });
    }
    events.push({ type:"renewal", ...r, index:i+1 });
  }

  return (
    <div>
      <div style={{ background:`linear-gradient(135deg,${C.teal}12,${C.tealLight})`, border:`1px solid ${C.teal}22`, borderRadius:RADIUS.lg, padding:18, marginBottom:18 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
          <div style={sAvatar(54)}>{member.name?.[0]}</div>
          <div>
            <div style={{ fontSize:18, fontWeight:900, color:C.text }}>{member.name}</div>
            <div style={{ fontSize:13, color:C.sub }}>{member.phone} · {member.id}</div>
            <div style={{ marginTop:6 }}><StatusBadge status={status}/></div>
          </div>
        </div>
        <div style={{ background:C.white, borderRadius:RADIUS.md, padding:12, boxShadow:SH_XS }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, fontWeight:700, marginBottom:4 }}>
            <span>{plan?.name} Plan Progress</span>
            <span style={{ color:sm.color }}>{remaining<0?`${Math.abs(remaining)}d overdue`:`${remaining}d left`}</span>
          </div>
          <div style={{ background:C.surfaceAlt, height:6, borderRadius:RADIUS.full, overflow:"hidden" }}>
            <div style={{ width:`${remPct}%`, height:"100%", background:sm.color }}/>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        <StatBox icon="fee"      label="Total Collected" value={`₹${totalPaid}`}         color={C.green}/>
        <StatBox icon="calendar" label="Sessions"        value={renewals.length}           color={C.teal}/>
      </div>
      {(status==="expired"||status==="expiring") &&
        <Btn onClick={onRenew} variant="purple" iconName="refresh" full>Renew Space Now</Btn>}
      <div style={{ marginTop:16 }}>
        <Divider label={`Activity Ledger — ${renewals.length} entries`}/>
        <div style={{ position:"relative", paddingLeft:24 }}>
          <div style={{ position:"absolute", left:9, top:0, bottom:0, width:2, background:C.border }}/>
          {events.map((e, idx) => (
            <div key={idx} style={{ position:"relative", marginBottom:14 }}>
              <div style={{ position:"absolute", left:-21, top:6, width:12, height:12, borderRadius:"50%", background:e.type==="gap"?C.amber:C.teal, border:`2px solid ${C.white}` }}/>
              {e.type==="gap"
                ? <div style={{ background:C.amberLight, borderRadius:RADIUS.md, padding:"8px 12px", fontSize:12, color:C.amber, fontWeight:600 }}>
                    {e.days}-day gap between {fmtDateSh(e.from)} – {fmtDateSh(e.to)}
                  </div>
                : <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:RADIUS.md, padding:"11px 13px", boxShadow:SH_XS }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                      <div>
                        <span style={{ fontWeight:800, color:C.text, fontSize:13 }}>Session #{e.index} — {e.planName}</span>
                        {e.note && <div style={{ fontSize:11, color:C.amber, marginTop:2 }}>{e.note}</div>}
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:15, fontWeight:900, color:C.green, fontFamily:"monospace" }}>₹{e.amount}</div>
                        <div style={{ fontSize:10, color:C.faint }}>{fmtDateSh(e.from)} – {fmtDateSh(e.to)}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:11, color:C.faint }}>Paid: {fmtDate(e.paidOn)} {e.paidTime}</span>
                      {onReceipt && <Btn onClick={()=>onReceipt(e)} variant="ghost" size="sm" iconName="print">Receipt</Btn>}
                    </div>
                  </div>
              }
            </div>
          ))}
          {events.length===0 && <div style={{ fontSize:13, color:C.faint, padding:"8px 0" }}>Koi record nahi.</div>}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const DashboardScreen = ({ members, plans, settings, onNav }) => {
  const active   = members.filter(m => getMemberStatus(m)==="active").length;
  const expiring = members.filter(m => getMemberStatus(m)==="expiring").length;
  const expired  = members.filter(m => getMemberStatus(m)==="expired").length;
  const unpaid   = members.filter(m => !m.paid).length;
  const totalRev = members.reduce((s,m) => s+(m.renewals||[]).reduce((a,r)=>a+r.amount,0), 0);
  const occupiedSeats = members.filter(m => m.seatNo!=null && getMemberStatus(m)==="active").length;

  const alerts = [
    ...members.filter(m=>getMemberStatus(m)==="expiring").map(m=>({ type:"warn", msg:`${m.name} — ${daysLeft(m.expiry)}d bacha hai`, action:()=>onNav("members") })),
    ...members.filter(m=>getMemberStatus(m)==="expired" && !m.manualInactive).map(m=>({ type:"red", msg:`${m.name} — expired ${Math.abs(daysLeft(m.expiry))}d pehle`, action:()=>onNav("members") })),
    ...members.filter(m=>!m.paid && getMemberStatus(m)==="active").map(m=>({ type:"amber", msg:`${m.name} — fee pending`, action:()=>onNav("fees") })),
  ];

  return (
    <div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:22, fontWeight:900, color:C.text, letterSpacing:"-0.4px" }}>{settings.libraryName}</div>
        <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>{settings.address} · {settings.timing}</div>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:14 }}>
        <StatBox icon="users"    label="Total Members"  value={members.length}          color={C.teal}/>
        <StatBox icon="check"    label="Active"         value={active}                  color={C.green}/>
        <StatBox icon="fee"      label="Total Revenue"  value={`₹${totalRev.toLocaleString()}`} color={C.purple}/>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
        <StatBox icon="warn"     label="Expiring Soon"  value={expiring}  color={C.amber}/>
        <StatBox icon="x"        label="Expired"        value={expired}   color={C.red}/>
        <StatBox icon="bell"     label="Fee Pending"    value={unpaid}    color={C.orange}/>
        <StatBox icon="seat"     label="Seats Occupied" value={`${occupiedSeats}/${settings.totalSeats}`} color={C.indigo}/>
      </div>
      {alerts.length>0 && (
        <div>
          <Divider label={`Alerts — ${alerts.length}`}/>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
            {alerts.slice(0,5).map((a,i) => (
              <Alert key={i} color={a.type==="red"?C.red:a.type==="warn"?C.teal:C.amber} bg={a.type==="red"?C.redLight:a.type==="warn"?C.tealLight:C.amberLight} iconName={a.type==="red"?"x":"warn"}>
                <span onClick={a.action} style={{ cursor:"pointer", textDecoration:"underline" }}>{a.msg}</span>
              </Alert>
            ))}
          </div>
        </div>
      )}
      <Divider label="Quick Actions"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <Btn onClick={()=>onNav("members")} variant="primary"  iconName="users"  full>Members</Btn>
        <Btn onClick={()=>onNav("fees")}    variant="green"    iconName="fee"    full>Fees</Btn>
        <Btn onClick={()=>onNav("seats")}   variant="indigo"   iconName="seat"   full>Seats</Btn>
        <Btn onClick={()=>onNav("admin")}   variant="ghost"    iconName="settings" full>Settings</Btn>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: SEATS
// ─────────────────────────────────────────────────────────────────────────────
const SeatsScreen = ({ members, settings }) => {
  const total    = settings.totalSeats;
  const occupied = {};
  members.forEach(m => {
    if (m.seatNo!=null && getMemberStatus(m)!=="inactive") occupied[toSeatInt(m.seatNo)] = m;
  });

  return (
    <div>
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:22, fontWeight:900, color:C.text, letterSpacing:"-0.4px" }}>Seats</div>
        <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>
          {Object.keys(occupied).length} occupied · {total - Object.keys(occupied).length} free
        </div>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
        <Badge text="🟢 Free"     color={C.green} bg={C.greenLight}/>
        <Badge text="🔴 Occupied" color={C.red}   bg={C.redLight}/>
        <Badge text="🟡 Expiring" color={C.amber} bg={C.amberLight}/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(72px,1fr))", gap:8 }}>
        {Array.from({ length:total }, (_,i) => {
          const num    = i+1;
          const member = occupied[num];
          const status = member ? getMemberStatus(member) : null;
          const bg     = !member ? C.greenLight : status==="expiring" ? C.amberLight : C.redLight;
          const color  = !member ? C.green : status==="expiring" ? C.amber : C.red;
          return (
            <div key={num} style={{ background:bg, border:`2px solid ${color}`, borderRadius:RADIUS.md, padding:"10px 6px", textAlign:"center", boxShadow:SH_XS }}>
              <div style={{ fontSize:16, fontWeight:900, color, fontFamily:"monospace" }}>{num}</div>
              {member
                ? <div style={{ fontSize:9, color, fontWeight:700, marginTop:2, lineHeight:1.2, wordBreak:"break-word" }}>{member.name.split(" ")[0]}</div>
                : <div style={{ fontSize:9, color:C.green, marginTop:2 }}>Free</div>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: MEMBERS
// ─────────────────────────────────────────────────────────────────────────────
const MembersScreen = ({ members, setMembers, plans, settings, addAudit, currentUser }) => {
  const [search, setSearch]             = useState("");
  const [filter, setFilter]             = useState("all");
  const [modal, setModal]               = useState(false);
  const [editing, setEditing]           = useState(null);
  const [viewing, setViewing]           = useState(null);
  const [renewFor, setRenewFor]         = useState(null);
  const [receipt, setReceipt]           = useState(null);
  const [deactivateGuard, setDeactivateGuard] = useState(null);
  const [deleteGuard, setDeleteGuard]   = useState(null);
  const [warnClose, setWarnClose]       = useState(false);

  const blank = { name:"", phone:"", address:"", planId:plans[0]?.id||"", seatNo:"", paid:false };
  const [form, setForm]         = useState(blank);
  const [origForm, setOrigForm] = useState(blank);
  const formDirty = JSON.stringify(form) !== JSON.stringify(origForm);

  const occupiedSeats = new Set(
    members.filter(m => m.seatNo!=null).map(m => toSeatInt(m.seatNo))
  );
  const seatOpts = [
    { value:"", label:"— No Seat —" },
    ...Array.from({ length:settings.totalSeats }, (_,i)=>i+1).map(n => ({
      value:String(n),
      label:`Seat ${n}${occupiedSeats.has(n) && toSeatInt(form.seatNo)!==n ? " (Occupied)" : ""}`,
      disabled: occupiedSeats.has(n) && toSeatInt(form.seatNo)!==n,
    })),
  ];

  const selPlan = plans.find(p => p.id===form.planId);

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.phone.includes(q) || m.id.toLowerCase().includes(q);
    const status = getMemberStatus(m);
    const matchF = filter==="all" || status===filter;
    return matchQ && matchF;
  });

  const openAdd  = () => { setEditing(null); setForm(blank); setOrigForm(blank); setModal(true); };
  const openEdit = m => {
    setEditing(m.id);
    const f = { name:m.name, phone:m.phone, address:m.address||"", planId:m.planId, seatNo:m.seatNo!=null?String(m.seatNo):"", paid:m.paid };
    setForm(f); setOrigForm(f); setModal(true);
  };
  const tryClose = () => { if (formDirty) setWarnClose(true); else setModal(false); };

  const save = () => {
    if (!form.name.trim()||!form.phone.trim()) return;
    const plan    = plans.find(p=>p.id===form.planId);
    const seatNum = toSeatInt(form.seatNo);
    if (editing) {
      setMembers(prev => prev.map(m => {
        if (m.id===editing) return { ...m, name:form.name, phone:form.phone, address:form.address, planId:form.planId, seatNo:seatNum, paid:form.paid };
        if (seatNum!=null && toSeatInt(m.seatNo)===seatNum) return { ...m, seatNo:null };
        return m;
      }));
      addAudit(currentUser, `Member edited: ${form.name} (${editing})`);
    } else {
      const newM = {
        id:genId(), name:form.name, phone:form.phone, address:form.address, planId:form.planId, seatNo:seatNum,
        firstJoined:todayStr(), expiry:addDays(todayStr(), plan?.days||30), paid:form.paid, manualInactive:false,
        renewals: form.paid && plan ? [{ planId:plan.id, planName:plan.name, amount:plan.price, from:todayStr(), to:addDays(todayStr(),plan.days), paidOn:todayStr(), paidTime:timeNow(), note:null }] : [],
      };
      setMembers(prev => [...prev.map(m=>(seatNum!=null&&toSeatInt(m.seatNo)===seatNum)?{...m,seatNo:null}:m), newM]);
      addAudit(currentUser, `New member: ${form.name} (${newM.id})`);
    }
    setModal(false);
  };

  const handleRenew = (id, plan, renewal, paid, newExpiry) => {
    setMembers(prev => prev.map(m => m.id!==id ? m : { ...m, planId:plan.id, expiry:newExpiry, paid, manualInactive:false, renewals:[...(m.renewals||[]),renewal] }));
    const m = members.find(x=>x.id===id);
    addAudit(currentUser, `Renewed: ${m?.name} → ${plan.name} till ${fmtDate(newExpiry)}`);
  };

  const markPaid = id => {
    setMembers(prev => prev.map(m => {
      if (m.id!==id) return m;
      const plan = plans.find(p=>p.id===m.planId);
      const r = { planId:plan?.id, planName:plan?.name||"?", amount:plan?.price||0, from:todayStr(), to:addDays(todayStr(),plan?.days||30), paidOn:todayStr(), paidTime:timeNow(), note:null };
      return { ...m, paid:true, renewals:[...(m.renewals||[]),r] };
    }));
    const m = members.find(x=>x.id===id);
    addAudit(currentUser, `Fee paid: ${m?.name}`);
  };

  const doDeactivate = id => {
    const m = members.find(x=>x.id===id);
    setMembers(prev => prev.map(x => x.id===id ? { ...x, manualInactive:!x.manualInactive } : x));
    addAudit(currentUser, `Member ${m?.manualInactive?"activated":"deactivated"}: ${m?.name}`);
    setDeactivateGuard(null);
  };

  const doDelete = id => {
    const m = members.find(x=>x.id===id);
    setMembers(prev => prev.filter(x=>x.id!==id));
    addAudit(currentUser, `Member DELETED: ${m?.name} (${id})`);
    setDeleteGuard(null);
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, gap:10 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:900, color:C.text, letterSpacing:"-0.4px" }}>Members</div>
          <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>{members.length} registered</div>
        </div>
        <Btn onClick={openAdd} iconName="plus">Add</Btn>
      </div>

      <div style={{ position:"relative", marginBottom:10 }}>
        <Icon name="search" size={14} color={C.faint} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name, phone ya ID..."
          style={{ width:"100%", padding:"10px 12px 10px 36px", borderRadius:RADIUS.lg, border:`1.5px solid ${C.border}`, fontSize:14, color:C.text, background:C.surface, outline:"none", boxSizing:"border-box", fontFamily:FONT, boxShadow:SH, transition:TR }}/>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:14, overflowX:"auto", paddingBottom:2 }}>
        {[["all","All"],["active","Active"],["expiring","Expiring"],["expired","Expired"],["inactive","Inactive"]].map(([v,l]) => (
          <button key={v} onClick={()=>setFilter(v)} style={sTabBtn(filter===v)}>{l}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.length===0 && <div style={{ textAlign:"center", padding:32, color:C.sub, fontSize:14 }}>Koi member nahi mila.</div>}
        {filtered.map(m => {
          const status = getMemberStatus(m), plan = plans.find(p=>p.id===m.planId), tp = (m.renewals||[]).reduce((s,r)=>s+r.amount,0);
          return (
            <Card key={m.id} style={{ padding:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <div style={sAvatar(44)}>{m.name[0]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:800, color:C.text, fontSize:15, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", letterSpacing:"-0.2px" }}>{m.name}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:C.sub }}>
                    <Icon name="phone" size={11} color={C.faint}/>{m.phone} · <span style={{ fontFamily:"monospace", color:C.faint, fontSize:11 }}>{m.id}</span>
                  </div>
                  <div style={{ fontSize:11, color:C.faint, marginTop:2 }}>Since {fmtDate(m.firstJoined)} · {m.renewals?.length||0} sessions · ₹{tp.toLocaleString()} total</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:17, fontWeight:900, color:C.teal, fontFamily:"monospace", letterSpacing:"-0.5px" }}>₹{plan?.price??""}</div>
                  <div style={{ fontSize:10, color:C.faint, marginTop:1 }}>{plan?.name}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                {m.seatNo!=null ? <Badge text={`🪑 Seat ${m.seatNo}`} color={C.teal} bg={C.tealMid}/> : null}
                <StatusBadge status={status}/>
                <Badge text={m.paid?"✓ Paid":"Fee Pending"} color={m.paid?C.green:C.red} bg={m.paid?C.greenLight:C.redLight}/>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <Btn onClick={()=>setViewing(m)} variant="ghost" size="sm" iconName="timeline">Profile</Btn>
                {(status==="expired"||status==="expiring"||status==="inactive") ? <Btn onClick={()=>setRenewFor(m)} variant="purple" size="sm" iconName="refresh">Renew</Btn> : null}
                {!m.paid ? <Btn onClick={()=>markPaid(m.id)} variant="green" size="sm" iconName="check">Paid</Btn> : null}
                <Btn onClick={()=>openEdit(m)} variant="ghost" size="sm" iconName="edit">Edit</Btn>
                <Btn onClick={()=>setDeactivateGuard(m)} variant="ghost" size="sm">{m.manualInactive?"Activate":"Deactivate"}</Btn>
                <Btn onClick={()=>setDeleteGuard(m)} variant="danger" size="sm" iconName="trash"/>
              </div>
            </Card>
          );
        })}
      </div>

      {modal && (
        <Modal title={editing?"Edit Member":"New Member"} onClose={tryClose}>
          <Divider label="Basic Info"/>
          <Field label="Full Name"  value={form.name}    onChange={v=>setForm({...form,name:v})}    placeholder="e.g. Ravi Kumar" required/>
          <Field label="Phone"      value={form.phone}   onChange={v=>setForm({...form,phone:v})}   placeholder="10-digit" type="tel" required/>
          <Field label="Address"    value={form.address} onChange={v=>setForm({...form,address:v})} placeholder="e.g. Jaunpur, UP" hint="Optional"/>
          {!editing && <Alert color={C.blue} bg={C.blueLight} iconName="info" style={{ marginBottom:14 }}>
            <b>First Join Date — Auto Locked:</b> {fmtDate(todayStr())}
          </Alert>}
          <Divider label="Seat"/>
          <Field label="Seat Number" value={form.seatNo} onChange={v=>setForm({...form,seatNo:v})} options={seatOpts} hint={`1–${settings.totalSeats} · Occupied seats disabled`}/>
          <Divider label="Membership Plan"/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
            {plans.map(p => (
              <div key={p.id} onClick={()=>setForm({...form,planId:p.id})}
                style={{ border:`2px solid ${form.planId===p.id?C.teal:C.border}`, borderRadius:RADIUS.md, padding:"10px 12px", cursor:"pointer", background:form.planId===p.id?C.tealLight:C.white, transition:TR, boxShadow:form.planId===p.id?FOCUS:"none" }}>
                <div style={{ fontWeight:900, color:C.teal, fontSize:17, fontFamily:"monospace" }}>₹{p.price}</div>
                <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>{p.name}</div>
                <div style={{ fontSize:11, color:C.sub }}>{p.days} days</div>
              </div>
            ))}
          </div>
          {selPlan && <div style={{ background:C.tealLight, borderRadius:RADIUS.md, padding:"10px 14px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:13, color:C.teal, fontWeight:700 }}>{selPlan.name} · {selPlan.days} days</div>
            <div style={{ fontSize:20, fontWeight:900, color:C.teal, fontFamily:"monospace" }}>₹{selPlan.price}</div>
          </div>}
          <label style={{ display:"flex", alignItems:"center", gap:10, background:form.paid?C.greenLight:C.surfaceAlt, borderRadius:RADIUS.md, padding:"12px 14px", marginBottom:16, cursor:"pointer", border:`1px solid ${form.paid?C.green:C.border}`, transition:TR }}>
            <input type="checkbox" checked={form.paid} onChange={e=>setForm({...form,paid:e.target.checked})} style={{ width:17, height:17, accentColor:C.green }}/>
            <div>
              <div style={{ fontWeight:700, color:form.paid?C.green:C.text, fontSize:14 }}>Fee collect kar li ✓</div>
              <div style={{ fontSize:11, color:C.sub }}>Timeline mein record hoga</div>
            </div>
          </label>
          {formDirty && <Alert color={C.amber} bg={C.amberLight} iconName="warn" style={{ marginBottom:12 }}>Unsaved changes hain — Save zaroor karo.</Alert>}
          <Btn onClick={save} iconName="check" full>Save Member</Btn>
        </Modal>
      )}

      {warnClose       && <UnsavedWarn onDiscard={()=>{setWarnClose(false);setModal(false);}} onContinue={()=>setWarnClose(false)}/>}
      {deactivateGuard && <DestructiveConfirm message={`"${deactivateGuard.name}" ko ${deactivateGuard.manualInactive?"activate":"deactivate"} karna chahte ho?`} confirmLabel={deactivateGuard.manualInactive?"Activate":"Deactivate"} variant={deactivateGuard.manualInactive?"green":"amber"} onConfirm={()=>doDeactivate(deactivateGuard.id)} onCancel={()=>setDeactivateGuard(null)}/>}
      {deleteGuard     && <DestructiveConfirm message={`"${deleteGuard.name}" permanently delete hoga. Undo nahi hoga.`} confirmLabel="Delete" variant="danger" onConfirm={()=>doDelete(deleteGuard.id)} onCancel={()=>setDeleteGuard(null)}/>}
      {viewing && (
        <Modal title="Member Profile" onClose={()=>setViewing(null)} wide>
          <MemberTimeline
            member={members.find(x=>x.id===viewing.id)||viewing}
            plans={plans}
            onRenew={()=>{ setRenewFor(members.find(x=>x.id===viewing.id)); setViewing(null); }}
            onReceipt={renewal=>setReceipt({ member:members.find(x=>x.id===viewing.id)||viewing, renewal })}/>
        </Modal>
      )}
      {renewFor && <RenewModal member={members.find(x=>x.id===renewFor.id)||renewFor} plans={plans} onRenew={handleRenew} onClose={()=>setRenewFor(null)}/>}
      {receipt  && <Receipt member={receipt.member} renewal={receipt.renewal} libName={settings.libraryName} onClose={()=>setReceipt(null)}/>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: FEES
// ─────────────────────────────────────────────────────────────────────────────
const FeesScreen = ({ members, setMembers, plans, settings, addAudit, currentUser }) => {
  const [filter, setFilter]   = useState("all");
  const [receipt, setReceipt] = useState(null);
  const [renewFor, setRenewFor] = useState(null);

  const markPaid = id => {
    setMembers(prev => prev.map(m => {
      if (m.id!==id) return m;
      const plan = plans.find(p=>p.id===m.planId);
      const r = { planId:plan?.id, planName:plan?.name||"?", amount:plan?.price||0, from:todayStr(), to:addDays(todayStr(),plan?.days||30), paidOn:todayStr(), paidTime:timeNow(), note:null };
      return { ...m, paid:true, renewals:[...(m.renewals||[]),r] };
    }));
    const m = members.find(x=>x.id===id);
    addAudit(currentUser, `Fee marked paid: ${m?.name}`);
  };
  const markUnpaid = id => setMembers(prev => prev.map(m => m.id===id ? { ...m, paid:false } : m));

  const handleRenew = (id, plan, renewal, paid, newExpiry) => {
    setMembers(prev => prev.map(m => m.id!==id ? m : { ...m, planId:plan.id, expiry:newExpiry, paid, manualInactive:false, renewals:[...(m.renewals||[]),renewal] }));
    const m = members.find(x=>x.id===id);
    addAudit(currentUser, `Renewed: ${m?.name} → ${plan.name}`);
  };

  const allPaid = members.reduce((s,m) => s+(m.renewals||[]).reduce((a,r)=>a+r.amount,0), 0);
  const pending = members.filter(m=>!m.paid).reduce((s,m) => s+(plans.find(p=>p.id===m.planId)?.price||0), 0);
  const filtered = filter==="paid" ? members.filter(m=>m.paid) : filter==="unpaid" ? members.filter(m=>!m.paid) : members;

  return (
    <div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:22, fontWeight:900, color:C.text, letterSpacing:"-0.4px" }}>Fees</div>
        <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>Offline collection · history · receipt</div>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:14 }}>
        <StatBox icon="check" label="All-time Collected" value={`₹${allPaid.toLocaleString()}`} sub={`${members.filter(m=>m.paid).length} paid`} color={C.green}/>
        <StatBox icon="bell"  label="Pending"            value={`₹${pending.toLocaleString()}`}  sub={`${members.filter(m=>!m.paid).length} members`} color={C.red}/>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["all","All"],["paid","Paid"],["unpaid","Pending"]].map(([v,l]) => (
          <button key={v} onClick={()=>setFilter(v)} style={sTabBtn(filter===v)}>{l}</button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(m => {
          const plan = plans.find(p=>p.id===m.planId), last=(m.renewals||[]).slice(-1)[0], status=getMemberStatus(m), tp=(m.renewals||[]).reduce((s,r)=>s+r.amount,0);
          return (
            <Card key={m.id} style={{ padding:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <div style={sAvatar(40)}>{m.name[0]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:800, color:C.text, fontSize:14 }}>{m.name}</div>
                  <div style={{ fontSize:12, color:C.sub }}>{m.phone} · {m.id}{m.seatNo!=null?` · Seat ${m.seatNo}`:""}</div>
                  <div style={{ fontSize:11, color:C.faint }}>{m.renewals?.length||0} sessions · ₹{tp.toLocaleString()} total</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:17, fontWeight:900, color:C.teal, fontFamily:"monospace" }}>₹{plan?.price??""}</div>
                  <div style={{ fontSize:10, color:C.faint }}>{plan?.name}</div>
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
                  <Badge text={m.paid?"✓ Paid":"Pending"} color={m.paid?C.green:C.red} bg={m.paid?C.greenLight:C.redLight}/>
                  <StatusBadge status={status}/>
                  {last && <span style={{ fontSize:11, color:C.faint }}>Last: {fmtDate(last.paidOn)}</span>}
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {!m.paid ? <Btn onClick={()=>markPaid(m.id)} variant="green" size="sm" iconName="check">Mark Paid</Btn> : <Btn onClick={()=>markUnpaid(m.id)} variant="ghost" size="sm">Unmark</Btn>}
                  {(status==="expired"||status==="expiring") ? <Btn onClick={()=>setRenewFor(m)} variant="purple" size="sm" iconName="refresh">Renew</Btn> : null}
                  {last && <Btn onClick={()=>setReceipt({member:m,renewal:last})} variant="ghost" size="sm" iconName="print"/>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {renewFor && <RenewModal member={members.find(x=>x.id===renewFor.id)||renewFor} plans={plans} onRenew={handleRenew} onClose={()=>setRenewFor(null)}/>}
      {receipt  && <Receipt member={receipt.member} renewal={receipt.renewal} libName={settings.libraryName} onClose={()=>setReceipt(null)}/>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: ADMIN PANEL
// ─────────────────────────────────────────────────────────────────────────────
const AdminPanel = ({ settings, setSettings, plans, setPlans, members, staff, setStaff, auditLog, addAudit, currentUser }) => {
  const [tab, setTab]           = useState("library");
  const [s, setS]               = useState({...settings});
  const [origS, setOrigS]       = useState({...settings});
  const [saved, setSaved]       = useState(false);
  const [planModal, setPlanModal]     = useState(false);
  const [editPlan, setEditPlan]       = useState(null);
  const [pForm, setPForm]             = useState({ name:"", days:"", price:"" });
  const [staffModal, setStaffModal]   = useState(false);
  const [editStaff, setEditStaff]     = useState(null);
  const [sfForm, setSfForm]           = useState({ name:"", email:"", role:"staff", pin:"" });
  const [deleteStaffGuard, setDeleteStaffGuard] = useState(null);
  const [deletePlanGuard, setDeletePlanGuard]   = useState(null);

  const settingsDirty = JSON.stringify(s) !== JSON.stringify(origS);

  const saveSettings = () => {
    setSettings(s); setOrigS({...s}); setSaved(true);
    setTimeout(()=>setSaved(false), 2000);
    addAudit(currentUser, "Library settings updated");
  };

  const openAddPlan  = () => { setEditPlan(null);  setPForm({ name:"", days:"", price:"" }); setPlanModal(true); };
  const openEditPlan = p  => { setEditPlan(p.id);  setPForm({ name:p.name, days:String(p.days), price:String(p.price) }); setPlanModal(true); };
  const savePlan = () => {
    if (!pForm.name||!pForm.days||!pForm.price) return;
    const data = { name:pForm.name, days:Number(pForm.days), price:Number(pForm.price) };
    if (editPlan) { setPlans(prev=>prev.map(p=>p.id===editPlan?{...p,...data}:p)); addAudit(currentUser,`Plan edited: ${pForm.name}`); }
    else          { setPlans(prev=>[...prev,{id:"p"+Date.now(),...data}]); addAudit(currentUser,`Plan created: ${pForm.name} ₹${pForm.price}`); }
    setPlanModal(false);
  };
  const doDeletePlan = id => {
    const p = plans.find(x=>x.id===id);
    setPlans(prev=>prev.filter(x=>x.id!==id));
    addAudit(currentUser, `Plan deleted: ${p?.name}`);
    setDeletePlanGuard(null);
  };

  const openAddStaff  = () => { setEditStaff(null);    setSfForm({ name:"", email:"", role:"staff", pin:"" }); setStaffModal(true); };
  const openEditStaff = sf => { setEditStaff(sf.id);   setSfForm({ name:sf.name, email:sf.email, role:sf.role, pin:sf.pin }); setStaffModal(true); };
  const saveStaff = () => {
    if (!sfForm.name||!sfForm.email||!sfForm.pin) return;
    if (editStaff) { setStaff(prev=>prev.map(sf=>sf.id===editStaff?{...sf,...sfForm}:sf)); addAudit(currentUser,`Staff edited: ${sfForm.name}`); }
    else           { const ns={id:"S"+Date.now(),...sfForm,active:true,createdAt:todayStr()}; setStaff(prev=>[...prev,ns]); addAudit(currentUser,`Staff added: ${sfForm.name} (${sfForm.role})`); }
    setStaffModal(false);
  };
  const toggleStaffActive = id => {
    const sf = staff.find(x=>x.id===id);
    setStaff(prev=>prev.map(x=>x.id===id?{...x,active:!x.active}:x));
    addAudit(currentUser, `Staff ${sf?.active?"deactivated":"activated"}: ${sf?.name}`);
  };
  const doDeleteStaff = id => {
    const sf = staff.find(x=>x.id===id);
    setStaff(prev=>prev.filter(x=>x.id!==id));
    addAudit(currentUser, `Staff deleted: ${sf?.name}`);
    setDeleteStaffGuard(null);
  };

  const exportData = () => {
    const data = { exportedAt:fmtDT(), settings, plans, members, staff:staff.map(({pin:_,...s})=>s), auditLog };
    const blob = new Blob([JSON.stringify(data,null,2)], { type:"application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `tejas-library-backup-${todayStr()}.json`;
    a.click();
    addAudit(currentUser, "Data exported");
  };

  const tabs = [["library","Library"],["plans","Plans"],["staff","Staff"],["backup","Backup"]];

  return (
    <div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:22, fontWeight:900, color:C.text, letterSpacing:"-0.4px" }}>Admin Panel</div>
        <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>Settings · plans · staff management</div>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:18, overflowX:"auto", paddingBottom:2 }}>
        {tabs.map(([v,l]) => <button key={v} onClick={()=>setTab(v)} style={sTabBtn(tab===v)}>{l}</button>)}
      </div>

      {tab==="library" && (
        <Card style={{ padding:20 }}>
          <Divider label="Library Settings"/>
          <Field label="Library Name"   value={s.libraryName}  onChange={v=>setS({...s,libraryName:v})}/>
          <Field label="Total Seats"    value={s.totalSeats}   onChange={v=>setS({...s,totalSeats:Number(v)})} type="number"/>
          <Field label="Default Fee"    value={s.defaultFee}   onChange={v=>setS({...s,defaultFee:Number(v)})} type="number"/>
          <Field label="Address"        value={s.address}      onChange={v=>setS({...s,address:v})}/>
          <Field label="Timing"         value={s.timing}       onChange={v=>setS({...s,timing:v})}/>
          {settingsDirty && <Alert color={C.amber} bg={C.amberLight} iconName="warn" style={{ marginBottom:12 }}>Unsaved changes hain.</Alert>}
          {saved && <Alert color={C.green} bg={C.greenLight} iconName="check" style={{ marginBottom:12 }}>Saved!</Alert>}
          <Btn onClick={saveSettings} iconName="check" full>Save Settings</Btn>
        </Card>
      )}

      {tab==="plans" && (
        <div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
            <Btn onClick={openAddPlan} iconName="plus" size="sm">Add Plan</Btn>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {plans.map(p => (
              <Card key={p.id} style={{ padding:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:800, color:C.text, fontSize:15 }}>{p.name}</div>
                  <div style={{ fontSize:12, color:C.sub }}>{p.days} days · ₹{p.price}</div>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <Btn onClick={()=>openEditPlan(p)} variant="ghost" size="sm" iconName="edit"/>
                  <Btn onClick={()=>setDeletePlanGuard(p)} variant="danger" size="sm" iconName="trash"/>
                </div>
              </Card>
            ))}
          </div>
          {planModal && (
            <Modal title={editPlan?"Edit Plan":"New Plan"} onClose={()=>setPlanModal(false)}>
              <Field label="Plan Name" value={pForm.name}  onChange={v=>setPForm({...pForm,name:v})}  placeholder="e.g. Monthly" required/>
              <Field label="Days"      value={pForm.days}  onChange={v=>setPForm({...pForm,days:v})}  type="number" required/>
              <Field label="Price (₹)" value={pForm.price} onChange={v=>setPForm({...pForm,price:v})} type="number" required/>
              <Btn onClick={savePlan} iconName="check" full>Save Plan</Btn>
            </Modal>
          )}
          {deletePlanGuard && <DestructiveConfirm message={`Plan "${deletePlanGuard.name}" delete karna chahte ho?`} confirmLabel="Delete" variant="danger" onConfirm={()=>doDeletePlan(deletePlanGuard.id)} onCancel={()=>setDeletePlanGuard(null)}/>}
        </div>
      )}

      {tab==="staff" && (
        <div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
            <Btn onClick={openAddStaff} iconName="plus" size="sm">Add Staff</Btn>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {staff.map(sf => (
              <Card key={sf.id} style={{ padding:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                  <div style={sAvatar(40)}>{sf.name[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, color:C.text, fontSize:14 }}>{sf.name}</div>
                    <div style={{ fontSize:12, color:C.sub }}>{sf.email}</div>
                    <div style={{ fontSize:11, color:C.faint, marginTop:2 }}>
                      <Badge text={sf.role} color={sf.role==="superadmin"?C.purple:C.teal} bg={sf.role==="superadmin"?C.purpleLight:C.tealMid}/>
                      {" "}<Badge text={sf.active?"Active":"Inactive"} color={sf.active?C.green:C.faint} bg={sf.active?C.greenLight:C.surfaceAlt}/>
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <Btn onClick={()=>openEditStaff(sf)} variant="ghost" size="sm" iconName="edit">Edit</Btn>
                  <Btn onClick={()=>toggleStaffActive(sf.id)} variant="ghost" size="sm">{sf.active?"Deactivate":"Activate"}</Btn>
                  <Btn onClick={()=>setDeleteStaffGuard(sf)} variant="danger" size="sm" iconName="trash"/>
                </div>
              </Card>
            ))}
          </div>
          {staffModal && (
            <Modal title={editStaff?"Edit Staff":"New Staff"} onClose={()=>setStaffModal(false)}>
              <Field label="Name"  value={sfForm.name}  onChange={v=>setSfForm({...sfForm,name:v})}  required/>
              <Field label="Email" value={sfForm.email} onChange={v=>setSfForm({...sfForm,email:v})} type="email" required/>
              <Field label="Role"  value={sfForm.role}  onChange={v=>setSfForm({...sfForm,role:v})}
                options={[{value:"superadmin",label:"Super Admin"},{value:"staff",label:"Staff"},{value:"readonly",label:"Read Only"}]}/>
              <Field label="PIN"   value={sfForm.pin}   onChange={v=>setSfForm({...sfForm,pin:v})}   type="password" placeholder="4-digit PIN" required/>
              <Btn onClick={saveStaff} iconName="check" full>Save Staff</Btn>
            </Modal>
          )}
          {deleteStaffGuard && <DestructiveConfirm message={`"${deleteStaffGuard.name}" ko delete karna chahte ho?`} confirmLabel="Delete" variant="danger" onConfirm={()=>doDeleteStaff(deleteStaffGuard.id)} onCancel={()=>setDeleteStaffGuard(null)}/>}
        </div>
      )}

      {tab==="backup" && (
        <Card style={{ padding:20 }}>
          <Divider label="Data Backup"/>
          <Alert color={C.blue} bg={C.blueLight} iconName="info" style={{ marginBottom:16 }}>
            Sab data JSON format mein export hoga. Ise safe rakhein.
          </Alert>
          <StatBox icon="users"  label="Members" value={members.length} color={C.teal}/>
          <div style={{ marginTop:10 }}/>
          <StatBox icon="backup" label="Plans"   value={plans.length}   color={C.purple}/>
          <div style={{ marginTop:16 }}/>
          <Btn onClick={exportData} variant="indigo" iconName="download" full>Export All Data (JSON)</Btn>
        </Card>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: AUDIT LOG
// ─────────────────────────────────────────────────────────────────────────────
const AuditScreen = ({ auditLog }) => (
  <div>
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:22, fontWeight:900, color:C.text, letterSpacing:"-0.4px" }}>Audit Log</div>
      <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>{auditLog.length} events recorded</div>
    </div>
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {auditLog.length===0 && <div style={{ textAlign:"center", padding:32, color:C.faint, fontSize:14 }}>Abhi koi activity nahi.</div>}
      {[...auditLog].reverse().map((log, i) => (
        <Card key={i} style={{ padding:12 }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
            <Icon name="audit" size={14} color={C.teal} style={{ marginTop:2, flexShrink:0 }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, color:C.text, fontWeight:600 }}>{log.action}</div>
              <div style={{ fontSize:11, color:C.faint, marginTop:2 }}>{log.by} · {log.at}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const LoginScreen = ({ staff, onLogin }) => {
  const [email, setEmail]   = useState("");
  const [pin, setPin]       = useState("");
  const [error, setError]   = useState("");

  const handleLogin = () => {
    const user = staff.find(s => s.email===email.trim() && s.pin===pin && s.active);
    if (user) { setError(""); onLogin(user); }
    else       setError("Email ya PIN galat hai, ya account inactive hai.");
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:FONT }}>
      <div style={{ width:"100%", maxWidth:360 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:64, height:64, background:C.tealGrad, borderRadius:RADIUS.lg, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:SH_MD }}>
            <Icon name="shield" size={30} color={C.white}/>
          </div>
          <div style={{ fontSize:24, fontWeight:900, color:C.text, letterSpacing:"-0.5px" }}>Tejas Library</div>
          <div style={{ fontSize:13, color:C.sub, marginTop:4 }}>Staff Login</div>
        </div>
        <Card style={{ padding:24 }}>
          <Field label="Email"  value={email} onChange={setEmail} type="email" placeholder="staff@tejaslib.com" required/>
          <Field label="PIN"    value={pin}   onChange={setPin}   type="password" placeholder="4-digit PIN" required/>
          {error && <Alert color={C.red} bg={C.redLight} iconName="warn" style={{ marginBottom:12 }}>{error}</Alert>}
          <Btn onClick={handleLogin} iconName="shield" full>Login</Btn>
        </Card>
        <div style={{ textAlign:"center", marginTop:14, fontSize:11, color:C.faint }}>
          Demo: admin@tejaslib.com / 1234
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM NAV
// ─────────────────────────────────────────────────────────────────────────────
const BottomNav = ({ screen, onNav, perms }) => {
  const items = [
    { id:"dashboard", icon:"home",     label:"Home"    },
    { id:"seats",     icon:"seat",     label:"Seats"   },
    { id:"members",   icon:"users",    label:"Members" },
    { id:"fees",      icon:"fee",      label:"Fees"    },
    { id:"admin",     icon:"settings", label:"Admin"   },
    { id:"audit",     icon:"audit",    label:"Audit"   },
  ].filter(i => perms.includes(i.id));

  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", zIndex:100, boxShadow:"0 -4px 12px rgba(0,0,0,0.07)" }}>
      {items.map(it => (
        <button key={it.id} onClick={()=>onNav(it.id)}
          style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"8px 4px 10px", background:"none", border:"none", cursor:"pointer", gap:3 }}>
          <Icon name={it.icon} size={20} color={screen===it.id?C.teal:C.faint}/>
          <span style={{ fontSize:9, fontWeight:700, color:screen===it.id?C.teal:C.faint, fontFamily:FONT }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen]           = useState("dashboard");
  const [members, setMembers]         = useState(DEFAULT_MEMBERS);
  const [plans, setPlans]             = useState(DEFAULT_PLANS);
  const [settings, setSettings]       = useState(DEFAULT_SETTINGS);
  const [staff, setStaff]             = useState(DEFAULT_STAFF);
  const [auditLog, setAuditLog]       = useState([]);

  const addAudit = (user, action) => {
    setAuditLog(prev => [...prev, { by:user?.name||"System", action, at:fmtDT() }]);
  };

  if (!currentUser) {
    return <LoginScreen staff={staff} onLogin={user=>{ setCurrentUser(user); addAudit(user,"Logged in"); }}/>;
  }

  const perms = ROLE_PERMS[currentUser.role] || ROLE_PERMS.readonly;
  const safeScreen = perms.includes(screen) ? screen : "dashboard";

  const commonProps = { members, setMembers, plans, settings, addAudit, currentUser };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:FONT, paddingBottom:72 }}>
      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50, boxShadow:SH_SM }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, background:C.tealGrad, borderRadius:RADIUS.md, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="shield" size={16} color={C.white}/>
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:900, color:C.text, letterSpacing:"-0.2px" }}>{settings.libraryName}</div>
            <div style={{ fontSize:10, color:C.faint }}>Logged in as <b>{currentUser.name}</b></div>
          </div>
        </div>
        <Btn onClick={()=>{ setCurrentUser(null); setScreen("dashboard"); }} variant="ghost" size="sm" iconName="logout">Logout</Btn>
      </div>

      {/* Screen Content */}
      <div style={{ padding:"16px 14px" }}>
        {safeScreen==="dashboard" && <DashboardScreen members={members} plans={plans} settings={settings} onNav={setScreen}/>}
        {safeScreen==="seats"     && <SeatsScreen     members={members} settings={settings}/>}
        {safeScreen==="members"   && <MembersScreen   {...commonProps} setPlans={setPlans}/>}
        {safeScreen==="fees"      && <FeesScreen      {...commonProps}/>}
        {safeScreen==="admin"     && perms.includes("admin") && <AdminPanel settings={settings} setSettings={setSettings} plans={plans} setPlans={setPlans} members={members} staff={staff} setStaff={setStaff} auditLog={auditLog} addAudit={addAudit} currentUser={currentUser}/>}
        {safeScreen==="audit"     && perms.includes("audit") && <AuditScreen auditLog={auditLog}/>}
      </div>

      {/* Bottom Navigation */}
      <BottomNav screen={safeScreen} onNav={setScreen} perms={perms}/>
    </div>
  );
}
