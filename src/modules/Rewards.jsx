import { useState } from "react";
import { B } from "../design/tokens.js";
import { REWARDS_PERSONAS, DESTELLOS_REWARDS } from "../data/mockData.js";
import ModuleHeader from "../components/ModuleHeader.jsx";
import Destello from "../components/Destello.jsx";
import PatternBg from "../components/PatternBg.jsx";

const fmt = n => `$${Number(n).toLocaleString("es-AR")}`;

export default function Rewards({ user, onBack }) {
  const [tab, setTab] = useState("ranking");

  const sorted = [...REWARDS_PERSONAS].sort((a, b) => b.destellos - a.destellos);
  const myData = sorted.find(r => r.nombre === user.nombre);

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <div style={{
        background: B.white, padding: "0 18px",
        borderBottom: `1px solid ${B.pinkLight}`,
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 10px rgba(221,164,174,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 0 10px" }}>
          <button onClick={onBack} style={{ background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "6px 13px", fontSize: 10, color: B.mid, fontWeight: 700 }}>← OS</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: B.text }}>✨ Niki Rewards</div>
            <div style={{ fontSize: 8, color: B.mid }}>1 Destello = $1.000</div>
          </div>
        </div>
        <div style={{ display: "flex", borderTop: `1px solid ${B.coolGray}` }}>
          {[{ id: "ranking", l: "Ranking" }, { id: "catalogo", l: "Catálogo" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "8px 0 10px", background: "transparent",
              borderBottom: `2.5px solid ${tab === t.id ? "#CAA150" : "transparent"}`,
              color: tab === t.id ? "#CAA150" : B.mid,
              fontSize: 9, fontWeight: tab === t.id ? 700 : 400,
              letterSpacing: .5, transition: "all .2s",
            }}>
              {t.l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {tab === "ranking" && (
        <div style={{ padding: "14px 14px 40px" }}>
          {/* Hero */}
          <div style={{
            background: "linear-gradient(135deg, #1a1008, #2A1A06)",
            borderRadius: 14, padding: 18, marginBottom: 14,
            position: "relative", overflow: "hidden",
            border: "1px solid rgba(202,161,80,0.2)",
          }}>
            <PatternBg opacity={0.08} id="rew-p" />
            <div style={{ position: "relative", display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginBottom: 4 }}>TUS DESTELLOS</div>
                {myData ? (
                  <>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 36, color: "#CAA150", fontWeight: 300, lineHeight: 1 }}>{myData.destellos}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>+{myData.mes} este mes</div>
                  </>
                ) : (
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 32, color: "#CAA150", fontWeight: 300, lineHeight: 1 }}>—</div>
                )}
              </div>
              <Destello size={40} color="#CAA150" style={{ opacity: .6, animation: "destelloSpin 8s linear infinite" }} />
            </div>
          </div>

          <div style={{ fontSize: 9, letterSpacing: 3, color: B.mid, fontWeight: 700, marginBottom: 10 }}>RANKING DE DESTELLOS ✨</div>

          {sorted.map((r, i) => {
            const next = DESTELLOS_REWARDS.find(c => c.d > r.destellos);
            const pct = next ? Math.min((r.destellos / next.d) * 100, 100) : 100;
            return (
              <div key={r.id} style={{
                background: B.white, borderRadius: 12, marginBottom: 8,
                border: `1px solid ${B.pinkLight}`, padding: "13px 14px",
                animation: `fadeUp .25s ease ${i * .05}s both`,
                boxShadow: "0 2px 6px rgba(221,164,174,0.06)",
              }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "#CAA15015", border: "1.5px solid #CAA15040",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, flexShrink: 0,
                  }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "✨"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: B.text, marginBottom: 2 }}>{r.nombre}</div>
                    <div style={{ fontSize: 9, color: B.mid }}>📍 {r.local} · +{r.mes} este mes</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "#CAA150", fontWeight: 300, lineHeight: 1 }}>{r.destellos}</div>
                    <div style={{ fontSize: 7, color: B.mid }}>destellos</div>
                  </div>
                </div>
                {next && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <div style={{ fontSize: 8, color: B.mid }}>Próximo: {next.emoji} {next.premio.substring(0, 28)}...</div>
                      <div style={{ fontSize: 8, color: "#CAA150", fontWeight: 700 }}>{r.destellos}/{next.d}</div>
                    </div>
                    <div style={{ height: 5, background: B.coolGray, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #CAA15080, #CAA150)", borderRadius: 2 }} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "catalogo" && (
        <div style={{ padding: "14px 14px 40px" }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: B.mid, fontWeight: 700, marginBottom: 12 }}>CATÁLOGO DE PREMIOS ✨</div>
          {DESTELLOS_REWARDS.map((item, i) => {
            const myDestellos = myData?.destellos || 0;
            const canRedeem = myDestellos >= item.d;
            return (
              <div key={i} style={{
                background: B.white, borderRadius: 12, marginBottom: 8,
                border: `1px solid ${canRedeem ? "#CAA15040" : B.pinkLight}`,
                padding: "12px 14px", display: "flex", gap: 12, alignItems: "center",
                animation: `fadeUp .2s ease ${i * .03}s both`,
                opacity: canRedeem ? 1 : 0.7,
              }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{item.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: B.text, marginBottom: 2 }}>{item.premio}</div>
                  <div style={{ fontSize: 9, color: B.mid }}>{fmt(item.p)} aprox.</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 16, color: "#CAA150", fontWeight: 300 }}>{item.d.toLocaleString()}</div>
                  <div style={{ fontSize: 7, color: B.mid }}>destellos</div>
                  {canRedeem && (
                    <div style={{ fontSize: 7, color: B.green, fontWeight: 700, marginTop: 2 }}>¡Podés canjear!</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
