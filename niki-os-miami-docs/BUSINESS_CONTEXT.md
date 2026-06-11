# BUSINESS_CONTEXT.md — Contexto del Negocio (Miami)

## NIKI BEAUTY BAR — MIAMI

### Descripción
Operación de Niki Beauty Bar en **Miami, USA** — la expansión internacional de la cadena luxury de salones de uñas fundada por Nicole Barat en Buenos Aires. El local de Miami nace de la adquisición de la operación de **Umara Miami**. Posicionamiento luxury, igual que la marca madre.

### Datos clave
- **Fundadora:** Nicole Barat
- **Mercado:** Miami, USA (expansión 2026)
- **Origen:** Adquisición de la operación de Umara Miami
- **Moneda:** Dólar estadounidense (US$)
- **Estado:** Flagship USA — en obra civil / apertura 2026
- **Modelo de la app:** Mono-local, operado por Encargada + manicuras

### Referencia de posicionamiento
Nail'd It Londres (@wenaildit) — 187K seguidores en Instagram, 28 locales globales

---

## ESTRUCTURA OPERATIVA EN MIAMI

A diferencia de la red de Buenos Aires, en Miami la app contempla **solo dos roles**:

| Rol | Color Destello | Responsabilidad |
|-----|---------------|-----------------|
| **Encargada** | Teal `#7A9E9F` | Administra el local y la app. Genera códigos de invitación, gestiona rewards, aprueba ideas, carga turnos, hace los 1:1, gestiona skills. |
| **Manicura** | Rosa suave `#DDA4AE` | Equipo del salón. Usa el cotizador, acumula y canjea rewards, propone ideas, ve sus 1:1 y su skill, lee comunicaciones y novedades. |

> **No existen** en esta versión: Casa Matriz, Franquiciada, Inversor. Todo lo administrativo queda en la Encargada.

---

## MANICURAS — DATOS DE SKILL

El sistema de skill es el mismo de la marca: el skill % = servicios del menú que domina / total de servicios del menú. El equipo de Miami se carga al hacer onboarding.

> ⚠️ **PENDIENTE:** Listado real del equipo de manicuras de Miami (nombre + skill %). Mientras tanto se usan los niveles del sistema de la marca.

---

## SISTEMA DE NIVELES Y COMISIONES

El sistema de niveles Junior / Senior / Master es brand-wide. Las comisiones de Miami pueden diferir por el contexto laboral de USA.

| Nivel | Requisito (skill) | Comisión (BsAs ref.) |
|-------|-------------------|----------------------|
| Junior | ≤ 60% del menú | 35% |
| Senior | 61-85% del menú | 38% |
| Master | 86-100% del menú | 40% |

> ⚠️ **PENDIENTE:** Confirmar el esquema de comisiones aplicable en Miami (USA). Mientras tanto se muestran los porcentajes de referencia de la marca.

---

## MENÚ DE SERVICIOS

El menú base es el de Niki Beauty Bar. El skill de cada manicura se mide por cuántos servicios domina. Grupos principales:

- Semipermanente básico
- Kapping (gel)
- Kapping complejo
- Acrílico
- Baby boomer (esponja y pincel)
- Aura nails
- Nail art (simple y complejo)
- Pestañas
- Pedicura
- Tratamientos adicionales

> ⚠️ **PENDIENTE:** Confirmar el menú y la cantidad exacta de servicios del local de Miami (puede diferir del de BsAs).

---

## VALORES DE LA MARCA

- Luxury accesible — no exclusiva, pero sí premium
- El detalle importa — las uñas son "el accesorio que siempre llevás puesto"
- Autocuidado como necesidad, no como lujo
- Comunidad interna fuerte — todas se cuidan y crecen juntas
- El café, la conversación y la experiencia son parte del servicio

---

## NOTAS PARA EL DESARROLLO

1. **Idioma:** Todo en español. Usar "vos" en lugar de "tú" (mismo tono que la marca).
2. **Moneda:** Dólares estadounidenses (US$). Usar `toLocaleString("en-US")` para formatear (ej: `US$ 1,250`).
3. **Fechas:** Formato "15 Abr 2026" (consistente con la marca).
4. **Sin nombres en login:** Solo los 2 roles (Encargada / Manicura). Sin nombres de personas.
5. **Tono:** Cálido, femenino, empoderador. No corporativo.
6. **Admin = Encargada:** Cualquier función que en BsAs hacía Casa Matriz, en Miami la hace la Encargada.
