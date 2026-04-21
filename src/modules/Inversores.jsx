import { useState } from "react";
import { B } from "../design/tokens.js";
import { INVERSORES_INIT } from "../data/mockData.js";
import ModuleHeader from "../components/ModuleHeader.jsx";
import Destello from "../components/Destello.jsx";

const fmt = n => `$${Number(n).toLocaleString("es-AR")}`;

const ESTADO_CONFIG = {
  pendiente:    { label: "Pendiente",    color: B.mid,   bg: B.coolGray,      icon: "⏳" },
  coordinando:  { label: "Coordinando", color: B.orange, bg: B.orangePale,    icon: "📅" },
  pagado:       { label: "Pagado",       color: B.green,  bg: B.greenPale,    icon: "✅" },
};

export default function Inversores({ user, onBack }) {
  const [inversores, setInversores] = useState(INVERSORES_INIT);
  const [selected, setSelected] = useState(null);
  const isCM = user.perfil === "casa_matriz";

  const inv = inversores.find(i => i.id === selected);
  const pendienteTotal = inversores.reduce((sum, inv) => {
    const last = inv.informes[0];
    return last && last.estado_dividendo === "pendiente" ? sum + last.dividendo : sum;
  }, 0);

  const cambiarEstado = (invId, mesIdx, estado) => {
    setInversores(prev => prev.map(i => {
      if (i.id !== invId) return i;
      return {
        ...i,
        informes: i.informes.map((inf, idx) => idx !== mesIdx ? inf : { ...inf, estado_dividendo: estado }),
      };
    }));
  };

  if (selected && inv) {
    const lastInforme = inv.informes[0];
    return (
      <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
        <div style={{
          background: B.white, padding: "13px 18px", borderBottom: `1px solid ${B.pinkLight}`,
          position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(221,164,174,0.08)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <button onClick={() => setSelected(null)} style={{ background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "6px 13px", fontSize: 10, color: B.mid, fontWeight: 700 }}>← Inversores</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: B.text }}>{inv.nombre}</div>
            <div style={{ fontSize: 8, color: B.mid }}>{inv.local} · {inv.porcentaje}% participación</div>
          </div>
        </div>

        <div style={{ padding: "14px 14px 60px" }}>
          {/* Resumen */}
          <div style={{
            background: `linear-gradient(135deg, ${B.englishGreen}, #1a5a3a)`,
            borderRadius: 14, padding: 18, marginBottom: 14,
            position: "relative", overflow: "hidden", border: "1px solid rgba(46,125,90,0.2)",
          }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", letterSpacing: 2, marginBottom: 4 }}>PRÓXIMO RETIRO</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 28, color: "#5EE8A0", fontWeight: 300, lineHeight: 1, marginBottom: 4 }}>
              {fmt(inv.proximo_retiro.monto_estimado)}
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>
              {inv.proximo_retiro.fecha} · {inv.proximo_retiro.metodo === "transferencia" ? "🏦 Transferencia" : "🏢 Presencial"}
            </div>
          </div>

          {/* Informes */}
          {inv.informes.map((inf, i) => {
            const estadoConf = ESTADO_CONFIG[inf.estado_dividendo];
            return (
              <div key={i} style={{ background: B.white, borderRadius: 14, padding: 16, marginBottom: 10, border: `1px solid ${B.pinkLight}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: B.text }}>{inf.mes}</div>
                    <div style={{ fontSize: 8, color: B.mid }}>Enviado: {inf.fecha_envio}</div>
                  </div>
                  <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700, background: estadoConf.bg, color: estadoConf.color }}>
                    {estadoConf.icon} {estadoConf.label}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  {[
                    { label: "Facturación", value: fmt(inf.facturacion), color: B.green },
                    { label: "Gastos", value: fmt(inf.gastos), color: B.red },
                    { label: "Resultado neto", value: fmt(inf.resultado_neto), color: B.teal },
                    { label: "Tu dividendo", value: fmt(inf.dividendo), color: B.englishGreen },
                  ].map((s, si) => (
                    <div key={si} style={{ background: B.coolGray, borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 8, color: B.mid, marginBottom: 3 }}>{s.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
                  {[
                    { label: "Ocupación", value: `${inf.ocupacion}%` },
                    { label: "Ticket prom.", value: fmt(inf.ticket_promedio) },
                    { label: "Servicios", value: inf.servicios },
                  ].map((s, si) => (
                    <div key={si} style={{ textAlign: "center", padding: "8px 6px", background: B.pinkBg, borderRadius: 8, border: `1px solid ${B.pinkLight}` }}>
                      <div style={{ fontFamily: "Georgia,serif", fontSize: 14, color: B.pinkDeep, lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: 7, color: B.mid, marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {inf.observaciones && (
                  <div style={{ padding: "8px 12px", background: B.coolGray, borderRadius: 8, fontSize: 10, color: B.mid, marginBottom: 10 }}>
                    {inf.observaciones}
                  </div>
                )}

                {isCM && inf.estado_dividendo !== "pagado" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    {inf.estado_dividendo === "pendiente" && (
                      <button onClick={() => cambiarEstado(inv.id, i, "coordinando")} style={{
                        flex: 1, padding: "9px", borderRadius: 10, fontSize: 10, fontWeight: 700,
                        color: B.orange, background: B.orangePale, border: `1px solid ${B.orange}30`,
                      }}>
                        📅 Coordinar retiro
                      </button>
                    )}
                    <button onClick={() => cambiarEstado(inv.id, i, "pagado")} style={{
                      flex: 1, padding: "9px", borderRadius: 10, fontSize: 10, fontWeight: 700,
                      color: B.white, background: `linear-gradient(135deg, ${B.green}, ${B.green}cc)`,
                    }}>
                      ✅ Marcar pagado
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader emoji="💰" title="Inversores" subtitle="Informes y dividendos" onBack={onBack} />

      <div style={{ padding: "14px 14px 60px" }}>
        {pendienteTotal > 0 && (
          <div style={{ background: B.orangePale, borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: `1px solid ${B.orange}30`, display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ fontSize: 20 }}>⚠️</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: B.orange }}>Dividendos pendientes</div>
              <div style={{ fontSize: 12, color: B.text, fontWeight: 700 }}>{fmt(pendienteTotal)} a coordinar</div>
            </div>
          </div>
        )}

        {inversores.map((inv, i) => {
          const last = inv.informes[0];
          const estadoConf = last ? ESTADO_CONFIG[last.estado_dividendo] : null;
          return (
            <button key={inv.id} onClick={() => setSelected(inv.id)} className="card" style={{
              width: "100%", background: B.white, borderRadius: 14, marginBottom: 10,
              border: `1px solid ${B.pinkLight}`, padding: "16px 14px", textAlign: "left",
              animation: `fadeUp .2s ease ${i * .05}s both`,
              boxShadow: "0 2px 8px rgba(221,164,174,0.06)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${B.englishGreen}50, ${B.englishGreen})` }} />
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                  background: `${B.englishGreen}15`, border: `2px solid ${B.englishGreen}40`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>💰</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: B.text, marginBottom: 2 }}>{inv.nombre}</div>
                  <div style={{ fontSize: 9, color: B.mid }}>{inv.local} · {inv.porcentaje}%</div>
                </div>
                {estadoConf && (
                  <span style={{ padding: "3px 8px", borderRadius: 20, fontSize: 7, fontWeight: 700, background: estadoConf.bg, color: estadoConf.color, flexShrink: 0 }}>
                    {estadoConf.icon} {estadoConf.label}
                  </span>
                )}
              </div>
              {last && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  <div style={{ background: B.coolGray, borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 7, color: B.mid }}>Último dividendo</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: B.englishGreen }}>{fmt(last.dividendo)}</div>
                  </div>
                  <div style={{ background: B.coolGray, borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 7, color: B.mid }}>Próximo retiro</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: B.text }}>{inv.proximo_retiro.fecha}</div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
