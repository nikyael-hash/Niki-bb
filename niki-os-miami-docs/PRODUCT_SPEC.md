# PRODUCT_SPEC.md — Especificación Completa de NIKI OS MIAMI

## 1. VISIÓN DEL PRODUCTO

NIKI OS Miami es el sistema operativo interno del **local de Miami** de Niki Beauty Bar. A diferencia de la app de la red de Buenos Aires, esta versión es **mono-local** y conecta solo a dos actores: la **Encargada** (que administra) y las **Manicuras** (el equipo).

**Posicionamiento:** Luxury nail bar — referencia: Nail'd It Londres (@wenaildit, 187K seguidores, 28 locales globales)
**Mercado:** Miami, USA (expansión 2026, origen: adquisición de Umara Miami)
**Moneda:** Dólar estadounidense (US$)
**Idioma:** Español

---

## 2. NEGOCIO

### Estructura operativa
- **1 local:** Miami flagship (USA)
- **2 roles:** Encargada (admin) + Manicura (equipo)
- **Sin** Casa Matriz, Franquiciada ni Inversor en esta versión

### Sistema de niveles de manicuras
| Nivel | Skill requerido | Comisión (ref. marca) |
|-------|----------------|------------------------|
| Junior | ≤ 60% del menú | 35% |
| Senior | 61-85% del menú | 38% |
| Master | 86-100% del menú | 40% |

El % de skill = servicios que domina / total de servicios del menú.

> ⚠️ **PENDIENTE:** Confirmar comisiones aplicables en Miami (USA) y cantidad de servicios del menú local.

### Precios del cotizador (Miami — USD)

> ⚠️ **PENDIENTE — VALORES DE EJEMPLO.** Reemplazar con la lista real de Miami. Como el local de Miami es único, se asume un solo nivel de precio (no hay "estándar/premium" como en BsAs). Confirmar si aplica distinción por forma de pago.

| Tipo | Descripción | Precio (USD) — ejemplo |
|------|-------------|------------------------|
| INCLUIDO | Francesita, líneas, baby shine, chromas 1 tono, strass, corazones (2), french 4 uñas | US$ 0 |
| SIMPLE ×2 | Baby boomer esponja/pincel — 1 por mano | US$ 12 |
| COMPLEJO | Baby boomer/aura todas las uñas, diseños elaborados | US$ 20 |

---

## 3. AUTENTICACIÓN Y REGISTRO

### Sistema de login
- **Email + contraseña** (mínimo 6 caracteres)
- NO hay login por nombre de usuario
- La pantalla de login muestra **solo 2 perfiles**: Encargada y Manicura

### Sistema de registro (3 pasos)
1. **Paso 1 — Código de invitación:** La **Encargada** genera un código único que ya tiene el perfil asignado. Sin código no se puede registrar.
2. **Paso 2 — Datos personales:** Nombre completo, email, contraseña, repetir contraseña.
3. **Paso 3 — Emoji de avatar:** El usuario elige un emoji de 4 grupos (Caras, Brillos, Flores, Gestos). Este emoji es su avatar en toda la app.

### Códigos de invitación (estructura)
```
Formato: NIKI-MIA-[TIPO]-[AÑO]
Ejemplos:
  NIKI-MIA-ENC-2026   → perfil: encargada,  local: "Miami"
  NIKI-MIA-MAN-2026   → perfil: manicura,   local: "Miami"
```
Cada código es de un solo uso. La **Encargada** los genera desde el panel de administración.

> Nota: el primer acceso de la Encargada se puede sembrar (seed) directamente en la base, ya que no hay Casa Matriz que le genere el código. Ver `CLAUDE_CODE_GUIDE.md`.

---

## 4. PERFILES Y PERMISOS

### Los 2 perfiles del sistema
| Perfil | Color Destello | Descripción |
|--------|---------------|-------------|
| Encargada | Teal `#7A9E9F` | Admin del local. Hereda los poderes administrativos (códigos, rewards, aprobación de ideas, turnos, 1:1, skills). |
| Manicura | Rosa suave `#DDA4AE` | Manicura del equipo. |

### Permisos por módulo
```
encargada (admin):  comunicaciones, rewards, cotizador, lab, frases,
                    blog, rrhh, plan_carrera, skills, youtube
                    + admin: códigos de invitación, gestión de rewards,
                      cambio de estado de ideas, gestión de skills

manicura:           cotizador, rewards, lab, blog, rrhh (solo lectura
                    de turnos propios), plan_carrera (solo el propio),
                    skills (solo el propio), youtube, comunicaciones (lectura)
```

