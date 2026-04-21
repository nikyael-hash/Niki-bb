import { useState } from "react";
import { B, PERFILES } from "../design/tokens.js";
import { USUARIOS_INIT } from "../data/mockData.js";
import { auth, db, IS_CONFIGURED } from "../firebase.js";
import Destello from "../components/Destello.jsx";
import PatternBg from "../components/PatternBg.jsx";

const PERFILES_LIST = Object.entries(PERFILES).map(([id, v]) => ({ id, ...v }));

let _signIn, _fbGetDoc, _fbDoc;
async function loadAuth() {
  if (_signIn) return true;
  if (!auth) return false;
  const fa = await import("firebase/auth");
  const ff = await import("firebase/firestore");
  _signIn = fa.signInWithEmailAndPassword;
  _fbGetDoc = ff.getDoc;
  _fbDoc = ff.doc;
  return true;
}

export default function Login({ onLogin, onGoRegister }) {
  const [selectedPerfil, setSelectedPerfil] = useState("manicura");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const perfil = PERFILES[selectedPerfil];
  const color = perfil.color;
  const glow  = perfil.glow;

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !pass.trim()) { setError("Ingresá email y contraseña."); return; }
    setLoading(true);

    try {
      if (IS_CONFIGURED && await loadAuth()) {
        // Firebase Auth login
        const cred = await _signIn(auth, email.trim().toLowerCase(), pass);
        const uid  = cred.user.uid;
        const snap = await _fbGetDoc(_fbDoc(db, "users", uid));
        if (!snap.exists()) { setError("Perfil no encontrado. Registrate primero."); setLoading(false); return; }
        const profile = snap.data();
        if (profile.perfil !== selectedPerfil) {
          setError(`Este usuario es ${PERFILES[profile.perfil]?.label || profile.perfil}, no ${perfil.label}.`);
          setLoading(false); return;
        }
        onLogin({ id: uid, ...profile });
      } else {
        // Mock fallback (app no conectada a Firebase aún)
        const user = USUARIOS_INIT.find(u => u.email === email.trim().toLowerCase() && u.pass === pass);
        if (!user) { setError("Email o contraseña incorrectos."); setLoading(false); return; }
        if (user.perfil !== selectedPerfil) {
          setError(`Este usuario es ${PERFILES[user.perfil].label}, no ${perfil.label}.`);
          setLoading(false); return;
        }
        onLogin(user);
      }
    } catch (e) {
      const msg = e.code === "auth/invalid-credential" || e.code === "auth/wrong-password"
        ? "Email o contraseña incorrectos."
        : e.code === "auth/user-not-found"
        ? "No existe una cuenta con ese email."
        : e.code === "auth/too-many-requests"
        ? "Demasiados intentos. Esperá unos minutos."
        : "Error al ingresar. Intentá de nuevo.";
      setError(msg);
    }
    setLoading(false);
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

      <div style={{
        position: "absolute", width: 260, height: 260, borderRadius: "50%",
        background: glow, filter: "blur(60px)", opacity: 0.35,
        animation: "glowPulse 3s ease-in-out infinite", transition: "background 0.6s",
        pointerEvents: "none",
      }} />

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

      <div style={{ position: "relative", textAlign: "center", marginBottom: 8 }}>
        <Destello size={38} color={color} style={{
          display: "block", margin: "0 auto 12px",
          animation: "destelloSpin 8s linear infinite", transition: "color 0.6s",
        }} />
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 64, fontWeight: 300,
          color: B.text, letterSpacing: 16, paddingLeft: 16, lineHeight: 1, userSelect: "none",
        }}>NIKI</div>
        <div style={{ fontSize: 8, letterSpacing: 4, color: B.mid, fontWeight: 700, marginTop: 2 }}>
          BEAUTY BAR · OS
        </div>
      </div>

      <div style={{ position: "relative", width: "100%", padding: "0 24px", marginBottom: 20 }}>
        <div style={{ fontSize: 7, letterSpacing: 3, color: B.mid, fontWeight: 700, textAlign: "center", marginBottom: 10 }}>
          SELECCIONÁ TU PERFIL
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {PERFILES_LIST.map(p => (
            <button key={p.id} onClick={() => setSelectedPerfil(p.id)} style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 9, fontWeight: 700,
              background: selectedPerfil === p.id ? p.color : B.white,
              color: selectedPerfil === p.id ? B.white : B.mid,
              border: `1.5px solid ${selectedPerfil === p.id ? p.color : B.glacier}`,
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 4,
            }}>
              <Destello size={7} color={selectedPerfil === p.id ? B.white : p.color} />
              {p.label}
            </button>
          ))}
        </div>
      </div>

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
        <button onClick={handleLogin} disabled={loading} style={{
          width: "100%", padding: "14px", borderRadius: 12, fontSize: 13,
          fontWeight: 700, color: B.white,
          background: loading ? B.mid : `linear-gradient(135deg, ${color}, ${color}cc)`,
          boxShadow: loading ? "none" : `0 4px 20px ${glow}`,
          transition: "all 0.3s", letterSpacing: 1,
        }}>
          <Destello size={11} color={B.white} style={{ marginRight: 6, verticalAlign: "middle" }} />
          {loading ? "INGRESANDO..." : "INGRESAR"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={onGoRegister} style={{ background: "none", fontSize: 10, color: B.mid, textDecoration: "underline" }}>
            Registrarme con código de invitación
          </button>
        </div>
      </div>

      <div style={{
        position: "relative", marginTop: 24, padding: "10px 16px",
        background: `${color}10`, borderRadius: 10, border: `1px solid ${color}30`,
        fontSize: 9, color: B.mid, textAlign: "center", maxWidth: 300,
      }}>
        {IS_CONFIGURED ? (
          <>Usá el email y contraseña con que te registraste.</>
        ) : (
          <>
            <strong style={{ color }}>Demo:</strong> nicole@nikibb.com / nicole123 (Casa Matriz)<br />
            este@nikibb.com / este123 (Manicura) · inv@nikibb.com / inv123 (Inversor)
          </>
        )}
      </div>
    </div>
  );
}
