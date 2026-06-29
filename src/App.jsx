// ─────────────────────────────────────────────────────────────────────────────
// TEJAS LIBRARY MANAGEMENT SYSTEM — UPGRADED v2.0
// Features: Dark Mode · Manual Entry · Supabase · Dev Panel · ID Card · PWA
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect, useMemo, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE CLIENT ─────────────────────────────────────────────────────────
const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase        = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ─── DARK MODE CONTEXT ───────────────────────────────────────────────────────
const DarkCtx = createContext({ dark: false, toggle: () => {} });
const useDark = () => useContext(DarkCtx);

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS (Light + Dark)
// ─────────────────────────────────────────────────────────────────────────────
// FIX 5: makeC is pure and has only 2 possible inputs (true/false).
// Cache both objects at module level — zero re-computation on any render.
const _C_CACHE = { light: null, dark: null };
const makeC = (dark) => {
  const key = dark ? "dark" : "light";
  if (_C_CACHE[key]) return _C_CACHE[key];
  _C_CACHE[key] = {
  bg:           dark ? "#0F172A" : "#F0F4F8",
  surface:      dark ? "#1E293B" : "#FFFFFF",
  surfaceAlt:   dark ? "#334155" : "#F5F7FA",
  surfaceGlass: dark ? "rgba(30,41,59,0.88)" : "rgba(255,255,255,0.72)",
  border:       dark ? "#334155" : "#E2E8F0",
  borderDark:   dark ? "#475569" : "#CBD5E1",
  teal:         "#0D9488",
  tealDark:     "#0B7C73",
  tealLight:    dark ? "#0D9488" + "22" : "#F0FDFA",
  tealMid:      dark ? "#0D9488" + "33" : "#CCFBF1",
  tealGrad:     "linear-gradient(135deg,#0D9488 0%,#0EA5A0 100%)",
  amber:        "#D97706",
  amberLight:   dark ? "#D97706" + "22" : "#FEF3C7",
  red:          "#DC2626",
  redLight:     dark ? "#DC2626" + "22" : "#FEE2E2",
  green:        "#16A34A",
  greenLight:   dark ? "#16A34A" + "22" : "#DCFCE7",
  purple:       "#9333EA",
  purpleLight:  dark ? "#9333EA" + "22" : "#F3E8FF",
  blue:         "#2563EB",
  blueLight:    dark ? "#2563EB" + "22" : "#EFF6FF",
  orange:       "#EA580C",
  orangeLight:  dark ? "#EA580C" + "22" : "#FFF7ED",
  indigo:       "#4F46E5",
  indigoLight:  dark ? "#4F46E5" + "22" : "#EEF2FF",
  text:         dark ? "#F1F5F9" : "#0F172A",
  sub:          dark ? "#94A3B8" : "#475569",
  faint:        dark ? "#64748B" : "#94A3B8",
  white:        "#FFFFFF",
  };
  return _C_CACHE[key];
};

const FONT   = "'Inter','Segoe UI',system-ui,sans-serif";
const SH_XS  = "0 1px 2px rgba(0,0,0,0.07)";
const SH_SM  = "0 1px 3px rgba(0,0,0,0.10),0 1px 2px rgba(0,0,0,0.06)";
const SH     = "0 2px 8px rgba(0,0,0,0.11),0 1px 3px rgba(0,0,0,0.07)";
const SH_MD  = "0 4px 12px rgba(0,0,0,0.14),0 2px 4px rgba(0,0,0,0.08)";
const SH_LG  = "0 12px 36px rgba(0,0,0,0.18),0 4px 8px rgba(0,0,0,0.10)";
const FOCUS  = "0 0 0 3px rgba(13,148,136,0.22)";
const RADIUS = { sm:8, md:12, lg:16, xl:20, full:9999 };
const TR     = "all 0.18s cubic-bezier(0.4,0,0.2,1)";

// ─────────────────────────────────────────────────────────────────────────────
// STYLE GENERATORS (dark-aware via C param)
// ─────────────────────────────────────────────────────────────────────────────
const sCard    = (C, extra={}) => ({ background:C.surface, border:`1px solid ${C.border}`, borderRadius:RADIUS.lg, boxShadow:SH, ...extra });
const sBadge   = (color,bg,size=11,px=10) => ({ background:bg, color, fontSize:size, fontWeight:700, padding:`3px ${px}px`, borderRadius:RADIUS.full, whiteSpace:"nowrap", display:"inline-block", letterSpacing:"0.01em" });
const sStatBox = (C, color) => ({ background:color+"18", borderLeft:`3px solid ${color}`, borderRadius:RADIUS.md, padding:"14px 16px", flex:1, minWidth:130, boxShadow:SH_XS });
const sAvatar  = (size=46) => ({ width:size, height:size, borderRadius:"50%", background:"linear-gradient(135deg,#0D9488 0%,#0EA5A0 100%)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:Math.round(size*0.42), flexShrink:0, boxShadow:SH_SM });
const sDivider = (C) => ({ fontSize:10, fontWeight:800, color:C.faint, textTransform:"uppercase", letterSpacing:"0.10em", padding:"6px 0 10px", borderBottom:`1px solid ${C.border}`, marginBottom:16 });
const sTabBtn  = (C, active, color=C.teal) => ({ padding:"8px 15px", borderRadius:RADIUS.full, fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", background:active?color:C.surface, color:active?C.white:C.sub, border:`1px solid ${active?color:C.border}`, fontFamily:FONT, transition:TR, boxShadow:SH_XS });

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
    moon:     <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
    sun:      <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    idcard:   <><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="3"/><path d="M14 10h4M14 14h4"/></>,
    code:     <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    database: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>,
    upload:   <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
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
const todayStr = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 60000).toISOString().split("T")[0]; };
const timeNow   = () => new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
const fmtDate   = (d) => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";
const fmtDateSh = (d) => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : "—";
const fmtDT     = () => new Date().toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"});
const daysLeft  = (e) => {
  const today = new Date(todayStr()); // midnight, date-only
  return Math.ceil((new Date(e) - today) / 86400000);
};
const addDays   = (b, n) => { const d = new Date(b); d.setDate(d.getDate()+n); return d.toISOString().split("T")[0]; };
// FIX 3: Collision-proof ID — timestamp suffix (base36) + 3 random chars
// Gives ~46656 combinations per millisecond; practically zero collision risk.
const genId = (existingIds = []) => {
  const existing = new Set(existingIds);
  let id;
  do {
    const ts   = Date.now().toString(36).slice(-4).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
    id = "LIB" + ts + rand;
  } while (existing.has(id));
  return id;
};
const clamp     = (v, lo, hi) => Math.min(Math.max(v,lo), hi);
const toSeatInt = (v) => v===""||v==null ? null : parseInt(v, 10);
// FIX 11: Canonical seatNo normalizer — always returns number|null, never string.
// Use this everywhere seatNo comes from DB, form, or state to keep type consistent.
const normalizeSeat = (v) => {
  if (v === "" || v == null) return null;
  const n = parseInt(v, 10);
  return isNaN(n) ? null : n;
};

const getMemberStatus = m => {
  if (m.manualInactive) return "inactive";
  const d = daysLeft(m.expiry);
  if (d < 0)  return "expired";
  if (d <= 5) return "expiring";
  return "active";
};

const STATUS_META = {
  active:   { label:"Active",        color:"#16A34A", bg:"#DCFCE7", icon:"check" },
  expiring: { label:"Expiring Soon", color:"#D97706", bg:"#FEF3C7", icon:"warn"  },
  expired:  { label:"Expired",       color:"#DC2626", bg:"#FEE2E2", icon:"x"     },
  inactive: { label:"Inactive",      color:"#94A3B8", bg:"#F5F7FA", icon:"lock"  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT DATA — All data comes from Supabase only
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  libraryName:"Tejas Library", totalSeats:35, defaultFee:500,
  address:"", timing:"",
};

const ROLE_PERMS = {
  superadmin: ["dashboard","seats","members","fees","admin","audit"],
  staff:      ["dashboard","seats","members","fees"],
  readonly:   ["dashboard","members"],
};

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const Badge = ({ text, color, bg, size=11, px=10, icon }) => (
  <span style={{ ...sBadge(color,bg,size,px), display:"inline-flex", alignItems:"center", gap:4 }}>
    {icon ? <Icon name={icon} size={size+1} color={color}/> : null}{text}
  </span>
);

const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.inactive;
  return <Badge text={m.label} color={m.color} bg={m.bg} icon={m.icon}/>;
};

// Dark-aware Card
const Card = ({ children, style={}, onClick }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  return <div onClick={onClick} style={sCard(C,style)}>{children}</div>;
};

// Dark-aware StatBox
const StatBox = ({ icon, label, value, sub, color="#0D9488" }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  return (
    <div style={sStatBox(C, color)}>
      <Icon name={icon} size={20} color={color} style={{ marginBottom:8 }}/>
      <div style={{ fontSize:21, fontWeight:900, color, fontFamily:"monospace", letterSpacing:"-0.5px" }}>{value}</div>
      <div style={{ fontSize:12, fontWeight:700, color:C.text, marginTop:3, lineHeight:1.3 }}>{label}</div>
      {sub ? <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{sub}</div> : null}
    </div>
  );
};

// Dark-aware Alert
const Alert = ({ children, color, bg, iconName, style={} }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  const bgFinal = dark ? color+"22" : bg;
  return (
    <div style={{ background:bgFinal, border:`1px solid ${color}25`, borderLeft:`3px solid ${color}`, borderRadius:RADIUS.md, padding:"11px 14px", display:"flex", gap:10, alignItems:"flex-start", boxShadow:SH_XS, ...style }}>
      {iconName ? <Icon name={iconName} size={15} color={color} style={{ marginTop:1, flexShrink:0 }}/> : null}
      <div style={{ flex:1, fontSize:13, color:C.sub, lineHeight:1.5 }}>{children}</div>
    </div>
  );
};

// Dark-aware Btn
const Btn = ({ children, onClick, variant="primary", size="md", disabled=false, full=false, iconName }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  const [hov, setHov]   = useState(false);
  const [press, setPress] = useState(false);
  const vs = {
    primary: { bg: hov?(press?"#0A6B65":"#0B7C73"):"#0D9488",  color:"#fff", border:"none" },
    danger:  { bg: hov?(press?"#991B1B":"#B91C1C"):"#DC2626",  color:"#fff", border:"none" },
    ghost:   { bg: hov?C.surfaceAlt:"transparent",              color:C.sub,  border:`1px solid ${C.border}` },
    green:   { bg: hov?"#166534":"#16A34A",                     color:"#fff", border:"none" },
    amber:   { bg: hov?"#B45309":"#D97706",                     color:"#fff", border:"none" },
    purple:  { bg: hov?"#7E22CE":"#9333EA",                     color:"#fff", border:"none" },
    blue:    { bg: hov?"#1D4ED8":"#2563EB",                     color:"#fff", border:"none" },
    indigo:  { bg: hov?"#4338CA":"#4F46E5",                     color:"#fff", border:"none" },
    orange:  { bg: hov?"#C2410C":"#EA580C",                     color:"#fff", border:"none" },
    devmode: { bg: hov?"#6D28D9":"#7C3AED",                     color:"#fff", border:"none" },
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

// Dark-aware Field
const Field = ({ label, value, onChange, type="text", placeholder, hint, required, options, disabled=false, readOnly=false, onKeyDown }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  const [foc, setFoc] = useState(false);
  const base = {
    width:"100%", padding:"10px 12px", borderRadius:RADIUS.md,
    border:`1.5px solid ${foc?C.teal:C.border}`, fontSize:14,
    color:disabled||readOnly?C.faint:C.text,
    background:disabled||readOnly?C.surfaceAlt:C.surface,
    outline:"none", boxSizing:"border-box", fontFamily:FONT,
    boxShadow:foc?FOCUS:"none", transition:TR,
    cursor:readOnly?"not-allowed":"text",
  };
  return (
    <div style={{ marginBottom:16 }}>
      {label ? <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.sub, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>
        {label}{required ? <span style={{ color:"#DC2626" }}> *</span> : null}
      </label> : null}
      {options
        ? <select value={value} onChange={e=>onChange(e.target.value)} disabled={disabled}
            onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} style={base}>
            {options.map(o => <option key={o.value??o} value={o.value??o} disabled={o.disabled}>{o.label??o}</option>)}
          </select>
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)}
            placeholder={placeholder} disabled={disabled} readOnly={readOnly}
            onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
            onKeyDown={onKeyDown}
            style={base}/>
      }
      {hint ? <p style={{ margin:"4px 0 0", fontSize:11, color:C.faint, lineHeight:1.4 }}>{hint}</p> : null}
    </div>
  );
};

const Divider = ({ label }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  return <div style={sDivider(C)}>{label}</div>;
};

// Dark-aware Modal
const Modal = ({ title, onClose, children, wide=false }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.62)", zIndex:1000, display:"flex", alignItems:"flex-end", justifyContent:"center", backdropFilter:"blur(2px)" }}
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
};

