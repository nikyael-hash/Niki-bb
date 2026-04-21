import { useState } from "react";
import { B } from "../design/tokens.js";
import { PROYECTOS_INIT } from "../data/mockData.js";
import ModuleHeader from "../components/ModuleHeader.jsx";

const PRIORIDAD_CONFIG = {
  alta:  { label: "Alta",  color: B.red,    bg: B.redPale,   icon: "🔴" },
  media: { label: "Media", color: B.orange, bg: B.orangePale,icon: "🟡" },
  baja:  { label: "Baja",  color: B.green,  bg: B.greenPale, icon: "🟢" },
};

export default function Proyectos({ user, onBack }) {
  const [proyectos, setProyectos] = useState(PROYECTOS_INIT);
  const [selected, setSelected] = useState(null);

  const toggleTarea = (proyId, tareaIdx) => {
    setProyectos(prev => prev.map(p => {
      if (p.id !== proyId) return p;
      return { ...p, tareas: p.tareas.map((t, ti) => ti !== tareaIdx ? t : { ...t, done: !t.done }) };
    }));
  };

  const proy = proyectos.find(p => p.id === selected);

  if (selected && proy) {
    const done = proy.tareas.filter(t => t.done).length;
    const total = proy.tareas.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const priConf = PRIORIDAD_CONFIG[proy.prioridad];

    return (
      <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
        <div style={{
          background: B.white, padding: "13px 18px", borderBottom: `1px solid ${B.pinkLight}`,
          position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(221,164,174,0.08)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <button onClick={() => setSelected(null)} style={{ background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "6px 13px", fontSize: 10, color: B.mid, fontWeight: 700 }}>← Proyectos</button>
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
              <span style={{ fontSize: 10, fontWeight: 700, color: "#CAA150" }}>{pct}%</span>
            </div>
            <div style={{ height: 6, background: B.coolGray, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, #CAA15080, #CAA150)`, borderRadius: 3 }} />
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader emoji="📁" title="Proyectos CM" subtitle="Gestión de directoras" onBack={onBack} />

      <div style={{ padding: "14px 14px 60px" }}>
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
                const done = p.tareas.filter(t => t.done).length;
                const total = p.tareas.length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
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
                      <span style={{ fontSize: 9, color: "#CAA150", fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 4, background: B.coolGray, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "#CAA150", borderRadius: 2 }} />
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
