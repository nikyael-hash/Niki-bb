import { useState } from "react";
import { B } from "../design/tokens.js";
import { PROYECTOS_INIT } from "../data/mockData.js";
import ModuleHeader from "../components/ModuleHeader.jsx";

const goldLight = "#CAA150";

const PRIORIDAD_CONFIG = {
  alta:  { label: "Alta",  color: B.red,    bg: B.redPale,    icon: "🔴" },
  media: { label: "Media", color: B.orange, bg: B.orangePale, icon: "🟡" },
  baja:  { label: "Baja",  color: B.green,  bg: B.greenPale,  icon: "🟢" },
};

const BLANK_FORM = { nombre: "", owner: "", area: "", prioridad: "media", fecha: "" };

export default function Proyectos({ user, onBack }) {
  const isCM = user?.perfil === "casa_matriz";

  const [proyectos, setProyectos] = useState(PROYECTOS_INIT);
  const [selected, setSelected]   = useState(null);
  const [editMode, setEditMode]   = useState(false);
  const [drafts, setDrafts]       = useState({});   // { id: { nombre, fecha, prioridad } }
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(BLANK_FORM);

  // ── task toggle (keeps working in all modes) ──────────────────────────────

  const toggleTarea = (proyId, tareaIdx) => {
    setProyectos(prev => prev.map(p => {
      if (p.id !== proyId) return p;
      return { ...p, tareas: p.tareas.map((t, ti) => ti !== tareaIdx ? t : { ...t, done: !t.done }) };
    }));
  };

  // ── edit helpers ──────────────────────────────────────────────────────────

  const getDraftById = (id) => {
    const p = proyectos.find(x => x.id === id);
    return drafts[id] ?? { nombre: p.nombre, fecha: p.fecha, prioridad: p.prioridad };
  };

  const setDraftField = (id, field, val) =>
    setDrafts(prev => ({ ...prev, [id]: { ...getDraftById(id), [field]: val } }));

  const handleToggleEdit = () => {
    if (editMode) {
      // commit all drafts
      setProyectos(prev => prev.map(p => {
        const d = drafts[p.id];
        return d ? { ...p, nombre: d.nombre || p.nombre, fecha: d.fecha, prioridad: d.prioridad } : p;
      }));
      setDrafts({});
      setShowForm(false);
      setForm(BLANK_FORM);
    }
    setEditMode(e => !e);
  };

  const handleDelete = (id) => {
    setProyectos(prev => prev.filter(p => p.id !== id));
    setDrafts(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const handleAddSubmit = () => {
    if (!form.nombre.trim()) return;
    const newId = "proy_" + Date.now();
    setProyectos(prev => [...prev, {
      id: newId,
      nombre: form.nombre.trim(),
      owner: form.owner.trim() || "Sin asignar",
      area: form.area.trim() || "General",
      prioridad: form.prioridad,
      fecha: form.fecha || "—",
      desc: "",
      tareas: [],
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

  // ── detail view ───────────────────────────────────────────────────────────

  const proy = proyectos.find(p => p.id === selected);

  if (selected && proy) {
    const done  = proy.tareas.filter(t => t.done).length;
    const total = proy.tareas.length;
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
    const priConf = PRIORIDAD_CONFIG[proy.prioridad];

    return (
      <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
        <div style={{
          background: B.white, padding: "13px 18px", borderBottom: `1px solid ${B.pinkLight}`,
          position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(221,164,174,0.08)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <button
            onClick={() => setSelected(null)}
            style={{ background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "6px 13px", fontSize: 10, color: B.mid, fontWeight: 700 }}
          >
            ← Proyectos
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.text }}>{proy.nombre}</div>
            <div style={{ fontSize: 8, color: B.mid }}>{proy.area} · {proy.owner.split(" ")[0]}</div>
          </div>
        </div>

        <div style={{ padding: "14px 14px 60px" }}>
          <div style={{ background: B.white, borderRadius: 14, padding: 16, marginBottom: 12, border: `1px solid ${B.pinkLight}` }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700, background: priConf.bg, color: priConf.color }}>
                {priConf.icon} {priConf.label}
              </span>
              <span style={{ fontSize: 8, color: B.mid }}>Vence: {proy.fecha}</span>
            </div>
            {proy.desc && <div style={{ fontSize: 11, color: B.mid, lineHeight: 1.6, marginBottom: 12 }}>{proy.desc}</div>}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: B.mid }}>Progreso</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: goldLight }}>{pct}%</span>
            </div>
            <div style={{ height: 6, background: B.coolGray, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${goldLight}80, ${goldLight})`, borderRadius: 3 }} />
            </div>
          </div>

          <div style={{ background: B.white, borderRadius: 14, border: `1px solid ${B.pinkLight}`, overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${B.coolGray}` }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700 }}>TAREAS ({done}/{total})</div>
            </div>
            {proy.tareas.map((t, ti) => (
              <div key={ti} style={{
                padding: "12px 14px", borderBottom: ti < proy.tareas.length - 1 ? `1px solid ${B.coolGray}` : "none",
                display: "flex", gap: 10, alignItems: "center",
                background: t.done ? B.greenPale : B.white,
              }}>
                <button onClick={() => toggleTarea(proy.id, ti)} style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: t.done ? B.green : B.white,
                  border: `2px solid ${t.done ? B.green : B.glacier}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: B.white,
                }}>
                  {t.done ? "✓" : ""}
                </button>
                <span style={{ fontSize: 11, color: t.done ? B.green : B.text, textDecoration: t.done ? "line-through" : "none" }}>
                  {t.t}
                </span>
              </div>
            ))}
            {proy.tareas.length === 0 && (
              <div style={{ padding: "20px 14px", textAlign: "center", fontSize: 11, color: B.mid }}>
                Sin tareas registradas
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── list view ─────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader
        emoji="📁" title="Proyectos CM" subtitle="Gestión de directoras"
        onBack={onBack} isCM={isCM} editMode={editMode} onToggleEdit={handleToggleEdit}
      />

      <div style={{ padding: "14px 14px 60px" }}>

        {/* Edit mode banner */}
        {editMode && (
          <div style={{
            background: B.redPale, border: `1px solid ${B.red}30`,
            borderRadius: 10, padding: "8px 12px", marginBottom: 12,
            fontSize: 10, color: B.red, fontWeight: 700,
          }}>
            ✏️ Modo edición activo — tocá ✓ Listo para guardar los cambios
          </div>
        )}

        {["alta", "media", "baja"].map(prioridad => {
          const group = proyectos.filter(p => p.prioridad === prioridad);
          if (group.length === 0) return null;
          const priConf = PRIORIDAD_CONFIG[prioridad];

          return (
            <div key={prioridad} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: priConf.color, fontWeight: 700, marginBottom: 8 }}>
                {priConf.icon} PRIORIDAD {priConf.label.toUpperCase()}
              </div>

              {group.map((p, i) => {
                const done  = p.tareas.filter(t => t.done).length;
                const total = p.tareas.length;
                const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
                const draft = getDraftById(p.id);

                if (editMode) {
                  // Editable card (not clickable to detail)
                  return (
                    <div key={p.id} style={{
                      background: B.pinkLight + "55",
                      borderRadius: 13, marginBottom: 8,
                      border: `1px solid ${B.pinkDeep}40`,
                      padding: "13px 14px",
                      position: "relative", overflow: "hidden",
                      animation: `fadeUp .2s ease ${i * .04}s both`,
                    }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${priConf.color}40, ${priConf.color})` }} />

                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>

                          {/* Nombre editable */}
                          <div>
                            <div style={{ fontSize: 8, color: B.mid, marginBottom: 2 }}>Nombre</div>
                            <input
                              value={draft.nombre}
                              onChange={e => setDraftField(p.id, "nombre", e.target.value)}
                              style={{ ...inputStyle, width: "100%", fontSize: 12, fontWeight: 700 }}
                            />
                          </div>

                          <div style={{ display: "flex", gap: 8 }}>
                            {/* Fecha editable */}
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 8, color: B.mid, marginBottom: 2 }}>Fecha venc.</div>
                              <input
                                type="date"
                                value={draft.fecha}
                                onChange={e => setDraftField(p.id, "fecha", e.target.value)}
                                style={{ ...inputStyle, width: "100%" }}
                              />
                            </div>

                            {/* Prioridad editable */}
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 8, color: B.mid, marginBottom: 2 }}>Prioridad</div>
                              <select
                                value={draft.prioridad}
                                onChange={e => setDraftField(p.id, "prioridad", e.target.value)}
                                style={{ ...selectStyle, width: "100%" }}
                              >
                                <option value="alta">Alta</option>
                                <option value="media">Media</option>
                                <option value="baja">Baja</option>
                              </select>
                            </div>
                          </div>

                          <div style={{ fontSize: 8, color: B.mid }}>{p.area} · {p.owner.split(" ")[0]}</div>
                        </div>

                        {/* Botón borrar */}
                        <button
                          onClick={() => handleDelete(p.id)}
                          style={{
                            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                            background: B.redPale, border: `1px solid ${B.red}40`,
                            fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                            marginTop: 2,
                          }}
                          title="Borrar proyecto"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                }

                // Read-only card (clickable)
                return (
                  <button key={p.id} onClick={() => setSelected(p.id)} className="card" style={{
                    width: "100%", background: B.white, borderRadius: 13, marginBottom: 8,
                    border: `1px solid ${B.pinkLight}`, padding: "14px 14px", textAlign: "left",
                    animation: `fadeUp .2s ease ${i * .04}s both`,
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${priConf.color}40, ${priConf.color})` }} />
                    <div style={{ fontSize: 12, fontWeight: 700, color: B.text, marginBottom: 4 }}>{p.nombre}</div>
                    <div style={{ fontSize: 9, color: B.mid, marginBottom: 8 }}>{p.area} · {p.owner.split(" ")[0]} · Vence: {p.fecha}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 9, color: B.mid }}>{done}/{total} tareas</span>
                      <span style={{ fontSize: 9, color: goldLight, fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 4, background: B.coolGray, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: goldLight, borderRadius: 2 }} />
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}

        {/* Botón + Nuevo proyecto */}
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
            + Nuevo proyecto
          </button>
        )}

        {/* Form inline nuevo proyecto */}
        {editMode && showForm && (
          <div style={{
            background: B.white, borderRadius: 14, padding: "16px 14px", marginTop: 4,
            border: `1.5px solid ${B.pinkDeep}40`,
            boxShadow: "0 2px 12px rgba(196,128,140,0.12)",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: B.pinkDeep, marginBottom: 12 }}>
              + Nuevo proyecto
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <div style={{ fontSize: 8, color: B.mid, marginBottom: 3 }}>Nombre</div>
                <input
                  placeholder="Nombre del proyecto"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8, color: B.mid, marginBottom: 3 }}>Owner</div>
                  <input
                    placeholder="Nombre"
                    value={form.owner}
                    onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
                    style={{ ...inputStyle, width: "100%" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8, color: B.mid, marginBottom: 3 }}>Área</div>
                  <input
                    placeholder="Área"
                    value={form.area}
                    onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                    style={{ ...inputStyle, width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8, color: B.mid, marginBottom: 3 }}>Prioridad</div>
                  <select
                    value={form.prioridad}
                    onChange={e => setForm(f => ({ ...f, prioridad: e.target.value }))}
                    style={{ ...selectStyle, width: "100%" }}
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8, color: B.mid, marginBottom: 3 }}>Fecha venc.</div>
                  <input
                    type="date"
                    value={form.fecha}
                    onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                    style={{ ...inputStyle, width: "100%" }}
                  />
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
                Agregar proyecto
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
