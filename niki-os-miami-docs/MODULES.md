# MODULES.md — Módulos de NIKI OS MIAMI

Versión mono-local (Miami) con 2 perfiles: **Encargada** (admin) y **Manicura**. 10 módulos.

---

## MÓDULO 1: COMUNICACIONES 💬
**ID:** `comunicaciones`
**Acceso:** Encargada (publica + fija), Manicura (lee + reacciona + publica)

### Funcionalidad
Canal de comunicación interna del local de Miami. Feed de mensajes con categorías.

### Categorías de mensajes
| ID | Label | Color |
|----|-------|-------|
| urgente | Urgente | Rojo `#C0392B` |
| operaciones | Operaciones | Teal `#7A9E9F` |
| capacitacion | Capacitación | Púrpura `#9B8EA6` |
| marketing | Marketing | Rosa `#DDA4AE` |
| rrhh | RRHH | Dorado `#CAA150` |

### Estructura de un mensaje
```
id, perfil (quién lo publicó), emoji, nombre, categoría, texto, fecha, fijado (bool),
reacciones: { like: int, love: int, star: int }
```

### Reglas
- La **Encargada** puede fijar mensajes (📌) — reemplaza el poder de Casa Matriz
- Cualquier perfil puede publicar y reaccionar
- Los mensajes fijados aparecen al tope
- Reacciones: 👍 like, 💖 love, ⭐ star

---

## MÓDULO 2: NIKI REWARDS ✨
**ID:** `rewards`
**Acceso:** Encargada (gestiona), Manicura (acumula + canjea)

### Concepto
Sistema de puntos interno. Las manicuras acumulan **destellos** y los canjean por premios del catálogo. La **Encargada** carga/ajusta destellos y aprueba canjes.

> ⚠️ **PENDIENTE:** Definir la tasa "1 Destello = US$ ?" y el catálogo real de premios de Miami.

### Catálogo de premios (Miami — USD)

> ⚠️ **VALORES DE EJEMPLO.** Reemplazar con el catálogo real de Miami.

| Destellos | Premio | Valor aprox. (USD) |
|-----------|--------|--------------------|
| 30 | Efectivo | US$ 30 |
| 200 | Merchandising Niki BB | US$ 200 |
| 350 | Vaso Stanley | US$ 350 |
| 500 | Set Victoria's Secret + Cena para dos | US$ 500 |
| 800 | Lapicera Swarovski | US$ 800 |
| 1.000 | Tablet | US$ 1,000 |
| 2.000 | iPad | US$ 2,000 |
| ... | ... | ... |

### Tabs
1. **Ranking** — Manicuras del local ordenadas por destellos, con barra de progreso al próximo premio
2. **Catálogo** — Todos los premios con filtros por categoría

---

## MÓDULO 3: COTIZADOR IA 💅
**ID:** `cotizador`
**Acceso:** Encargada, Manicura

### Flujo
1. **Paso 1:** (Si aplica) seleccionar forma de pago. En Miami hay un solo nivel de precio (mono-local), así que se elimina la selección "Estándar/Premium" del original.
2. **Paso 2:** Subir foto del diseño de uñas (cámara o galería)
3. **Paso 3:** Claude API analiza la imagen y devuelve el precio en USD

### Integración Claude API
```javascript
// La imagen va en base64
// El prompt incluye la tabla de precios USD de Miami
// Respuesta esperada en JSON:
{
  "nivel": "incluido" | "simple" | "complejo",
  "precio": 0 | 12 | 20,    // USD — VALORES DE EJEMPLO, reemplazar
  "diseno": "Baby boomer con nail art de flores",
  "justificacion": "El diseño incluye baby boomer en todas las uñas...",
  "elementos": ["baby boomer", "flores en relieve"],
  "tip": "Para un mejor resultado, asegurate de preparar la cutícula antes..."
}
```

### Tabla de precios
Ver `PRODUCT_SPEC.md` sección 2. ⚠️ Pendiente lista real de Miami.

---

## MÓDULO 4: NIKI LAB 🧪
**ID:** `lab`
**Acceso:** Encargada (cambia estado), Manicura (propone + vota + comenta)

### Concepto
Ideas del equipo. Cualquiera propone una idea. Todos votan y comentan. Solo la **Encargada** puede cambiar el estado (reemplaza a Casa Matriz).

### Categorías de ideas
| ID | Label | Emoji | Color |
|----|-------|-------|-------|
| colores | Colores | 🎨 | Rosa |
| productos | Productos | 💅 | Dorado |
| proyectos | Proyectos | 🚀 | Teal |
| servicios | Servicios | ✨ | Púrpura |
| operaciones | Operaciones | ⚙️ | Verde |

