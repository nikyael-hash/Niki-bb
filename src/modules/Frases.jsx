import { useState } from "react";
import { B } from "../design/tokens.js";
import { FRASES_INIT } from "../data/mockData.js";
import { useAppDoc } from "../hooks/useAppDoc.js";
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

const NUEVA_FRASE_INIT = { texto: "", cat: "actitud" };

export default function Frases({ user, onBack }) {
  const [tab, setTab] = useState("todas");
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [favoritas, setFavoritas] = useState([]);
  const [copied, setCopied] = useState(null);
  const [frases, setFrases] = useAppDoc("frases", FRASES_INIT);
  const [editMode, setEditMode] = useState(false);
  const [editTextos, setEditTextos] = useState({});
  const [showNuevaFrase, setShowNuevaFrase] = useState(false);
  const [nuevaFrase, setNuevaFrase] = useState(NUEVA_FRASE_INIT);

  const isCM = user.perfil === "casa_matriz";

  const hoy = frases[(new Date().getDate()) % frases.length] || frases[0];

  const filtradas = frases.filter(f => {
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

  const toggleEditMode = () => {
    if (editMode) {
      // Al salir de editMode, guardar cambios de texto en frases
      setFrases(prev => prev.map(f =>
        editTextos[f.id] !== undefined
          ? { ...f, texto: editTextos[f.id] }
          : f
      ));
      setEditTextos({});
      setShowNuevaFrase(false);
      setNuevaFrase(NUEVA_FRASE_INIT);
    }
    setEditMode(m => !m);
  };

  const borrarFrase = (id) => {
    setFrases(prev => prev.filter(f => f.id !== id));
    setFavoritas(prev => prev.filter(x => x !== id));
    setEditTextos(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const agregarFrase = () => {
    if (!nuevaFrase.texto.trim()) return;
    const nueva = {
      id: `f_${Date.now()}`,
      texto: nuevaFrase.texto.trim(),
      cat: nuevaFrase.cat,
    };
    setFrases(prev => [nueva, ...prev]);
    setNuevaFrase(NUEVA_FRASE_INIT);
    setShowNuevaFrase(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: B.white,
        borderBottom: `1px solid ${B.pinkLight}`,
        boxShadow: "0 2px 10px rgba(221,164,174,0.08)",
      }}>
        <ModuleHeader
          emoji="☕"
          title="Frases del Café"
          subtitle="Para compartir con clientas"
          onBack={onBack}
          isCM={isCM}
          editMode={editMode}
          onToggleEdit={toggleEditMode}
        />
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
            const textoEditable = editTextos[f.id] !== undefined ? editTextos[f.id] : f.texto;
            return (
              <div key={f.id} style={{
                breakInside: "avoid", marginBottom: 10,
                background: editMode ? B.redPale : B.white,
                borderRadius: 12, padding: 14,
                border: `1px solid ${editMode ? `${B.red}30` : B.pinkLight}`,
                boxShadow: "0 2px 6px rgba(221,164,174,0.05)",
                animation: `fadeUp .2s ease ${i * .03}s both`,
                transition: "background 0.2s, border-color 0.2s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 10 }}>{catIcon(f.cat)}</span>
                  {editMode ? (
                    <button
                      onClick={() => borrarFrase(f.id)}
                      title="Borrar frase"
                      style={{
                        background: B.red, border: "none", borderRadius: 6,
                        width: 24, height: 24, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 12, cursor: "pointer",
                      }}
                    >
                      🗑️
                    </button>
                  ) : (
                    <button onClick={() => toggleFav(f.id)} style={{ background: "none", fontSize: 14 }}>
                      {isFav ? "❤️" : "🤍"}
                    </button>
                  )}
                </div>

                {editMode ? (
                  <textarea
                    value={textoEditable}
                    onChange={e => setEditTextos(prev => ({ ...prev, [f.id]: e.target.value }))}
                    style={{
                      width: "100%", fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 13, color: B.text, lineHeight: 1.5,
                      fontStyle: "italic", resize: "none",
                      border: `1.5px solid ${B.pinkLight}`, borderRadius: 8,
                      padding: "6px 8px", background: B.white,
                      minHeight: 70, marginBottom: 0,
                    }}
                  />
                ) : (
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, color: B.text, lineHeight: 1.5, marginBottom: 10, fontStyle: "italic" }}>
                    "{f.texto}"
                  </div>
                )}

                {!editMode && (
                  <button onClick={() => copiar(f.texto, f.id)} style={{
                    width: "100%", padding: "5px 8px", borderRadius: 8, fontSize: 8, fontWeight: 700,
                    background: copied === f.id ? `${B.green}15` : `${color}10`,
                    color: copied === f.id ? B.green : color,
                    border: `1px solid ${copied === f.id ? B.green : color}30`,
                    transition: "all .2s",
                  }}>
                    {copied === f.id ? "✓ Copiado" : "Copiar"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {filtradas.length === 0 && !editMode && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: B.mid, fontSize: 12 }}>
            No se encontraron frases
          </div>
        )}

        {/* Formulario inline: nueva frase (solo en editMode y CM) */}
        {editMode && isCM && (
          <div style={{ marginTop: 4 }}>
            {!showNuevaFrase ? (
              <button
                onClick={() => setShowNuevaFrase(true)}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 12,
                  border: `1.5px dashed ${B.pinkDeep}`,
                  background: B.white, color: B.pinkDeep,
                  fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "background 0.2s",
                }}
              >
                + Nueva frase
              </button>
            ) : (
              <div style={{
                background: B.white, borderRadius: 12, padding: 14,
                border: `1.5px solid ${B.pinkDeep}`,
                boxShadow: "0 2px 10px rgba(196,128,140,0.1)",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: B.pinkDeep, marginBottom: 10 }}>+ Nueva frase</div>
                <textarea
                  value={nuevaFrase.texto}
                  onChange={e => setNuevaFrase(p => ({ ...p, texto: e.target.value }))}
                  placeholder="Escribí la frase aquí..."
                  style={{
                    width: "100%", fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 13, color: B.text, lineHeight: 1.5,
                    fontStyle: "italic", resize: "none",
                    border: `1.5px solid ${B.pinkLight}`, borderRadius: 8,
                    padding: "8px 10px", background: B.coolGray,
                    minHeight: 72, marginBottom: 10,
                  }}
                  autoFocus
                />
                <div style={{ fontSize: 9, color: B.mid, marginBottom: 6, fontWeight: 700 }}>Categoría</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
                  {CATS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setNuevaFrase(p => ({ ...p, cat: c.id }))}
                      style={{
                        padding: "4px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700,
                        background: nuevaFrase.cat === c.id ? c.color : B.white,
                        color: nuevaFrase.cat === c.id ? B.white : B.mid,
                        border: `1px solid ${nuevaFrase.cat === c.id ? c.color : B.glacier}`,
                        transition: "all 0.15s",
                      }}
                    >
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => { setShowNuevaFrase(false); setNuevaFrase(NUEVA_FRASE_INIT); }}
                    style={{
                      flex: 1, padding: "9px 0", borderRadius: 10, fontSize: 11, fontWeight: 700,
                      background: B.coolGray, color: B.mid, border: `1px solid ${B.glacier}`,
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={agregarFrase}
                    disabled={!nuevaFrase.texto.trim()}
                    style={{
                      flex: 2, padding: "9px 0", borderRadius: 10, fontSize: 11, fontWeight: 700,
                      background: nuevaFrase.texto.trim() ? B.pinkDeep : B.glacier,
                      color: B.white, border: "none",
                      transition: "background 0.2s",
                    }}
                  >
                    Agregar frase
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
