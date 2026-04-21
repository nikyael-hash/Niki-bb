import { useState, useEffect } from "react";
import { B } from "../design/tokens.js";
import { BLOG_POSTS } from "../data/mockData.js";

function useCountdown(dateStr) {
  const [t, setT] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = new Date(dateStr) - new Date();
      if (diff <= 0) { setT({ expired: true }); return; }
      setT({
        dias: Math.floor(diff / 864e5),
        horas: Math.floor((diff % 864e5) / 36e5),
        min: Math.floor((diff % 36e5) / 6e4),
        seg: Math.floor((diff % 6e4) / 1e3),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [dateStr]);
  return t;
}

export default function StayTuned({ user, onNavigate }) {
  const [expandedId, setExpandedId] = useState(null);
  const countdown = useCountdown("2026-05-17T20:00:00");

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <div style={{
        background: B.white, padding: "13px 18px",
        borderBottom: `1px solid ${B.pinkLight}`,
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 10px rgba(221,164,174,0.08)",
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: B.text }}>✨ Stay Tuned</div>
        <div style={{ fontSize: 8, color: B.mid }}>Novedades y eventos de Niki BB</div>
      </div>

      <div style={{ padding: "14px 14px 100px" }}>
        {BLOG_POSTS.map((p, i) => {
          const isExpanded = expandedId === p.id;
          return (
            <div
              key={p.id}
              style={{
                background: B.white, borderRadius: 14, marginBottom: 10,
                border: `1px solid ${B.pinkLight}`, overflow: "hidden",
                animation: `fadeUp 0.25s ease ${i * 0.05}s both`,
                boxShadow: "0 2px 8px rgba(221,164,174,0.06)",
              }}
            >
              {/* Header de la card */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
                style={{
                  width: "100%", padding: "16px 16px 14px", display: "flex",
                  gap: 12, alignItems: "flex-start", background: "transparent",
                  borderBottom: isExpanded ? `1px solid ${B.pinkLight}` : "none",
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  background: `${p.color}15`, border: `1px solid ${p.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>
                  {p.emoji}
                </div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{
                      padding: "2px 7px", borderRadius: 10, fontSize: 7, fontWeight: 700,
                      background: `${p.color}15`, color: p.color,
                    }}>{p.tag}</span>
                    <span style={{ fontSize: 7, color: B.mid }}>{p.fecha}</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: B.text, marginBottom: 2 }}>{p.titulo}</div>
                  <div style={{ fontSize: 10, color: B.mid }}>{p.sub}</div>
                </div>
                <div style={{ fontSize: 10, color: B.mid, flexShrink: 0 }}>{isExpanded ? "▲" : "▼"}</div>
              </button>

              {/* Contenido expandido */}
              {isExpanded && (
                <div style={{ padding: "14px 16px" }}>
                  {p.countdown && !countdown.expired && countdown.dias !== undefined && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 8, color: B.mid, marginBottom: 8 }}>FALTAN</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                        {[
                          { val: countdown.dias, label: "días" },
                          { val: countdown.horas, label: "horas" },
                          { val: countdown.min, label: "min" },
                          { val: countdown.seg, label: "seg" },
                        ].map((c, ci) => (
                          <div key={ci} style={{ textAlign: "center", padding: "8px 4px", background: B.pinkBg, borderRadius: 8, border: `1px solid ${B.pinkLight}` }}>
                            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: B.pinkDeep, lineHeight: 1 }}>
                              {String(c.val).padStart(2, "0")}
                            </div>
                            <div style={{ fontSize: 7, color: B.mid, marginTop: 2 }}>{c.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" style={{
                      display: "block", textAlign: "center", padding: "10px",
                      borderRadius: 10, fontSize: 11, fontWeight: 700, color: B.white,
                      background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)`,
                      textDecoration: "none",
                    }}>
                      {p.cta} →
                    </a>
                  ) : (
                    <button
                      onClick={() => p.id === 2 && onNavigate("lab")}
                      style={{
                        width: "100%", padding: "10px", borderRadius: 10,
                        fontSize: 11, fontWeight: 700, color: B.white,
                        background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)`,
                      }}
                    >
                      {p.cta} →
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
