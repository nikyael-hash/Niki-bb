import { useState } from "react";
import { B, PERFILES } from "../design/tokens.js";
import { MSGS_INIT } from "../data/mockData.js";
import { useAppDoc } from "../hooks/useAppDoc.js";
import ModuleHeader from "../components/ModuleHeader.jsx";
import Bubble from "../components/Bubble.jsx";

const CAT_CONFIG = {
  urgente:     { color: B.red,        bg: B.redPale,     label: "Urgente"      },
  operaciones: { color: B.teal,       bg: B.tealPale,    label: "Operaciones"  },
  capacitacion:{ color: B.purple,     bg: B.purplePale,  label: "Capacitación" },
  marketing:   { color: B.pink,       bg: B.pinkLight,   label: "Marketing"    },
  rrhh:        { color: "#CAA150",    bg: B.goldPale,    label: "RRHH"         },
};

export default function Comunicaciones({ user, onBack }) {
  const [msgs, setMsgs] = useAppDoc("comunicaciones", MSGS_INIT);
  const [draft, setDraft] = useState("");
  const [cat, setCat] = useState("operaciones");
  const [editMode, setEditMode] = useState(false);
  const isCM = user.perfil === "casa_matriz";

  const reaccionar = (id, tipo) =>
    setMsgs(p => p.map(m => m.id !== id ? m : { ...m, reacciones: { ...m.reacciones, [tipo]: (m.reacciones[tipo] || 0) + 1 } }));

  const deleteMsg = (id) => setMsgs(p => p.filter(m => m.id !== id));
  const togglePin = (id) => setMsgs(p => p.map(m => m.id !== id ? m : { ...m, fijado: !m.fijado }));

  const publicar = () => {
    if (!draft.trim()) return;
    setMsgs(p => [{
      id: `m_${Date.now()}`, perfil: user.perfil, emoji: user.emoji,
      nombre: user.nombre, cat, texto: draft.trim(),
      fecha: "Ahora", fijado: false, reacciones: { like: 0, love: 0, star: 0 },
    }, ...p]);
    setDraft("");
  };

  const fijados = msgs.filter(m => m.fijado);
  const normales = msgs.filter(m => !m.fijado);

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader emoji="💬" title="Comunicaciones" subtitle="Canal interno Niki BB" onBack={onBack}
        isCM={isCM} editMode={editMode} onToggleEdit={() => setEditMode(!editMode)} />

      <div style={{ padding: "12px 14px 140px" }}>
        {fijados.length > 0 && (
          <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 8 }}>📌 FIJADOS</div>
        )}
        {[...fijados, ...normales].map((m, i) => {
          const catConf = CAT_CONFIG[m.cat] || CAT_CONFIG.operaciones;
          return (
            <div key={m.id} style={{
              background: m.fijado ? B.goldPale : B.white, borderRadius: 12, marginBottom: 8,
              padding: "13px 14px", border: `1px solid ${m.fijado ? "#CAA15050" : B.pinkLight}`,
              animation: `fadeUp .25s ease ${i * .03}s both`,
            }}>
              <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 8 }}>
                <Bubble emoji={m.emoji} color={PERFILES[m.perfil]?.color || B.pink} size={34} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: B.text }}>{m.nombre}</span>
                    <span style={{ padding: "1px 7px", borderRadius: 20, background: catConf.bg, border: `1px solid ${catConf.color}40`, fontSize: 7, color: catConf.color, fontWeight: 700 }}>
                      {catConf.label}
                    </span>
                    {m.fijado && <span style={{ fontSize: 7, color: "#CAA150", fontWeight: 700 }}>📌</span>}
                  </div>
                  <div style={{ fontSize: 9, color: B.mid }}>{m.fecha}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: B.text, lineHeight: 1.6, marginBottom: 8 }}>{m.texto}</div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {!editMode && [["like", "👍", m.reacciones.like], ["love", "💖", m.reacciones.love], ["star", "⭐", m.reacciones.star]].map(([tipo, ic, cnt]) => (
                  <button key={tipo} onClick={() => reaccionar(m.id, tipo)} style={{
                    display: "flex", alignItems: "center", gap: 3,
                    padding: "3px 9px", background: B.coolGray, border: `1px solid ${B.glacier}`,
                    borderRadius: 20, fontSize: 9, color: B.mid,
                  }}>
                    {ic} {cnt || ""}
                  </button>
                ))}
                {editMode && isCM && (
                  <>
                    <button onClick={() => togglePin(m.id)} style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700,
                      background: m.fijado ? B.goldPale : B.coolGray,
                      color: m.fijado ? "#CAA150" : B.mid,
                      border: `1px solid ${m.fijado ? "#CAA150" : B.glacier}`,
                    }}>
                      {m.fijado ? "📌 Desfij." : "📌 Fijar"}
                    </button>
                    <button onClick={() => deleteMsg(m.id)} style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700,
                      background: B.redPale, color: B.red, border: `1px solid ${B.red}30`,
                    }}>
                      🗑️ Borrar
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input fijo */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        padding: "10px 14px 22px", background: B.white,
        borderTop: `1px solid ${B.pinkLight}`,
        boxShadow: "0 -2px 12px rgba(221,164,174,0.08)",
      }}>
        <div style={{ display: "flex", gap: 5, marginBottom: 8, overflowX: "auto", scrollbarWidth: "none" }}>
          {Object.entries(CAT_CONFIG).map(([k, v]) => (
            <button key={k} onClick={() => setCat(k)} style={{
              padding: "3px 10px", borderRadius: 20, fontSize: 7, fontWeight: 700,
              whiteSpace: "nowrap", flexShrink: 0,
              background: cat === k ? v.color : B.white,
              color: cat === k ? B.white : B.mid,
              border: `1px solid ${cat === k ? v.color : B.glacier}`,
              transition: "all .2s",
            }}>
              {v.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Bubble emoji={user.emoji} color={PERFILES[user.perfil]?.color || B.pink} size={34} />
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && publicar()}
            placeholder="Escribí tu mensaje..."
            style={{
              flex: 1, padding: "9px 12px", border: `1.5px solid ${B.pinkLight}`,
              borderRadius: 9, fontSize: 12, color: B.text, background: B.pinkBg,
            }}
          />
          <button onClick={publicar} style={{
            padding: "9px 14px", background: `linear-gradient(135deg, ${B.pink}, ${B.pinkDeep})`,
            borderRadius: 9, color: B.white, fontSize: 13, fontWeight: 700,
          }}>↑</button>
        </div>
      </div>
    </div>
  );
}
