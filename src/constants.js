// constants.js
import { createContext } from "react";

// ─── DARK MODE CONTEXT ───────────────────────────────────────────────────────
export const DarkCtx = createContext({ dark: false, toggle: () => {} });

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const _C_CACHE = { light: null, dark: null };

export const makeC = (dark) => {
  const key = dark ? "dark" : "light";
  if (_C_CACHE[key]) return _C_CACHE[key];
  _C_CACHE[key] = {
    bg:           dark ? "#0F172A" : "#F0F4F8",
    surface:      dark ? "#1E293B" : "#FFFFFF",
    surfaceAlt:   dark ? "#334155" : "#F5F7FA",
    teal:         "#0D9488",
    tealLight:    dark ? "#0D9488" + "22" : "#F0FDFA",
    tealMid:      dark ? "#0D9488" + "33" : "#CCFBF1",
    amberLight:   dark ? "#D97706" + "22" : "#FEF3C7",
    redLight:     dark ? "#DC2626" + "22" : "#FEE2E2",
    greenLight:   dark ? "#16A34A" + "22" : "#DCFCE7",
    purpleLight:  dark ? "#9333EA" + "22" : "#F3E8FF",
    text:         dark ? "#F1F5F9" : "#0F172A",
    sub:          dark ? "#94A3B8" : "#475569",
    faint:        dark ? "#64748B" : "#94A3B8",
    white:        "#FFFFFF",
    border:       dark ? "#334155" : "#E2E8F0",
  };
  return _C_CACHE[key];
};

export const FONT   = "'Inter','Segoe UI',system-ui,sans-serif";
export const RADIUS = { sm:8, md:12, lg:16, xl:20, full:9999 };
export const SH     = "0 2px 8px rgba(0,0,0,0.11),0 1px 3px rgba(0,0,0,0.07)";
export const TR     = "all 0.18s cubic-bezier(0.4,0,0.2,1)";

// ─── CONFIG & DEFAULT DATA ───────────────────────────────────────────────────
export const DEFAULT_SETTINGS = {
  libraryName:"Tejas Library", totalSeats:35, defaultFee:500,
  address:"", timing:"",
};

export const ROLE_PERMS = {
  superadmin: ["dashboard","seats","members","fees","admin","audit"],
  staff:      ["dashboard","seats","members","fees"],
  readonly:   ["dashboard","members"],
};

export const STATUS_META = {
  active:   { label:"Active",       color:"#16A34A", bg:"#DCFCE7", icon:"check" },
  expiring: { label:"Expiring Soon", color:"#D97706", bg:"#FEF3C7", icon:"warn"  },
  expired:  { label:"Expired",       color:"#DC2626", bg:"#FEE2E2", icon:"x"     },
  inactive: { label:"Inactive",      color:"#94A3B8", bg:"#F5F7FA", icon:"lock"  },
};

// ─── UTILITIES ───────────────────────────────────────────────────────────────
export const todayStr = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 60000).toISOString().split("T")[0]; };
export const timeNow   = () => new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
export const fmtDate   = (d) => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";
export const fmtDateSh = (d) => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : "—";
export const fmtDT     = () => new Date().toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"});
export const addDays   = (b, n) => { const d = new Date(b); d.setDate(d.getDate()+n); return d.toISOString().split("T")[0]; };

export const genId = (existingIds = []) => {
  const existing = new Set(existingIds);
  let id;
  do {
    const ts   = Date.now().toString(36).slice(-4).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
    id = "LIB" + ts + rand;
  } while (existing.has(id));
  return id;
};

export const clamp = (v, lo, hi) => Math.min(Math.max(v,lo), hi);
export const toSeatInt = (v) => v===""||v==null ? null : parseInt(v, 10);

export const normalizeSeat = (v) => {
  if (v === "" || v == null) return null;
  const n = parseInt(v, 10);
  return isNaN(n) ? null : n;
};

export const getMemberStatus = m => {
  if (m.manualInactive) return "inactive";
  const today = new Date(todayStr());
  const expiry = new Date(m.expiry);
  const diffDays = Math.ceil((expiry - today) / 86400000);
  if (diffDays < 0) return "expired";
  if (diffDays <= 5) return "expiring";
  return "active";
};
