import { B, PERFILES, MODULES_LIST, PERMISOS } from "../design/tokens.js";
import Destello from "../components/Destello.jsx";

export default function ModulosGrid({ user, onOpenModule, onBack }) {
  const perfil = PERFILES[user.perfil];
  const permisos = PERMISOS[user.perfil];

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <div style={{
        background: B.white, padding: "13px 18px",
        borderBottom: `1px solid ${B.pinkLight}`,
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 10px rgba(221,164,174,0.08)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <button onClick={onBack} style={{ background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "6px 13px", fontSize: 10, color: B.mid, fontWeight: 700 }}>
          ← Inicio
        </button>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: B.text }}>
            <Destello size={10} color="#CAA150" style={{ marginRight: 4, verticalAlign: "middle" }} />
            Módulos
          </div>
          <div style={{ fontSize: 8, color: B.mid }}>{PERMISOS[user.perfil].length} módulos disponibles · {perfil.label}</div>
        </div>
      </div>

      <div style={{ padding: "14px 14px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {MODULES_LIST.map((m, i) => {
            const hasAccess = permisos.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => hasAccess && onOpenModule(m.id)}
                className={hasAccess ? "card" : ""}
                style={{
                  background: B.white, borderRadius: 13, padding: "16px 14px",
                  border: `1px solid ${hasAccess ? B.pinkLight : B.coolGray}`,
                  position: "relative", overflow: "hidden",
                  boxShadow: hasAccess ? "0 2px 8px rgba(221,164,174,0.06)" : "none",
                  opacity: hasAccess ? 1 : 0.45,
                  animation: `fadeUp 0.2s ease ${i * 0.03}s both`,
                  textAlign: "left", display: "block", width: "100%",
                  cursor: hasAccess ? "pointer" : "not-allowed",
                }}
              >
                {hasAccess && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${m.color}50, ${m.color})` }} />
                )}
                <div style={{ fontSize: 24, marginBottom: 8 }}>{m.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: hasAccess ? B.text : B.mid, marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 9, color: B.mid }}>{m.desc}</div>
                {!hasAccess && (
                  <div style={{ position: "absolute", top: 8, right: 8, fontSize: 12 }}>🔒</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
