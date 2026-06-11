# CLAUDE_CODE_GUIDE.md — Guía para Claude Code (Miami)

## CONTEXTO
Estás desarrollando **NIKI OS Miami** — la app interna del local de Niki Beauty Bar en Miami, USA. Es una versión **mono-local** con **2 perfiles**: Encargada (admin) y Manicura. La owner (Nicole Barat) no tiene conocimientos técnicos. El objetivo es una app production-ready que la Encargada y el equipo puedan usar desde el día 1.

> Si ya implementaste NIKI OS (BsAs): esta versión reutiliza el mismo diseño y stack, pero recorta a 2 perfiles, 1 local y montos en USD. La Encargada hereda todos los poderes de Casa Matriz.

---

## STACK RECOMENDADO

### Frontend
```
React Native con Expo (expo-router, react-native-reanimated)
  o, si se prefiere web:
Next.js 14 (App Router) + Tailwind CSS → deployable en Vercel + PWA
```

### Backend y servicios
```
Firebase: Auth (email/contraseña), Firestore, Storage, Cloud Functions
Anthropic Claude API: cotizador de nail art (API key SOLO en servidor)
```

---

## ARCHIVOS DE REFERENCIA

| Archivo | Para qué usarlo |
|---------|-----------------|
| `README.md` | Visión general y diferencias vs. BsAs |
| `PRODUCT_SPEC.md` | Toda la lógica de la versión Miami |
| `DESIGN_SYSTEM.md` | Colores, tipografía, componentes (idéntico a la marca) |
| `MODULES.md` | Los 10 módulos de Miami en detalle |
| `DATA_MODELS.md` | Esquemas de Firestore (2 perfiles) y reglas de seguridad |
| `BUSINESS_CONTEXT.md` | Contexto del negocio Miami |
| `niki-os-prototype.jsx` (del paquete original) | **PROTOTIPO FUNCIONAL** — referencia visual exacta |

---

## ORDEN DE IMPLEMENTACIÓN SUGERIDO

### Fase 1 — Base
1. Setup del proyecto (Expo / Next.js)
2. Firebase Auth — login con email/contraseña (login con **2 perfiles**)
3. Seed de la primera Encargada (no hay quien le genere el código)
4. Sistema de registro con código de invitación (3 pasos) — la Encargada genera códigos
5. Navegación base (3 tabs: Inicio, Módulos, Stay Tuned)
6. Sistema de permisos por perfil (encargada = admin)

### Fase 2 — Módulos Core
7. Comunicaciones (feed + publicar + reacciones, fijar = Encargada)
8. Niki Rewards (ranking + catálogo USD + canjes que aprueba la Encargada)
9. Cotizador IA (foto + Claude API, precios USD)
10. Niki Lab (ideas + votos + comentarios, estado = Encargada)

### Fase 3 — Operación del equipo
11. RRHH & Turnos
12. Skills (skill % → nivel → comisión)
13. Plan de Carrera (1:1)
14. Frases del Café
15. Stay Tuned / Blog
16. YouTube (link)

---

## VARIABLES DE ENTORNO REQUERIDAS

```env
# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# Anthropic (SOLO en servidor/functions — nunca en cliente)
ANTHROPIC_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://miami.nikibeautybar.com
```

---

## REGLAS CRÍTICAS

1. **Colores exactos** — Ver `DESIGN_SYSTEM.md`. No aproximar. Idénticos a la marca.
2. **Destello SVG** — `M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z`
3. **Tipografía** — Cormorant Garamond + Lato. Sin excepciones.
4. **Logo NIKI** — `fontSize: 64, letterSpacing: 16, paddingLeft: 16`
5. **maxWidth: 430px** — mobile-first.
6. **Login con 2 perfiles** — Solo Encargada / Manicura. Sin nombres de personas.
7. **Idioma** — Español. Vos, no tú.
8. **Moneda** — USD. `toLocaleString("en-US")` (ej: `US$ 1,250`).
9. **Admin = Encargada** — Toda función que en BsAs hacía Casa Matriz, acá la hace la Encargada.

---

## FLUJO DEL COTIZADOR (Claude API)

```javascript
// En Cloud Function / API Route (NUNCA en el cliente)
export async function POST(request) {
  const { imageBase64, pago } = await request.json();   // Miami: un solo nivel de precio

  const precios = getPreciosMiami(pago);   // ⚠️ cargar la tabla real de Miami (USD)

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 600,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
        { type: "text", text: `Sos la asistente de Niki Beauty Bar Miami. Analizá esta imagen de nail art y clasificala:
- INCLUIDO (US$0): Francesita, líneas, baby shine, chromas 1 tono, papel oro, strass, flores/corazones (2 total), french 4 uñas
- SIMPLE x2 (US$${precios.simple}): Baby boomer esponja/pincel, 1 por mano
- COMPLEJO (US$${precios.complejo}): Baby boomer/aura todas las uñas, diseños elaborados
Respondé SOLO JSON sin markdown: {"nivel":"incluido"|"simple"|"complejo","precio":número,"diseno":"descripción","justificacion":"1-2 oraciones","elementos":["el1","el2"],"tip":"consejo"}` }
      ]
    }]
  });

  return Response.json(JSON.parse(response.content[0].text));
}
```

---

## DATOS DE PRUEBA (seed para Firebase)

```javascript
// Usuario inicial — la Encargada se siembra directo (no hay CM que le genere el código)
const SEED_USERS = [
  { email: "encargada.miami@nikibb.com", nombre: "Encargada Miami", perfil: "encargada", local: "Miami", isAdmin: true, emoji: "🌟" },
];

// Códigos de invitación iniciales (los genera la Encargada desde admin)
const SEED_CODIGOS = [
  { codigo: "NIKI-MIA-ENC-2026", perfil: "encargada", local: "Miami" },
  { codigo: "NIKI-MIA-MAN-2026", perfil: "manicura",  local: "Miami" },
];
```

---

## PREGUNTAS FRECUENTES

**¿Por qué solo 2 perfiles?**
Miami es un único local operado por la Encargada y su equipo de manicuras. No hay Casa Matriz, Franquiciada ni Inversor local en esta versión.

**¿Quién administra si no hay Casa Matriz?**
La Encargada. Genera códigos, gestiona rewards, aprueba ideas, carga turnos, hace los 1:1 y gestiona skills.

**¿Cómo entra la primera Encargada si no hay quien le dé un código?**
Se la siembra (seed) directo en la base con `isAdmin: true`. A partir de ahí ella genera el resto de los códigos.

**¿Multi-idioma?**
No. Solo español, igual que la marca.

**¿Hay un dominio?**
Sugerido: `miami.nikibeautybar.com` o `app.nikibeautybar.com/miami`

---

## ENTREGABLES ESPERADOS

1. ✅ App funcional en iOS y Android (o PWA web)
2. ✅ Los 10 módulos operativos (no placeholders)
3. ✅ Firebase configurado con seed (Encargada inicial + códigos)
4. ✅ Precios USD reales cargados en cotizador y rewards
5. ✅ Deploy + dominio configurado
6. ✅ Instrucciones de uso para la Encargada (sin tecnicismos)

---

## ⚠️ PENDIENTES (esperando datos de Miami)

- [ ] Tabla de precios del cotizador (USD)
- [ ] Catálogo de Rewards (USD) + tasa "1 destello = US$ ?"
- [ ] Comisiones aplicables en Miami (USA)
- [ ] Menú y cantidad de servicios del local de Miami
- [ ] Equipo de manicuras real
- [ ] Eventos/novedades de Miami para Stay Tuned
- [ ] URL de YouTube
