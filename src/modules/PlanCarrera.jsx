import { useState } from "react";
import { B } from "../design/tokens.js";
import { PLAN_CARRERA_INIT } from "../data/mockData.js";
import ModuleHeader from "../components/ModuleHeader.jsx";

const ESCALA = [
  { val: 1, label: "Crítico",       color: B.red     },
  { val: 2, label: "A mejorar",     color: B.orange  },
  { val: 3, label: "En desarrollo", color: "#CAA150" },
  { val: 4, label: "Muy bueno",     color: B.teal    },
  { val: 5, label: "Excepcional",   color: B.green   },
];
const NIVEL_COLOR = { Master: "#CAA150", Senior: B.teal, Junior: B.pink };

const REUNION_INIT = {
  fecha: "",
  proximo: "",
  escala: 3,
  notas: "",
  mejora: "",
  objetivosRaw: "",
};

export default function PlanCarrera({ user, onBack }) {
  const [planes, setPlanes]       = useState(PLAN_CARRERA_INIT);
  const [selected, setSelected]   = useState(null);
  const [editMode, setEditMode]   = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState(REUNION_INIT);

  const isCM = user.perfil === "casa_matriz";
  const plan  = planes.find(p => p.id === selected);

  const borrarPlan = (id, e) => {
    e.stopPropagation();
    setPlanes(prev => prev.filter(p => p.id !== id));
  };

  const abrirModal = () => {
    setForm(REUNION_INIT);
    setModalOpen(true);
  };

  const cerrarModal = () => setModalOpen(false);

  const guardarReunion = () => {
    if (!form.fecha.trim()) return;
    const nuevaReunion = {
      fecha:   form.fecha.trim(),
      quien:   user.nombre || "Casa Matriz",
      proximo: form.proximo.trim(),
      escala:  Number(form.escala),
      notas:   form.notas.trim(),
      mejora:  form.mejora.trim(),
      objetivos: form.objetivosRaw
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean),
    };
    setPlanes(prev => prev.map(p =>
      p.id !== selected ? p : { ...p, reuniones: [...p.reuniones, nuevaReunion] }
    ));
    cerrarModal();
  };

  // ── Vista detalle ─────────────────────────────────────────────────────────
  if (selected && plan) {
    const escalaConf = ESCALA.find(e => e.val === (plan.reuniones[plan.reuniones.length - 1]?.escala));
    return (
      <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          background: B.white, padding: "13px 18px", borderBottom: `1px solid ${B.pinkLight}`,
          position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(221,164,174,0.08)",
          display: "flex", gap: 10, alignItems: "center",
        }}>
          <button onClick={() => setSelected(null)} style={{ background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "6px 13px", fontSize: 10, color: B.mid, fontWeight: 700 }}>← Plan de Carrera</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.text }}>{plan.manicura}</div>
            <div style={{ fontSize: 8, color: B.mid }}>{plan.local} · {plan.nivel}</div>
          </div>
          {isCM && (
            <button
              onClick={abrirModal}
              style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 10, fontWeight: 700,
                color: B.white,
                background: `linear-gradient(135deg, ${B.englishGreen}, #1a5a3a)`,
                border: "none", whiteSpace: "nowrap",
              }}
            >
              + Nueva 1:1
            </button>
          )}
        </div>

        <div style={{ padding: "14px 14px 60px" }}>
          {/* Skill */}
          <div style={{ background: B.white, borderRadius: 14, padding: 16, marginBottom: 12, border: `1px solid ${B.pinkLight}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: B.text }}>Skill actual</div>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700, background: B.goldPale, color: NIVEL_COLOR[plan.nivel] || "#CAA150" }}>
                {plan.nivel}
              </span>
            </div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 32, color: NIVEL_COLOR[plan.nivel] || "#CAA150", lineHeight: 1, marginBottom: 6 }}>{plan.skill}%</div>
            <div style={{ height: 6, background: B.coolGray, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${plan.skill}%`, height: "100%", background: NIVEL_COLOR[plan.nivel] || "#CAA150", borderRadius: 3 }} />
            </div>
          </div>

          {/* Reuniones */}
          {plan.reuniones.map((r, i) => {
            const rEscala = ESCALA.find(e => e.val === r.escala);
            return (
              <div key={i} style={{ background: B.white, borderRadius: 14, padding: 16, marginBottom: 12, border: `1px solid ${B.pinkLight}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: B.text }}>Reunión 1:1</div>
                    <div style={{ fontSize: 9, color: B.mid }}>{r.fecha} · por {r.quien}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: rEscala?.color, lineHeight: 1 }}>{r.escala}/5</div>
                    <div style={{ fontSize: 7, color: rEscala?.color, fontWeight: 700 }}>{rEscala?.label}</div>
                  </div>
                </div>

                {r.notas && (
                  <div style={{ padding: "10px 12px", background: B.coolGray, borderRadius: 10, marginBottom: 10, fontSize: 11, color: B.text, lineHeight: 1.6 }}>
                    {r.notas}
                  </div>
                )}

                {r.mejora && (
                  <div style={{ padding: "10px 12px", background: B.orangePale, borderRadius: 10, marginBottom: 10, fontSize: 11, color: B.text }}>
                    <div style={{ fontSize: 8, color: B.orange, fontWeight: 700, marginBottom: 4 }}>PLAN DE MEJORA</div>
                    {r.mejora}
                  </div>
                )}

                {r.objetivos?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 6 }}>OBJETIVOS ACORDADOS</div>
                    {r.objetivos.map((obj, oi) => (
                      <div key={oi} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 4 }}>
                        <span style={{ color: B.green, fontSize: 10, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 10, color: B.text }}>{obj}</span>
                      </div>
                    ))}
                  </div>
                )}

                {r.proximo && (
                  <div style={{ marginTop: 10, padding: "8px 12px", background: B.pinkBg, borderRadius: 8, fontSize: 9, color: B.mid }}>
                    Próximo 1:1: <strong style={{ color: B.text }}>{r.proximo}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Nueva Reunión 1:1 */}
        {modalOpen && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(61,43,45,0.45)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
          }}>
            <div style={{
              background: B.white, borderRadius: "18px 18px 0 0",
              width: "100%", maxWidth: 430,
              padding: "20px 18px 36px",
              maxHeight: "90vh", overflowY: "auto",
            }}>
              {/* Modal header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: B.text }}>Nueva reunión 1:1</div>
                  <div style={{ fontSize: 9, color: B.mid }}>{plan.manicura}</div>
                </div>
                <button
                  onClick={cerrarModal}
                  style={{ background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "5px 10px", fontSize: 12, color: B.mid, fontWeight: 700 }}
                >✕</button>
              </div>

              {/* Fecha */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 9, color: B.mid, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 4 }}>FECHA *</label>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                  style={{ width: "100%", fontSize: 12, color: B.text, background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "8px 10px" }}
                />
              </div>

              {/* Próximo 1:1 */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 9, color: B.mid, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 4 }}>PRÓXIMO 1:1</label>
                <input
                  type="date"
                  value={form.proximo}
                  onChange={e => setForm(f => ({ ...f, proximo: e.target.value }))}
                  style={{ width: "100%", fontSize: 12, color: B.text, background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "8px 10px" }}
                />
              </div>

              {/* Escala */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 9, color: B.mid, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>ESCALA DE DESEMPEÑO</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {ESCALA.map(e => (
                    <button
                      key={e.val}
                      onClick={() => setForm(f => ({ ...f, escala: e.val }))}
                      style={{
                        flex: 1, padding: "8px 4px", borderRadius: 10, fontSize: 9, fontWeight: 700,
                        background: form.escala === e.val ? `${e.color}20` : B.coolGray,
                        color: form.escala === e.val ? e.color : B.mid,
                        border: form.escala === e.val ? `2px solid ${e.color}` : `1px solid ${B.glacier}`,
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ fontSize: 13, marginBottom: 2 }}>{e.val}</div>
                      <div style={{ fontSize: 7, lineHeight: 1.2 }}>{e.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notas */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 9, color: B.mid, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 4 }}>NOTAS</label>
                <textarea
                  rows={3}
                  placeholder="Notas de la reunión..."
                  value={form.notas}
                  onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
                  style={{ width: "100%", fontSize: 11, color: B.text, background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "8px 10px", resize: "vertical", lineHeight: 1.5 }}
                />
              </div>

              {/* Plan de mejora */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 9, color: B.mid, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 4 }}>PLAN DE MEJORA</label>
                <textarea
                  rows={3}
                  placeholder="Describí el plan de mejora acordado..."
                  value={form.mejora}
                  onChange={e => setForm(f => ({ ...f, mejora: e.target.value }))}
                  style={{ width: "100%", fontSize: 11, color: B.text, background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "8px 10px", resize: "vertical", lineHeight: 1.5 }}
                />
              </div>

              {/* Objetivos */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 9, color: B.mid, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 4 }}>OBJETIVOS (uno por línea)</label>
                <textarea
                  rows={4}
                  placeholder={"Objetivo 1\nObjetivo 2\nObjetivo 3"}
                  value={form.objetivosRaw}
                  onChange={e => setForm(f => ({ ...f, objetivosRaw: e.target.value }))}
                  style={{ width: "100%", fontSize: 11, color: B.text, background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "8px 10px", resize: "vertical", lineHeight: 1.5 }}
                />
              </div>

              {/* Acciones */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={cerrarModal}
                  style={{ flex: 1, padding: "11px", borderRadius: 10, fontSize: 11, fontWeight: 700, color: B.mid, background: B.coolGray, border: `1px solid ${B.glacier}` }}
                >Cancelar</button>
                <button
                  onClick={guardarReunion}
                  style={{
                    flex: 2, padding: "11px", borderRadius: 10, fontSize: 11, fontWeight: 700,
                    color: B.white, background: `linear-gradient(135deg, ${B.englishGreen}, #1a5a3a)`,
                    border: "none", opacity: form.fecha ? 1 : 0.5,
                  }}
                >Guardar reunión</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Vista lista ───────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader
        emoji="🌱"
        title="Plan de Carrera"
        subtitle="1:1 y crecimiento del equipo"
        onBack={onBack}
        isCM={isCM}
        editMode={editMode}
        onToggleEdit={() => setEditMode(v => !v)}
      />

      <div style={{ padding: "14px 14px 60px" }}>
        {planes.map((p, i) => {
          const ultima     = p.reuniones[p.reuniones.length - 1];
          const escalaConf = ESCALA.find(e => e.val === ultima.escala);
          return (
            <div
              key={p.id}
              style={{
                width: "100%", background: B.white, borderRadius: 14, marginBottom: 10,
                border: `1px solid ${editMode ? B.redPale : B.pinkLight}`,
                animation: `fadeUp .2s ease ${i * .05}s both`,
                position: "relative", overflow: "hidden",
              }}
            >
              {/* barra superior de color */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${NIVEL_COLOR[p.nivel] || B.pink}50, ${NIVEL_COLOR[p.nivel] || B.pink})` }} />

              <div style={{ padding: "16px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                {/* avatar */}
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: `${NIVEL_COLOR[p.nivel] || B.pink}15`, border: `2px solid ${NIVEL_COLOR[p.nivel] || B.pink}40`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
                }}>
                  {p.nivel === "Master" ? "⭐" : p.nivel === "Senior" ? "💅" : "🌸"}
                </div>

                {/* info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: B.text, marginBottom: 2 }}>{p.manicura}</div>
                  <div style={{ fontSize: 9, color: B.mid }}>{p.local}</div>
                </div>

                {/* skill o botón borrar */}
                {editMode ? (
                  <button
                    onClick={e => borrarPlan(p.id, e)}
                    style={{
                      flexShrink: 0, width: 36, height: 36, borderRadius: 8,
                      background: B.redPale, border: `1px solid ${B.red}30`,
                      fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >🗑️</button>
                ) : (
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 18, color: NIVEL_COLOR[p.nivel] || "#CAA150", lineHeight: 1 }}>{p.skill}%</div>
                    <div style={{ fontSize: 7, color: B.mid }}>skill</div>
                  </div>
                )}
              </div>

              {/* footer con badges (solo modo normal) */}
              {!editMode && (
                <button
                  onClick={() => setSelected(p.id)}
                  className="card"
                  style={{ width: "100%", padding: "0 14px 14px", background: "none", border: "none", textAlign: "left" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 7, fontWeight: 700, background: B.goldPale, color: NIVEL_COLOR[p.nivel] || "#CAA150" }}>
                        {p.nivel}
                      </span>
                      <span style={{ fontSize: 8, color: B.mid, marginLeft: 6 }}>Último 1:1: {ultima.fecha}</span>
                    </div>
                    <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 8, fontWeight: 700, background: `${escalaConf?.color}15`, color: escalaConf?.color }}>
                      {ultima.escala}/5 {escalaConf?.label}
                    </span>
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
