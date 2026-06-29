// components.js
import { useState } from "react";
import { makeC, RADIUS, SH, SH_XS, SH_SM, SH_MD, SH_LG, FOCUS, TR, FONT, STATUS_META } from "./constants";
import { useDark } from "./constants"; // Tumhe constants.js mein useDark bhi export karna hoga

// ICON SYSTEM (Full paths)
export const Icon = ({ name, size=18, color="currentColor", style={} }) => {
  const paths = {
    home: <><path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/></>,
    seat: <><rect x="5" y="3" width="14" height="13" rx="2"/><path d="M3 21h18M5 16v5M19 16v5"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    fee: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></>,
    // ... baaki icons yahan add kar lena (tumhare original code se)
    check: <polyline points="20 6 9 17 4 12"/>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    // ... (Keep the full list from original code)
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ display:"block", flexShrink:0, ...style }}>
      {paths[name] || <circle cx="12" cy="12" r="10"/>}
    </svg>
  );
};

// UI COMPONENTS
export const Badge = ({ text, color, bg, size=11, px=10, icon }) => (
  <span style={{ background:bg, color, fontSize:size, fontWeight:700, padding:`3px ${px}px`, borderRadius:RADIUS.full, whiteSpace:"nowrap", display:"inline-flex", alignItems:"center", gap:4, letterSpacing:"0.01em" }}>
    {icon ? <Icon name={icon} size={size+1} color={color}/> : null}{text}
  </span>
);

export const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.inactive;
  return <Badge text={m.label} color={m.color} bg={m.bg} icon={m.icon}/>;
};

export const Card = ({ children, style={}, onClick }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  return <div onClick={onClick} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:RADIUS.lg, boxShadow:SH, ...style }}>{children}</div>;
};

export const Btn = ({ children, onClick, variant="primary", size="md", disabled=false, full=false, iconName }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  const [hov, setHov] = useState(false);
  // ... (Full button logic here as per your original code)
  return <button onClick={onClick} disabled={disabled} style={{...}}>{children}</button>;
};

export const Field = ({ label, value, onChange, type="text", placeholder, hint, required, options, disabled=false, readOnly=false }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  // ... (Full field logic here)
  return <div style={{marginBottom:16}}>...</div>;
};

export const Modal = ({ title, onClose, children, wide=false }) => {
  const { dark } = useDark();
  const C = makeC(dark);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.62)", zIndex:1000, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:C.surface, borderRadius:`${RADIUS.xl}px ${RADIUS.xl}px 0 0`, width:"100%", maxWidth:wide?680:520, maxHeight:"92vh", overflowY:"auto" }}>
        {children}
      </div>
    </div>
  );
};
