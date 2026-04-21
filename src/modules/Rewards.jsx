import { useState } from "react";
import { B } from "../design/tokens.js";
import { REWARDS_PERSONAS, DESTELLOS_REWARDS } from "../data/mockData.js";
import { useAppDoc } from "../hooks/useAppDoc.js";
import ModuleHeader from "../components/ModuleHeader.jsx";
import Destello from "../components/Destello.jsx";
import PatternBg from "../components/PatternBg.jsx";

const fmt = n => `$${Number(n).toLocaleString("es-AR")}`;

export default function Rewards({ user, onBack }) {
  const [tab, setTab] = useState("ranking");
  const [editMode, setEditMode] = useState(false);
  const [personas, setPersonas] = useAppDoc("rewards", REWARDS_PERSONAS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addNombre, setAddNombre] = useState("");
  const [addLocal, setAddLocal] = useState("");
  const [addDestellos, setAddDestellos] = useState("");

  const isCM = user.perfil === "casa_matriz";

  const sorted = [...personas].sort((a, b) => b.destellos - a.destellos);
  const myData = sorted.find(r => r.nombre === user.nombre);

  const handleEditDestellos = (id, val) => {
    const n = parseInt(val, 10);
    setPersonas(prev => prev.map(p => p.id === id ? { ...p, destellos: isNaN(n) ? p.destellos : n } : p));
  };

  const handleEditMes = (id, val) => {
    const n = parseInt(val, 10);
    setPersonas(prev => prev.map(p => p.id === id ? { ...p, mes: isNaN(n) ? p.mes : n } : p));
  };

  const handleBorrar = (id) => {
    setPersonas(prev => prev.filter(p => p.id !== id));
  };

  const handleAgregar = () => {
    if (!addNombre.trim()) return;
    const d = parseInt(addDestellos, 10) || 0;
    setPersonas(prev => [...prev, {
      id: `p_${Date.now()}`,
      nombre: addNombre.trim(),
      local: addLocal.trim() || "—",
      destellos: d,
      mes: 0,
    }]);
    setAddNombre(""); setAddLocal(""); setAddDestellos("");
    setShowAddForm(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader
        emoji="✨"
        title="Niki Rewards"
        subtitle="1 Destello = $1.000"
        onBack={onBack}
        isCM={isCM}
        editMode={editMode}
        onToggleEdit={() => setEditMode(e => !e)}
      />
      <div style={{
        background: B.white, padding: "0 18px",
        borderBottom: `1px solid ${B.pinkLight}`,
        position: "sticky", top: 53, zIndex: 99,
        boxShadow: "0 2px 6px rgba(221,164,174,0.05)",
      }}>
        <div style={{ display: "flex" }}>
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
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: editMode && isCM ? 10 : 8 }}>
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
                    {editMode && isCM ? (
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 8, color: B.mid }}>📍 {r.local}</span>
                        <span style={{ fontSize: 8, color: B.mid }}>Destellos:</span>
                        <input
                          type="number"
                          value={r.destellos}
                          onChange={e => handleEditDestellos(r.id, e.target.value)}
                          style={{
                            width: 60, padding: "2px 6px", borderRadius: 6,
                            border: `1px solid ${B.pinkLight}`, fontSize: 10,
                            color: B.text, background: B.white,
                          }}
                        />
                        <span style={{ fontSize: 8, color: B.mid }}>Mes:</span>
                        <input
                          type="number"
                          value={r.mes}
                          onChange={e => handleEditMes(r.id, e.target.value)}
                          style={{
                            width: 50, padding: "2px 6px", borderRadius: 6,
                            border: `1px solid ${B.pinkLight}`, fontSize: 10,
                            color: B.text, background: B.white,
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{ fontSize: 9, color: B.mid }}>📍 {r.local} · +{r.mes} este mes</div>
                    )}
                  </div>
                  {editMode && isCM ? (
                    <button
                      onClick={() => handleBorrar(r.id)}
                      style={{
                        padding: "5px 10px", borderRadius: 8, fontSize: 13,
                        background: B.redPale, color: B.red,
                        border: `1px solid ${B.red}30`,
                        flexShrink: 0,
                      }}
                    >🗑️</button>
                  ) : (
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "#CAA150", fontWeight: 300, lineHeight: 1 }}>{r.destellos}</div>
                      <div style={{ fontSize: 7, color: B.mid }}>destellos</div>
                    </div>
                  )}
                </div>
                {!editMode && next && (
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

          {/* Botón agregar persona — solo en edit mode */}
          {editMode && isCM && (
            <div style={{ marginTop: 4 }}>
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  style={{
                    width: "100%", padding: "11px", borderRadius: 12,
                    border: `1.5px dashed ${B.pinkLight}`, background: B.white,
                    fontSize: 11, fontWeight: 700, color: B.pinkDeep,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  + Agregar persona
                </button>
              ) : (
                <div style={{
                  background: B.white, borderRadius: 12,
                  border: `1.5px solid ${B.pinkLight}`, padding: "14px",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: B.text, marginBottom: 10 }}>Nueva persona</div>
                  <input
                    value={addNombre}
                    onChange={e => setAddNombre(e.target.value)}
                    placeholder="Nombre *"
                    style={{
                      width: "100%", padding: "8px 10px", marginBottom: 7,
                      border: `1px solid ${B.pinkLight}`, borderRadius: 8,
                      fontSize: 11, color: B.text,
                    }}
                  />
                  <input
                    value={addLocal}
                    onChange={e => setAddLocal(e.target.value)}
                    placeholder="Local"
                    style={{
                      width: "100%", padding: "8px 10px", marginBottom: 7,
                      border: `1px solid ${B.pinkLight}`, borderRadius: 8,
                      fontSize: 11, color: B.text,
                    }}
                  />
                  <input
                    type="number"
                    value={addDestellos}
                    onChange={e => setAddDestellos(e.target.value)}
                    placeholder="Destellos"
                    style={{
                      width: "100%", padding: "8px 10px", marginBottom: 10,
                      border: `1px solid ${B.pinkLight}`, borderRadius: 8,
                      fontSize: 11, color: B.text,
                    }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => { setShowAddForm(false); setAddNombre(""); setAddLocal(""); setAddDestellos(""); }}
                      style={{
                        flex: 1, padding: "9px", borderRadius: 8, fontSize: 10, fontWeight: 700,
                        background: B.coolGray, color: B.mid, border: `1px solid ${B.glacier}`,
                      }}
                    >Cancelar</button>
                    <button
                      onClick={handleAgregar}
                      style={{
                        flex: 2, padding: "9px", borderRadius: 8, fontSize: 10, fontWeight: 700,
                        background: `linear-gradient(135deg, ${B.pinkDeep}, ${B.pink})`,
                        color: B.white, border: "none",
                      }}
                    >Agregar</button>
                  </div>
                </div>
              )}
            </div>
          )}
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
