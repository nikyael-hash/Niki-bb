import { useState } from "react";
import { B } from "../design/tokens.js";
import { PLAN_CARRERA_INIT } from "../data/mockData.js";
import ModuleHeader from "../components/ModuleHeader.jsx";

const ESCALA = [
  { val: 1, label: "Crítico",      color: B.red    },
  { val: 2, label: "A mejorar",    color: B.orange  },
  { val: 3, label: "En desarrollo",color: "#CAA150" },
  { val: 4, label: "Muy bueno",    color: B.teal    },
  { val: 5, label: "Excepcional",  color: B.green   },
];
const NIVEL_COLOR = { Master: "#CAA150", Senior: B.teal, Junior: B.pink };

export default function PlanCarrera({ user, onBack }) {
  const [planes, setPlanes] = useState(PLAN_CARRERA_INIT);
  const [selected, setSelected] = useState(null);

  const plan = planes.find(p => p.id === selected);

  if (selected && plan) {
    const ultima = plan.reuniones[plan.reuniones.length - 1];
    const escalaConf = ESCALA.find(e => e.val === ultima.escala);
    return (
      <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
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

          {/* Última reunión */}
          {plan.reuniones.map((r, i) => (
            <div key={i} style={{ background: B.white, borderRadius: 14, padding: 16, marginBottom: 12, border: `1px solid ${B.pinkLight}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: B.text }}>Reunión 1:1</div>
                  <div style={{ fontSize: 9, color: B.mid }}>{r.fecha} · por {r.quien}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: escalaConf?.color, lineHeight: 1 }}>{r.escala}/5</div>
                  <div style={{ fontSize: 7, color: escalaConf?.color, fontWeight: 700 }}>{escalaConf?.label}</div>
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
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader emoji="🌱" title="Plan de Carrera" subtitle="1:1 y crecimiento del equipo" onBack={onBack} />

      <div style={{ padding: "14px 14px 60px" }}>
        {planes.map((p, i) => {
          const ultima = p.reuniones[p.reuniones.length - 1];
          const escalaConf = ESCALA.find(e => e.val === ultima.escala);
          return (
            <button key={p.id} onClick={() => setSelected(p.id)} className="card" style={{
              width: "100%", background: B.white, borderRadius: 14, marginBottom: 10,
              border: `1px solid ${B.pinkLight}`, padding: "16px 14px", textAlign: "left",
              animation: `fadeUp .2s ease ${i * .05}s both`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${NIVEL_COLOR[p.nivel] || B.pink}50, ${NIVEL_COLOR[p.nivel] || B.pink})` }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: `${NIVEL_COLOR[p.nivel] || B.pink}15`, border: `2px solid ${NIVEL_COLOR[p.nivel] || B.pink}40`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>
                  {p.nivel === "Master" ? "⭐" : p.nivel === "Senior" ? "💅" : "🌸"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: B.text, marginBottom: 2 }}>{p.manicura}</div>
                  <div style={{ fontSize: 9, color: B.mid }}>{p.local}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 18, color: NIVEL_COLOR[p.nivel] || "#CAA150", lineHeight: 1 }}>{p.skill}%</div>
                  <div style={{ fontSize: 7, color: B.mid }}>skill</div>
                </div>
              </div>
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
          );
        })}
      </div>
    </div>
  );
}
