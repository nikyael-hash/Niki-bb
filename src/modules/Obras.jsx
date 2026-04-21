import { useState } from "react";
import { B } from "../design/tokens.js";
import { OBRAS_INIT } from "../data/mockData.js";
import { useAppDoc } from "../hooks/useAppDoc.js";
import ModuleHeader from "../components/ModuleHeader.jsx";

const ETAPAS = ["Búsqueda Local", "Firma Contrato", "Obra Civil", "En construcción", "Terminada"];
const ETAPA_COLOR = {
  "Obra Civil":       B.orange,
  "Búsqueda Local":   B.teal,
  "Firma Contrato":   B.purple,
  "En construcción":  B.green,
  "Terminada":        B.green,
};

export default function Obras({ user, onBack }) {
  const [obras, setObras] = useAppDoc("obras", OBRAS_INIT);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showAddObra, setShowAddObra] = useState(false);
  const [newObraNombre, setNewObraNombre] = useState("");
  const isCM = user.perfil === "casa_matriz";

  const obra = obras.find(o => o.id === selected);

  const updateObra = (id, changes) =>
    setObras(prev => prev.map(o => o.id !== id ? o : { ...o, ...changes }));

  const deleteObra = (id) => { setObras(prev => prev.filter(o => o.id !== id)); setSelected(null); };

  const toggleItem = (obraId, itemId) => {
    setObras(prev => prev.map(o => {
      if (o.id !== obraId) return o;
      return { ...o, items: o.items.map(it => it.id !== itemId ? it : { ...it, listo: !it.listo }) };
    }));
  };

  const deleteItem = (obraId, itemId) => {
    setObras(prev => prev.map(o => {
      if (o.id !== obraId) return o;
      return { ...o, items: o.items.filter(it => it.id !== itemId) };
    }));
  };

  const addItem = (obraId, nombre) => {
    setObras(prev => prev.map(o => {
      if (o.id !== obraId) return o;
      return { ...o, items: [...o.items, { id: `oi_${Date.now()}`, nombre, origen: "comprar", fecha: "", obs: "", listo: false }] };
    }));
  };

  const addObra = () => {
    if (!newObraNombre.trim()) return;
    setObras(prev => [...prev, { id: `o_${Date.now()}`, nombre: newObraNombre.trim(), etapa: "Búsqueda Local", flag: "🔍", items: [] }]);
    setNewObraNombre(""); setShowAddObra(false);
  };

  if (selected && obra) {
    const totalItems = obra.items.length;
    const listos = obra.items.filter(i => i.listo).length;
    const pct = totalItems > 0 ? Math.round((listos / totalItems) * 100) : 0;
    const [newItem, setNewItem] = useState("");

    return (
      <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
        <div style={{
          background: B.white, padding: "13px 18px", borderBottom: `1px solid ${B.pinkLight}`,
          position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(221,164,174,0.08)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <button onClick={() => setSelected(null)} style={{ background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "6px 13px", fontSize: 10, color: B.mid, fontWeight: 700 }}>← Obras</button>
          <div style={{ flex: 1 }}>
            {editMode ? (
              <input value={obra.nombre} onChange={e => updateObra(obra.id, { nombre: e.target.value })}
                style={{ fontSize: 13, fontWeight: 700, color: B.text, border: `1px solid ${B.pinkLight}`, borderRadius: 6, padding: "2px 8px", width: "100%" }} />
            ) : (
              <div style={{ fontSize: 13, fontWeight: 700, color: B.text }}>{obra.flag} {obra.nombre}</div>
            )}
            {editMode ? (
              <select value={obra.etapa} onChange={e => updateObra(obra.id, { etapa: e.target.value })}
                style={{ fontSize: 8, color: B.mid, border: `1px solid ${B.pinkLight}`, borderRadius: 6, padding: "2px 6px", marginTop: 2 }}>
                {ETAPAS.map(e => <option key={e}>{e}</option>)}
              </select>
            ) : (
              <div style={{ fontSize: 8, color: ETAPA_COLOR[obra.etapa] || B.mid, fontWeight: 700 }}>{obra.etapa}</div>
            )}
          </div>
          {isCM && (
            <div style={{ display: "flex", gap: 6 }}>
              {editMode && (
                <button onClick={() => { if (confirm(`¿Eliminar "${obra.nombre}"?`)) deleteObra(obra.id); }}
                  style={{ padding: "6px 10px", borderRadius: 8, fontSize: 10, background: B.redPale, color: B.red, border: `1px solid ${B.red}30` }}>
                  🗑️
                </button>
              )}
              <button onClick={() => setEditMode(!editMode)} style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 10, fontWeight: 700,
                background: editMode ? B.pinkDeep : B.coolGray,
                color: editMode ? B.white : B.mid,
                border: `1px solid ${editMode ? B.pinkDeep : B.glacier}`,
              }}>
                {editMode ? "✓ Listo" : "✏️ Editar"}
              </button>
            </div>
          )}
        </div>

        <div style={{ padding: "14px 14px 80px" }}>
          {totalItems > 0 && (
            <div style={{ background: B.white, borderRadius: 14, padding: 16, marginBottom: 14, border: `1px solid ${B.pinkLight}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: B.text }}>Equipamiento</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#CAA150" }}>{listos}/{totalItems}</div>
              </div>
              <div style={{ height: 6, background: B.coolGray, borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #CAA15080, #CAA150)", borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 9, color: B.mid }}>{pct}% completado</div>
            </div>
          )}

          <div style={{ background: B.white, borderRadius: 14, border: `1px solid ${B.pinkLight}`, overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${B.coolGray}` }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700 }}>CHECKLIST DE EQUIPAMIENTO</div>
            </div>

            {obra.items.map((item, i) => (
              <div key={item.id} style={{
                padding: "12px 14px", borderBottom: i < obra.items.length - 1 ? `1px solid ${B.coolGray}` : "none",
                display: "flex", gap: 10, alignItems: "flex-start",
                background: item.listo ? B.greenPale : B.white,
              }}>
                <button onClick={() => toggleItem(obra.id, item.id)} style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                  background: item.listo ? B.green : B.white,
                  border: `2px solid ${item.listo ? B.green : B.glacier}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: B.white,
                }}>
                  {item.listo ? "✓" : ""}
                </button>
                <div style={{ flex: 1 }}>
                  {editMode ? (
                    <input value={item.nombre} onChange={e => setObras(prev => prev.map(o => o.id !== obra.id ? o : { ...o, items: o.items.map(it => it.id !== item.id ? it : { ...it, nombre: e.target.value }) }))}
                      style={{ fontSize: 11, fontWeight: 700, color: B.text, border: `1px solid ${B.pinkLight}`, borderRadius: 6, padding: "2px 8px", width: "100%" }} />
                  ) : (
                    <div style={{ fontSize: 11, fontWeight: 700, color: item.listo ? B.green : B.text, textDecoration: item.listo ? "line-through" : "none" }}>{item.nombre}</div>
                  )}
                  {item.obs && !editMode && <div style={{ fontSize: 9, color: B.mid, marginTop: 2 }}>{item.obs}</div>}
                </div>
                {editMode && (
                  <button onClick={() => deleteItem(obra.id, item.id)} style={{ background: "none", fontSize: 14, color: B.red, flexShrink: 0 }}>🗑️</button>
                )}
              </div>
            ))}

            {editMode && (
              <div style={{ padding: "10px 14px", display: "flex", gap: 8, borderTop: `1px solid ${B.coolGray}` }}>
                <input value={newItem} onChange={e => setNewItem(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && newItem.trim()) { addItem(obra.id, newItem.trim()); setNewItem(""); } }}
                  placeholder="+ Agregar ítem..."
                  style={{ flex: 1, padding: "7px 10px", border: `1px solid ${B.pinkLight}`, borderRadius: 8, fontSize: 11, color: B.text }} />
                <button onClick={() => { if (newItem.trim()) { addItem(obra.id, newItem.trim()); setNewItem(""); } }}
                  style={{ padding: "7px 12px", borderRadius: 8, background: B.pinkDeep, color: B.white, fontSize: 11, fontWeight: 700 }}>+</button>
              </div>
            )}

            {obra.items.length === 0 && !editMode && (
              <div style={{ padding: "30px 20px", textAlign: "center", color: B.mid, fontSize: 11 }}>
                No hay ítems cargados aún
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader emoji="🏗️" title="Obras" subtitle={`${obras.length} obras activas`} onBack={onBack}
        isCM={isCM} editMode={editMode} onToggleEdit={() => setEditMode(!editMode)} />

      <div style={{ padding: "14px 14px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
          {[
            { label: "Total", value: obras.length, icon: "🏗️" },
            { label: "Búsqueda", value: obras.filter(o => o.etapa === "Búsqueda Local").length, icon: "🔍" },
            { label: "Obra Civil", value: obras.filter(o => o.etapa === "Obra Civil").length, icon: "⚒️" },
          ].map((s, i) => (
            <div key={i} style={{ background: B.white, borderRadius: 12, padding: "12px 10px", textAlign: "center", border: `1px solid ${B.pinkLight}` }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "#CAA150", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 8, color: B.mid, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {obras.map((o, i) => {
          const col = ETAPA_COLOR[o.etapa] || B.teal;
          const listos = o.items.filter(it => it.listo).length;
          const pct = o.items.length > 0 ? Math.round((listos / o.items.length) * 100) : 0;

          return (
            <div key={o.id} style={{ position: "relative", marginBottom: 10 }}>
              <button onClick={() => setSelected(o.id)} className="card" style={{
                width: "100%", background: B.white, borderRadius: 14,
                border: `1px solid ${B.pinkLight}`, padding: "16px 14px",
                boxShadow: "0 2px 8px rgba(221,164,174,0.06)",
                animation: `fadeUp .2s ease ${i * .05}s both`, textAlign: "left",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${col}50, ${col})` }} />
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: o.items.length > 0 ? 10 : 0 }}>
                  <div style={{ fontSize: 26, flexShrink: 0 }}>{o.flag}</div>
                  <div style={{ flex: 1 }}>
                    {editMode ? (
                      <input value={o.nombre} onClick={e => e.stopPropagation()}
                        onChange={e => updateObra(o.id, { nombre: e.target.value })}
                        style={{ fontSize: 13, fontWeight: 700, color: B.text, border: `1px solid ${B.pinkLight}`, borderRadius: 6, padding: "3px 8px", width: "100%", marginBottom: 6 }} />
                    ) : (
                      <div style={{ fontSize: 13, fontWeight: 700, color: B.text, marginBottom: 4 }}>{o.nombre}</div>
                    )}
                    {editMode ? (
                      <select value={o.etapa} onClick={e => e.stopPropagation()}
                        onChange={e => updateObra(o.id, { etapa: e.target.value })}
                        style={{ fontSize: 9, border: `1px solid ${col}40`, borderRadius: 8, padding: "3px 8px", background: `${col}10`, color: col, fontWeight: 700 }}>
                        {ETAPAS.map(et => <option key={et}>{et}</option>)}
                      </select>
                    ) : (
                      <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 8, fontWeight: 700, background: `${col}15`, color: col, border: `1px solid ${col}30` }}>
                        {o.etapa}
                      </span>
                    )}
                  </div>
                  {editMode ? (
                    <button onClick={e => { e.stopPropagation(); setObras(prev => prev.filter(ob => ob.id !== o.id)); }}
                      style={{ background: B.redPale, border: `1px solid ${B.red}30`, borderRadius: 8, padding: "6px 8px", fontSize: 14, color: B.red, flexShrink: 0 }}>
                      🗑️
                    </button>
                  ) : (
                    <div style={{ fontSize: 10, color: B.mid, flexShrink: 0 }}>→</div>
                  )}
                </div>
                {o.items.length > 0 && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ fontSize: 9, color: B.mid }}>Equipamiento: {listos}/{o.items.length}</div>
                      <div style={{ fontSize: 9, color: "#CAA150", fontWeight: 700 }}>{pct}%</div>
                    </div>
                    <div style={{ height: 4, background: B.coolGray, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "#CAA150", borderRadius: 2 }} />
                    </div>
                  </>
                )}
              </button>
            </div>
          );
        })}

        {editMode && (
          showAddObra ? (
            <div style={{ background: B.white, borderRadius: 14, padding: 16, border: `1px solid ${B.pinkLight}`, display: "flex", gap: 8 }}>
              <input value={newObraNombre} onChange={e => setNewObraNombre(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addObra()}
                placeholder="Nombre de la obra..."
                style={{ flex: 1, padding: "10px 12px", border: `1.5px solid ${B.pinkLight}`, borderRadius: 10, fontSize: 12, color: B.text }} />
              <button onClick={addObra} style={{ padding: "10px 14px", borderRadius: 10, background: B.pinkDeep, color: B.white, fontSize: 12, fontWeight: 700 }}>+</button>
              <button onClick={() => setShowAddObra(false)} style={{ padding: "10px 12px", borderRadius: 10, background: B.coolGray, color: B.mid, fontSize: 12 }}>✕</button>
            </div>
          ) : (
            <button onClick={() => setShowAddObra(true)} style={{
              width: "100%", padding: "14px", borderRadius: 14, fontSize: 11, fontWeight: 700,
              color: B.pinkDeep, background: B.white, border: `2px dashed ${B.pinkLight}`,
            }}>
              + Nueva obra
            </button>
          )
        )}
      </div>
    </div>
  );
}
