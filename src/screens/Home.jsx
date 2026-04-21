import { useState, useEffect } from "react";
import { B, PERFILES, MODULES_LIST, PERMISOS } from "../design/tokens.js";
import Destello from "../components/Destello.jsx";
import PatternBg from "../components/PatternBg.jsx";
import Bubble from "../components/Bubble.jsx";

const TICKER_ITEMS = [
  { text: "EVENTO 17 DE MAYO", icon: "✨", color: B.pink },
  { text: "NIKI OS v1.0", icon: "◆", color: "#CAA150" },
  { text: "NIKI LAB ACTIVO", icon: "🧪", color: B.green },
  { text: "5 OBRAS EN MARCHA", icon: "◆", color: "#CAA150" },
  { text: "JUNIOR → MASTER", icon: "✨", color: B.pink },
  { text: "MIAMI EN CONSTRUCCIÓN", icon: "◆", color: "#CAA150" },
];

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

const QUICK_MODULES = ["comunicaciones", "rewards", "cotizador", "lab", "auditorias", "obras"];

export default function Home({ user, onOpenModule, onLogout }) {
  const perfil = PERFILES[user.perfil];
  const color = perfil.color;
  const permisos = PERMISOS[user.perfil];
  const countdown = useCountdown("2026-05-17T20:00:00");

  const quickMods = MODULES_LIST.filter(m => QUICK_MODULES.includes(m.id) && permisos.includes(m.id));

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>

      {/* Header con ticker */}
      <div style={{ background: B.white, borderBottom: `1px solid ${B.pinkLight}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(221,164,174,0.08)" }}>
        {/* Ticker */}
        <div style={{ height: 22, borderBottom: `1px solid ${B.coolGray}`, overflow: "hidden", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", height: "100%", animation: "ticker 28s linear infinite", whiteSpace: "nowrap", gap: 32 }}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} style={{ fontSize: 7, fontWeight: 700, letterSpacing: 2, color: item.color, flexShrink: 0 }}>
                {item.icon}  {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* Logo bar */}
        <div style={{ padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Destello size={11} color="#CAA150" />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, letterSpacing: 6, paddingLeft: 6, color: B.text }}>
              NIKI
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: B.text }}>{user.nombre.split(" ")[0]}</div>
              <div style={{ fontSize: 7, color, fontWeight: 700 }}>{perfil.label}</div>
            </div>
            <Bubble emoji={user.emoji} color={color} size={32} />
            <button onClick={onLogout} style={{ background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "4px 8px", fontSize: 8, color: B.mid }}>
              Salir
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 14px 100px" }}>
        {/* Bienvenida */}
        <div style={{
          background: `linear-gradient(135deg, ${B.text}, #5a3a3c)`,
          borderRadius: 16, padding: "18px", marginBottom: 14,
          position: "relative", overflow: "hidden",
          border: `1px solid rgba(202,161,80,0.15)`,
        }}>
          <PatternBg opacity={0.06} id="home-p" />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <Bubble emoji={user.emoji} color={color} size={46} />
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>Bienvenida de vuelta</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: B.white, fontWeight: 300, lineHeight: 1.1 }}>
                {user.nombre.split(" ")[0]} ✨
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4, marginTop: 5,
                padding: "3px 10px", borderRadius: 20,
                background: `${color}20`, border: `1px solid ${color}40`,
              }}>
                <Destello size={7} color={color} />
                <span style={{ fontSize: 8, color, fontWeight: 700 }}>{perfil.label.toUpperCase()}</span>
                {user.local && <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>· {user.local}</span>}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {[
              { label: "Locales", value: "14", icon: "📍" },
              { label: "Obras", value: "5", icon: "🏗️" },
              { label: "Ideas", value: "4", icon: "💡" },
              { label: "Inversores", value: "3", icon: "💰" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "8px 4px", background: "rgba(255,255,255,0.06)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 14 }}>{s.icon}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#CAA150", lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown */}
        {!countdown.expired && countdown.dias !== undefined && (
          <div style={{
            background: B.white, borderRadius: 14, padding: "14px", marginBottom: 14,
            border: `1px solid ${B.pinkLight}`, position: "relative", overflow: "hidden",
          }}>
            <div style={{ fontSize: 8, letterSpacing: 2, color: B.mid, fontWeight: 700, marginBottom: 10 }}>
              ✨ PRÓXIMO EVENTO
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.text, marginBottom: 10 }}>
              Evento Niki Beauty Bar — 17 de Mayo
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { val: countdown.dias, label: "días" },
                { val: countdown.horas, label: "horas" },
                { val: countdown.min, label: "min" },
                { val: countdown.seg, label: "seg" },
              ].map((c, i) => (
                <div key={i} style={{ textAlign: "center", padding: "8px 4px", background: B.pinkBg, borderRadius: 10, border: `1px solid ${B.pinkLight}` }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: B.pinkDeep, lineHeight: 1 }}>
                    {String(c.val).padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: 7, color: B.mid, marginTop: 2 }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acceso rápido */}
        {quickMods.length > 0 && (
          <>
            <div style={{ fontSize: 8, letterSpacing: 3, color: B.mid, fontWeight: 700, marginBottom: 10 }}>ACCESO RÁPIDO</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
              {quickMods.slice(0, 6).map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => onOpenModule(m.id)}
                  className="card"
                  style={{
                    background: B.white, borderRadius: 13, padding: "14px 10px",
                    border: `1px solid ${B.pinkLight}`, position: "relative", overflow: "hidden",
                    boxShadow: "0 2px 6px rgba(221,164,174,0.06)",
                    animation: `fadeUp 0.25s ease ${i * 0.04}s both`,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    textAlign: "center",
                  }}
                >
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${m.color}60, ${m.color})` }} />
                  <div style={{ fontSize: 22 }}>{m.emoji}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: B.text }}>{m.label}</div>
                  <div style={{ fontSize: 7, color: B.mid }}>{m.desc}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Ver todos */}
        <button
          onClick={() => onOpenModule("_modulos")}
          style={{
            width: "100%", padding: "12px", borderRadius: 12, fontSize: 10, fontWeight: 700,
            color: B.mid, background: B.white, border: `1px solid ${B.pinkLight}`,
            letterSpacing: 1,
          }}
        >
          VER TODOS LOS MÓDULOS →
        </button>
      </div>
    </div>
  );
}