const DestructiveConfirm = ({ message, onConfirm, onCancel, confirmLabel="Confirm", variant="danger" }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.68)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:24, backdropFilter:"blur(3px)" }}>
      <div style={{ background:C.surface, borderRadius:RADIUS.xl, padding:28, maxWidth:320, width:"100%", boxShadow:SH_LG, textAlign:"center" }}>
        <div style={{ width:52, height:52, background:variant==="danger"?C.redLight:C.amberLight, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          <Icon name="warn" size={24} color={variant==="danger"?"#DC2626":"#D97706"}/>
        </div>
        <p style={{ fontSize:14, color:C.text, marginBottom:22, lineHeight:1.5 }}>{message}</p>
        <div style={{ display:"flex", gap:10 }}>
          <Btn onClick={onCancel} variant="ghost" full>Cancel</Btn>
          <Btn onClick={onConfirm} variant={variant==="green"?"green":"danger"} full>{confirmLabel}</Btn>
        </div>
      </div>
    </div>
  );
};

const UnsavedWarn = ({ onDiscard, onContinue }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.68)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
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
};

// ─────────────────────────────────────────────────────────────────────────────
// DARK MODE TOGGLE (header mein use hoga)
// ─────────────────────────────────────────────────────────────────────────────
const DarkToggle = () => {
  const { dark, toggle } = useDark();
  return (
    <button onClick={toggle}
      style={{ background:"none", border:"none", cursor:"pointer", padding:"6px 8px", borderRadius:RADIUS.md, display:"flex", alignItems:"center", gap:6, color: dark?"#F59E0B":"#475569", transition:TR }}>
      <Icon name={dark?"sun":"moon"} size={18} color={dark?"#F59E0B":"#475569"}/>
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// RECEIPT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const Receipt = ({ member, renewal, libName, onClose }) => (
  <Modal title="Payment Receipt" onClose={onClose}>
    <div style={{ textAlign:"center", marginBottom:18 }}>
      <div style={{ fontSize:18, fontWeight:900, color:"#0D9488" }}>{libName}</div>
      <div style={{ fontSize:12, color:"#94A3B8" }}>Official Payment Receipt</div>
    </div>
    <div style={{ marginBottom:16 }}>
      {[
        ["Member", member.name], ["ID", member.id], ["Phone", member.phone],
        ["Plan", renewal.planName], ["Amount", `₹${renewal.amount}`],
        ["From", fmtDate(renewal.from)], ["To", fmtDate(renewal.to)],
        ["Paid On", `${fmtDate(renewal.paidOn)} ${renewal.paidTime||""}`],
      ].map(([k,v]) => (
        <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #E2E8F0", fontSize:13 }}>
          <span style={{ color:"#475569", fontWeight:600 }}>{k}</span>
          <span style={{ color:"#0F172A", fontWeight:700 }}>{v}</span>
        </div>
      ))}
      {renewal.note && <div style={{ marginTop:8, fontSize:12, color:"#D97706" }}>Note: {renewal.note}</div>}
    </div>
    <Btn onClick={()=>window.print()} variant="ghost" iconName="print" full>Print Receipt</Btn>
  </Modal>
);

// ─────────────────────────────────────────────────────────────────────────────
// MEMBER ID CARD (PDF + Print)
// ─────────────────────────────────────────────────────────────────────────────
const MemberIdCard = ({ member, libName, libAddress, onClose }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  const status = getMemberStatus(member);
  const sm     = STATUS_META[status];

  const printCard = () => {
    const w = window.open("", "_blank", "width=400,height=280");
    // BUG FIX 13: window.open returns null when popups are blocked.
    if (!w) {
      alert("Popup blocked! Please allow popups for this site and try again.");
      return;
    }
    w.document.write(`
<!DOCTYPE html><html><head>
<meta charset="UTF-8"/>
<title>ID Card — ${member.name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; background:#f0f4f8; display:flex; align-items:center; justify-content:center; min-height:100vh; }
  .card {
    width:340px; background:#fff; border-radius:16px;
    overflow:hidden; box-shadow:0 8px 32px rgba(0,0,0,0.18);
    border:1px solid #e2e8f0;
  }
  .header {
    background:linear-gradient(135deg,#0D9488,#0EA5A0);
    padding:18px 20px 16px; color:#fff;
  }
  .lib-name { font-size:17px; font-weight:900; letter-spacing:-0.3px; }
  .lib-sub  { font-size:10px; opacity:0.82; margin-top:2px; }
  .body { padding:18px 20px; }
  .avatar {
    width:54px; height:54px; border-radius:50%;
    background:linear-gradient(135deg,#0D9488,#14B8A6);
    color:#fff; font-weight:900; font-size:22px;
    display:flex; align-items:center; justify-content:center;
    border:3px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,0.18);
    margin-bottom:12px;
  }
  .name   { font-size:18px; font-weight:900; color:#0f172a; letter-spacing:-0.3px; }
  .mid    { font-size:12px; color:#475569; margin-top:2px; font-family:monospace; font-weight:600; }
  .row    { display:flex; justify-content:space-between; margin-top:10px; font-size:11px; }
  .label  { color:#94a3b8; font-weight:600; }
  .val    { color:#0f172a; font-weight:700; }
  .badge  { display:inline-block; padding:3px 10px; border-radius:999px; font-size:10px; font-weight:700; background:${sm.bg}; color:${sm.color}; margin-top:8px; }
  .footer { border-top:1px solid #e2e8f0; padding:10px 20px; font-size:9px; color:#94a3b8; text-align:center; }
  @media print { body { background:#fff; } .card { box-shadow:none; } }
</style>
</head><body>
<div class="card">
  <div class="header">
    <div class="lib-name">${libName}</div>
    <div class="lib-sub">${libAddress} • Library Membership Card</div>
  </div>
  <div class="body">
    <div class="avatar">${member.name[0]}</div>
    <div class="name">${member.name}</div>
    <div class="mid">${member.id}</div>
    <div class="badge">${sm.label}</div>
    <div class="row"><span class="label">Phone</span><span class="val">${member.phone}</span></div>
    <div class="row"><span class="label">Seat No</span><span class="val">${member.seatNo != null ? "Seat " + member.seatNo : "—"}</span></div>
    <div class="row"><span class="label">Member Since</span><span class="val">${fmtDate(member.firstJoined)}</span></div>
    <div class="row"><span class="label">Valid Till</span><span class="val">${fmtDate(member.expiry)}</span></div>
  </div>
  <div class="footer">Tejas Library • Official Member Card • Not Transferable</div>
</div>
<script>window.onload=()=>{ window.print(); setTimeout(()=>window.close(),800); }<\/script>
</body></html>`);
    w.document.close();
  };

  return (
    <Modal title="Member ID Card" onClose={onClose}>
      {/* Preview */}
      <div style={{ background:"linear-gradient(135deg,#0D9488,#0EA5A0)", borderRadius:"14px 14px 0 0", padding:"18px 20px 16px" }}>
        <div style={{ fontSize:16, fontWeight:900, color:"#fff" }}>{libName}</div>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.8)", marginTop:2 }}>{libAddress} • Library Membership Card</div>
      </div>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderTop:"none", borderRadius:"0 0 14px 14px", padding:"18px 20px 20px", marginBottom:16 }}>
        <div style={sAvatar(54)}>{member.name[0]}</div>
        <div style={{ fontSize:18, fontWeight:900, color:C.text, marginTop:10 }}>{member.name}</div>
        <div style={{ fontSize:12, color:C.sub, fontFamily:"monospace", fontWeight:600, marginTop:2 }}>{member.id}</div>
        <span style={{ ...sBadge(sm.color, sm.bg), marginTop:8, display:"inline-block" }}>{sm.label}</span>
        {[["Phone", member.phone], ["Seat", member.seatNo!=null?`Seat ${member.seatNo}`:"—"], ["Member Since", fmtDate(member.firstJoined)], ["Valid Till", fmtDate(member.expiry)]].map(([k,v])=>(
          <div key={k} style={{ display:"flex", justifyContent:"space-between", marginTop:8, fontSize:12 }}>
            <span style={{ color:C.faint, fontWeight:600 }}>{k}</span>
            <span style={{ color:C.text, fontWeight:700 }}>{v}</span>
          </div>
        ))}
      </div>
      <Alert color="#0D9488" bg="#F0FDFA" iconName="info" style={{ marginBottom:14 }}>
        Print button se browser print dialog khulega. "Save as PDF" select karke PDF bana sakte ho.
      </Alert>
      <Btn onClick={printCard} iconName="print" full>Print / Save as PDF</Btn>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// RENEW MODAL
