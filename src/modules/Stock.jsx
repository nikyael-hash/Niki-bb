import { useState } from "react";
import { B } from "../design/tokens.js";
import { STOCK_INIT } from "../data/mockData.js";
import ModuleHeader from "../components/ModuleHeader.jsx";

const ESTADO_CONFIG = {
  disponible: { label: "Disponible", color: B.green,  bg: B.greenPale,  icon: "✅" },
  en_uso:     { label: "En uso",     color: B.teal,   bg: B.tealPale,   icon: "📦" },
  dañado:     { label: "Dañado",     color: B.red,    bg: B.redPale,    icon: "⚠️" },
};

export default function Stock({ user, onBack }) {
  const [items, setItems] = useState(STOCK_INIT);
  const [filter, setFilter] = useState("all");

  const filtrados = filter === "all" ? items : items.filter(i => i.estado === filter);

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader emoji="📦" title="Stock Depósito" subtitle="Inventario para obras" onBack={onBack} />

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

        {/* Filtros */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
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
          const conf = ESTADO_CONFIG[item.estado];
          return (
            <div key={item.id} style={{
              background: B.white, borderRadius: 12, marginBottom: 8,
              border: `1px solid ${B.pinkLight}`, padding: "12px 14px",
              display: "flex", gap: 10, alignItems: "center",
              animation: `fadeUp .2s ease ${i * .03}s both`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: conf.bg, border: `1px solid ${conf.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>
                {conf.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: B.text, marginBottom: 2 }}>{item.nombre}</div>
                {item.obs && <div style={{ fontSize: 9, color: B.mid }}>{item.obs}</div>}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: conf.color, lineHeight: 1 }}>{item.cantidad}</div>
                <div style={{ fontSize: 7, color: B.mid }}>unid.</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
