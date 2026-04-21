import { useState } from "react";
import { B } from "../design/tokens.js";
import { AUDITORIAS_INIT } from "../data/mockData.js";
import ModuleHeader from "../components/ModuleHeader.jsx";
import Destello from "../components/Destello.jsx";

const EJES = ["Estado General", "Operación y Personal", "Imagen y Marca", "Equipamiento", "Experiencia Cliente", "Bioseguridad"];
const LOCALES = ["Belgrano","Saavedra","Cañitas","Recoleta I","Bella Vista","Banfield","Lomas","Canning","Puerto Madero","Adrogue","Mar del Plata Centro","Mar del Plata Güemes"];

const scoreColor = (s) => s >= 8 ? B.green : s >= 6 ? "#CAA150" : B.red;
const scoreBg    = (s) => s >= 8 ? B.greenPale : s >= 6 ? B.goldPale : B.redPale;

export default function Auditorias({ user, onBack }) {
  const [auditorias, setAuditorias] = useState(AUDITORIAS_INIT);
  const [expanded, setExpanded] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ local: LOCALES[0], tipo: "cm", fecha: "", ejes: EJES.map(n => ({ nombre: n, score: 8, obs: "" })), conclusiones: "", mejoras: [""] });
  const isCM = user.perfil === "casa_matriz";

  const promedioTotal = (a) => {
    const sum = a.ejes.reduce((s, e) => s + e.score, 0);
    return (sum / a.ejes.length).toFixed(1);
  };

  const guardarAuditoria = () => {
    setAuditorias(prev => [{
      id: `a_${Date.now()}`, ...form,
      mejoras: form.mejoras.filter(m => m.trim()),
    }, ...prev]);
    setShowForm(false);
  };

  const borrarAuditoria = (id) => {
    setAuditorias(prev => prev.filter(a => a.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const toggleEditMode = () => {
    setEditMode(m => !m);
  };

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader
        emoji="📋"
        title="Auditorías"
        subtitle="Control de calidad de locales"
        onBack={onBack}
        isCM={isCM}
        editMode={editMode}
        onToggleEdit={toggleEditMode}
      />

      <div style={{ padding: "12px 14px 80px" }}>
        {auditorias.map((a, i) => {
          const prom = promedioTotal(a);
          const col = scoreColor(parseFloat(prom));
          const isMisterioso = a.tipo === "shopper";
          const isExpanded = expanded === a.id;

          return (
            <div key={a.id} style={{
              background: B.white, borderRadius: 14, marginBottom: 10,
              border: `1px solid ${editMode ? `${B.red}30` : B.pinkLight}`,
              overflow: "hidden",
              animation: `fadeUp .2s ease ${i * .05}s both`,
              transition: "border-color 0.2s",
            }}>
              {/* Row principal: expand + boton borrar en editMode */}
              <div style={{ display: "flex", alignItems: "stretch" }}>
                <button onClick={() => setExpanded(isExpanded ? null : a.id)} style={{
                  flex: 1, padding: "14px 14px 12px", display: "flex",
                  alignItems: "center", gap: 12, background: "transparent",
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: scoreBg(parseFloat(prom)), border: `1.5px solid ${col}40`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 18, color: col, lineHeight: 1 }}>{prom}</div>
                    <div style={{ fontSize: 6, color: col, fontWeight: 700 }}>/ 10</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: B.text, marginBottom: 3 }}>{a.local}</div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      <span style={{
                        padding: "2px 7px", borderRadius: 10, fontSize: 7, fontWeight: 700,
                        background: isMisterioso ? B.purplePale : B.goldPale,
                        color: isMisterioso ? B.purple : "#CAA150",
                      }}>
                        {isMisterioso ? "🕵️ Misterioso Shopper" : "✦ Casa Matriz"}
                      </span>
                      <span style={{ fontSize: 7, color: B.mid }}>{a.fecha}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: B.mid }}>{isExpanded ? "▲" : "▼"}</span>
                </button>

                {editMode && (
                  <button
                    onClick={() => borrarAuditoria(a.id)}
                    title="Borrar auditoría"
                    style={{
                      padding: "0 14px",
                      background: B.redPale,
                      border: "none",
                      borderLeft: `1px solid ${B.red}20`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, cursor: "pointer",
                      flexShrink: 0,
                      transition: "background 0.15s",
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>

              {isExpanded && (
                <div style={{ borderTop: `1px solid ${B.coolGray}`, padding: "12px 14px" }}>
                  {/* Botón borrar también dentro del card expandido */}
                  {editMode && (
                    <div style={{ marginBottom: 12 }}>
                      <button
                        onClick={() => borrarAuditoria(a.id)}
                        style={{
                          width: "100%", padding: "9px 14px", borderRadius: 10,
                          background: B.redPale, color: B.red,
                          border: `1px solid ${B.red}30`,
                          fontSize: 11, fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        }}
                      >
                        🗑️ Eliminar esta auditoría
                      </button>
                    </div>
                  )}

                  <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 10 }}>EJES DE EVALUACIÓN</div>
                  {a.ejes.map((eje, ei) => (
                    <div key={ei} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: B.text }}>{eje.nombre}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(eje.score) }}>{eje.score}/10</span>
                      </div>
                      <div style={{ height: 5, background: B.coolGray, borderRadius: 3, overflow: "hidden", marginBottom: eje.obs ? 4 : 0 }}>
                        <div style={{ width: `${eje.score * 10}%`, height: "100%", background: scoreColor(eje.score), borderRadius: 3 }} />
                      </div>
                      {eje.obs && <div style={{ fontSize: 9, color: B.mid, fontStyle: "italic" }}>{eje.obs}</div>}
                    </div>
                  ))}

                  {a.conclusiones && (
                    <div style={{ padding: "10px 12px", background: B.coolGray, borderRadius: 10, marginTop: 8, marginBottom: 8 }}>
                      <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 4 }}>CONCLUSIONES</div>
                      <div style={{ fontSize: 11, color: B.text }}>{a.conclusiones}</div>
                    </div>
                  )}

                  {a.mejoras?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 8, letterSpacing: 2, color: B.red, fontWeight: 700, marginBottom: 6 }}>PUNTOS A MEJORAR</div>
                      {a.mejoras.map((m, mi) => (
                        <div key={mi} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 4 }}>
                          <span style={{ color: B.red, fontSize: 10, flexShrink: 0 }}>•</span>
                          <span style={{ fontSize: 10, color: B.text }}>{m}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {auditorias.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: B.mid, fontSize: 12 }}>
            No hay auditorías registradas
          </div>
        )}
      </div>

      {/* FAB nueva auditoría (solo CM) */}
      {isCM && !editMode && (
        <div style={{ position: "fixed", bottom: 20, right: "calc(50% - 210px)", zIndex: 50 }}>
          <button onClick={() => setShowForm(true)} style={{
            padding: "12px 18px", borderRadius: 24, fontSize: 11, fontWeight: 700,
            color: B.white, background: `linear-gradient(135deg, #CAA150, #A67A2E)`,
            boxShadow: "0 4px 16px rgba(202,161,80,0.4)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Destello size={10} color={B.white} /> Nueva auditoría
          </button>
        </div>
      )}

      {/* Modal nueva auditoría */}
      {showForm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(61,43,45,0.5)",
          display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200, overflowY: "auto",
        }} onClick={() => setShowForm(false)}>
          <div style={{
            background: B.white, borderRadius: "16px 16px 0 0",
            padding: "20px", width: "100%", maxWidth: 430, maxHeight: "90vh", overflowY: "auto",
            animation: "fadeUp 0.25s ease",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 14, fontWeight: 700, color: B.text, marginBottom: 14 }}>📋 Nueva Auditoría</div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, color: B.mid, marginBottom: 4 }}>Local</div>
              <select value={form.local} onChange={e => setForm(f => ({ ...f, local: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${B.pinkLight}`, borderRadius: 10, fontSize: 12, color: B.text }}>
                {LOCALES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              {[{ id: "cm", label: "✦ Casa Matriz" }, { id: "shopper", label: "🕵️ Misterioso Shopper" }].map(t => (
                <button key={t.id} onClick={() => setForm(f => ({ ...f, tipo: t.id }))} style={{
                  padding: "10px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700,
                  background: form.tipo === t.id ? B.goldPale : B.white,
                  color: form.tipo === t.id ? "#CAA150" : B.mid,
                  border: `2px solid ${form.tipo === t.id ? "#CAA150" : B.glacier}`,
                }}>
                  {t.label}
                </button>
              ))}
            </div>

            <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
              style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${B.pinkLight}`, borderRadius: 10, fontSize: 12, marginBottom: 14 }} />

            <div style={{ fontSize: 9, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 10 }}>PUNTAJE POR EJE (1-10)</div>
            {form.ejes.map((eje, ei) => (
              <div key={ei} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: B.text }}>{eje.nombre}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(eje.score) }}>{eje.score}</span>
                </div>
                <input type="range" min={1} max={10} step={0.5} value={eje.score}
                  onChange={e => setForm(f => ({ ...f, ejes: f.ejes.map((x, xi) => xi === ei ? { ...x, score: parseFloat(e.target.value) } : x) }))}
                  style={{ width: "100%", marginBottom: 4, accentColor: scoreColor(eje.score) }} />
                <input value={eje.obs} onChange={e => setForm(f => ({ ...f, ejes: f.ejes.map((x, xi) => xi === ei ? { ...x, obs: e.target.value } : x) }))}
                  placeholder="Observaciones..."
                  style={{ width: "100%", padding: "7px 10px", border: `1px solid ${B.pinkLight}`, borderRadius: 8, fontSize: 11, color: B.text }} />
              </div>
            ))}

            <textarea value={form.conclusiones} onChange={e => setForm(f => ({ ...f, conclusiones: e.target.value }))}
              placeholder="Conclusiones generales..."
              style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${B.pinkLight}`, borderRadius: 10, fontSize: 12, resize: "none", height: 72, marginBottom: 10 }} />

            <button onClick={guardarAuditoria} style={{
              width: "100%", padding: 13, borderRadius: 12, fontSize: 12, fontWeight: 700,
              color: B.white, background: "linear-gradient(135deg, #CAA150, #A67A2E)",
            }}>
              Publicar auditoría
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
