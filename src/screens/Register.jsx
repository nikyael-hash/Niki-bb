import { useState } from "react";
import { B, PERFILES, CODIGOS, EMOJI_GRUPOS } from "../design/tokens.js";
import { auth, db, IS_CONFIGURED } from "../firebase.js";
import Destello from "../components/Destello.jsx";
import PatternBg from "../components/PatternBg.jsx";

let _createUser, _ffDoc, _ffSetDoc;
async function loadAuth() {
  if (_createUser) return true;
  if (!auth) return false;
  const fa = await import("firebase/auth");
  const ff = await import("firebase/firestore");
  _createUser = fa.createUserWithEmailAndPassword;
  _ffDoc      = ff.doc;
  _ffSetDoc   = ff.setDoc;
  return true;
}

export default function Register({ onBack, onRegistered }) {
  const [step, setStep] = useState(1);
  const [codigo, setCodigo] = useState("");
  const [codigoData, setCodigoData] = useState(null);
  const [errCodigo, setErrCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [errForm, setErrForm] = useState("");
  const [emoji, setEmoji] = useState("");
  const [grupoEmoji, setGrupoEmoji] = useState(0);
  const [loading, setLoading] = useState(false);

  const verificarCodigo = () => {
    setErrCodigo("");
    const data = CODIGOS[codigo.trim().toUpperCase()];
    if (!data) { setErrCodigo("Código inválido. Pedile uno a Casa Matriz."); return; }
    setCodigoData(data);
    setStep(2);
  };

  const verificarForm = () => {
    setErrForm("");
    if (!nombre.trim())         { setErrForm("Ingresá tu nombre completo."); return; }
    if (!email.includes("@"))   { setErrForm("Email inválido."); return; }
    if (pass.length < 6)        { setErrForm("La contraseña debe tener al menos 6 caracteres."); return; }
    if (pass !== pass2)         { setErrForm("Las contraseñas no coinciden."); return; }
    setStep(3);
  };

  const finalizar = async () => {
    if (!emoji) return;
    setLoading(true);

    const profile = {
      nombre:  nombre.trim(),
      email:   email.trim().toLowerCase(),
      perfil:  codigoData.perfil,
      local:   codigoData.local,
      emoji,
    };

    try {
      if (IS_CONFIGURED && await loadAuth()) {
        const cred = await _createUser(auth, profile.email, pass);
        await _ffSetDoc(_ffDoc(db, "users", cred.user.uid), profile);
        onRegistered({ id: cred.user.uid, ...profile });
      } else {
        // Mock fallback
        onRegistered({ id: `u_${Date.now()}`, pass, ...profile });
      }
    } catch (e) {
      const msg = e.code === "auth/email-already-in-use"
        ? "Ese email ya tiene una cuenta. Usá el login."
        : e.code === "auth/invalid-email"
        ? "Email inválido."
        : "Error al registrarte. Intentá de nuevo.";
      setErrForm(msg);
      setStep(2);
    }
    setLoading(false);
  };

  const perfil = codigoData ? PERFILES[codigoData.perfil] : PERFILES.manicura;
  const color  = perfil.color;

  return (
    <div style={{
      minHeight: "100vh", background: B.pinkBg,
      display: "flex", flexDirection: "column",
      maxWidth: 430, margin: "0 auto",
      fontFamily: "'Lato', sans-serif", position: "relative", overflow: "hidden",
    }}>
      <PatternBg opacity={0.04} id="reg-bg" />

      <div style={{ position: "relative", padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: B.coolGray, border: `1px solid ${B.glacier}`, borderRadius: 8, padding: "6px 13px", fontSize: 10, color: B.mid, fontWeight: 700 }}>
          ← Volver
        </button>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: B.text, fontWeight: 300 }}>Registro</div>
          <div style={{ fontSize: 8, color: B.mid }}>Paso {step} de 3</div>
        </div>
      </div>

      <div style={{ position: "relative", padding: "12px 20px 0" }}>
        <div style={{ height: 3, background: B.coolGray, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${(step / 3) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${color}80, ${color})`, borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>
      </div>

      <div style={{ position: "relative", padding: "24px 20px 40px", flex: 1 }}>

        {step === 1 && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <Destello size={32} color={B.goldLight} style={{ display: "block", margin: "0 auto 12px" }} />
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: B.text, fontWeight: 300, marginBottom: 6 }}>
                Código de invitación
              </div>
              <div style={{ fontSize: 11, color: B.mid, lineHeight: 1.6 }}>
                Tu administradora te envió un código único.<br />Sin código no es posible registrarse.
              </div>
            </div>
            <input
              value={codigo}
              onChange={e => { setCodigo(e.target.value); setErrCodigo(""); }}
              onKeyDown={e => e.key === "Enter" && verificarCodigo()}
              placeholder="NIKI-CM-2026"
              style={{
                width: "100%", padding: "14px 16px", marginBottom: errCodigo ? 8 : 16,
                border: `1.5px solid ${B.pinkLight}`, borderRadius: 12,
                fontSize: 15, color: B.text, background: B.white, textAlign: "center",
                letterSpacing: 2, fontWeight: 700, textTransform: "uppercase",
              }}
            />
            {errCodigo && <div style={{ fontSize: 10, color: B.red, marginBottom: 10, textAlign: "center", padding: "6px 12px", background: B.redPale, borderRadius: 8 }}>{errCodigo}</div>}
            <button onClick={verificarCodigo} style={{ width: "100%", padding: 14, borderRadius: 12, fontSize: 13, fontWeight: 700, color: B.white, background: `linear-gradient(135deg, ${B.pink}, ${B.pinkDeep})` }}>
              Verificar código
            </button>
            <div style={{ marginTop: 16, padding: 12, background: B.goldPale, borderRadius: 10, fontSize: 9, color: B.mid, textAlign: "center" }}>
              Códigos: NIKI-CM-2026 · NIKI-MAN-2026 · NIKI-ENC-2026 · NIKI-FRQ-2026 · NIKI-INV-2026
            </div>
          </div>
        )}

        {step === 2 && codigoData && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 20,
                background: `${color}15`, border: `1px solid ${color}40`, marginBottom: 12,
              }}>
                <Destello size={8} color={color} />
                <span style={{ fontSize: 9, color, fontWeight: 700 }}>{PERFILES[codigoData.perfil].label.toUpperCase()}</span>
                {codigoData.local && <span style={{ fontSize: 9, color: B.mid }}>· {codigoData.local}</span>}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: B.text, fontWeight: 300 }}>
                Tus datos
              </div>
            </div>
            {[
              { val: nombre, set: setNombre, placeholder: "Nombre completo", type: "text" },
              { val: email,  set: setEmail,  placeholder: "Email", type: "email" },
              { val: pass,   set: setPass,   placeholder: "Contraseña (mín. 6 caracteres)", type: "password" },
              { val: pass2,  set: setPass2,  placeholder: "Repetir contraseña", type: "password" },
            ].map((f, i) => (
              <input key={i} value={f.val} onChange={e => { f.set(e.target.value); setErrForm(""); }}
                placeholder={f.placeholder} type={f.type}
                style={{ width: "100%", padding: "13px 16px", marginBottom: 10, border: `1.5px solid ${B.pinkLight}`, borderRadius: 12, fontSize: 13, color: B.text, background: B.white }}
              />
            ))}
            {errForm && <div style={{ fontSize: 10, color: B.red, marginBottom: 10, textAlign: "center", padding: "6px 12px", background: B.redPale, borderRadius: 8 }}>{errForm}</div>}
            <button onClick={verificarForm} style={{ width: "100%", padding: 14, borderRadius: 12, fontSize: 13, fontWeight: 700, color: B.white, background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
              Continuar →
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{emoji || "✨"}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: B.text, fontWeight: 300, marginBottom: 4 }}>
                Tu avatar
              </div>
              <div style={{ fontSize: 11, color: B.mid }}>Este emoji te va a representar en toda la app.</div>
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", scrollbarWidth: "none" }}>
              {EMOJI_GRUPOS.map((g, i) => (
                <button key={i} onClick={() => setGrupoEmoji(i)} style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 9, fontWeight: 700, whiteSpace: "nowrap",
                  background: grupoEmoji === i ? color : B.white,
                  color: grupoEmoji === i ? B.white : B.mid,
                  border: `1px solid ${grupoEmoji === i ? color : B.glacier}`,
                }}>
                  {g.label}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 20 }}>
              {EMOJI_GRUPOS[grupoEmoji].items.map(em => (
                <button key={em} onClick={() => setEmoji(em)} style={{
                  fontSize: 26, padding: 8, borderRadius: 10, aspectRatio: "1",
                  background: emoji === em ? `${color}20` : B.white,
                  border: `2px solid ${emoji === em ? color : B.pinkLight}`,
                  transition: "all 0.15s",
                }}>
                  {em}
                </button>
              ))}
            </div>

            <button onClick={finalizar} disabled={!emoji || loading} style={{
              width: "100%", padding: 14, borderRadius: 12, fontSize: 13, fontWeight: 700,
              color: emoji ? B.white : B.mid,
              background: emoji ? `linear-gradient(135deg, ${color}, ${color}cc)` : B.coolGray,
              transition: "all 0.2s",
            }}>
              {loading ? "Creando cuenta..." : emoji ? "¡Listo! Entrar a NIKI OS ✨" : "Elegí un emoji para continuar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
