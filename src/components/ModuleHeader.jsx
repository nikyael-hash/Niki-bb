import { B } from '../design/tokens.js';

export default function ModuleHeader({ emoji, title, subtitle, onBack, editMode, onToggleEdit, isCM }) {
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
      {isCM && onToggleEdit && (
        <button
          onClick={onToggleEdit}
          style={{
            padding: "6px 12px", borderRadius: 8, fontSize: 10, fontWeight: 700,
            background: editMode ? B.pinkDeep : B.coolGray,
            color: editMode ? B.white : B.mid,
            border: `1px solid ${editMode ? B.pinkDeep : B.glacier}`,
            transition: "all 0.2s",
          }}
        >
          {editMode ? "✓ Listo" : "✏️ Editar"}
        </button>
      )}
    </div>
  );
}