### Estados de una idea
| ID | Label | Quién puede cambiar |
|----|-------|---------------------|
| nueva | Nueva 💡 | Automático al publicar |
| analisis | En análisis 🔍 | Solo Encargada |
| aprobada | Aprobada ✅ | Solo Encargada |
| descartada | Descartada ✕ | Solo Encargada |

### Estructura de idea
```
id, perfil, emoji, titulo, categoria, descripcion, estado, fecha,
votos: { encargada: 0|1, manicura: 0|1 },
votantes: [userIds],
comentarios: [{ perfil, emoji, texto, fecha }]
```

### Reglas
- Cada usuario vota una vez (toggle)
- Las ideas se ordenan por total de votos
- Filtros por categoría y por estado

---

## MÓDULO 5: RRHH & TURNOS 👥
**ID:** `rrhh`
**Acceso:** Encargada (gestiona todo), Manicura (ve sus turnos)

### Funcionalidades
- Listado del equipo del local con nivel (Junior/Senior/Master), estado y contacto
- Gestión de turnos (mañana/tarde) por día de la semana
- Registro de vacantes activas del local
- Historial de ingresos

La Manicura ve **solo sus propios turnos** (lectura). La Encargada gestiona el equipo completo.

---

## MÓDULO 6: PLAN DE CARRERA 🌱
**ID:** `plan_carrera`
**Acceso:** Encargada (sobre todas sus manicuras), Manicura (solo el propio)

### Permisos de edición
| Quién | Puede editar sobre |
|-------|--------------------|
| Encargada | Todas las manicuras del local |
| Manicura | Solo sus notas propias |

### Registro 1:1
Campos de cada reunión 1:1:
- Fecha de la reunión
- Fecha del próximo 1:1
- Escala de desempeño 1-5: Crítico / A mejorar / En desarrollo / Muy bueno / Excepcional
- Notas de la reunión
- Plan de mejora
- Objetivos acordados (lista de ítems)
- Quién lo registró

---

## MÓDULO 7: SKILLS 📊
**ID:** `skills`
**Acceso:** Encargada (carga y edita), Manicura (ve el propio)

### Concepto
Registro del % de skill de cada manicura, que determina su nivel (Junior/Senior/Master) y su comisión.

### Funcionalidades
- Tabla de los servicios del menú (⚠️ confirmar menú de Miami)
- Registro de % de skill por manicura (servicios que domina / total)
- Historial de skill reviews
- Cálculo automático de nivel: Junior ≤60%, Senior 61-85%, Master 86-100%
- La Manicura ve su propio skill, su nivel y qué le falta para subir

---

## MÓDULO 8: FRASES DEL CAFÉ ☕
**ID:** `frases`
**Acceso:** Encargada (la Manicura puede tener acceso de lectura si se desea)

### Concepto
30 frases inspiracionales estilo Pinterest para compartir con las clientas durante el servicio.

### Categorías
- 🔥 Actitud
- 👑 Poder
- 💅 Belleza
- 🌸 Bienestar
- 😏 Humor

### Ejemplos de frases
- "A mal día, lindas uñas."
- "Ella no espera que la arreglen. Ella se arregla sola."
- "Manicura hecha, semana ganada."
- "El autocuidado no es un lujo. Es una necesidad."
- "Café, uñas y buena vibra. El plan perfecto."

### Funcionalidades
- Layout masonry 2 columnas (estilo Pinterest)
- Frase del día (cambia con la fecha)
- Favoritas (tab separado)
- Copiar frase al portapapeles
- Búsqueda por texto y filtros por categoría

---

## MÓDULO 9: STAY TUNED ✨
**ID:** `blog`
**Acceso:** Encargada, Manicura

### Concepto
Feed de novedades, eventos y lanzamientos del local de Miami. Las tarjetas se expanden al tocar.

### Posts iniciales (sugeridos)
1. **Apertura Miami flagship** — Cuenta regresiva / novedades de la apertura
2. **Niki Lab activo** — Invitación al módulo
3. **NIKI OS Miami v1.0** — Lanzamiento del sistema
4. **Junior → Senior → Master** — Sistema de niveles y skills

> ⚠️ **PENDIENTE:** Eventos y fechas propias del local de Miami.

---

## MÓDULO 10: YOUTUBE ▶️
**ID:** `youtube`
**Acceso:** Encargada, Manicura

- Link al canal oficial de Niki Beauty Bar (⚠️ pendiente de confirmar URL)
