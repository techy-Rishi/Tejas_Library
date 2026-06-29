// ─── UTILITIES ────────────────────────────────────────────────────────────────

export const todayStr = () => {
  const d = new Date();
  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().split("T")[0];
};

export const timeNow = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const fmtDateSh = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—";

export const fmtDT = () =>
  new Date().toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

// Days remaining until expiry (negative = overdue)
export const daysLeft = (e) => {
  const today = new Date(todayStr());
  return Math.ceil((new Date(e) - today) / 86400000);
};

export const addDays = (b, n) => {
  const d = new Date(b);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

// Collision-proof member ID
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

export const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

export const toSeatInt = (v) => (v === "" || v == null ? null : parseInt(v, 10));

// Always returns number|null — never a string
export const normalizeSeat = (v) => {
  if (v === "" || v == null) return null;
  const n = parseInt(v, 10);
  return isNaN(n) ? null : n;
};

// ─── MEMBER STATUS ─────────────────────────────────────────────────────────────
export const getMemberStatus = (m) => {
  if (m.manualInactive) return "inactive";
  const d = daysLeft(m.expiry);
  if (d < 0)  return "expired";
  if (d <= 5) return "expiring";
  return "active";
};

export const STATUS_META = {
  active:   { label: "Active",        color: "#16A34A", bg: "#DCFCE7", icon: "check" },
  expiring: { label: "Expiring Soon", color: "#D97706", bg: "#FEF3C7", icon: "warn"  },
  expired:  { label: "Expired",       color: "#DC2626", bg: "#FEE2E2", icon: "x"     },
  inactive: { label: "Inactive",      color: "#94A3B8", bg: "#F5F7FA", icon: "lock"  },
};

// ─── REVENUE ───────────────────────────────────────────────────────────────────
// Single source of truth: revenue = sum of renewals[].amount
export const memberRevenue = (m) =>
  (m.renewals || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);

export const totalRevenue = (members) =>
  members.reduce((s, m) => s + memberRevenue(m), 0);

// ─── DEFAULTS ─────────────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS = {
  libraryName: "Tejas Library",
  totalSeats: 35,
  defaultFee: 500,
  address: "",
  timing: "",
};

export const ROLE_PERMS = {
  superadmin: ["dashboard", "seats", "members", "fees", "admin", "audit"],
  staff:      ["dashboard", "seats", "members", "fees"],
  readonly:   ["dashboard", "members"],
};
