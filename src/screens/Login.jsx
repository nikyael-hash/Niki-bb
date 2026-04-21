import { useState } from "react";
import { B, PERFILES } from "../design/tokens.js";
import { USUARIOS_INIT } from "../data/mockData.js";
import Destello from "../components/Destello.jsx";
import PatternBg from "../components/PatternBg.jsx";

const PERFILES_LIST = Object.entries(PERFILES).map(([id, v]) => ({ id, ...v }));

export default function Login({ onLogin, onGoRegister }) {
  const [selectedPerfil, setSelectedPerfil] = useState("manicura");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const perfil = PERFILES[selectedPerfil];
  const color = perfil.color;
  const glow = perfil.glow;

  const handleLogin = () => {
    setError("");
    const user = USUARIOS_INIT.find(u => u.email === email && u.pass === pass);
    if (!user) { setError("Email o contraseña incorrectos."); return; }
    if (user.perfil !== selectedPerfil) { setError(`Este usuario es ${PERFILES[user.perfil].label}, no ${perfil.label}.`); return; }
    onLogin(user);
  };

  return (
    <div style={{
      minHeight: "100vh", background: B.pinkBg,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", maxWidth: 430, margin: "0 auto",
      fontFamily: "'Lato', sans-serif", position: "relative", overflow: "hidden",
      padding: "0 0 40px",
    }}>
      <PatternBg opacity={0.04} id="login-bg" />

      {/* Glow */}
      <div style={{
        position: "absolute", width: 260, height: 260, borderRadius: "50%",
        background: glow, filter: "blur(60px)", opacity: 0.35,
        animation: "glowPulse 3s ease-in-out infinite", transition: "background 0.6s",
        pointerEvents: "none",
      }} />

      {/* Floating destellos */}
      {[
        { top: "12%", left: "10%", size: 14, delay: "0s" },
        { top: "20%", right: "12%", size: 10, delay: "0.8s" },
        { top: "70%", left: "8%",  size: 12, delay: "1.4s" },
        { top: "75%", right: "10%",size: 8,  delay: "0.4s" },
        { top: "45%", left: "5%",  size: 6,  delay: "1.8s" },
      ].map((f, i) => (
        <Destello key={i} size={f.size} color={color} style={{
          position: "absolute", top: f.top, left: f.left, right: f.right,
          opacity: 0.5, animation: `destelloFloat 3s ease-in-out ${f.delay} infinite`,
          transition: "color 0.6s",
        }} />
      ))}

      {/* Logo */}
      <div style={{ position: "relative", textAlign: "center", marginBottom: 8 }}>
        <Destello size={38} color={color} style={{
          display: "block", margin: "0 auto 12px",
          animation: "destelloSpin 8s linear infinite",
          transition: "color 0.6s",
        }} />
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 64, fontWeight: 300,
          color: B.text, letterSpacing: 16, paddingLeft: 16,
          lineHeight: 1, userSelect: "none",
        }}>
          NIKI
        </div>
        <div style={{ fontSize: 8, letterSpacing: 4, color: B.mid, fontWeight: 700, marginTop: 2 }}>
          BEAUTY BAR · OS
        </div>
      </div>

      {/* Perfil selector */}
      <div style={{ position: "relative", width: "100%", padding: "0 24px", marginBottom: 20 }}>
        <div style={{ fontSize: 7, letterSpacing: 3, color: B.mid, fontWeight: 700, textAlign: "center", marginBottom: 10 }}>
          SELECCIONÁ TU PERFIL
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {PERFILES_LIST.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPerfil(p.id)}
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 9, fontWeight: 700,
                background: selectedPerfil === p.id ? p.color : B.white,
                color: selectedPerfil === p.id ? B.white : B.mid,
                border: `1.5px solid ${selectedPerfil === p.id ? p.color : B.glacier}`,
                transition: "all 0.2s", display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <Destello size={7} color={selectedPerfil === p.id ? B.white : p.color} />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ position: "relative", width: "100%", padding: "0 24px" }}>
        <input
          value={email}
          onChange={e => { setEmail(e.target.value); setError(""); }}
          placeholder="Email"
          type="email"
          style={{
            width: "100%", padding: "13px 16px", marginBottom: 10,
            border: `1.5px solid ${B.pinkLight}`, borderRadius: 12,
            fontSize: 13, color: B.text, background: B.white,
            boxShadow: "0 2px 8px rgba(221,164,174,0.06)",
          }}
        />
        <input
          value={pass}
          onChange={e => { setPass(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          placeholder="Contraseña"
          type="password"
          style={{
            width: "100%", padding: "13px 16px", marginBottom: error ? 8 : 16,
            border: `1.5px solid ${B.pinkLight}`, borderRadius: 12,
            fontSize: 13, color: B.text, background: B.white,
            boxShadow: "0 2px 8px rgba(221,164,174,0.06)",
          }}
        />
        {error && (
          <div style={{ fontSize: 10, color: B.red, marginBottom: 10, textAlign: "center", padding: "6px 12px", background: B.redPale, borderRadius: 8 }}>
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          style={{
            width: "100%", padding: "14px", borderRadius: 12, fontSize: 13,
            fontWeight: 700, color: B.white,
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
            boxShadow: `0 4px 20px ${glow}`,
            transition: "all 0.3s", letterSpacing: 1,
          }}
        >
          <Destello size={11} color={B.white} style={{ marginRight: 6, verticalAlign: "middle" }} />
          INGRESAR
        </button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button
            onClick={onGoRegister}
            style={{ background: "none", fontSize: 10, color: B.mid, textDecoration: "underline" }}
          >
            Registrarme con código de invitación
          </button>
        </div>
      </div>

      {/* Demo hint */}
      <div style={{
        position: "relative", marginTop: 24, padding: "10px 16px",
        background: `${color}10`, borderRadius: 10, border: `1px solid ${color}30`,
        fontSize: 9, color: B.mid, textAlign: "center", maxWidth: 300,
      }}>
        <strong style={{ color }}>Demo:</strong> nicole@nikibb.com / nicole123 (Casa Matriz)<br />
        este@nikibb.com / este123 (Manicura) · inv@nikibb.com / inv123 (Inversor)
      </div>
    </div>
  );
}
