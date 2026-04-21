import { useState, useRef } from "react";
import { B } from "../design/tokens.js";
import { PRECIOS_NAILART } from "../data/mockData.js";
import ModuleHeader from "../components/ModuleHeader.jsx";
import Destello from "../components/Destello.jsx";

const fmt = n => n === 0 ? "INCLUIDO" : `$${Number(n).toLocaleString("es-AR")}`;

export default function Cotizador({ user, onBack }) {
  const [tipoLocal, setTipoLocal] = useState("estandar");
  const [pago, setPago] = useState("efectivo");
  const [imagen, setImagen] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setImagen(ev.target.result); setStep(3); };
    reader.readAsDataURL(file);
  };

  const simularAnalisis = () => {
    setLoading(true);
    setResultado(null);
    setTimeout(() => {
      const niveles = ["incluido", "simple", "complejo"];
      const nivel = niveles[Math.floor(Math.random() * niveles.length)];
      const precioData = PRECIOS_NAILART[nivel];
      const precio = precioData[tipoLocal][pago];
      setResultado({
        nivel,
        precio,
        diseno: nivel === "incluido" ? "Diseño básico con strass y francesita" : nivel === "simple" ? "Baby boomer esponja en 1 uña por mano" : "Baby boomer en todas las uñas con aura",
        justificacion: nivel === "incluido" ? "El diseño solicitado está dentro de los servicios incluidos sin costo adicional." : nivel === "simple" ? "Se detecta un diseño de complejidad simple aplicado en una uña por mano." : "El diseño cubre todas las uñas con técnica compleja de baby boomer o aura.",
        elementos: precioData.items.slice(0, 2),
        tip: "Para mejores resultados, asegurate de preparar la cutícula antes del servicio.",
      });
      setLoading(false);
    }, 2200);
  };

  const reset = () => { setImagen(null); setResultado(null); setStep(1); setLoading(false); };

  const precioData = PRECIOS_NAILART[resultado?.nivel];

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader emoji="💅" title="Cotizador IA" subtitle="Nail art → precio automático" onBack={onBack} />

      <div style={{ padding: "14px 14px 60px" }}>

        {!resultado ? (
          <>
            {/* Paso 1 — Configuración */}
            <div style={{ background: B.white, borderRadius: 14, padding: 16, marginBottom: 12, border: `1px solid ${B.pinkLight}` }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 12 }}>PASO 1 — TIPO DE LOCAL</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[{ id: "estandar", label: "Estándar", desc: "La mayoría de locales" }, { id: "premium", label: "Premium", desc: "Puerto Madero, Recoleta" }].map(t => (
                  <button key={t.id} onClick={() => setTipoLocal(t.id)} style={{
                    padding: "12px 8px", borderRadius: 10, border: `2px solid ${tipoLocal === t.id ? B.pinkDeep : B.glacier}`,
                    background: tipoLocal === t.id ? `${B.pinkDeep}10` : B.white,
                    transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: tipoLocal === t.id ? B.pinkDeep : B.text }}>{t.label}</div>
                    <div style={{ fontSize: 9, color: B.mid, marginTop: 2 }}>{t.desc}</div>
                  </button>
                ))}
              </div>

              <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 10 }}>FORMA DE PAGO</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[{ id: "efectivo", label: "Efectivo / Débito", icon: "💵" }, { id: "tarjeta", label: "Crédito", icon: "💳" }].map(t => (
                  <button key={t.id} onClick={() => setPago(t.id)} style={{
                    padding: "12px 8px", borderRadius: 10, border: `2px solid ${pago === t.id ? B.pinkDeep : B.glacier}`,
                    background: pago === t.id ? `${B.pinkDeep}10` : B.white,
                    transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: 16, marginBottom: 4 }}>{t.icon}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: pago === t.id ? B.pinkDeep : B.text }}>{t.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Referencia de precios */}
            <div style={{ background: B.white, borderRadius: 14, padding: 16, marginBottom: 12, border: `1px solid ${B.pinkLight}` }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 10 }}>TABLA DE PRECIOS</div>
              {Object.entries(PRECIOS_NAILART).map(([key, data]) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "8px 10px", background: `${data.color}08`, borderRadius: 8, border: `1px solid ${data.color}25` }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: data.color }}>{data.label}</div>
                    <div style={{ fontSize: 8, color: B.mid }}>{data.desc}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 14, color: data.color, fontWeight: 300 }}>
                      {fmt(data[tipoLocal][pago])}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paso 2 — Foto */}
            <div style={{ background: B.white, borderRadius: 14, padding: 16, border: `1px solid ${B.pinkLight}` }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 12 }}>PASO 2 — FOTO DEL DISEÑO</div>

              {imagen ? (
                <div>
                  <img src={imagen} alt="diseño" style={{ width: "100%", borderRadius: 10, marginBottom: 12, maxHeight: 220, objectFit: "cover" }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setImagen(null); setStep(2); }} style={{
                      flex: 1, padding: "10px", borderRadius: 10, fontSize: 10,
                      border: `1px solid ${B.glacier}`, background: B.coolGray, color: B.mid, fontWeight: 700,
                    }}>
                      Cambiar foto
                    </button>
                    <button onClick={simularAnalisis} style={{
                      flex: 2, padding: "10px", borderRadius: 10, fontSize: 11, fontWeight: 700,
                      color: B.white, background: `linear-gradient(135deg, ${B.pink}, ${B.pinkDeep})`,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}>
                      <Destello size={11} color={B.white} />
                      Analizar con IA
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
                  <button onClick={() => fileRef.current?.click()} style={{
                    width: "100%", padding: "40px 20px", borderRadius: 12, fontSize: 12,
                    border: `2px dashed ${B.pinkLight}`, background: B.pinkBg, color: B.mid,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  }}>
                    <div style={{ fontSize: 32 }}>📷</div>
                    <div style={{ fontWeight: 700, color: B.text }}>Subí una foto del diseño</div>
                    <div style={{ fontSize: 10 }}>Desde cámara o galería</div>
                  </button>
                  <div style={{ marginTop: 10, padding: 12, background: B.goldPale, borderRadius: 10, fontSize: 9, color: B.mid, textAlign: "center" }}>
                    <strong style={{ color: "#CAA150" }}>Demo:</strong> Subí cualquier imagen y la IA simulará el análisis
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Resultado */
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{
              background: B.white, borderRadius: 16, padding: 20, marginBottom: 12,
              border: `2px solid ${precioData.color}40`,
              boxShadow: `0 4px 20px ${precioData.color}15`,
            }}>
              {/* Nivel badge */}
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{
                  display: "inline-block", padding: "6px 20px", borderRadius: 20,
                  background: `${precioData.color}15`, border: `1.5px solid ${precioData.color}`,
                  fontSize: 10, fontWeight: 700, color: precioData.color, marginBottom: 10,
                }}>
                  {precioData.label}
                </div>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 42, color: precioData.color, fontWeight: 300, lineHeight: 1 }}>
                  {fmt(resultado.precio)}
                </div>
                <div style={{ fontSize: 10, color: B.mid, marginTop: 4 }}>
                  {tipoLocal === "premium" ? "Local Premium" : "Local Estándar"} · {pago === "efectivo" ? "Efectivo/Débito" : "Crédito"}
                </div>
              </div>

              {/* Diseño detectado */}
              <div style={{ padding: "12px", background: B.coolGray, borderRadius: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 4 }}>DISEÑO DETECTADO</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: B.text, marginBottom: 6 }}>{resultado.diseno}</div>
                <div style={{ fontSize: 11, color: B.mid, lineHeight: 1.6 }}>{resultado.justificacion}</div>
              </div>

              {/* Elementos */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 6 }}>ELEMENTOS DETECTADOS</div>
                {resultado.elementos.map((el, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Destello size={7} color={precioData.color} />
                    <span style={{ fontSize: 10, color: B.text }}>{el}</span>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div style={{ padding: "10px 12px", background: B.goldPale, borderRadius: 10, border: `1px solid #CAA15030` }}>
                <div style={{ fontSize: 8, letterSpacing: 2, color: "#CAA150", fontWeight: 700, marginBottom: 3 }}>✦ TIP PROFESIONAL</div>
                <div style={{ fontSize: 10, color: B.text, lineHeight: 1.6 }}>{resultado.tip}</div>
              </div>
            </div>

            <button onClick={reset} style={{
              width: "100%", padding: 14, borderRadius: 12, fontSize: 12, fontWeight: 700,
              color: B.mid, background: B.white, border: `1px solid ${B.pinkLight}`,
            }}>
              Nueva cotización
            </button>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(253,245,246,0.92)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            zIndex: 200,
          }}>
            <Destello size={40} color={B.pinkDeep} style={{ animation: "destelloSpin 1s linear infinite", marginBottom: 16 }} />
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: B.text, fontWeight: 300, marginBottom: 6 }}>
              Analizando diseño...
            </div>
            <div style={{ fontSize: 11, color: B.mid }}>La IA está evaluando el nail art</div>
          </div>
        )}
      </div>
    </div>
  );
}
