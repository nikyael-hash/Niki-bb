import { B } from '../design/tokens.js';

export default function ModuleHeader({ emoji, title, subtitle, onBack }) {
  return (
    <div style={{
      background: B.white, padding: "13px 18px",
      borderBottom: `1px solid ${B.pinkLight}`,
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 2px 10px rgba(221,164,174,0.08)",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <button
        onClick={onBack}
        style={{
          background: B.coolGray, border: `1px solid ${B.glacier}`,
          borderRadius: 8, padding: "6px 13px",
          fontSize: 10, color: B.mid, fontWeight: 700,
        }}
      >
        ← OS
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: B.text }}>{emoji} {title}</div>
        {subtitle && <div style={{ fontSize: 8, color: B.mid }}>{subtitle}</div>}
      </div>
    </div>
  );
}
