# NIKI OS MIAMI — Sistema Operativo del Local de Miami

## ¿Qué es NIKI OS Miami?

NIKI OS Miami es la versión dedicada de NIKI OS para la operación de **Niki Beauty Bar en Miami, USA**. A diferencia de la app general de la red (Buenos Aires), esta versión es **mono-local** y está pensada exclusivamente para las dos personas que hacen funcionar el salón día a día:

- **Encargada** — administra el local y la app (rol admin de Miami)
- **Manicura** — el equipo del salón

No hay Casa Matriz, Franquiciada ni Inversor en esta versión. Todo lo administrativo (códigos de invitación, rewards, aprobación de ideas) lo maneja la **Encargada**.

**Stack requerido:** React Native (iOS + Android) o React Web PWA
**Diseño:** Mobile-first, máximo 430px de ancho — idéntico a la marca (no se modifica)
**Base de datos:** Firebase Firestore (recomendado) o Supabase
**Auth:** Firebase Auth con email/contraseña
**IA:** Anthropic Claude API (claude-sonnet-4-20250514) — integrada en el cotizador
**Moneda:** Dólar estadounidense (US$) — formato `toLocaleString("en-US")`
**Idioma:** Español (mismo tono cálido que la app original)

---

## Diferencias clave vs. NIKI OS (Buenos Aires)

| Aspecto | NIKI OS (BsAs) | NIKI OS Miami |
|---------|----------------|---------------|
| Perfiles | 5 (CM, Franquiciada, Encargada, Manicura, Inversor) | **2 (Encargada, Manicura)** |
| Admin | Casa Matriz | **Encargada** |
| Locales | 14+ en red | **1 (Miami flagship)** |
| Moneda | Pesos argentinos (ARS) | **Dólares (USD)** |
| Módulos | 16 | **10 (recortado a los relevantes)** |
| Login | 5 perfiles | **2 perfiles** |

---

## Estructura del proyecto

```
niki-os-miami/
├── README.md                    ← Este archivo
├── PRODUCT_SPEC.md              ← Especificación completa de la versión Miami
├── DESIGN_SYSTEM.md             ← Colores, tipografía, componentes (idéntico a la marca)
├── MODULES.md                   ← Los 10 módulos de Miami en detalle
├── DATA_MODELS.md               ← Esquemas de base de datos (2 perfiles)
├── BUSINESS_CONTEXT.md          ← Contexto del negocio Niki BB Miami
└── CLAUDE_CODE_GUIDE.md         ← Guía de implementación con Claude Code
```

El **prototipo visual** sigue siendo `niki-os-prototype.jsx` del paquete original de NIKI OS — la identidad visual NO cambia. Esta versión Miami solo recorta perfiles y módulos.

---

## Quick Start para Claude Code

1. Leer `PRODUCT_SPEC.md` — contiene TODA la lógica de la versión Miami
2. Leer `DESIGN_SYSTEM.md` — los colores y estilos son exactos y NO deben modificarse (igual que la marca)
3. Implementar módulo por módulo según prioridad en `MODULES.md`
4. Recordar: solo 2 perfiles. La Encargada es la admin.

---

## ⚠️ PENDIENTE — Datos a confirmar

Estas tablas están con valores de ejemplo hasta recibir la lista real de Miami:

- **Tabla de precios del Cotizador** (servicios + precios USD) — ver `PRODUCT_SPEC.md` §2 y `MODULES.md` Módulo 3
- **Catálogo de Niki Rewards** (destellos → premio → valor USD) — ver `MODULES.md` Módulo 2

---

## Contacto del proyecto
**Owner:** Nicole Barat — Niki Beauty Bar
**Contexto:** Versión dedicada al local de Miami. Operada por la Encargada y el equipo de manicuras. Debe ser deployable sin configuración técnica compleja.
