import { useState } from "react";
import { B } from "../design/tokens.js";
import { FRASES_INIT } from "../data/mockData.js";
import ModuleHeader from "../components/ModuleHeader.jsx";
import Destello from "../components/Destello.jsx";

const CATS = [
  { id: "actitud",   label: "Actitud",   icon: "🔥", color: B.pinkDeep },
  { id: "poder",     label: "Poder",     icon: "👑", color: "#CAA150"  },
  { id: "belleza",   label: "Belleza",   icon: "💅", color: B.pink      },
  { id: "bienestar", label: "Bienestar", icon: "🌸", color: B.teal      },
  { id: "humor",     label: "Humor",     icon: "😏", color: B.purple    },
];

const catColor = (cat) => CATS.find(c => c.id === cat)?.color || B.pink;
const catIcon  = (cat) => CATS.find(c => c.id === cat)?.icon  || "✨";

export default function Frases({ user, onBack }) {
  const [tab, setTab] = useState("todas");
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [favoritas, setFavoritas] = useState([]);
  const [copied, setCopied] = useState(null);

  const hoy = FRASES_INIT[(new Date().getDate()) % FRASES_INIT.length];

  const filtradas = FRASES_INIT.filter(f => {
    if (tab === "favoritas" && !favoritas.includes(f.id)) return false;
    if (catFilter !== "all" && f.cat !== catFilter) return false;
    if (search && !f.texto.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleFav = (id) => setFavoritas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const copiar = (texto, id) => {
    navigator.clipboard.writeText(texto).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

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
            <div style={{ fontSize: 13, fontWeight: 700, color: B.text }}>☕ Frases del Café</div>
            <div style={{ fontSize: 8, color: B.mid }}>Para compartir con clientas</div>
          </div>
        </div>
        <div style={{ display: "flex", borderTop: `1px solid ${B.coolGray}` }}>
          {[{ id: "todas", l: "Todas" }, { id: "favoritas", l: `Favoritas (${favoritas.length})` }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "8px 0 10px", background: "transparent",
              borderBottom: `2.5px solid ${tab === t.id ? B.pinkDeep : "transparent"}`,
              color: tab === t.id ? B.pinkDeep : B.mid,
              fontSize: 9, fontWeight: tab === t.id ? 700 : 400, letterSpacing: .5,
            }}>
              {t.l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 14px 60px" }}>
        {/* Frase del día */}
        {tab === "todas" && (
          <div style={{
            background: `linear-gradient(135deg, ${B.pinkDeep}, ${B.pinkDeep}cc)`,
            borderRadius: 14, padding: 18, marginBottom: 14, position: "relative", overflow: "hidden",
          }}>
            <Destello size={60} color="rgba(255,255,255,0.06)" style={{ position: "absolute", right: -10, top: -10 }} />
            <div style={{ fontSize: 8, letterSpacing: 2, color: "rgba(255,255,255,0.6)", fontWeight: 700, marginBottom: 8 }}>✦ FRASE DEL DÍA</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: B.white, fontWeight: 300, lineHeight: 1.5, marginBottom: 12 }}>
              "{hoy.texto}"
            </div>
            <button onClick={() => copiar(hoy.texto, "hoy")} style={{
              padding: "7px 14px", borderRadius: 20, fontSize: 9, fontWeight: 700,
              background: "rgba(255,255,255,0.2)", color: B.white, border: "1px solid rgba(255,255,255,0.3)",
            }}>
              {copied === "hoy" ? "✓ Copiado" : "Copiar"}
            </button>
          </div>
        )}

        {/* Búsqueda y filtros */}
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar frases..."
          style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${B.pinkLight}`, borderRadius: 10, fontSize: 12, color: B.text, background: B.white, marginBottom: 10 }}
        />
        <div style={{ display: "flex", gap: 5, marginBottom: 12, overflowX: "auto", scrollbarWidth: "none" }}>
          <button onClick={() => setCatFilter("all")} style={{
            padding: "4px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700, flexShrink: 0,
            background: catFilter === "all" ? B.text : B.white, color: catFilter === "all" ? B.white : B.mid,
            border: `1px solid ${catFilter === "all" ? B.text : B.glacier}`,
          }}>Todas</button>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCatFilter(c.id)} style={{
              padding: "4px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700, flexShrink: 0,
              background: catFilter === c.id ? c.color : B.white,
              color: catFilter === c.id ? B.white : B.mid,
              border: `1px solid ${catFilter === c.id ? c.color : B.glacier}`,
            }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Grid masonry (2 columnas simuladas) */}
        <div style={{ columns: 2, columnGap: 10 }}>
          {filtradas.map((f, i) => {
            const color = catColor(f.cat);
            const isFav = favoritas.includes(f.id);
            return (
              <div key={f.id} style={{
                breakInside: "avoid", marginBottom: 10,
                background: B.white, borderRadius: 12, padding: 14,
                border: `1px solid ${B.pinkLight}`,
                boxShadow: "0 2px 6px rgba(221,164,174,0.05)",
                animation: `fadeUp .2s ease ${i * .03}s both`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 10 }}>{catIcon(f.cat)}</span>
                  <button onClick={() => toggleFav(f.id)} style={{ background: "none", fontSize: 14 }}>
                    {isFav ? "❤️" : "🤍"}
                  </button>
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, color: B.text, lineHeight: 1.5, marginBottom: 10, fontStyle: "italic" }}>
                  "{f.texto}"
                </div>
                <button onClick={() => copiar(f.texto, f.id)} style={{
                  width: "100%", padding: "5px 8px", borderRadius: 8, fontSize: 8, fontWeight: 700,
                  background: copied === f.id ? `${B.green}15` : `${color}10`,
                  color: copied === f.id ? B.green : color,
                  border: `1px solid ${copied === f.id ? B.green : color}30`,
                  transition: "all .2s",
                }}>
                  {copied === f.id ? "✓ Copiado" : "Copiar"}
                </button>
              </div>
            );
          })}
        </div>

        {filtradas.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: B.mid, fontSize: 12 }}>
            No se encontraron frases
          </div>
        )}
      </div>
    </div>
  );
}
