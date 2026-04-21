import { useState } from "react";
import { B, PERFILES } from "../design/tokens.js";
import { IDEAS_INIT } from "../data/mockData.js";
import ModuleHeader from "../components/ModuleHeader.jsx";
import Bubble from "../components/Bubble.jsx";
import Destello from "../components/Destello.jsx";

const CATS = [
  { id: "colores",     label: "Colores",     emoji: "🎨", color: B.pink   },
  { id: "productos",   label: "Productos",   emoji: "💅", color: "#CAA150" },
  { id: "proyectos",   label: "Proyectos",   emoji: "🚀", color: B.teal   },
  { id: "servicios",   label: "Servicios",   emoji: "✨", color: B.purple },
  { id: "operaciones", label: "Operaciones", emoji: "⚙️", color: B.green  },
];

const ESTADOS = {
  nueva:      { label: "Nueva",        color: B.mid,   bg: B.coolGray,   icon: "💡" },
  analisis:   { label: "En análisis",  color: "#CAA150", bg: B.goldPale, icon: "🔍" },
  aprobada:   { label: "Aprobada",     color: B.green,  bg: B.greenPale, icon: "✅" },
  descartada: { label: "Descartada",   color: B.red,    bg: B.redPale,   icon: "✕"  },
};

export default function NikiLab({ user, onBack }) {
  const [ideas, setIdeas] = useState(IDEAS_INIT);
  const [catFilter, setCatFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newTitulo, setNewTitulo] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState("colores");
  const [commentDraft, setCommentDraft] = useState({});
  const isCM = user.perfil === "casa_matriz";

  const filtradas = ideas
    .filter(i => catFilter === "all" || i.categoria === catFilter)
    .sort((a, b) => {
      const sumVotos = o => Object.values(o.votos).reduce((s, v) => s + v, 0);
      return sumVotos(b) - sumVotos(a);
    });

  const votar = (ideaId) => {
    setIdeas(prev => prev.map(i => {
      if (i.id !== ideaId) return i;
      const current = i.votos[user.perfil];
      return { ...i, votos: { ...i.votos, [user.perfil]: current ? 0 : 1 } };
    }));
  };

  const comentar = (ideaId) => {
    const texto = commentDraft[ideaId]?.trim();
    if (!texto) return;
    setIdeas(prev => prev.map(i => {
      if (i.id !== ideaId) return i;
      return { ...i, comentarios: [...i.comentarios, { perfil: user.perfil, emoji: user.emoji, texto, fecha: "Ahora" }] };
    }));
    setCommentDraft(d => ({ ...d, [ideaId]: "" }));
  };

  const cambiarEstado = (ideaId, estado) => {
    setIdeas(prev => prev.map(i => i.id !== ideaId ? i : { ...i, estado }));
  };

  const publicarIdea = () => {
    if (!newTitulo.trim()) return;
    setIdeas(prev => [{
      id: `i_${Date.now()}`, perfil: user.perfil, emoji: user.emoji, nombre: user.nombre.split(" ")[0],
      titulo: newTitulo.trim(), categoria: newCat, descripcion: newDesc.trim(),
      estado: "nueva", fecha: "Hoy",
      votos: { casa_matriz: 0, franquiciada: 0, encargada: 0, manicura: 0, inversor: 0 },
      comentarios: [],
    }, ...prev]);
    setNewTitulo(""); setNewDesc(""); setShowForm(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato', sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <ModuleHeader emoji="🧪" title="Niki Lab" subtitle="Ideas del equipo" onBack={onBack} />

      <div style={{ padding: "12px 14px 80px" }}>
        {/* Filtros de categoría */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", scrollbarWidth: "none" }}>
          <button onClick={() => setCatFilter("all")} style={{
            padding: "5px 12px", borderRadius: 20, fontSize: 8, fontWeight: 700, flexShrink: 0,
            background: catFilter === "all" ? B.text : B.white,
            color: catFilter === "all" ? B.white : B.mid,
            border: `1px solid ${catFilter === "all" ? B.text : B.glacier}`,
          }}>Todas</button>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCatFilter(c.id)} style={{
              padding: "5px 12px", borderRadius: 20, fontSize: 8, fontWeight: 700, flexShrink: 0,
              background: catFilter === c.id ? c.color : B.white,
              color: catFilter === c.id ? B.white : B.mid,
              border: `1px solid ${catFilter === c.id ? c.color : B.glacier}`,
            }}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {/* Ideas */}
        {filtradas.map((idea, idx) => {
          const estado = ESTADOS[idea.estado];
          const cat = CATS.find(c => c.id === idea.categoria);
          const totalVotos = Object.values(idea.votos).reduce((s, v) => s + v, 0);
          const yaVote = idea.votos[user.perfil] === 1;
          const isExpanded = expandedId === idea.id;

          return (
            <div key={idea.id} style={{
              background: B.white, borderRadius: 13, marginBottom: 10,
              border: `1px solid ${B.pinkLight}`, overflow: "hidden",
              animation: `fadeUp .2s ease ${idx * .04}s both`,
            }}>
              {/* Header de idea */}
              <div style={{ padding: "14px 14px 10px" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <Bubble emoji={idea.emoji} color={PERFILES[idea.perfil]?.color || B.pink} size={30} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 5 }}>
                      <span style={{ padding: "2px 7px", borderRadius: 10, fontSize: 7, fontWeight: 700, background: `${cat?.color}15`, color: cat?.color }}>
                        {cat?.emoji} {cat?.label}
                      </span>
                      <span style={{ padding: "2px 7px", borderRadius: 10, fontSize: 7, fontWeight: 700, background: estado.bg, color: estado.color }}>
                        {estado.icon} {estado.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: B.text, marginBottom: 3 }}>{idea.titulo}</div>
                    <div style={{ fontSize: 9, color: B.mid }}>{idea.nombre} · {idea.fecha}</div>
                  </div>
                </div>

                {/* Acciones */}
                <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
                  <button onClick={() => votar(idea.id)} style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "5px 12px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                    background: yaVote ? `${B.pink}20` : B.coolGray,
                    color: yaVote ? B.pinkDeep : B.mid,
                    border: `1px solid ${yaVote ? B.pinkDeep : B.glacier}`,
                    transition: "all .2s",
                  }}>
                    <Destello size={8} color={yaVote ? B.pinkDeep : B.mid} />
                    {totalVotos} {totalVotos === 1 ? "voto" : "votos"}
                  </button>
                  <button onClick={() => setExpandedId(isExpanded ? null : idea.id)} style={{
                    flex: 1, padding: "5px", fontSize: 9, color: B.mid, background: "none",
                    textAlign: "right",
                  }}>
                    💬 {idea.comentarios.length} {isExpanded ? "▲" : "▼"}
                  </button>
                  {isCM && (
                    <select
                      value={idea.estado}
                      onChange={e => cambiarEstado(idea.id, e.target.value)}
                      style={{
                        padding: "4px 8px", borderRadius: 8, fontSize: 8,
                        border: `1px solid ${B.glacier}`, background: B.white, color: B.mid,
                      }}
                    >
                      {Object.entries(ESTADOS).map(([k, v]) => (
                        <option key={k} value={k}>{v.icon} {v.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Comentarios */}
              {isExpanded && (
                <div style={{ borderTop: `1px solid ${B.coolGray}`, padding: "10px 14px" }}>
                  {idea.comentarios.map((c, ci) => (
                    <div key={ci} style={{ display: "flex", gap: 7, marginBottom: 8 }}>
                      <Bubble emoji={c.emoji} color={PERFILES[c.perfil]?.color || B.pink} size={24} />
                      <div style={{ flex: 1, background: B.coolGray, borderRadius: 8, padding: "6px 10px" }}>
                        <div style={{ fontSize: 10, color: B.text }}>{c.texto}</div>
                        <div style={{ fontSize: 8, color: B.mid, marginTop: 3 }}>{c.fecha}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      value={commentDraft[idea.id] || ""}
                      onChange={e => setCommentDraft(d => ({ ...d, [idea.id]: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && comentar(idea.id)}
                      placeholder="Comentar..."
                      style={{ flex: 1, padding: "7px 10px", border: `1px solid ${B.pinkLight}`, borderRadius: 8, fontSize: 11, color: B.text }}
                    />
                    <button onClick={() => comentar(idea.id)} style={{
                      padding: "7px 12px", borderRadius: 8, background: `linear-gradient(135deg, ${B.pink}, ${B.pinkDeep})`,
                      color: B.white, fontSize: 12, fontWeight: 700,
                    }}>↑</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAB nueva idea */}
      <div style={{ position: "fixed", bottom: 20, right: "calc(50% - 210px)", zIndex: 50 }}>
        <button onClick={() => setShowForm(true)} style={{
          padding: "12px 18px", borderRadius: 24, fontSize: 11, fontWeight: 700,
          color: B.white, background: `linear-gradient(135deg, ${B.green}, ${B.green}cc)`,
          boxShadow: `0 4px 16px ${B.green}40`, display: "flex", alignItems: "center", gap: 6,
        }}>
          <Destello size={10} color={B.white} /> Nueva idea
        </button>
      </div>

      {/* Modal nueva idea */}
      {showForm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(61,43,45,0.5)",
          display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200,
        }} onClick={() => setShowForm(false)}>
          <div style={{
            background: B.white, borderRadius: "16px 16px 0 0",
            padding: "20px", width: "100%", maxWidth: 430,
            animation: "fadeUp 0.25s ease",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 14, fontWeight: 700, color: B.text, marginBottom: 14 }}>💡 Nueva idea</div>
            <input value={newTitulo} onChange={e => setNewTitulo(e.target.value)} placeholder="Título de la idea *"
              style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${B.pinkLight}`, borderRadius: 10, fontSize: 13, color: B.text, marginBottom: 8 }} />
            <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Descripción (opcional)"
              style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${B.pinkLight}`, borderRadius: 10, fontSize: 12, color: B.text, resize: "none", height: 72, marginBottom: 8 }} />
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {CATS.map(c => (
                <button key={c.id} onClick={() => setNewCat(c.id)} style={{
                  padding: "4px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700,
                  background: newCat === c.id ? c.color : B.white,
                  color: newCat === c.id ? B.white : B.mid,
                  border: `1px solid ${newCat === c.id ? c.color : B.glacier}`,
                }}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
            <button onClick={publicarIdea} style={{
              width: "100%", padding: 13, borderRadius: 12, fontSize: 12, fontWeight: 700,
              color: B.white, background: `linear-gradient(135deg, ${B.green}, ${B.green}cc)`,
            }}>
              Publicar idea
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
