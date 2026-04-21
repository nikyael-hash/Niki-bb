import { useState, useRef } from "react";
import { B } from "../design/tokens.js";
import { PRECIOS_NAILART } from "../data/mockData.js";
import ModuleHeader from "../components/ModuleHeader.jsx";
import Destello from "../components/Destello.jsx";

const NIVEL_CONFIG = {
  incluido: {
    label: "INCLUIDO",
    desc: "Sin costo adicional de nail art",
    color: B.green,
    bg: B.greenPale,
    icon: "✓",
    emoji: "🟢",
  },
  simple: {
    label: "SIMPLE ×2",
    desc: "Se cobra un diseño por mano",
    color: B.pinkDeep,
    bg: B.pinkLight,
    icon: "×2",
    emoji: "🩷",
  },
  complejo: {
    label: "COMPLEJO",
    desc: "Se cobra diseño complejo",
    color: "#CAA150",
    bg: B.goldPale,
    icon: "★",
    emoji: "⭐",
  },
};

export default function Cotizador({ user, onBack }) {
  const [imagen, setImagen] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = ev => setImagen(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleFile = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const analizar = () => {
    if (!imagen) return;
    setLoading(true);
    setResultado(null);
    setTimeout(() => {
      const niveles = ["incluido", "simple", "complejo"];
      const nivel = niveles[Math.floor(Math.random() * niveles.length)];
      const precioData = PRECIOS_NAILART[nivel];
      setResultado({
        nivel,
        diseno: nivel === "incluido"
          ? "Strass con francesita"
          : nivel === "simple"
          ? "Baby boomer esponja (1 por mano)"
          : "Baby boomer en todas las uñas con aura",
        justificacion: nivel === "incluido"
          ? "El diseño detectado está dentro de los elementos incluidos sin costo adicional."
          : nivel === "simple"
          ? "Se detecta un diseño simple aplicado en una uña por mano."
          : "El diseño cubre todas las uñas con técnica compleja.",
        elementos: precioData.items.slice(0, 2),
        tip: "Para mejores resultados, asegurate de preparar la cutícula antes del servicio.",
      });
      setLoading(false);
    }, 2200);
  };

  const reset = () => { setImagen(null); setResultado(null); setLoading(false); };

  const nivelConf = resultado ? NIVEL_CONFIG[resultado.nivel] : null;
  const precioData = resultado ? PRECIOS_NAILART[resultado.nivel] : null;

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader emoji="💅" title="Cotizador IA" subtitle="Identificá el nivel del diseño" onBack={onBack} />

      <div style={{ padding: "14px 14px 60px" }}>

        {!resultado ? (
          <>
            {/* Referencia de niveles */}
            <div style={{ background: B.white, borderRadius: 14, padding: 16, marginBottom: 12, border: `1px solid ${B.pinkLight}` }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 12 }}>REFERENCIA DE NIVELES</div>
              {Object.entries(PRECIOS_NAILART).map(([key, data]) => {
                const conf = NIVEL_CONFIG[key];
                return (
                  <div key={key} style={{ marginBottom: 10 }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
                      padding: "8px 10px", background: conf.bg, borderRadius: 10,
                      border: `1px solid ${conf.color}25`,
                    }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                        background: conf.color, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 10, fontWeight: 700, color: B.white,
                      }}>
                        {conf.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: conf.color }}>{conf.label}</div>
                        <div style={{ fontSize: 9, color: B.mid }}>{conf.desc}</div>
                      </div>
                    </div>
                    <div style={{ paddingLeft: 8 }}>
                      {data.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 3 }}>
                          <Destello size={7} color={conf.color} style={{ flexShrink: 0, marginTop: 3 }} />
                          <span style={{ fontSize: 10, color: B.text, lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    {key !== "complejo" && <div style={{ height: 1, background: B.coolGray, margin: "10px 0 0" }} />}
                  </div>
                );
              })}
            </div>

            {/* Zona de subida */}
            <div style={{ background: B.white, borderRadius: 14, padding: 16, border: `1px solid ${B.pinkLight}` }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 12 }}>SUBÍ LA FOTO DEL DISEÑO</div>

              {imagen ? (
                <div>
                  <img src={imagen} alt="diseño" style={{ width: "100%", borderRadius: 10, marginBottom: 12, maxHeight: 240, objectFit: "cover" }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setImagen(null)} style={{
                      flex: 1, padding: "10px", borderRadius: 10, fontSize: 10, fontWeight: 700,
                      border: `1px solid ${B.glacier}`, background: B.coolGray, color: B.mid,
                    }}>
                      Cambiar foto
                    </button>
                    <button onClick={analizar} style={{
                      flex: 2, padding: "10px", borderRadius: 10, fontSize: 11, fontWeight: 700,
                      color: B.white, background: `linear-gradient(135deg, ${B.pink}, ${B.pinkDeep})`,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}>
                      <Destello size={11} color={B.white} />
                      Analizar diseño
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    style={{
                      width: "100%", padding: "36px 20px", borderRadius: 12, cursor: "pointer",
                      border: `2px dashed ${dragging ? B.pinkDeep : B.pinkLight}`,
                      background: dragging ? `${B.pinkDeep}08` : B.pinkBg,
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: 36 }}>{dragging ? "📥" : "📷"}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: dragging ? B.pinkDeep : B.text }}>
                      {dragging ? "Soltá la imagen acá" : "Subí o arrastrá la foto"}
                    </div>
                    <div style={{ fontSize: 10, color: B.mid }}>Desde cámara, galería o arrastrar</div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Resultado — solo nivel, sin precio */
          <div style={{ animation: "fadeUp 0.3s ease" }}>

            {/* Imagen */}
            {imagen && (
              <img src={imagen} alt="diseño analizado" style={{ width: "100%", borderRadius: 14, marginBottom: 12, maxHeight: 220, objectFit: "cover" }} />
            )}

            {/* Nivel principal */}
            <div style={{
              background: B.white, borderRadius: 16, padding: 20, marginBottom: 12,
              border: `2px solid ${nivelConf.color}50`,
              boxShadow: `0 4px 24px ${nivelConf.color}20`,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{nivelConf.emoji}</div>
              <div style={{ fontSize: 8, letterSpacing: 3, color: B.mid, fontWeight: 700, marginBottom: 6 }}>ESTE DISEÑO ES</div>
              <div style={{
                display: "inline-block", padding: "8px 24px", borderRadius: 24,
                background: nivelConf.bg, border: `2px solid ${nivelConf.color}`,
                fontSize: 18, fontWeight: 700, color: nivelConf.color, marginBottom: 8,
                letterSpacing: 1,
              }}>
                {nivelConf.label}
              </div>
              <div style={{ fontSize: 12, color: B.mid, marginTop: 4 }}>{nivelConf.desc}</div>
            </div>

            {/* Diseño detectado */}
            <div style={{ background: B.white, borderRadius: 14, padding: 16, marginBottom: 12, border: `1px solid ${B.pinkLight}` }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 8 }}>DISEÑO DETECTADO</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: B.text, marginBottom: 6 }}>{resultado.diseno}</div>
              <div style={{ fontSize: 11, color: B.mid, lineHeight: 1.6 }}>{resultado.justificacion}</div>

              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${B.coolGray}` }}>
                <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 8 }}>ELEMENTOS DETECTADOS</div>
                {resultado.elementos.map((el, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 5 }}>
                    <Destello size={7} color={nivelConf.color} style={{ flexShrink: 0, marginTop: 3 }} />
                    <span style={{ fontSize: 11, color: B.text, lineHeight: 1.5 }}>{el}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div style={{ padding: "12px 14px", background: B.goldPale, borderRadius: 12, border: `1px solid #CAA15030`, marginBottom: 12 }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: "#CAA150", fontWeight: 700, marginBottom: 4 }}>✦ TIP PROFESIONAL</div>
              <div style={{ fontSize: 11, color: B.text, lineHeight: 1.6 }}>{resultado.tip}</div>
            </div>

            <button onClick={reset} style={{
              width: "100%", padding: 14, borderRadius: 12, fontSize: 12, fontWeight: 700,
              color: B.mid, background: B.white, border: `1px solid ${B.pinkLight}`,
            }}>
              Analizar otro diseño
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(253,245,246,0.95)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            zIndex: 200,
          }}>
            <Destello size={44} color={B.pinkDeep} style={{ animation: "destelloSpin 1s linear infinite", marginBottom: 16 }} />
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: B.text, fontWeight: 300, marginBottom: 6 }}>
              Analizando diseño...
            </div>
            <div style={{ fontSize: 11, color: B.mid }}>La IA está identificando el nivel del nail art</div>
          </div>
        )}
      </div>
    </div>
  );
}