// ─────────────────────────────────────────────────────────────────────────────
const RenewModal = ({ member, plans, onRenew, onClose }) => {
  const [selPlanId, setSelPlanId] = useState(member.planId || plans[0]?.id);
  // Initialize amount from the pre-selected plan; update whenever the user picks a different plan.
  const [amount, setAmount] = useState(() => {
    const initial = plans.find(p => p.id === (member.planId || plans[0]?.id));
    return initial ? String(initial.price) : "";
  });
  const [note, setNote] = useState("");
  const [paid, setPaid] = useState(true);
  const { dark } = useDark();
  const C = makeC(dark);

  const selPlan = plans.find(p => p.id === selPlanId);
  useEffect(() => { if (selPlan) setAmount(String(selPlan.price)); }, [selPlanId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRenew = () => {
    if (!selPlan) return;
    // BUG FIX 2: Chain renewal from current expiry if member is still active/expiring,
    // not always from today — otherwise you lose remaining days.
    const baseDate = member.expiry && daysLeft(member.expiry) > 0 ? member.expiry : todayStr();
    const from = baseDate, to = addDays(from, selPlan.days);
    const renewal = { planId:selPlan.id, planName:selPlan.name, amount:Number(amount)||selPlan.price, from, to, paidOn:todayStr(), paidTime:timeNow(), note:note||null };
    onRenew(member.id, selPlan, renewal, paid, to);
    onClose();
  };

  return (
    <Modal title={`Renew — ${member.name}`} onClose={onClose}>
      <Divider label="Select Plan"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
        {plans.map(p => (
          <div key={p.id} onClick={()=>setSelPlanId(p.id)}
            style={{ border:`2px solid ${selPlanId===p.id?"#0D9488":C.border}`, borderRadius:RADIUS.md, padding:"10px 12px", cursor:"pointer", background:selPlanId===p.id?C.tealLight:C.surface, transition:TR }}>
            <div style={{ fontWeight:900, color:"#0D9488", fontSize:17, fontFamily:"monospace" }}>₹{p.price}</div>
            <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>{p.name}</div>
            <div style={{ fontSize:11, color:C.sub }}>{p.days} days</div>
          </div>
        ))}
      </div>
      <Field label="Amount (₹)" value={amount} onChange={setAmount} type="number" hint="Custom amount allowed"/>
      <Field label="Note (optional)" value={note} onChange={setNote} placeholder="e.g. ₹50 discount"/>
      <label style={{ display:"flex", alignItems:"center", gap:10, background:paid?C.greenLight:C.surfaceAlt, borderRadius:RADIUS.md, padding:"12px 14px", marginBottom:16, cursor:"pointer", border:`1px solid ${paid?"#16A34A":C.border}`, transition:TR }}>
        <input type="checkbox" checked={paid} onChange={e=>setPaid(e.target.checked)} style={{ width:17, height:17, accentColor:"#16A34A" }}/>
        <div>
          <div style={{ fontWeight:700, color:paid?"#16A34A":C.text, fontSize:14 }}>Fee collect kar li ✓</div>
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
const MemberTimeline = ({ member, plans, onRenew, onReceipt, onIdCard }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  const renewals  = member.renewals || [];
  const status    = getMemberStatus(member);
  const sm        = STATUS_META[status];
  const totalPaid = renewals.reduce((s,r) => s+r.amount, 0);
  const plan      = plans.find(p => p.id===member.planId);
  const remaining = daysLeft(member.expiry);
  // BUG FIX 19: Use the actual current renewal period (last renewal's from→to)
  // for the progress bar denominator, not just plan.days. This correctly shows
  // how far through the current billing period the member is.
  const lastRenewal = renewals[renewals.length - 1];
  const periodDays = lastRenewal
    ? Math.max(1, Math.ceil((new Date(lastRenewal.to) - new Date(lastRenewal.from)) / 86400000))
    : (plan?.days || 30);
  const remPct    = clamp(Math.round((Math.max(0,remaining)/periodDays)*100), 0, 100);

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
      <div style={{ background:C.tealLight, border:`1px solid #0D948822`, borderRadius:RADIUS.lg, padding:18, marginBottom:18 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
          <div style={sAvatar(54)}>{member.name?.[0]}</div>
          <div>
            <div style={{ fontSize:18, fontWeight:900, color:C.text }}>{member.name}</div>
            <div style={{ fontSize:13, color:C.sub }}>{member.phone} · {member.id}</div>
            <div style={{ marginTop:6, display:"flex", gap:6, flexWrap:"wrap" }}>
              <StatusBadge status={status}/>
            </div>
          </div>
        </div>
        <div style={{ background:C.surface, borderRadius:RADIUS.md, padding:12, boxShadow:SH_XS }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, fontWeight:700, marginBottom:4, color:C.text }}>
            <span>{plan?.name} Plan Progress</span>
            <span style={{ color:sm.color }}>{remaining<0?`${Math.abs(remaining)}d overdue`:`${remaining}d left`}</span>
          </div>
          <div style={{ background:C.surfaceAlt, height:6, borderRadius:RADIUS.full, overflow:"hidden" }}>
            <div style={{ width:`${remPct}%`, height:"100%", background:sm.color }}/>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
        <StatBox icon="fee"      label="Total Collected" value={`₹${totalPaid}`}  color="#16A34A"/>
        <StatBox icon="calendar" label="Sessions"        value={renewals.length}  color="#0D9488"/>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {(status==="expired"||status==="expiring") && <Btn onClick={onRenew} variant="purple" iconName="refresh" full>Renew Now</Btn>}
        <Btn onClick={onIdCard} variant="indigo" iconName="idcard" full>ID Card / PDF</Btn>
      </div>
      <Divider label={`Activity Ledger — ${renewals.length} entries`}/>
      <div style={{ position:"relative", paddingLeft:24 }}>
        <div style={{ position:"absolute", left:9, top:0, bottom:0, width:2, background:C.border }}/>
        {events.map((e, idx) => (
          <div key={idx} style={{ position:"relative", marginBottom:14 }}>
            <div style={{ position:"absolute", left:-21, top:6, width:12, height:12, borderRadius:"50%", background:e.type==="gap"?"#D97706":"#0D9488", border:`2px solid ${C.surface}` }}/>
            {e.type==="gap"
              ? <div style={{ background:C.amberLight, borderRadius:RADIUS.md, padding:"8px 12px", fontSize:12, color:"#D97706", fontWeight:600 }}>
                  {e.days}-day gap between {fmtDateSh(e.from)} – {fmtDateSh(e.to)}
                </div>
              : <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:RADIUS.md, padding:"11px 13px", boxShadow:SH_XS }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <div>
                      <span style={{ fontWeight:800, color:C.text, fontSize:13 }}>Session #{e.index} — {e.planName}</span>
                      {e.note && <div style={{ fontSize:11, color:"#D97706", marginTop:2 }}>{e.note}</div>}
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:15, fontWeight:900, color:"#16A34A", fontFamily:"monospace" }}>₹{e.amount}</div>
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
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FIX 8: Shared markPaid logic — single source of truth used by both
// MembersScreen and FeesScreen. Guards against double-payment on rapid clicks.
// ─────────────────────────────────────────────────────────────────────────────
const applyMarkPaid = (prev, id, plans) => prev.map(m => {
  if (m.id !== id) return m;
  if (m.paid) return m; // already paid — no duplicate renewal entry
  const plan = plans.find(p => p.id === m.planId);
  const r = {
    planId: plan?.id, planName: plan?.name || "?",
    amount: plan?.price || 0,
    from: todayStr(), to: addDays(todayStr(), plan?.days || 30),
    paidOn: todayStr(), paidTime: timeNow(), note: null,
  };
  return { ...m, paid: true, renewals: [...(m.renewals || []), r] };
});

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const DashboardScreen = ({ members, plans, settings, onNav }) => {
  const { dark } = useDark();
  const C = makeC(dark);
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
        <StatBox icon="users"  label="Total Members"  value={members.length}                color="#0D9488"/>
        <StatBox icon="check"  label="Active"         value={active}                        color="#16A34A"/>
        <StatBox icon="fee"    label="Total Revenue"  value={`₹${totalRev.toLocaleString()}`} color="#9333EA"/>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
        <StatBox icon="warn"   label="Expiring Soon"  value={expiring}  color="#D97706"/>
        <StatBox icon="x"      label="Expired"        value={expired}   color="#DC2626"/>
        <StatBox icon="bell"   label="Fee Pending"    value={unpaid}    color="#EA580C"/>
        <StatBox icon="seat"   label="Seats Occupied" value={`${occupiedSeats}/${settings.totalSeats}`} color="#4F46E5"/>
      </div>
      {alerts.length>0 && (
        <div>
          <Divider label={`Alerts — ${alerts.length}`}/>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
            {alerts.slice(0,5).map((a,i) => (
              <Alert key={i} color={a.type==="red"?"#DC2626":a.type==="warn"?"#0D9488":"#D97706"} bg={a.type==="red"?"#FEE2E2":a.type==="warn"?"#F0FDFA":"#FEF3C7"} iconName={a.type==="red"?"x":"warn"}>
                <span onClick={a.action} style={{ cursor:"pointer", textDecoration:"underline" }}>{a.msg}</span>
              </Alert>
            ))}
          </div>
        </div>
      )}
      <Divider label="Quick Actions"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <Btn onClick={()=>onNav("members")} variant="primary"  iconName="users"   full>Members</Btn>
        <Btn onClick={()=>onNav("fees")}    variant="green"    iconName="fee"     full>Fees</Btn>
        <Btn onClick={()=>onNav("seats")}   variant="indigo"   iconName="seat"    full>Seats</Btn>
        <Btn onClick={()=>onNav("admin")}   variant="ghost"    iconName="settings" full>Settings</Btn>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: SEATS
// ─────────────────────────────────────────────────────────────────────────────
const SeatsScreen = ({ members, settings }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  const total    = settings.totalSeats;
  const occupied = {};
  // BUG FIX 3: Only active/expiring members occupy a seat. Expired AND inactive
  // members should free their seat so it shows as available in the grid.
  members.forEach(m => {
    const st = getMemberStatus(m);
    if (m.seatNo != null && (st === "active" || st === "expiring"))
      occupied[toSeatInt(m.seatNo)] = m;
  });
  return (
    <div>
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:22, fontWeight:900, color:C.text, letterSpacing:"-0.4px" }}>Seats</div>
        <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>{Object.keys(occupied).length} occupied · {total-Object.keys(occupied).length} free</div>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
        <Badge text="🟢 Free"     color="#16A34A" bg="#DCFCE7"/>
        <Badge text="🔴 Occupied" color="#DC2626" bg="#FEE2E2"/>
        <Badge text="🟡 Expiring" color="#D97706" bg="#FEF3C7"/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(72px,1fr))", gap:8 }}>
        {Array.from({ length:total }, (_,i) => {
          const num=i+1, member=occupied[num], status=member?getMemberStatus(member):null;
          const bg    = !member?C.greenLight:status==="expiring"?C.amberLight:C.redLight;
          const color = !member?"#16A34A":status==="expiring"?"#D97706":"#DC2626";
          return (
            <div key={num} style={{ background:bg, border:`2px solid ${color}`, borderRadius:RADIUS.md, padding:"10px 6px", textAlign:"center", boxShadow:SH_XS }}>
              <div style={{ fontSize:16, fontWeight:900, color, fontFamily:"monospace" }}>{num}</div>
              {member
                ? <div style={{ fontSize:9, color, fontWeight:700, marginTop:2, lineHeight:1.2, wordBreak:"break-word" }}>{member.name.split(" ")[0]}</div>
                : <div style={{ fontSize:9, color:"#16A34A", marginTop:2 }}>Free</div>
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
const MembersScreen = ({ members, setMembers, plans, setPlans, settings, addAudit, currentUser }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [renewFor, setRenewFor] = useState(null);
  const [receipt, setReceipt]   = useState(null);
  const [idCardFor, setIdCardFor] = useState(null);
  const [deactivateGuard, setDeactivateGuard] = useState(null);
  const [deleteGuard, setDeleteGuard] = useState(null);
  const [warnClose, setWarnClose] = useState(false);

  const blank = useMemo(() => ({ name:"", phone:"", address:"", planId:plans[0]?.id||"", seatNo:"", paid:false }), [plans]);
  const [form, setForm]         = useState(blank);
  const [origForm, setOrigForm] = useState(blank);
  const formDirty = JSON.stringify(form) !== JSON.stringify(origForm);

  // BUG FIX 4: Only seats held by active/expiring members count as "occupied"
  // for conflict detection. Expired members' seats should be reassignable.
  const occupiedSeats = new Set(
    members
      .filter(m => { const st = getMemberStatus(m); return st === "active" || st === "expiring"; })
      .filter(m => m.seatNo != null)
      .map(m => toSeatInt(m.seatNo))
  );
  const seatOpts = [
    { value:"", label:"— No Seat —" },
    ...Array.from({ length:settings.totalSeats }, (_,i)=>i+1).map(n => ({
      value:String(n), label:`Seat ${n}${occupiedSeats.has(n)&&toSeatInt(form.seatNo)!==n?" (Occupied)":""}`, disabled:occupiedSeats.has(n)&&toSeatInt(form.seatNo)!==n,
    })),
  ];

  const selPlan = plans.find(p => p.id===form.planId);
  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.phone.includes(q) || m.id.toLowerCase().includes(q);
    const matchF = filter==="all" || getMemberStatus(m)===filter;
    return matchQ && matchF;
  });

  const openAdd  = () => {
    if (plans.length === 0) { alert("Pehle Admin Panel mein kam se kam ek Plan banao."); return; }
    setEditing(null); setForm(blank); setOrigForm(blank); setModal(true);
  };
  const openEdit = m => {
    setEditing(m.id);
    const f = { name:m.name, phone:m.phone, address:m.address||"", planId:m.planId, seatNo:m.seatNo!=null?String(m.seatNo):"", paid:m.paid };
    setForm(f); setOrigForm(f); setModal(true);
  };
  const tryClose = () => { if (formDirty) setWarnClose(true); else setModal(false); };

  const save = () => {
    if (!form.name.trim()) return;
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) {
      // Show inline feedback — for now just return; Field hint already says 10-digit
      alert("Valid 10-digit phone number required.");
      return;
    }
    const plan=plans.find(p=>p.id===form.planId), seatNum=normalizeSeat(form.seatNo);
    if (editing) {
      setMembers(prev => prev.map(m => {
        if (m.id === editing) return { ...m, name:form.name, phone:form.phone, address:form.address, planId:form.planId, seatNo:seatNum, paid:form.paid };
        // BUG FIX 5: Only evict another member from a seat if they're not the one
        // being edited (already handled above) AND they are currently active/expiring
        // (expired members' seats are already logically free).
        const theirSeat = toSeatInt(m.seatNo);
        if (seatNum != null && theirSeat === seatNum && m.id !== editing) return { ...m, seatNo:null };
        return m;
      }));
      addAudit(currentUser, `Member edited: ${form.name} (${editing})`);
    } else {
      const newM = {
        id:genId(members.map(m=>m.id)), name:form.name, phone:form.phone, address:form.address, planId:form.planId, seatNo:seatNum,
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
    const m = members.find(x => x.id === id);
    const updatedMembers = applyMarkPaid(members, id, plans);
    setMembers(updatedMembers);
    addAudit(currentUser, `Fee paid: ${m?.name}`);
  };

  const doDeactivate = id => {
    const m = members.find(x => x.id === id);
    // BUG FIX 14: Log must describe the NEW state (post-flip), not the current state.
    // m.manualInactive is the current value; after toggle it becomes !m.manualInactive.
    const willBeInactive = !m?.manualInactive;
    setMembers(prev=>prev.map(x=>x.id===id?{...x,manualInactive:!x.manualInactive}:x));
    addAudit(currentUser, `Member ${willBeInactive?"deactivated":"activated"}: ${m?.name}`);
    setDeactivateGuard(null);
  };

  const doDelete = id => {
    const m = members.find(x => x.id === id);
    setMembers(prev => prev.filter(x => x.id !== id));
    addAudit(currentUser, `Member DELETED: ${m?.name} (${id})`);
    setDeleteGuard(null);
    // Close any open modal that references this member
    if (viewing?.id === id)  setViewing(null);
    if (idCardFor?.id === id) setIdCardFor(null);
    if (renewFor?.id === id)  setRenewFor(null);
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
          <button key={v} onClick={()=>setFilter(v)} style={sTabBtn(C, filter===v)}>{l}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.length===0 && <div style={{ textAlign:"center", padding:32, color:C.sub, fontSize:14 }}>Koi member nahi mila.</div>}
        {filtered.map(m => {
          const status=getMemberStatus(m), plan=plans.find(p=>p.id===m.planId), tp=(m.renewals||[]).reduce((s,r)=>s+r.amount,0);
          return (
            <Card key={m.id} style={{ padding:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <div style={sAvatar(44)}>{m.name[0]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:800, color:C.text, fontSize:15, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.name}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:C.sub }}>
                    <Icon name="phone" size={11} color={C.faint}/>{m.phone} · <span style={{ fontFamily:"monospace", color:C.faint, fontSize:11 }}>{m.id}</span>
                  </div>
                  <div style={{ fontSize:11, color:C.faint, marginTop:2 }}>Since {fmtDate(m.firstJoined)} · {m.renewals?.length||0} sessions · ₹{tp.toLocaleString()} total</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:17, fontWeight:900, color:"#0D9488", fontFamily:"monospace" }}>₹{plan?.price??""}</div>
                  <div style={{ fontSize:10, color:C.faint, marginTop:1 }}>{plan?.name}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                {m.seatNo!=null ? <Badge text={`🪑 Seat ${m.seatNo}`} color="#0D9488" bg={C.tealMid}/> : null}
                <StatusBadge status={status}/>
                <Badge text={m.paid?"✓ Paid":"Fee Pending"} color={m.paid?"#16A34A":"#DC2626"} bg={m.paid?C.greenLight:C.redLight}/>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <Btn onClick={()=>setViewing(m)} variant="ghost" size="sm" iconName="timeline">Profile</Btn>
                <Btn onClick={()=>setIdCardFor(m)} variant="indigo" size="sm" iconName="idcard">ID Card</Btn>
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
          {!editing && <Alert color="#2563EB" bg="#EFF6FF" iconName="info" style={{ marginBottom:14 }}>
            <b>First Join Date — Auto Locked:</b> {fmtDate(todayStr())}
          </Alert>}
          <Divider label="Seat"/>
          <Field label="Seat Number" value={form.seatNo} onChange={v=>setForm({...form,seatNo:v})} options={seatOpts} hint={`1–${settings.totalSeats} · Occupied seats disabled`}/>
          <Divider label="Membership Plan"/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
            {plans.map(p => (
              <div key={p.id} onClick={()=>setForm({...form,planId:p.id})}
                style={{ border:`2px solid ${form.planId===p.id?"#0D9488":C.border}`, borderRadius:RADIUS.md, padding:"10px 12px", cursor:"pointer", background:form.planId===p.id?C.tealLight:C.surface, transition:TR }}>
                <div style={{ fontWeight:900, color:"#0D9488", fontSize:17, fontFamily:"monospace" }}>₹{p.price}</div>
                <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>{p.name}</div>
                <div style={{ fontSize:11, color:C.sub }}>{p.days} days</div>
              </div>
            ))}
          </div>
          {selPlan && <div style={{ background:C.tealLight, borderRadius:RADIUS.md, padding:"10px 14px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:13, color:"#0D9488", fontWeight:700 }}>{selPlan.name} · {selPlan.days} days</div>
            <div style={{ fontSize:20, fontWeight:900, color:"#0D9488", fontFamily:"monospace" }}>₹{selPlan.price}</div>
          </div>}
          <label style={{ display:"flex", alignItems:"center", gap:10, background:form.paid?C.greenLight:C.surfaceAlt, borderRadius:RADIUS.md, padding:"12px 14px", marginBottom:16, cursor:"pointer", border:`1px solid ${form.paid?"#16A34A":C.border}`, transition:TR }}>
            <input type="checkbox" checked={form.paid} onChange={e=>setForm({...form,paid:e.target.checked})} style={{ width:17, height:17, accentColor:"#16A34A" }}/>
            <div>
              <div style={{ fontWeight:700, color:form.paid?"#16A34A":C.text, fontSize:14 }}>Fee collect kar li ✓</div>
              <div style={{ fontSize:11, color:C.sub }}>Timeline mein record hoga</div>
            </div>
          </label>
          {formDirty && <Alert color="#D97706" bg="#FEF3C7" iconName="warn" style={{ marginBottom:12 }}>Unsaved changes hain — Save zaroor karo.</Alert>}
          <Btn onClick={save} iconName="check" full>Save Member</Btn>
        </Modal>
      )}

      {warnClose && <UnsavedWarn onDiscard={()=>{setWarnClose(false);setModal(false);}} onContinue={()=>setWarnClose(false)}/>}
      {deactivateGuard && <DestructiveConfirm message={`"${deactivateGuard.name}" ko ${deactivateGuard.manualInactive?"activate":"deactivate"} karna chahte ho?`} confirmLabel={deactivateGuard.manualInactive?"Activate":"Deactivate"} variant={deactivateGuard.manualInactive?"green":"amber"} onConfirm={()=>doDeactivate(deactivateGuard.id)} onCancel={()=>setDeactivateGuard(null)}/>}
      {deleteGuard && <DestructiveConfirm message={`"${deleteGuard.name}" permanently delete hoga. Undo nahi hoga.`} confirmLabel="Delete" variant="danger" onConfirm={()=>doDelete(deleteGuard.id)} onCancel={()=>setDeleteGuard(null)}/>}
      {viewing && (
        <Modal title="Member Profile" onClose={()=>setViewing(null)} wide>
          {/* BUG FIX 20: Always derive latest data from members array; viewing is just an ID carrier. */}
          {(() => {
            const freshMember = members.find(x => x.id === viewing.id) || viewing;
            return (
              <MemberTimeline
                member={freshMember}
                plans={plans}
                onRenew={()=>{ setRenewFor(freshMember); setViewing(null); }}
                onReceipt={renewal=>setReceipt({ member:freshMember, renewal })}
                onIdCard={()=>{ setIdCardFor(freshMember); setViewing(null); }}
              />
            );
          })()}
        </Modal>
      )}
      {idCardFor && <MemberIdCard member={idCardFor} libName={settings.libraryName} libAddress={settings.address} onClose={()=>setIdCardFor(null)}/>}
      {renewFor  && <RenewModal member={members.find(x=>x.id===renewFor.id)||renewFor} plans={plans} onRenew={handleRenew} onClose={()=>setRenewFor(null)}/>}
      {receipt   && <Receipt member={receipt.member} renewal={receipt.renewal} libName={settings.libraryName} onClose={()=>setReceipt(null)}/>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: FEES
// ─────────────────────────────────────────────────────────────────────────────
const FeesScreen = ({ members, setMembers, plans, settings, addAudit, currentUser }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  const [filter, setFilter]   = useState("all");
  const [receipt, setReceipt] = useState(null);
  const [renewFor, setRenewFor] = useState(null);

  const markPaid = id => {
    const m = members.find(x => x.id === id);
    const updatedMembers = applyMarkPaid(members, id, plans);
    setMembers(updatedMembers);
    addAudit(currentUser, `Fee marked paid: ${m?.name}`);
    const updatedM = updatedMembers.find(x => x.id === id);
    const lastRenewal = updatedM?.renewals?.slice(-1)[0];
    if (updatedM && lastRenewal) setReceipt({ member: updatedM, renewal: lastRenewal });
  };
  const markUnpaid = id => setMembers(prev=>prev.map(m=>m.id===id?{...m,paid:false}:m));
  const handleRenew = (id,plan,renewal,paid,newExpiry) => {
    // BUG FIX 8: Capture name before state update.
    const m = members.find(x => x.id === id);
    setMembers(prev=>prev.map(m=>m.id!==id?m:{...m,planId:plan.id,expiry:newExpiry,paid,manualInactive:false,renewals:[...(m.renewals||[]),renewal]}));
    addAudit(currentUser,`Renewed: ${m?.name} → ${plan.name}`);
  };

  const allPaid  = members.reduce((s,m)=>s+(m.renewals||[]).reduce((a,r)=>a+r.amount,0),0);
  const pending  = members.filter(m=>!m.paid).reduce((s,m)=>s+(plans.find(p=>p.id===m.planId)?.price||0),0);
  const filtered = filter==="paid"?members.filter(m=>m.paid):filter==="unpaid"?members.filter(m=>!m.paid):members;

  return (
    <div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:22, fontWeight:900, color:C.text, letterSpacing:"-0.4px" }}>Fees</div>
        <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>Offline collection · history · receipt</div>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:14 }}>
        <StatBox icon="check" label="All-time Collected" value={`₹${allPaid.toLocaleString()}`} sub={`${members.filter(m=>m.paid).length} paid`} color="#16A34A"/>
        <StatBox icon="bell"  label="Pending"            value={`₹${pending.toLocaleString()}`} sub={`${members.filter(m=>!m.paid).length} members`} color="#DC2626"/>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["all","All"],["paid","Paid"],["unpaid","Pending"]].map(([v,l]) => (
          <button key={v} onClick={()=>setFilter(v)} style={sTabBtn(C, filter===v)}>{l}</button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(m=>{
          const plan=plans.find(p=>p.id===m.planId),last=(m.renewals||[]).slice(-1)[0],status=getMemberStatus(m),tp=(m.renewals||[]).reduce((s,r)=>s+r.amount,0);
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
                  <div style={{ fontSize:17, fontWeight:900, color:"#0D9488", fontFamily:"monospace" }}>₹{plan?.price??""}</div>
                  <div style={{ fontSize:10, color:C.faint }}>{plan?.name}</div>
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
                  <Badge text={m.paid?"✓ Paid":"Pending"} color={m.paid?"#16A34A":"#DC2626"} bg={m.paid?C.greenLight:C.redLight}/>
                  <StatusBadge status={status}/>
                  {last && <span style={{ fontSize:11, color:C.faint }}>Last: {fmtDate(last.paidOn)}</span>}
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {!m.paid?<Btn onClick={()=>markPaid(m.id)} variant="green" size="sm" iconName="check">Mark Paid</Btn>:<Btn onClick={()=>markUnpaid(m.id)} variant="ghost" size="sm">Unmark</Btn>}
                  {(status==="expired"||status==="expiring")?<Btn onClick={()=>setRenewFor(m)} variant="purple" size="sm" iconName="refresh">Renew</Btn>:null}
                  {last&&<Btn onClick={()=>setReceipt({member:m,renewal:last})} variant="ghost" size="sm" iconName="print"/>}
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
// SCREEN: ADMIN PANEL (with Manual Data Entry tab)
// ─────────────────────────────────────────────────────────────────────────────
const AdminPanel = ({ settings, setSettings, plans, setPlans, members, setMembers, staff, setStaff, auditLog, addAudit, currentUser }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  const [tab, setTab] = useState("library");
  const [s, setS]     = useState({...settings});
  const [origS, setOrigS] = useState({...settings});
  const [saved, setSaved] = useState(false);

  // FIX 7: When Supabase finishes loading fresh settings (after login/user-switch),
  // the `settings` prop updates but local `s` stays stale because useState only
  // runs its initializer once. This effect keeps them in sync.
  useEffect(() => {
    setS({...settings});
    setOrigS({...settings});
  }, [settings]);
  const [planModal, setPlanModal]   = useState(false);
  const [editPlan, setEditPlan]     = useState(null);
  const [pForm, setPForm]           = useState({ name:"", days:"", price:"" });
  const [staffModal, setStaffModal] = useState(false);
  const [editStaff, setEditStaff]   = useState(null);
  const [sfForm, setSfForm]         = useState({ name:"", email:"", role:"staff", pin:"" });
  const [deleteStaffGuard, setDeleteStaffGuard] = useState(null);
  const [deletePlanGuard, setDeletePlanGuard]   = useState(null);

  // ── MANUAL DATA ENTRY STATE ──────────────────────────────────────────────
  // BUG FIX 15: Memoize blank form objects so they don't recreate on every render
  // and so the planId always reflects the current first plan.
  const blankManual  = useMemo(() => ({ name:"", phone:"", address:"", planId:plans[0]?.id||"", seatNo:"", firstJoined:"", expiry:"", paid:true, manualInactive:false }), [plans]);
  const blankRenewal = useMemo(() => ({ planId:plans[0]?.id||"", planName:"", amount:"", from:"", to:"", paidOn:"", paidTime:"09:00 AM", note:"" }), [plans]);
  const [manualForm, setManualForm]     = useState(blankManual);
  const [renewals, setRenewals]         = useState([]);
  const [addingRenewal, setAddingRenewal] = useState(false);
  const [renewalForm, setRenewalForm]   = useState(blankRenewal);
  const [manualSaved, setManualSaved]   = useState(false);
  const [manualError, setManualError]   = useState("");

  const settingsDirty = JSON.stringify(s)!==JSON.stringify(origS);

  const saveSettings = () => {
    setSettings(s); setOrigS({...s}); setSaved(true);
    setTimeout(()=>setSaved(false),2000);
    addAudit(currentUser,"Library settings updated");
  };

  const openAddPlan  = () => { setEditPlan(null); setPForm({name:"",days:"",price:""}); setPlanModal(true); };
  const openEditPlan = p  => { setEditPlan(p.id); setPForm({name:p.name,days:String(p.days),price:String(p.price)}); setPlanModal(true); };
  const savePlan = () => {
    if (!pForm.name.trim() || !pForm.days || !pForm.price) return;
    const data = { name:pForm.name.trim(), days:Number(pForm.days), price:Number(pForm.price) };
    if (editPlan) {
      setPlans(prev => prev.map(p => p.id===editPlan ? {...p,...data} : p));
      addAudit(currentUser, `Plan edited: ${data.name}`);
    } else {
      const newId = "p" + (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID().slice(0,8) : Date.now().toString(36));
      setPlans(prev => [...prev, { id:newId, ...data }]);
      addAudit(currentUser, `Plan created: ${data.name} ₹${data.price}`);
    }
    setPlanModal(false);
  };
  const doDeletePlan = id => {
    const p=plans.find(x=>x.id===id); setPlans(prev=>prev.filter(x=>x.id!==id));
    addAudit(currentUser,`Plan deleted: ${p?.name}`); setDeletePlanGuard(null);
  };

  const openAddStaff  = () => { setEditStaff(null); setSfForm({name:"",email:"",role:"staff",pin:""}); setStaffModal(true); };
  const openEditStaff = sf => { setEditStaff(sf.id); setSfForm({name:sf.name,email:sf.email,role:sf.role,pin:sf.pin}); setStaffModal(true); };
  const saveStaff = () => {
    if (!sfForm.name.trim() || !sfForm.email.trim() || !sfForm.pin) return;
    if (!/^\d{4}$/.test(sfForm.pin)) { alert("PIN exactly 4 digits hona chahiye."); return; }
    if (editStaff) {
      const existing = staff.find(x => x.id === editStaff);
      if (existing?.role === "superadmin" && sfForm.role !== "superadmin") {
        alert("Superadmin ka role change nahi ho sakta.");
        return;
      }
      setStaff(prev => prev.map(sf => sf.id===editStaff ? {...sf, ...sfForm, name:sfForm.name.trim(), email:sfForm.email.trim()} : sf));
      addAudit(currentUser, `Staff edited: ${sfForm.name.trim()}`);
    } else {
      const newId = "S" + (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID().slice(0,8) : Date.now().toString(36));
      const ns = { id:newId, ...sfForm, name:sfForm.name.trim(), email:sfForm.email.trim(), active:true, createdAt:todayStr() };
      setStaff(prev => [...prev, ns]);
      addAudit(currentUser, `Staff added: ${ns.name} (${ns.role})`);
    }
    setStaffModal(false);
  };
  const toggleStaffActive = id => {
    const sf = staff.find(x => x.id === id);
    if (sf?.role === "superadmin") {
      alert("Superadmin account ko deactivate nahi kar sakte.");
      return;
    }
    const willBeActive = !sf?.active;
    setStaff(prev=>prev.map(x=>x.id===id?{...x,active:!x.active}:x));
    addAudit(currentUser, `Staff ${willBeActive?"activated":"deactivated"}: ${sf?.name}`);
  };
  const doDeleteStaff = id => {
    const sf = staff.find(x => x.id === id);
    if (id === currentUser.id) {
      setDeleteStaffGuard(null);
      alert("Aap apna khud ka account delete nahi kar sakte.");
      return;
    }
    if (sf?.role === "superadmin") {
      setDeleteStaffGuard(null);
      alert("Superadmin account delete nahi ho sakta.");
      return;
    }
    setStaff(prev => prev.filter(x => x.id !== id));
    addAudit(currentUser, `Staff deleted: ${sf?.name}`);
    setDeleteStaffGuard(null);
  };

  const exportData = () => {
    // BUG FIX: Renamed destructure alias from `s` to `rest` to avoid shadowing
    // the outer `s` (local settings copy) state variable.
    const data = { exportedAt:fmtDT(), settings, plans, members, staff:staff.map(({pin:_,...rest})=>rest), auditLog };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `tejas-library-backup-${todayStr()}.json`;
    a.click();
    // Fix: revoke the object URL to avoid a memory leak
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    addAudit(currentUser, "Data exported");
  };

  // ── Manual Entry: Add Renewal Row ──────────────────────────────────────
  const addRenewalRow = () => {
    if (!renewalForm.from||!renewalForm.to||!renewalForm.amount) return;
    const plan=plans.find(p=>p.id===renewalForm.planId);
    setRenewals(prev=>[...prev,{
      planId:renewalForm.planId, planName:plan?.name||renewalForm.planName,
      amount:Number(renewalForm.amount), from:renewalForm.from, to:renewalForm.to,
      paidOn:renewalForm.paidOn||renewalForm.from, paidTime:renewalForm.paidTime||"09:00 AM",
      note:renewalForm.note||null,
    }]);
    setRenewalForm(blankRenewal);
    setAddingRenewal(false);
  };

  // ── Manual Entry: Save Member ──────────────────────────────────────────
  const saveManualMember = () => {
    setManualError("");
    if (!manualForm.name.trim() || !manualForm.phone.trim()) { setManualError("Name aur Phone required hain."); return; }
    if (!/^\d{10}$/.test(manualForm.phone.trim())) { setManualError("Valid 10-digit phone number required hai."); return; }
    if (!manualForm.firstJoined) { setManualError("First Join Date required hai."); return; }
    if (!manualForm.expiry)      { setManualError("Expiry Date required hai."); return; }
    if (manualForm.firstJoined > manualForm.expiry) { setManualError("First Join Date, Expiry Date se pehle honi chahiye."); return; }
    const seatNum=normalizeSeat(manualForm.seatNo);
    const newM={
      id:genId(members.map(m=>m.id)), name:manualForm.name.trim(), phone:manualForm.phone.trim(),
      address:manualForm.address||"", planId:manualForm.planId, seatNo:seatNum,
      firstJoined:manualForm.firstJoined, expiry:manualForm.expiry,
      paid:manualForm.paid, manualInactive:manualForm.manualInactive,
      renewals,
    };
    setMembers(prev=>[...prev,newM]);
    addAudit(currentUser,`Manual entry: ${newM.name} (${newM.id}) — ${renewals.length} renewal(s) added`);
    setManualForm(blankManual); setRenewals([]); setManualSaved(true);
    setTimeout(()=>setManualSaved(false),3000);
  };

  const tabs = [["library","Library"],["plans","Plans"],["staff","Staff"],["manual","Manual Entry"],["backup","Backup"]];

  return (
    <div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:22, fontWeight:900, color:C.text, letterSpacing:"-0.4px" }}>Admin Panel</div>
        <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>Settings · plans · staff · manual entry</div>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:18, overflowX:"auto", paddingBottom:2 }}>
        {tabs.map(([v,l])=><button key={v} onClick={()=>setTab(v)} style={sTabBtn(C, tab===v)}>{l}</button>)}
      </div>

      {/* ── LIBRARY SETTINGS ─────────────────────────────────────────────── */}
      {tab==="library" && (
        <Card style={{ padding:20 }}>
          <Divider label="Library Settings"/>
          <Field label="Library Name"  value={s.libraryName}  onChange={v=>setS({...s,libraryName:v})}/>
          <Field label="Total Seats"   value={s.totalSeats}   onChange={v=>setS({...s,totalSeats:Number(v)})} type="number"/>
          <Field label="Default Fee"   value={s.defaultFee}   onChange={v=>setS({...s,defaultFee:Number(v)})} type="number"/>
          <Field label="Address"       value={s.address}      onChange={v=>setS({...s,address:v})}/>
          <Field label="Timing"        value={s.timing}       onChange={v=>setS({...s,timing:v})}/>
          {settingsDirty && <Alert color="#D97706" bg="#FEF3C7" iconName="warn" style={{ marginBottom:12 }}>Unsaved changes hain.</Alert>}
          {saved && <Alert color="#16A34A" bg="#DCFCE7" iconName="check" style={{ marginBottom:12 }}>Saved!</Alert>}
          <Btn onClick={saveSettings} iconName="check" full>Save Settings</Btn>
        </Card>
      )}

      {/* ── PLANS ─────────────────────────────────────────────────────────── */}
      {tab==="plans" && (
        <div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
            <Btn onClick={openAddPlan} iconName="plus" size="sm">Add Plan</Btn>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {plans.map(p=>(
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

      {/* ── STAFF ─────────────────────────────────────────────────────────── */}
      {tab==="staff" && (
        <div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
            <Btn onClick={openAddStaff} iconName="plus" size="sm">Add Staff</Btn>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {staff.map(sf=>(
              <Card key={sf.id} style={{ padding:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                  <div style={sAvatar(40)}>{sf.name[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, color:C.text, fontSize:14 }}>{sf.name}</div>
                    <div style={{ fontSize:12, color:C.sub }}>{sf.email}</div>
                    <div style={{ marginTop:2 }}>
                      <Badge text={sf.role} color={sf.role==="superadmin"?"#9333EA":"#0D9488"} bg={sf.role==="superadmin"?C.purpleLight:C.tealMid}/>
                      {" "}<Badge text={sf.active?"Active":"Inactive"} color={sf.active?"#16A34A":C.faint} bg={sf.active?C.greenLight:C.surfaceAlt}/>
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <Btn onClick={()=>openEditStaff(sf)} variant="ghost" size="sm" iconName="edit">Edit</Btn>
                  {sf.role !== "superadmin" && <Btn onClick={()=>toggleStaffActive(sf.id)} variant="ghost" size="sm">{sf.active?"Deactivate":"Activate"}</Btn>}
                  {sf.role !== "superadmin" && <Btn onClick={()=>setDeleteStaffGuard(sf)} variant="danger" size="sm" iconName="trash"/>}
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

      {/* ── MANUAL DATA ENTRY ──────────────────────────────────────────────── */}
      {tab==="manual" && (
        <div>
          <Alert color="#4F46E5" bg="#EEF2FF" iconName="info" style={{ marginBottom:16 }}>
            <b>Purane Members ka Manual Entry:</b> Jo members pehle se library use kar rahe hain unka data aur poori renewal history yahan add karo. Ye Members list mein directly add ho jaayega.
          </Alert>
          <Card style={{ padding:20 }}>
            <Divider label="Member Basic Info"/>
            <Field label="Full Name"  value={manualForm.name}    onChange={v=>setManualForm({...manualForm,name:v})}    placeholder="e.g. Ramesh Tiwari" required/>
            <Field label="Phone"      value={manualForm.phone}   onChange={v=>setManualForm({...manualForm,phone:v})}   placeholder="10-digit mobile" type="tel" required/>
            <Field label="Address"    value={manualForm.address} onChange={v=>setManualForm({...manualForm,address:v})} placeholder="e.g. Jaunpur, UP"/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Field label="First Join Date" value={manualForm.firstJoined} onChange={v=>setManualForm({...manualForm,firstJoined:v})} type="date" required hint="Jab pehli baar aaye the"/>
              <Field label="Expiry Date"     value={manualForm.expiry}      onChange={v=>setManualForm({...manualForm,expiry:v})}      type="date" required hint="Current membership expiry"/>
            </div>
            <Divider label="Seat & Plan"/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Field label="Seat No (optional)" value={manualForm.seatNo} onChange={v=>setManualForm({...manualForm,seatNo:v})} type="number" placeholder="e.g. 5"/>
              <Field label="Plan" value={manualForm.planId} onChange={v=>setManualForm({...manualForm,planId:v})}
                options={plans.map(p=>({value:p.id,label:`${p.name} — ₹${p.price}`}))}/>
            </div>
            <div style={{ display:"flex", gap:12, marginBottom:16, flexWrap:"wrap" }}>
              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, color:C.text, fontWeight:600 }}>
                <input type="checkbox" checked={manualForm.paid} onChange={e=>setManualForm({...manualForm,paid:e.target.checked})} style={{ accentColor:"#16A34A" }}/>
                Fee Paid hai abhi
              </label>
              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, color:C.text, fontWeight:600 }}>
                <input type="checkbox" checked={manualForm.manualInactive} onChange={e=>setManualForm({...manualForm,manualInactive:e.target.checked})} style={{ accentColor:"#DC2626" }}/>
                Inactive mark karo
              </label>
            </div>

            {/* Renewals List */}
            <Divider label={`Renewal History — ${renewals.length} entries`}/>
            {renewals.length===0 && <div style={{ fontSize:13, color:C.faint, marginBottom:12, fontStyle:"italic" }}>Koi renewal nahi add ki abhi tak.</div>}
            {renewals.map((r,i)=>(
              <div key={i} style={{ background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:RADIUS.md, padding:"10px 14px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>{r.planName} — ₹{r.amount}</div>
                  <div style={{ fontSize:11, color:C.sub }}>{fmtDate(r.from)} → {fmtDate(r.to)}</div>
                  {r.note && <div style={{ fontSize:11, color:"#D97706" }}>{r.note}</div>}
                </div>
                <Btn onClick={()=>setRenewals(prev=>prev.filter((_,j)=>j!==i))} variant="danger" size="sm" iconName="trash"/>
              </div>
            ))}

            {/* Add Renewal Form */}
            {addingRenewal ? (
              <div style={{ background:C.tealLight, border:`1px solid #0D948833`, borderRadius:RADIUS.lg, padding:16, marginBottom:12 }}>
                <div style={{ fontWeight:700, color:"#0D9488", marginBottom:12, fontSize:13 }}>New Renewal Entry</div>
                <Field label="Plan" value={renewalForm.planId} onChange={v=>{ const p=plans.find(x=>x.id===v); setRenewalForm({...renewalForm,planId:v,planName:p?.name||"",amount:String(p?.price||"")}); }}
                  options={plans.map(p=>({value:p.id,label:`${p.name} — ₹${p.price}`}))}/>
                <Field label="Amount (₹)" value={renewalForm.amount} onChange={v=>setRenewalForm({...renewalForm,amount:v})} type="number" hint="Custom amount ho sakta hai"/>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <Field label="From Date" value={renewalForm.from} onChange={v=>setRenewalForm({...renewalForm,from:v})} type="date" required/>
                  <Field label="To Date"   value={renewalForm.to}   onChange={v=>setRenewalForm({...renewalForm,to:v})}   type="date" required/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <Field label="Paid On Date" value={renewalForm.paidOn} onChange={v=>setRenewalForm({...renewalForm,paidOn:v})} type="date"/>
                  <Field label="Paid Time"    value={renewalForm.paidTime} onChange={v=>setRenewalForm({...renewalForm,paidTime:v})} placeholder="09:00 AM"/>
                </div>
                <Field label="Note (optional)" value={renewalForm.note} onChange={v=>setRenewalForm({...renewalForm,note:v})} placeholder="e.g. ₹50 discount diya"/>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn onClick={addRenewalRow} variant="green" iconName="plus">Add Renewal</Btn>
                  <Btn onClick={()=>{ setAddingRenewal(false); setRenewalForm(blankRenewal); }} variant="ghost">Cancel</Btn>
                </div>
              </div>
            ) : (
              <Btn onClick={()=>setAddingRenewal(true)} variant="ghost" iconName="plus" size="sm" full>+ Renewal History Add Karo</Btn>
            )}

            {manualError && <Alert color="#DC2626" bg="#FEE2E2" iconName="warn" style={{ marginTop:14, marginBottom:0 }}>{manualError}</Alert>}
            {manualSaved && <Alert color="#16A34A" bg="#DCFCE7" iconName="check" style={{ marginTop:14, marginBottom:0 }}>Member successfully add ho gaya Members list mein!</Alert>}
            <div style={{ marginTop:16 }}>
              <Btn onClick={saveManualMember} iconName="users" variant="primary" full>Save Member to List</Btn>
            </div>
          </Card>
        </div>
      )}

      {/* ── BACKUP ─────────────────────────────────────────────────────────── */}
      {tab==="backup" && (
        <Card style={{ padding:20 }}>
          <Divider label="Data Backup"/>
          <Alert color="#2563EB" bg="#EFF6FF" iconName="info" style={{ marginBottom:16 }}>
            Sab data JSON format mein export hoga. Ise safe rakhein.
          </Alert>
          <StatBox icon="users"  label="Members" value={members.length} color="#0D9488"/>
          <div style={{ marginTop:10 }}/>
          <StatBox icon="backup" label="Plans"   value={plans.length}   color="#9333EA"/>
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
const AuditScreen = ({ auditLog }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  return (
    <div>
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:22, fontWeight:900, color:C.text, letterSpacing:"-0.4px" }}>Audit Log</div>
        <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>{auditLog.length} events recorded</div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {auditLog.length===0 && <div style={{ textAlign:"center", padding:32, color:C.faint, fontSize:14 }}>Abhi koi activity nahi.</div>}
        {[...auditLog].reverse().map((log,i)=>(
          <Card key={`${log.at}-${log.by}-${i}`} style={{ padding:12 }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
              <Icon name="audit" size={14} color="#0D9488" style={{ marginTop:2, flexShrink:0 }}/>
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
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const LoginScreen = ({ staff, onLogin }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  const [email, setEmail] = useState("");
  const [pin, setPin]     = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = staff.find(s =>
      s.email === email.trim() &&
      String(s.pin) === String(pin).trim() &&
      (s.active === true || s.active === "true" || s.active === 1)
    );
    if (user) { setError(""); onLogin(user); }
    else       setError("Email ya PIN galat hai, ya account inactive hai.");
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:FONT }}>
      <div style={{ width:"100%", maxWidth:360 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:64, height:64, background:"linear-gradient(135deg,#0D9488,#0EA5A0)", borderRadius:RADIUS.lg, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:SH_MD }}>
            <Icon name="shield" size={30} color="#fff"/>
          </div>
          <div style={{ fontSize:24, fontWeight:900, color:C.text, letterSpacing:"-0.5px" }}>
            Tejas Library
          </div>
          <div style={{ fontSize:13, color:C.sub, marginTop:4 }}>Staff Login</div>
        </div>
        <Card style={{ padding:24 }}>
          <Field label="Email"  value={email} onChange={setEmail} type="email" placeholder="staff@tejaslib.com" required/>
          <Field label="PIN"    value={pin}   onChange={setPin}   type="password" placeholder="4-digit PIN" required onKeyDown={e=>{ if(e.key==="Enter") handleLogin(); }}/>
          {error && <Alert color="#DC2626" bg="#FEE2E2" iconName="warn" style={{ marginBottom:12 }}>{error}</Alert>}
          <Btn onClick={handleLogin} iconName="shield" full variant="primary">
            Login
          </Btn>
        </Card>
        <div style={{ textAlign:"center", marginTop:14, fontSize:11, color:C.faint }}>
          Staff email aur PIN darj karo
        </div>
        {/* Dark mode toggle on login screen */}
        <div style={{ textAlign:"center", marginTop:16 }}>
          <DarkToggle/>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM NAV
// ─────────────────────────────────────────────────────────────────────────────
const BottomNav = ({ screen, onNav, perms }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  const items = [
    { id:"dashboard", icon:"home",     label:"Home"    },
    { id:"seats",     icon:"seat",     label:"Seats"   },
    { id:"members",   icon:"users",    label:"Members" },
    { id:"fees",      icon:"fee",      label:"Fees"    },
    { id:"admin",     icon:"settings", label:"Admin"   },
    { id:"audit",     icon:"audit",    label:"Audit"   },
  ].filter(i => perms.includes(i.id));

  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", zIndex:100, boxShadow:"0 -4px 12px rgba(0,0,0,0.09)" }}>
      {items.map(it=>(
        <button key={it.id} onClick={()=>onNav(it.id)}
          style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"8px 4px 10px", background:"none", border:"none", cursor:"pointer", gap:3 }}>
          <Icon name={it.icon} size={20} color={screen===it.id?"#0D9488":C.faint}/>
          <span style={{ fontSize:9, fontWeight:700, color:screen===it.id?"#0D9488":C.faint, fontFamily:FONT }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE SYNC HOOK
// FIX 9: Accepts a single config object instead of 10 positional params.
// Adding new state in future = add one key, not change every call site.
// ─────────────────────────────────────────────────────────────────────────────
function useSupabaseSync({ members, setMembers, plans, setPlans, settings, setSettings, staff, setStaff, auditLog, setAuditLog, setLoading, currentUser }) {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced]   = useState(false);
  const [syncError, setSyncError] = useState(null);

  // ─── TIMER REFS declared BEFORE load useEffect so they are accessible inside it ───
  const membersTimer  = useRef(null);
  const settingsTimer = useRef(null);
  const plansTimer    = useRef(null);
  const staffTimer    = useRef(null);
  const auditTimer    = useRef(null); // FIX 10

  // Helper: atomically kill every pending auto-save timer
  const killAllTimers = useCallback(() => {
    clearTimeout(membersTimer.current);
    clearTimeout(settingsTimer.current);
    clearTimeout(plansTimer.current);
    clearTimeout(staffTimer.current);
    clearTimeout(auditTimer.current);
    membersTimer.current  = null;
    settingsTimer.current = null;
    plansTimer.current    = null;
    staffTimer.current    = null;
    auditTimer.current    = null;
  }, []);

  // ─── LOAD FROM SUPABASE — re-runs on every currentUser change ───────────────
  useEffect(() => {
    if (!supabase || !currentUser) {
      // Kill all pending auto-save timers immediately on logout
      // so no debounced write fires after the user has left.
      killAllTimers();
      if (!supabase) return; // error screen handles this case
      setLoading(false);
      return;
    }

    // ── STEP 1: Kill all stale auto-save timers from previous session FIRST ──
    // This is the atomic guard that prevents the race condition where stale
    // debounced timers fire during the 1-2s fetch window and overwrite live data.
    killAllTimers();

    // ── STEP 2: Mark synced=false so auto-save effects are fully blocked ──────
    // Auto-save guards check `synced`, so resetting it here creates a hard lock
    // that holds until fresh data has been loaded for the new user session.
    setSynced(false);
    setSyncError(null);

    let cancelled = false; // prevent stale async state updates if effect re-runs

    const load = async () => {
      setSyncing(true);
      setLoading(true); // show spinner while fetching after login
      try {
        const [mRes, pRes, sRes, stRes, aRes] = await Promise.all([
          supabase.from("members").select("*"),
          supabase.from("plans").select("*"),
          supabase.from("settings").select("*").eq("id", 1).single(),
          supabase.from("staff").select("*"),
          // FIX 10: load audit_log — sorted newest-last, cap at 500 rows
          supabase.from("audit_log").select("*").order("at", { ascending: true }).limit(500),
        ]);

        if (cancelled) return; // effect was cleaned up before fetch completed

        // Members — Supabase always returns lowercase column names
        if (mRes.error) console.error("Members load error:", mRes.error.message);
        else if (mRes.data && mRes.data.length > 0) {
          setMembers(mRes.data.map(m => ({
            id: m.id,
            name: m.name || "",
            phone: m.phone || "",
            address: m.address || "",
            planId: m.planid || "",
            seatNo: normalizeSeat(m.seatno),
            firstJoined: m.firstjoined || m.expiry || todayStr(),
            expiry: m.expiry || todayStr(),
            paid: !!m.paid,
            manualInactive: !!m.manualinactive,
            renewals: Array.isArray(m.renewals) ? m.renewals : []
          })));
        } else {
          setMembers([]);
        }

        // Plans — if DB is empty, keep empty (never fall back to DEFAULT_PLANS
        // which would auto-save hardcoded data back to DB and poison it)
        if (pRes.error) console.error("Plans load error:", pRes.error.message);
        else if (pRes.data && pRes.data.length > 0) setPlans(pRes.data);
        else setPlans([]);

        // Settings — .single() errors if row doesn't exist yet
        if (!sRes.error && sRes.data) {
          setSettings({
            libraryName: sRes.data.libraryname || DEFAULT_SETTINGS.libraryName,
            totalSeats:  Number(sRes.data.totalseats)  || DEFAULT_SETTINGS.totalSeats,
            defaultFee:  Number(sRes.data.defaultfee)  || DEFAULT_SETTINGS.defaultFee,
            address:     sRes.data.address  || DEFAULT_SETTINGS.address,
            timing:      sRes.data.timing   || DEFAULT_SETTINGS.timing,
          });
        }
        // else keep DEFAULT_SETTINGS already in state

        // Staff — DB is the only source of truth. Never fall back to DEFAULT_STAFF.
        // If staff table is empty, login will correctly fail (no valid accounts).
        if (stRes.error) console.error("Staff load error:", stRes.error.message);
        else if (stRes.data && stRes.data.length > 0) {
          setStaff(stRes.data.map(s => ({ ...s, active: s.active === true || s.active === "true" || s.active === 1 })));
        } else {
          setStaff([]);
        }

        // Audit log
        if (aRes.error) console.error("Audit load error:", aRes.error.message);
        if (aRes.data && aRes.data.length > 0) {
          setAuditLog(aRes.data.map(r => ({ by: r.by || "?", action: r.action || "", at: r.at || "" })));
        }

        // ── STEP 3: Only unlock auto-save AFTER all fresh data is committed ──
        if (!cancelled) setSynced(true);
      } catch(e) {
        if (!cancelled) setSyncError("Supabase load failed: " + e.message);
      } finally {
        // Always release the loading screen — even if this effect was cancelled
        // (user switched again mid-fetch). A subsequent effect will handle the new load.
        setLoading(false);
        if (!cancelled) setSyncing(false);
      }
    };

    load();

    // Cleanup: if currentUser changes again before fetch completes, cancel the
    // in-flight load and kill any timers that may have snuck through.
    return () => {
      cancelled = true;
      killAllTimers();
    };
  }, [currentUser, killAllTimers]);

  // ─── SAVE FUNCTIONS ──────────────────────────────────────────────────────────

  const saveMembers = useCallback(async (data) => {
    if (!supabase) return;
    // Safety guard: never wipe all members. If local state is empty due to a
    // logout race or transient reset, skip to protect real DB data.
    if (data.length === 0) {
      console.warn("saveMembers called with empty array — skipping to prevent data wipe.");
      return;
    }
    const rows = data.map(m => ({
      id: m.id,
      name: m.name,
      phone: m.phone,
      address: m.address || "",
      planid: m.planId,
      seatno: normalizeSeat(m.seatNo),
      firstjoined: m.firstJoined,
      expiry: m.expiry,
      paid: !!m.paid,
      manualinactive: !!m.manualInactive,
      renewals: m.renewals || [],
      updated_at: new Date().toISOString()
    }));
    const { error } = await supabase.from("members").upsert(rows, { onConflict: "id" });
    if (error) console.error("Members upsert error:", error.message);
    // Delete rows that no longer exist in local state
    const { data: dbRows, error: fetchErr } = await supabase.from("members").select("id");
    if (!fetchErr && dbRows) {
      const localIds = new Set(data.map(m => m.id));
      const toDelete = dbRows.map(r => r.id).filter(id => !localIds.has(id));
      if (toDelete.length > 0) {
        const { error: delErr } = await supabase.from("members").delete().in("id", toDelete);
        if (delErr) console.error("Members delete error:", delErr.message);
      }
    }
  }, []);

  const saveSettings = useCallback(async (data) => {
    if (!supabase) return;
    const { error } = await supabase.from("settings").upsert({
      id: 1,
      libraryname: data.libraryName,
      totalseats: data.totalSeats,
      defaultfee: data.defaultFee,
      address: data.address,
      timing: data.timing
    }, { onConflict: "id" });
    if (error) console.error("Settings save error:", error.message);
  }, []);

  const savePlans = useCallback(async (data) => {
    if (!supabase) return;
    // Safety guard: never wipe all plans. If local state is empty (e.g. due to
    // a race), skip entirely to avoid deleting real data from DB.
    if (data.length === 0) return;
    const { error } = await supabase.from("plans").upsert(data, { onConflict: "id" });
    if (error) { console.error("Plans upsert error:", error.message); return; }
    // Delete plans from DB that are no longer in local state
    const { data: dbPlans, error: fetchErr } = await supabase.from("plans").select("id");
    if (!fetchErr && dbPlans) {
      const localIds = new Set(data.map(p => p.id));
      const toDelete = dbPlans.map(p => p.id).filter(id => !localIds.has(id));
      if (toDelete.length > 0) {
        const { error: delErr } = await supabase.from("plans").delete().in("id", toDelete);
        if (delErr) console.error("Plans delete error:", delErr.message);
      }
    }
  }, []);

  const saveStaff = useCallback(async (data) => {
    if (!supabase) return;
    if (data.length > 0) {
      const { error } = await supabase.from("staff").upsert(data, { onConflict: "id" });
      if (error) console.error("Staff save error:", error.message);
    }
    // Delete staff rows from DB that no longer exist in local state.
    // Without this, deleting a staff member in UI would NOT remove them from DB,
    // so they'd reappear on next login and could still log in.
    const { data: dbStaff, error: fetchErr } = await supabase.from("staff").select("id");
    if (!fetchErr && dbStaff) {
      const localIds = new Set(data.map(s => s.id));
      const toDelete = dbStaff.map(s => s.id).filter(id => !localIds.has(id));
      if (toDelete.length > 0) {
        const { error: delErr } = await supabase.from("staff").delete().in("id", toDelete);
        if (delErr) console.error("Staff delete error:", delErr.message);
      }
    }
  }, []);

  // BUGFIX: Audit log — use insert with ignoreDuplicates instead of upsert with
  // a constraint that may not exist in the DB schema. Also save immediately,
  // not debounced, so logout doesn't cancel the timer before it fires.
  const saveAuditLog = useCallback(async (data) => {
    if (!supabase || !data.length) return;
    // Fetch all existing entries to deduplicate
    const { data: existing } = await supabase.from("audit_log").select("at,by,action");
    const existingKeys = new Set((existing || []).map(r => `${r.at}||${r.by}||${r.action}`));
    const newRows = data
      .map(r => ({ by: r.by, action: r.action, at: r.at }))
      .filter(r => !existingKeys.has(`${r.at}||${r.by}||${r.action}`));
    if (!newRows.length) return;
    const { error } = await supabase.from("audit_log").insert(newRows);
    if (error) console.error("Audit log save error:", error.message);
  }, []);

  // ─── AUTO-SAVE EFFECTS ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!supabase || !synced || !currentUser) return;
    clearTimeout(membersTimer.current);
    membersTimer.current = setTimeout(() => saveMembers(members), 800);
    return () => clearTimeout(membersTimer.current);
  }, [members, synced, currentUser, saveMembers]);

  useEffect(() => {
    if (!supabase || !synced || !currentUser) return;
    clearTimeout(settingsTimer.current);
    settingsTimer.current = setTimeout(() => saveSettings(settings), 800);
    return () => clearTimeout(settingsTimer.current);
  }, [settings, synced, currentUser, saveSettings]);

  useEffect(() => {
    if (!supabase || !synced || !currentUser) return;
    // BUGFIX: Save plans immediately (no debounce) so a delete+logout doesn't lose data
    savePlans(plans);
  }, [plans, synced, currentUser, savePlans]);

  useEffect(() => {
    if (!supabase || !synced || !currentUser) return;
    clearTimeout(staffTimer.current);
    staffTimer.current = setTimeout(() => saveStaff(staff), 800);
    return () => clearTimeout(staffTimer.current);
  }, [staff, synced, currentUser, saveStaff]);

  // BUGFIX: Audit saves immediately — debounce meant logout cancelled the timer
  // before the save fired, so the last action was always lost.
  useEffect(() => {
    if (!supabase || !synced || !currentUser || !auditLog.length) return;
    saveAuditLog(auditLog);
  }, [auditLog, synced, currentUser, saveAuditLog]);

  return { syncing, synced, syncError };
}







// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // Dark mode persisted in localStorage
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("lib_dark")==="1"; } catch { return false; }
  });
  const toggleDark = () => setDark(d => {
    try { localStorage.setItem("lib_dark", d?"0":"1"); } catch {}
    // Bust the makeC cache for the toggled theme so fresh colors are computed
    _C_CACHE[d ? "light" : "dark"] = null;
    return !d;
  });
  const C = makeC(dark);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("lib_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // Persist currentUser to localStorage whenever it changes
  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem("lib_user", JSON.stringify(currentUser));
      else localStorage.removeItem("lib_user");
    } catch {}
  }, [currentUser]);

  const [screen, setScreen]           = useState("dashboard");
  const [members, setMembers]         = useState([]);
  const [plans, setPlans]             = useState([]);
  const [settings, setSettings]       = useState(() => DEFAULT_SETTINGS);
  const [staff, setStaff]             = useState([]);
  const [auditLog, setAuditLog]       = useState([]);
  const [loading, setLoading]         = useState(() => {
    try { return !!localStorage.getItem("lib_user"); } catch { return false; }
  });

  // Staff preload — login se pehle fetch karo (currentUser nahi hoga tab)
  useEffect(() => {
    if (!supabase || currentUser) return;
    supabase.from("staff").select("*").then(({ data, error }) => {
      if (error) console.error("Staff pre-load:", error.message);
      else if (data && data.length > 0)
        setStaff(data.map(s => ({ ...s, active: s.active === true || s.active === "true" || s.active === 1 })));
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  // Supabase sync
  const { syncing, synced, syncError } = useSupabaseSync({
    members, setMembers, plans, setPlans,
    settings, setSettings, staff, setStaff,
    auditLog, setAuditLog,
    setLoading, currentUser,
  });

  const addAudit = useCallback((user, action) => {
    setAuditLog(prev => [...prev, { by: user?.name || "System", action, at: fmtDT() }]);
  }, []);

  const contextValue = { dark, toggle: toggleDark };

  // Supabase not configured — show error, app cannot run without it
  if (!supabase) return (
    <DarkCtx.Provider value={contextValue}>
      <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, padding:24 }}>
        <div style={{ textAlign:"center", maxWidth:340 }}>
          <div style={{ width:64, height:64, background:"#FEE2E2", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
            <Icon name="warn" size={28} color="#DC2626"/>
          </div>
          <div style={{ fontSize:18, fontWeight:900, color:C.text, marginBottom:8 }}>Supabase Not Configured</div>
          <div style={{ fontSize:13, color:C.sub, lineHeight:1.6 }}>
            <code>VITE_SUPABASE_URL</code> aur <code>VITE_SUPABASE_ANON_KEY</code> environment variables set nahi hain.<br/><br/>
            <code>.env</code> file mein dono values add karo aur app restart karo.
          </div>
        </div>
      </div>
    </DarkCtx.Provider>
  );

  // Loading screen
  if (loading) return (
    <DarkCtx.Provider value={contextValue}>
      <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:28, marginBottom:8 }}>⟳</div>
          <div style={{ fontSize:14, color:"#0D9488", fontWeight:700 }}>Loading...</div>
        </div>
      </div>
    </DarkCtx.Provider>
  );

  // Not logged in
  if (!currentUser) {
    return (
      <DarkCtx.Provider value={contextValue}>
        <LoginScreen staff={staff} onLogin={user=>{ setCurrentUser(user); }}/>
      </DarkCtx.Provider>
    );
  }

  const perms      = ROLE_PERMS[currentUser.role] || ROLE_PERMS.readonly;
  const safeScreen = perms.includes(screen) ? screen : "dashboard";
  const commonProps = { members, setMembers, plans, settings, addAudit, currentUser };

  return (
    <DarkCtx.Provider value={contextValue}>
      <div style={{ minHeight:"100vh", background:C.bg, fontFamily:FONT, paddingBottom:72, transition:"background 0.2s" }}>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50, boxShadow:SH_SM }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, background:"linear-gradient(135deg,#0D9488,#0EA5A0)", borderRadius:RADIUS.md, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="shield" size={16} color="#fff"/>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:900, color:C.text, letterSpacing:"-0.2px" }}>
                {settings.libraryName}
              </div>
              <div style={{ fontSize:10, color:C.faint }}>Logged in as <b>{currentUser.name}</b></div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            {/* Sync indicator */}
            {supabase && (
              <span style={{ fontSize:10, color:syncing?"#D97706":synced?"#16A34A":"#94A3B8", fontWeight:600 }}>
                {syncing?"⟳ Syncing":synced?"● Synced":"○"}
              </span>
            )}
            {/* Dark mode toggle */}
            <DarkToggle/>
            {/* Logout */}
            <button onClick={()=>{
              // BUG FIX: Logout sequence — order matters critically.
              // 1. setCurrentUser(null) FIRST — useSupabaseSync's load effect
              //    fires, kills all timers, and sets synced=false atomically.
              //    This blocks ALL auto-save effects before any state is cleared.
              setCurrentUser(null);
              setScreen("dashboard");
              setLoading(false);
              // 2. Only clear local UI state AFTER currentUser is null.
              //    Auto-save effects guard on `currentUser`, so these setters
              //    will NOT trigger a DB write — the guard is already down.
              //    DO NOT reset members/plans here — it was causing the logout
              //    race that wiped DB data when synced was still true.
              //    Instead, data is cleared on next login's fresh load from Supabase.
              setAuditLog([]);
            }}
              style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:RADIUS.md, padding:"6px 10px", display:"flex", alignItems:"center", gap:5, cursor:"pointer", fontSize:12, color:C.sub, fontFamily:FONT, fontWeight:600 }}>
              <Icon name="logout" size={13} color={C.sub}/>Logout
            </button>
          </div>
        </div>

        {/* Sync error banner */}
        {syncError && (
          <div style={{ background:"#FEE2E2", borderBottom:"1px solid #FCA5A5", padding:"8px 16px", fontSize:12, color:"#DC2626", fontWeight:600 }}>
            ⚠ {syncError}
          </div>
        )}

        {/* ── SCREEN CONTENT ─────────────────────────────────────────────── */}
        <div style={{ padding:"16px 14px" }}>
          {safeScreen==="dashboard" && <DashboardScreen members={members} plans={plans} settings={settings} onNav={setScreen}/>}
          {safeScreen==="seats"     && <SeatsScreen     members={members} settings={settings}/>}
          {safeScreen==="members"   && <MembersScreen   {...commonProps} setPlans={setPlans}/>}
          {safeScreen==="fees"      && <FeesScreen      {...commonProps}/>}
          {safeScreen==="admin"     && perms.includes("admin")    && <AdminPanel settings={settings} setSettings={setSettings} plans={plans} setPlans={setPlans} members={members} setMembers={setMembers} staff={staff} setStaff={setStaff} auditLog={auditLog} addAudit={addAudit} currentUser={currentUser}/>}
          {safeScreen==="audit"     && perms.includes("audit")    && <AuditScreen auditLog={auditLog}/>}
        </div>

        {/* ── BOTTOM NAV ─────────────────────────────────────────────────── */}
        <BottomNav screen={safeScreen} onNav={setScreen} perms={perms}/>
      </div>
    </DarkCtx.Provider>
  );
}
