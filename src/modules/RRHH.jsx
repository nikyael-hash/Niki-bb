import { useState } from "react";
import { B } from "../design/tokens.js";
import { MANICURAS_DATA } from "../data/mockData.js";
import ModuleHeader from "../components/ModuleHeader.jsx";

const LOCALES = [...new Set(MANICURAS_DATA.map(m => m.local))];
const NIVEL_COLOR = { Master: "#CAA150", Senior: B.teal, Junior: B.pink };
const NIVEL_BG    = { Master: B.goldPale, Senior: B.tealPale, Junior: B.pinkLight };

export default function RRHH({ user, onBack }) {
  const [localFilter, setLocalFilter] = useState("all");
  const [nivelFilter, setNivelFilter] = useState("all");

  const filtradas = MANICURAS_DATA.filter(m => {
    if (localFilter !== "all" && m.local !== localFilter) return false;
    if (nivelFilter !== "all" && m.nivel !== nivelFilter) return false;
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader emoji="👥" title="RRHH & Turnos" subtitle="Equipo Niki Beauty Bar" onBack={onBack} />

      <div style={{ padding: "12px 14px 60px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
          {[
            { label: "Master", value: MANICURAS_DATA.filter(m => m.nivel === "Master").length, color: "#CAA150" },
            { label: "Senior", value: MANICURAS_DATA.filter(m => m.nivel === "Senior").length, color: B.teal    },
            { label: "Junior", value: MANICURAS_DATA.filter(m => m.nivel === "Junior").length, color: B.pink    },
          ].map((s, i) => (
            <div key={i} style={{ background: B.white, borderRadius: 12, padding: "12px 10px", textAlign: "center", border: `1px solid ${B.pinkLight}` }}>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 26, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 8, color: B.mid, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: 6, marginBottom: 8, overflowX: "auto", scrollbarWidth: "none" }}>
          <button onClick={() => setLocalFilter("all")} style={{
            padding: "4px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700, flexShrink: 0,
            background: localFilter === "all" ? B.text : B.white, color: localFilter === "all" ? B.white : B.mid,
            border: `1px solid ${localFilter === "all" ? B.text : B.glacier}`,
          }}>Todos</button>
          {LOCALES.map(l => (
            <button key={l} onClick={() => setLocalFilter(l)} style={{
              padding: "4px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700, flexShrink: 0,
              background: localFilter === l ? B.pinkDeep : B.white,
              color: localFilter === l ? B.white : B.mid,
              border: `1px solid ${localFilter === l ? B.pinkDeep : B.glacier}`,
            }}>{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", scrollbarWidth: "none" }}>
          {["all", "Master", "Senior", "Junior"].map(n => (
            <button key={n} onClick={() => setNivelFilter(n)} style={{
              padding: "4px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700, flexShrink: 0,
              background: nivelFilter === n ? (n === "all" ? B.text : NIVEL_COLOR[n]) : B.white,
              color: nivelFilter === n ? B.white : B.mid,
              border: `1px solid ${nivelFilter === n ? (n === "all" ? B.text : NIVEL_COLOR[n]) : B.glacier}`,
            }}>{n === "all" ? "Todos niveles" : n}</button>
          ))}
        </div>

        {/* Lista */}
        {filtradas.map((m, i) => (
          <div key={m.id} style={{
            background: B.white, borderRadius: 12, marginBottom: 8,
            border: `1px solid ${B.pinkLight}`, padding: "13px 14px",
            animation: `fadeUp .2s ease ${i * .04}s both`,
            display: "flex", gap: 10, alignItems: "center",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
              background: `${NIVEL_COLOR[m.nivel]}15`, border: `2px solid ${NIVEL_COLOR[m.nivel]}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>
              {m.nivel === "Master" ? "⭐" : m.nivel === "Senior" ? "💅" : "🌸"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: B.text, marginBottom: 3 }}>{m.nombre}</div>
              <div style={{ fontSize: 9, color: B.mid, marginBottom: 4 }}>📍 {m.local}</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{
                  padding: "2px 8px", borderRadius: 20, fontSize: 7, fontWeight: 700,
                  background: NIVEL_BG[m.nivel], color: NIVEL_COLOR[m.nivel],
                }}>
                  {m.nivel}
                </span>
                <span style={{ fontSize: 8, color: B.mid }}>{m.skill}% skill</span>
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 20, color: NIVEL_COLOR[m.nivel], lineHeight: 1 }}>{m.skill}%</div>
              <div style={{ fontSize: 7, color: B.mid }}>dominio</div>
            </div>
          </div>
        ))}

        {filtradas.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: B.mid, fontSize: 12 }}>
            No hay manicuras con ese filtro
          </div>
        )}
      </div>
    </div>
  );
}
