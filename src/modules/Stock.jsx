import { useState } from "react";
import { B } from "../design/tokens.js";
import { STOCK_INIT } from "../data/mockData.js";
import { useAppDoc } from "../hooks/useAppDoc.js";
import ModuleHeader from "../components/ModuleHeader.jsx";

const ESTADO_CONFIG = {
  disponible: { label: "Disponible", color: B.green,  bg: B.greenPale,  icon: "✅" },
  en_uso:     { label: "En uso",     color: B.teal,   bg: B.tealPale,   icon: "📦" },
  dañado:     { label: "Dañado",     color: B.red,    bg: B.redPale,    icon: "⚠️" },
};

const BLANK_FORM = { nombre: "", cantidad: 1, estado: "disponible" };

export default function Stock({ user, onBack }) {
  const isCM = user?.perfil === "casa_matriz";

  const [items, setItems]     = useAppDoc("stock", STOCK_INIT);
  const [filter, setFilter]   = useState("all");
  const [editMode, setEditMode] = useState(false);
  const [drafts, setDrafts]   = useState({});   // { id: { cantidad, estado, obs } }
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(BLANK_FORM);

  const filtrados = filter === "all" ? items : items.filter(i => i.estado === filter);

  // ── edit helpers ──────────────────────────────────────────────────────────

  const getDraft = (item) =>
    drafts[item.id] ?? { cantidad: item.cantidad, estado: item.estado, obs: item.obs };

  const getDraftById = (id) => {
    const item = items.find(x => x.id === id);
    return drafts[id] ?? { cantidad: item.cantidad, estado: item.estado, obs: item.obs };
  };

  const setDraftField = (id, field, val) =>
    setDrafts(prev => ({ ...prev, [id]: { ...getDraftById(id), [field]: val } }));

  const handleToggleEdit = () => {
    if (editMode) {
      setItems(prev => prev.map(item => {
        const d = drafts[item.id];
        return d ? { ...item, cantidad: Number(d.cantidad), estado: d.estado, obs: d.obs } : item;
      }));
      setDrafts({});
      setShowForm(false);
      setForm(BLANK_FORM);
    }
    setEditMode(e => !e);
  };

  const handleDelete = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setDrafts(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const handleAddSubmit = () => {
    if (!form.nombre.trim()) return;
    const newId = "s_" + Date.now();
    setItems(prev => [...prev, {
      id: newId, nombre: form.nombre.trim(),
      cantidad: Number(form.cantidad), estado: form.estado, obs: "",
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
        emoji="📦" title="Stock Depósito" subtitle="Inventario para obras"
        onBack={onBack} isCM={isCM} editMode={editMode} onToggleEdit={handleToggleEdit}
      />

      <div style={{ padding: "12px 14px 60px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
          {Object.entries(ESTADO_CONFIG).map(([k, v]) => (
            <div key={k} style={{ background: B.white, borderRadius: 12, padding: "10px 8px", textAlign: "center", border: `1px solid ${B.pinkLight}` }}>
              <div style={{ fontSize: 16, marginBottom: 3 }}>{v.icon}</div>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 20, color: v.color, lineHeight: 1 }}>
                {items.filter(i => i.estado === k).length}
              </div>
              <div style={{ fontSize: 7, color: B.mid, marginTop: 1 }}>{v.label}</div>
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

        {/* Filtros */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          <button onClick={() => setFilter("all")} style={{
            padding: "5px 12px", borderRadius: 20, fontSize: 8, fontWeight: 700,
            background: filter === "all" ? B.text : B.white, color: filter === "all" ? B.white : B.mid,
            border: `1px solid ${filter === "all" ? B.text : B.glacier}`,
          }}>Todos</button>
          {Object.entries(ESTADO_CONFIG).map(([k, v]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              padding: "5px 12px", borderRadius: 20, fontSize: 8, fontWeight: 700,
              background: filter === k ? v.color : B.white, color: filter === k ? B.white : B.mid,
              border: `1px solid ${filter === k ? v.color : B.glacier}`,
            }}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {filtrados.map((item, i) => {
          const draft = getDraft(item);
          const displayEstado = editMode ? draft.estado : item.estado;
          const conf = ESTADO_CONFIG[displayEstado] ?? ESTADO_CONFIG.disponible;

          return (
            <div key={item.id} style={{
              background: editMode ? B.pinkLight + "55" : B.white,
              borderRadius: 12, marginBottom: 8,
              border: `1px solid ${editMode ? B.pinkDeep + "40" : B.pinkLight}`,
              padding: "12px 14px",
              display: "flex", gap: 10, alignItems: editMode ? "flex-start" : "center",
              animation: `fadeUp .2s ease ${i * .03}s both`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: conf.bg, border: `1px solid ${conf.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                marginTop: editMode ? 2 : 0,
              }}>
                {conf.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: B.text, marginBottom: 4 }}>{item.nombre}</div>

                {editMode ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <label style={{ fontSize: 8, color: B.mid, flexShrink: 0 }}>Cant.</label>
                      <input
                        type="number" min={0}
                        value={draft.cantidad}
                        onChange={e => setDraftField(item.id, "cantidad", e.target.value)}
                        style={{ ...inputStyle, width: 60 }}
                      />
                      <select
                        value={draft.estado}
                        onChange={e => setDraftField(item.id, "estado", e.target.value)}
                        style={selectStyle}
                      >
                        <option value="disponible">Disponible</option>
                        <option value="en_uso">En uso</option>
                        <option value="dañado">Dañado</option>
                      </select>
                    </div>
                    <input
                      placeholder="Observación…"
                      value={draft.obs}
                      onChange={e => setDraftField(item.id, "obs", e.target.value)}
                      style={{ ...inputStyle, width: "100%" }}
                    />
                  </div>
                ) : (
                  item.obs && <div style={{ fontSize: 9, color: B.mid }}>{item.obs}</div>
                )}
              </div>

              {editMode ? (
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: B.redPale, border: `1px solid ${B.red}40`,
                    fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                    marginTop: 2,
                  }}
                  title="Borrar item"
                >
                  🗑️
                </button>
              ) : (
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: conf.color, lineHeight: 1 }}>{item.cantidad}</div>
                  <div style={{ fontSize: 7, color: B.mid }}>unid.</div>
                </div>
              )}
            </div>
          );
        })}

        {/* Botón + Nuevo item */}
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
            + Nuevo item
          </button>
        )}

        {/* Form inline nuevo item */}
        {editMode && showForm && (
          <div style={{
            background: B.white, borderRadius: 14, padding: "16px 14px", marginTop: 4,
            border: `1.5px solid ${B.pinkDeep}40`,
            boxShadow: "0 2px 12px rgba(196,128,140,0.12)",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: B.pinkDeep, marginBottom: 12 }}>
              + Nuevo item
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <div style={{ fontSize: 8, color: B.mid, marginBottom: 3 }}>Nombre</div>
                <input
                  placeholder="Nombre del item"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8, color: B.mid, marginBottom: 3 }}>Cantidad</div>
                  <input
                    type="number" min={0}
                    value={form.cantidad}
                    onChange={e => setForm(f => ({ ...f, cantidad: e.target.value }))}
                    style={{ ...inputStyle, width: "100%" }}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <div style={{ fontSize: 8, color: B.mid, marginBottom: 3 }}>Estado</div>
                  <select
                    value={form.estado}
                    onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
                    style={{ ...selectStyle, width: "100%" }}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="en_uso">En uso</option>
                    <option value="dañado">Dañado</option>
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
                Agregar item
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
