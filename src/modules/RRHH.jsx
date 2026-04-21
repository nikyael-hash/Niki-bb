import { useState } from "react";
import { B } from "../design/tokens.js";
import { MANICURAS_DATA } from "../data/mockData.js";
import { useAppDoc } from "../hooks/useAppDoc.js";
import ModuleHeader from "../components/ModuleHeader.jsx";

const goldLight = "#CAA150";
const LOCALES_BASE = [...new Set(MANICURAS_DATA.map(m => m.local))];
const NIVEL_COLOR = { Master: goldLight, Senior: B.teal, Junior: B.pink };
const NIVEL_BG    = { Master: B.goldPale, Senior: B.tealPale, Junior: B.pinkLight };

const BLANK_FORM = { nombre: "", local: LOCALES_BASE[0], skill: 80, nivel: "Junior" };

export default function RRHH({ user, onBack }) {
  const isCM = user?.perfil === "casa_matriz";

  const [manicuras, setManicuras]     = useAppDoc("rrhh", MANICURAS_DATA);
  const [localFilter, setLocalFilter] = useState("all");
  const [nivelFilter, setNivelFilter] = useState("all");
  const [editMode, setEditMode]       = useState(false);
  const [drafts, setDrafts]           = useState({});   // { id: { skill, nivel } }
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState(BLANK_FORM);

  // Derive locales dynamically so new ones appear in filter
  const LOCALES = [...new Set(manicuras.map(m => m.local))];

  const filtradas = manicuras.filter(m => {
    if (localFilter !== "all" && m.local !== localFilter) return false;
    if (nivelFilter !== "all" && m.nivel !== nivelFilter) return false;
    return true;
  });

  // ── edit helpers ──────────────────────────────────────────────────────────

  const getDraft = (m) => drafts[m.id] ?? { skill: m.skill, nivel: m.nivel };

  const setDraftField = (id, field, val) =>
    setDrafts(prev => ({ ...prev, [id]: { ...getDraftById(id), [field]: val } }));

  const getDraftById = (id) => {
    const m = manicuras.find(x => x.id === id);
    return drafts[id] ?? { skill: m.skill, nivel: m.nivel };
  };

  const handleToggleEdit = () => {
    if (editMode) {
      // commit all drafts
      setManicuras(prev => prev.map(m => {
        const d = drafts[m.id];
        return d ? { ...m, skill: Number(d.skill), nivel: d.nivel } : m;
      }));
      setDrafts({});
      setShowForm(false);
      setForm(BLANK_FORM);
    }
    setEditMode(e => !e);
  };

  const handleDelete = (id) => {
    setManicuras(prev => prev.filter(m => m.id !== id));
    setDrafts(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const handleAddSubmit = () => {
    if (!form.nombre.trim()) return;
    const newId = "mani_" + Date.now();
    setManicuras(prev => [...prev, {
      id: newId, nombre: form.nombre.trim(), local: form.local,
      skill: Number(form.skill), nivel: form.nivel,
      estado: "activa", telefono: "",
    }]);
    setForm(BLANK_FORM);
    setShowForm(false);
  };

  // ── shared input style ─────────────────────────────────────────────────────

  const inputStyle = {
    border: `1px solid ${B.pinkLight}`, borderRadius: 6,
    padding: "4px 7px", fontSize: 11, color: B.text,
    background: B.white, outline: "none",
  };
  const selectStyle = { ...inputStyle };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader
        emoji="👥" title="RRHH & Turnos" subtitle="Equipo Niki Beauty Bar"
        onBack={onBack} isCM={isCM} editMode={editMode} onToggleEdit={handleToggleEdit}
      />

      <div style={{ padding: "12px 14px 60px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
          {[
            { label: "Master", value: manicuras.filter(m => m.nivel === "Master").length, color: goldLight },
            { label: "Senior", value: manicuras.filter(m => m.nivel === "Senior").length, color: B.teal    },
            { label: "Junior", value: manicuras.filter(m => m.nivel === "Junior").length, color: B.pink    },
          ].map((s, i) => (
            <div key={i} style={{ background: B.white, borderRadius: 12, padding: "12px 10px", textAlign: "center", border: `1px solid ${B.pinkLight}` }}>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 26, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 8, color: B.mid, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Edit mode banner */}
        {editMode && (
          <div style={{
            background: B.redPale, border: `1px solid ${B.red}30`,
            borderRadius: 10, padding: "8px 12px", marginBottom: 10,
            fontSize: 10, color: B.red, fontWeight: 700,
          }}>
            ✏️ Modo edición activo — tocá ✓ Listo para guardar los cambios
          </div>
        )}

        {/* Filtros de local */}
        <div style={{ display: "flex", gap: 6, marginBottom: 8, overflowX: "auto", scrollbarWidth: "none" }}>
          <button onClick={() => setLocalFilter("all")} style={{
            padding: "4px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700, flexShrink: 0,
            background: localFilter === "all" ? B.text : B.white, color: localFilter === "all" ? B.white : B.mid,
            border: `1px solid ${localFilter === "all" ? B.text : B.glacier}`,
          }}>Todos</button>
          {LOCALES.map(l => (
            <button key={l} onClick={() => setLocalFilter(l)} style={{
              padding: "4px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700, flexShrink: 0,
              background: localFilter === l ? B.pinkDeep : B.white,
              color: localFilter === l ? B.white : B.mid,
              border: `1px solid ${localFilter === l ? B.pinkDeep : B.glacier}`,
            }}>{l}</button>
          ))}
        </div>

        {/* Filtros de nivel */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", scrollbarWidth: "none" }}>
          {["all", "Master", "Senior", "Junior"].map(n => (
            <button key={n} onClick={() => setNivelFilter(n)} style={{
              padding: "4px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700, flexShrink: 0,
              background: nivelFilter === n ? (n === "all" ? B.text : NIVEL_COLOR[n]) : B.white,
              color: nivelFilter === n ? B.white : B.mid,
              border: `1px solid ${nivelFilter === n ? (n === "all" ? B.text : NIVEL_COLOR[n]) : B.glacier}`,
            }}>{n === "all" ? "Todos niveles" : n}</button>
          ))}
        </div>

        {/* Lista */}
        {filtradas.map((m, i) => {
          const draft = getDraft(m);
          const displayNivel = editMode ? draft.nivel : m.nivel;
          const displaySkill = editMode ? draft.skill : m.skill;

          return (
            <div key={m.id} style={{
              background: editMode ? B.pinkLight + "55" : B.white,
              borderRadius: 12, marginBottom: 8,
              border: `1px solid ${editMode ? B.pinkDeep + "40" : B.pinkLight}`,
              padding: "13px 14px",
              animation: `fadeUp .2s ease ${i * .04}s both`,
              display: "flex", gap: 10, alignItems: "center",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: `${NIVEL_COLOR[displayNivel]}15`,
                border: `2px solid ${NIVEL_COLOR[displayNivel]}40`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>
                {displayNivel === "Master" ? "⭐" : displayNivel === "Senior" ? "💅" : "🌸"}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: B.text, marginBottom: 3 }}>{m.nombre}</div>
                <div style={{ fontSize: 9, color: B.mid, marginBottom: 4 }}>📍 {m.local}</div>

                {editMode ? (
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <label style={{ fontSize: 8, color: B.mid }}>Skill%</label>
                    <input
                      type="number" min={0} max={100}
                      value={draft.skill}
                      onChange={e => setDraftField(m.id, "skill", e.target.value)}
                      style={{ ...inputStyle, width: 52 }}
                    />
                    <select
                      value={draft.nivel}
                      onChange={e => setDraftField(m.id, "nivel", e.target.value)}
                      style={selectStyle}
                    >
                      <option>Junior</option>
                      <option>Senior</option>
                      <option>Master</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{
                      padding: "2px 8px", borderRadius: 20, fontSize: 7, fontWeight: 700,
                      background: NIVEL_BG[m.nivel], color: NIVEL_COLOR[m.nivel],
                    }}>
                      {m.nivel}
                    </span>
                    <span style={{ fontSize: 8, color: B.mid }}>{m.skill}% skill</span>
                  </div>
                )}
              </div>

              {editMode ? (
                <button
                  onClick={() => handleDelete(m.id)}
                  style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: B.redPale, border: `1px solid ${B.red}40`,
                    fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  title="Borrar manicura"
                >
                  🗑️
                </button>
              ) : (
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 20, color: NIVEL_COLOR[m.nivel], lineHeight: 1 }}>{m.skill}%</div>
                  <div style={{ fontSize: 7, color: B.mid }}>dominio</div>
                </div>
              )}
            </div>
          );
        })}

        {filtradas.length === 0 && !showForm && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: B.mid, fontSize: 12 }}>
            No hay manicuras con ese filtro
          </div>
        )}

        {/* Botón + Nueva manicura */}
        {editMode && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              width: "100%", padding: "12px", borderRadius: 12, marginTop: 4,
              background: B.white, border: `1.5px dashed ${B.pinkDeep}`,
              fontSize: 11, fontWeight: 700, color: B.pinkDeep,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            + Nueva manicura
          </button>
        )}

        {/* Form inline nueva manicura */}
        {editMode && showForm && (
          <div style={{
            background: B.white, borderRadius: 14, padding: "16px 14px", marginTop: 4,
            border: `1.5px solid ${B.pinkDeep}40`,
            boxShadow: "0 2px 12px rgba(196,128,140,0.12)",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: B.pinkDeep, marginBottom: 12 }}>
              + Nueva manicura
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <div style={{ fontSize: 8, color: B.mid, marginBottom: 3 }}>Nombre</div>
                <input
                  placeholder="Nombre completo"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </div>

              <div>
                <div style={{ fontSize: 8, color: B.mid, marginBottom: 3 }}>Local</div>
                <select
                  value={form.local}
                  onChange={e => setForm(f => ({ ...f, local: e.target.value }))}
                  style={{ ...selectStyle, width: "100%" }}
                >
                  {LOCALES_BASE.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8, color: B.mid, marginBottom: 3 }}>Skill %</div>
                  <input
                    type="number" min={0} max={100}
                    value={form.skill}
                    onChange={e => setForm(f => ({ ...f, skill: e.target.value }))}
                    style={{ ...inputStyle, width: "100%" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8, color: B.mid, marginBottom: 3 }}>Nivel</div>
                  <select
                    value={form.nivel}
                    onChange={e => setForm(f => ({ ...f, nivel: e.target.value }))}
                    style={{ ...selectStyle, width: "100%" }}
                  >
                    <option>Junior</option>
                    <option>Senior</option>
                    <option>Master</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button
                onClick={() => { setShowForm(false); setForm(BLANK_FORM); }}
                style={{
                  flex: 1, padding: "9px", borderRadius: 8,
                  background: B.coolGray, border: `1px solid ${B.glacier}`,
                  fontSize: 10, color: B.mid, fontWeight: 700,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddSubmit}
                style={{
                  flex: 2, padding: "9px", borderRadius: 8,
                  background: B.pinkDeep, border: "none",
                  fontSize: 10, color: B.white, fontWeight: 700,
                }}
              >
                Agregar manicura
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