### Resumen de poderes admin de la Encargada (reemplazan a Casa Matriz)
- Generar y revocar códigos de invitación
- Cargar y ajustar destellos de rewards / marcar canjes
- Cambiar el estado de las ideas en Niki Lab (análisis / aprobada / descartada)
- Fijar mensajes en Comunicaciones
- Cargar turnos y gestionar el equipo en RRHH
- Registrar 1:1 en Plan de Carrera
- Cargar y actualizar el skill % de cada manicura

---

## 5. MÓDULOS — RESUMEN

Ver `MODULES.md` para especificación detallada de cada uno. Se recortó la lista de 16 (BsAs) a **10** módulos relevantes para un mono-local con 2 roles.

| ID | Nombre | Estado | Prioridad |
|----|--------|--------|-----------|
| comunicaciones | Comunicaciones | ✅ Funcional | Alta |
| rewards | Niki Rewards | ✅ Funcional | Alta |
| cotizador | Cotizador IA | ✅ Funcional (usa Claude API) | Alta |
| lab | Niki Lab | ✅ Funcional | Alta |
| rrhh | RRHH & Turnos | ✅ Funcional | Alta |
| plan_carrera | Plan de Carrera | ✅ Funcional | Media |
| skills | Skills | ✅ Funcional | Media |
| frases | Frases del Café | ✅ Funcional | Media |
| blog | Stay Tuned | ✅ Funcional | Media |
| youtube | YouTube | 🔄 Link pendiente | Baja |

### Módulos de BsAs que NO van en Miami
`obras`, `auditorias`, `proyectos`, `stock`, `inversores`, `manicuras` (solicitud entre locales) — son funciones de Casa Matriz / Franquiciada / Inversor o tienen sentido solo en una red multi-local.

---

## 6. FLUJO DE NAVEGACIÓN

```
App
├── Login (email + contraseña) — 2 perfiles: Encargada / Manicura
│   └── → Registro (código → datos → emoji)
└── App Principal
    ├── Tab: Inicio
    │   ├── Bienvenida personalizada (emoji + nombre + perfil)
    │   ├── Stats del local (equipo, skill promedio, destellos del mes)
    │   └── Acceso rápido a los módulos principales
    ├── Tab: Módulos
    │   └── Grid de los 10 módulos (con 🔒 si la manicura no tiene acceso admin)
    └── Tab: Stay Tuned
        └── Blog con novedades del local de Miami
```

---

## 7. DISEÑO VISUAL — REGLAS CRÍTICAS

La identidad visual es **idéntica** a la marca. Ver `DESIGN_SYSTEM.md`. No se cambia ningún color, tipografía ni el destello.

1. **Destello ✦** — ícono de 4 puntas, firma de Niki BB. SVG: `M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z`
2. **Tipografía:** Cormorant Garamond (títulos) + Lato (body)
3. **Logo NIKI** — `fontSize: 64, letterSpacing: 16, paddingLeft: 16` para centrar
4. **Login** — solo los **2 perfiles** como opciones. Los destellos cambian de color según el perfil seleccionado (teal encargada / rosa manicura).
5. **maxWidth: 430px** — mobile-first.

---

## 8. INTEGRACIÓN CON CLAUDE API

El cotizador de nail art usa la API de Anthropic directamente (igual que la marca), adaptado a precios USD de un solo nivel.

```javascript
// Endpoint
POST https://api.anthropic.com/v1/messages

// Modelo
claude-sonnet-4-20250514

// Flujo
1. La manicura sube una foto del diseño de uñas
2. (Si aplica) selecciona forma de pago
3. La imagen se envía en base64 junto con un prompt que incluye la tabla de precios USD de Miami
4. Claude devuelve JSON con: nivel, precio, diseño detectado, justificación, elementos, tip

// Formato de respuesta esperado
{
  "nivel": "incluido" | "simple" | "complejo",
  "precio": number,        // en USD
  "diseno": "descripción breve",
  "justificacion": "1-2 oraciones",
  "elementos": ["elemento1", "elemento2"],
  "tip": "consejo profesional"
}
```

**IMPORTANTE:** La API key se maneja del lado del servidor (nunca expuesta en el frontend).

---

## 9. PENDIENTES PARA CERRAR LA VERSIÓN MIAMI

- [ ] Tabla de precios real del cotizador (USD)
- [ ] Catálogo de Niki Rewards en USD + tasa "1 destello = US$ ?"
- [ ] Esquema de comisiones aplicable en Miami (USA)
- [ ] Menú de servicios y cantidad total (para el cálculo de skill)
- [ ] Listado real del equipo de manicuras de Miami
- [ ] Evento / novedades propias del local de Miami para Stay Tuned
- [ ] URL del canal de YouTube (si aplica)
