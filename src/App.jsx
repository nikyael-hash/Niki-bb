import { useState, useEffect } from "react";
import { CSS_GLOBAL } from "./design/tokens.js";
import { B } from "./design/tokens.js";

import Login from "./screens/Login.jsx";
import Register from "./screens/Register.jsx";
import Home from "./screens/Home.jsx";
import ModulosGrid from "./screens/ModulosGrid.jsx";
import StayTuned from "./screens/StayTuned.jsx";

import Comunicaciones from "./modules/Comunicaciones.jsx";
import Rewards from "./modules/Rewards.jsx";
import Cotizador from "./modules/Cotizador.jsx";
import NikiLab from "./modules/NikiLab.jsx";
import Frases from "./modules/Frases.jsx";
import Auditorias from "./modules/Auditorias.jsx";
import Obras from "./modules/Obras.jsx";
import RRHH from "./modules/RRHH.jsx";
import Inversores from "./modules/Inversores.jsx";
import PlanCarrera from "./modules/PlanCarrera.jsx";
import Stock from "./modules/Stock.jsx";
import Proyectos from "./modules/Proyectos.jsx";

const MODULE_COMPONENTS = {
  comunicaciones: Comunicaciones,
  rewards:        Rewards,
  cotizador:      Cotizador,
  lab:            NikiLab,
  frases:         Frases,
  auditorias:     Auditorias,
  obras:          Obras,
  rrhh:           RRHH,
  inversores:     Inversores,
  plan_carrera:   PlanCarrera,
  stock:          Stock,
  proyectos:      Proyectos,
};

const TABS = [
  { id: "home",     icon: "◆",  label: "Inicio"   },
  { id: "modulos",  icon: "⊞",  label: "Módulos"  },
  { id: "blog",     icon: "✨", label: "Novedades" },
];

export default function App() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS_GLOBAL;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    setScreen("app");
    setTab("home");
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("login");
    setActiveModule(null);
    setTab("home");
  };

  const openModule = (id) => {
    if (id === "_modulos") { setTab("modulos"); setActiveModule(null); return; }
    setActiveModule(id);
  };

  const closeModule = () => setActiveModule(null);

  // Login / Register
  if (screen === "login") {
    return <Login onLogin={handleLogin} onGoRegister={() => setScreen("register")} />;
  }
  if (screen === "register") {
    return <Register onBack={() => setScreen("login")} onRegistered={handleLogin} />;
  }

  // Módulo activo
  if (activeModule) {
    const ModComponent = MODULE_COMPONENTS[activeModule];
    if (ModComponent) {
      return <ModComponent user={user} onBack={closeModule} />;
    }
    // Módulos no implementados aún
    return (
      <div style={{ minHeight: "100vh", background: B.coolGray, fontFamily: "'Lato',sans-serif", maxWidth: 430, margin: "0 auto" }}>
        <div style={{ background: B.white, padding: "13px 18px", borderBottom: `1px solid ${B.pinkLight}`, display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={closeModule} style={{ background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "6px 13px", fontSize: 10, color: B.mid, fontWeight: 700 }}>← OS</button>
          <div style={{ fontSize: 13, fontWeight: 700, color: B.text }}>Módulo</div>
        </div>
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: B.text, fontWeight: 300, marginBottom: 8 }}>Próximamente</div>
          <div style={{ fontSize: 11, color: B.mid }}>Este módulo está en desarrollo.</div>
        </div>
      </div>
    );
  }

  // App principal con tabs
  const renderTab = () => {
    if (tab === "home")    return <Home user={user} onOpenModule={openModule} onLogout={handleLogout} />;
    if (tab === "modulos") return <ModulosGrid user={user} onOpenModule={openModule} onBack={() => setTab("home")} />;
    if (tab === "blog")    return <StayTuned user={user} onNavigate={openModule} />;
    return null;
  };

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", position: "relative", minHeight: "100vh" }}>
      <div style={{ paddingBottom: 60 }}>
        {renderTab()}
      </div>

      {/* Bottom navigation */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: B.white, borderTop: `1px solid ${B.pinkLight}`,
        padding: "7px 0 13px",
        display: "flex", justifyContent: "space-around",
        zIndex: 100,
        boxShadow: "0 -2px 12px rgba(221,164,174,0.08)",
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setActiveModule(null); }}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3, background: "none", padding: "4px 0",
            }}
          >
            <span style={{ fontSize: 16, color: tab === t.id ? B.pinkDeep : B.glacier, transition: "color 0.2s" }}>
              {t.icon}
            </span>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1, color: tab === t.id ? B.pinkDeep : B.mid, transition: "color 0.2s" }}>
              {t.label.toUpperCase()}
            </span>
            {tab === t.id && <div style={{ width: 18, height: 2, borderRadius: 1, background: B.pinkDeep }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
