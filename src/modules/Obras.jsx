import { useState } from "react";
import { B } from "../design/tokens.js";
import { OBRAS_INIT } from "../data/mockData.js";
import ModuleHeader from "../components/ModuleHeader.jsx";

const ETAPA_COLOR = {
  "Obra Civil":       B.orange,
  "Búsqueda Local":   B.teal,
  "Firma Contrato":   B.purple,
  "En construcción":  B.green,
  "Terminada":        B.green,
};

export default function Obras({ user, onBack }) {
  const [obras, setObras] = useState(OBRAS_INIT);
  const [selected, setSelected] = useState(null);
  const isCM = user.perfil === "casa_matriz";

  const toggleItem = (obraId, itemId) => {
    setObras(prev => prev.map(o => {
      if (o.id !== obraId) return o;
      return { ...o, items: o.items.map(it => it.id !== itemId ? it : { ...it, listo: !it.listo }) };
    }));
  };

  const obra = obras.find(o => o.id === selected);

  if (selected && obra) {
    const totalItems = obra.items.length;
    const listos = obra.items.filter(i => i.listo).length;
    const pct = totalItems > 0 ? Math.round((listos / totalItems) * 100) : 0;

    return (
      <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
        <div style={{
          background: B.white, padding: "13px 18px",
          borderBottom: `1px solid ${B.pinkLight}`,
          position: "sticky", top: 0, zIndex: 100,
          boxShadow: "0 2px 10px rgba(221,164,174,0.08)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <button onClick={() => setSelected(null)} style={{ background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "6px 13px", fontSize: 10, color: B.mid, fontWeight: 700 }}>← Obras</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: B.text }}>{obra.flag} {obra.nombre}</div>
            <div style={{ fontSize: 8, color: ETAPA_COLOR[obra.etapa] || B.mid, fontWeight: 700 }}>{obra.etapa}</div>
          </div>
        </div>

        <div style={{ padding: "14px 14px 60px" }}>
          {/* Progreso */}
          <div style={{ background: B.white, borderRadius: 14, padding: 16, marginBottom: 14, border: `1px solid ${B.pinkLight}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: B.text }}>Equipamiento</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#CAA150" }}>{listos}/{totalItems}</div>
            </div>
            <div style={{ height: 6, background: B.coolGray, borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, #CAA15080, #CAA150)`, borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 9, color: B.mid }}>{pct}% completado</div>
          </div>

          {/* Checklist */}
          {obra.items.length > 0 ? (
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
                  <button onClick={() => isCM && toggleItem(obra.id, item.id)} style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                    background: item.listo ? B.green : B.white,
                    border: `2px solid ${item.listo ? B.green : B.glacier}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: B.white,
                    cursor: isCM ? "pointer" : "default",
                  }}>
                    {item.listo ? "✓" : ""}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: item.listo ? B.green : B.text, marginBottom: 2, textDecoration: item.listo ? "line-through" : "none" }}>
                      {item.nombre}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: 7, fontWeight: 700, padding: "2px 6px", borderRadius: 8,
                        background: item.origen === "deposito" ? B.tealPale : B.orangePale,
                        color: item.origen === "deposito" ? B.teal : B.orange,
                      }}>
                        {item.origen === "deposito" ? "🏭 Depósito" : "🛒 A comprar"}
                      </span>
                      {item.fecha && <span style={{ fontSize: 7, color: B.mid }}>{item.fecha}</span>}
                    </div>
                    {item.obs && <div style={{ fontSize: 9, color: B.mid, marginTop: 2 }}>{item.obs}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", background: B.white, borderRadius: 14, border: `1px solid ${B.pinkLight}` }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
              <div style={{ fontSize: 12, color: B.mid }}>No hay ítems cargados aún</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader emoji="🏗️" title="Obras" subtitle={`${obras.length} obras activas`} onBack={onBack} />

      <div style={{ padding: "14px 14px 60px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
          {[
            { label: "Total obras", value: obras.length, icon: "🏗️" },
            { label: "Obra Civil", value: obras.filter(o => o.etapa === "Obra Civil").length, icon: "⚒️" },
            { label: "En proceso", value: obras.filter(o => ["Búsqueda Local","Firma Contrato"].includes(o.etapa)).length, icon: "📄" },
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
          const totalItems = o.items.length;
          const listos = o.items.filter(it => it.listo).length;
          const pct = totalItems > 0 ? Math.round((listos / totalItems) * 100) : 0;
          const needsAlert = ["Búsqueda Local", "Firma Contrato"].includes(o.etapa) && totalItems < 5;

          return (
            <button key={o.id} onClick={() => setSelected(o.id)} className="card" style={{
              width: "100%", background: B.white, borderRadius: 14, marginBottom: 10,
              border: `1px solid ${B.pinkLight}`, padding: "16px 14px",
              boxShadow: "0 2px 8px rgba(221,164,174,0.06)",
              animation: `fadeUp .2s ease ${i * .05}s both`, textAlign: "left",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${col}50, ${col})` }} />

              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 26, flexShrink: 0 }}>{o.flag}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: B.text, marginBottom: 4 }}>{o.nombre}</div>
                  <span style={{
                    padding: "3px 9px", borderRadius: 20, fontSize: 8, fontWeight: 700,
                    background: `${col}15`, color: col, border: `1px solid ${col}30`,
                  }}>
                    {o.etapa}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: B.mid, flexShrink: 0 }}>→</div>
              </div>

              {totalItems > 0 && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontSize: 9, color: B.mid }}>Equipamiento: {listos}/{totalItems} ítems</div>
                    <div style={{ fontSize: 9, color: "#CAA150", fontWeight: 700 }}>{pct}%</div>
                  </div>
                  <div style={{ height: 4, background: B.coolGray, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: "#CAA150", borderRadius: 2 }} />
                  </div>
                </>
              )}

              {needsAlert && (
                <div style={{ marginTop: 10, padding: "6px 10px", background: B.orangePale, borderRadius: 8, fontSize: 9, color: B.orange, fontWeight: 700 }}>
                  ⚠️ Es momento de activar compras
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
