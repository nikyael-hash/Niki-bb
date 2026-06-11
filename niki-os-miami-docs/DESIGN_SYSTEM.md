# DESIGN_SYSTEM.md — Sistema de Diseño de NIKI OS MIAMI

## IMPORTANTE
La identidad visual de Miami es **idéntica** a la de la marca. No se cambia ningún color, tipografía ni espaciado. Lo único que cambia respecto a BsAs es que hay **2 perfiles** en lugar de 5 y el ticker menciona Miami. Todo lo demás es exactamente igual al `DESIGN_SYSTEM.md` original.

---

## 1. PALETA DE COLORES

```javascript
const B = {
  // Rosas (colores principales de la marca)
  pink:        "#DDA4AE",   // Rosa suave — color manicura, elementos primarios
  pinkLight:   "#F2D6DA",   // Rosa claro — borders, backgrounds
  pinkDeep:    "#C4808C",   // Rosa profundo — botones activos
  pinkBg:      "#FDF5F6",   // Rosa fondo — background de pantallas

  // Dorados (premios, UI premium)
  gold:        "#A67A2E",   // Dorado oscuro — texto gold
  goldLight:   "#CAA150",   // Dorado claro — badges
  goldPale:    "#F5EDD8",   // Dorado pálido — fondos gold

  // Neutros
  white:       "#FFFFFF",
  coolGray:    "#F1F1F2",   // Background general de la app
  glacier:     "#D0D2D3",   // Borders inactivos
  mid:         "#7A6A6C",   // Texto secundario
  text:        "#3D2B2D",   // Texto principal

  // Semáforos
  green:       "#5A9E6E",   // Éxito, aprobado, disponible
  greenPale:   "#EBF5EE",
  red:         "#C0392B",   // Error, urgente
  redPale:     "#FDECEA",

  // Perfiles
  teal:        "#7A9E9F",   // Encargada
  tealPale:    "#EBF5F5",
  purple:      "#9B8EA6",   // Categoría capacitación
  purplePale:  "#F0EDF5",
  orange:      "#E07A30",   // Advertencias
  orangePale:  "#FEF0E4",
};
```

### Colores por perfil (CRÍTICOS — no cambiar)
En Miami solo hay 2 perfiles:
```javascript
const PERFIL_COLORS = {
  encargada: { color: "#7A9E9F", glow: "rgba(122,158,159,0.4)" },
  manicura:  { color: "#DDA4AE", glow: "rgba(221,164,174,0.4)" },
};
```

---

## 2. TIPOGRAFÍA

### Fuentes (Google Fonts)
```
Cormorant Garamond — pesos: 300, 400 (normal e italic)
  Uso: Títulos principales, nombre "NIKI", subtítulos elegantes, frases

Lato — pesos: 300, 400, 700
  Uso: Todo el body text, botones, labels, navegación
```

### Escala tipográfica
```
NIKI logo:        64px Cormorant Garamond 300, letter-spacing: 16px
Títulos grandes:  24-28px Cormorant Garamond 300
Títulos módulo:   16-20px Cormorant Garamond 300
Body regular:     12-13px Lato 400
Labels:           8-9px Lato 700 (MAYÚSCULAS con letter-spacing: 2-3px)
Microtexto:       7px Lato 700 (letter-spacing: 2px)
Números métricas: Georgia serif (fallback de Cormorant para números)
```

### NOTA CRÍTICA sobre el logo NIKI
El `letterSpacing: 16` desplaza el texto a la derecha. Para centrarlo:
```css
paddingLeft: 16px;  /* Compensar el letterSpacing */
textAlign: center;
```

---

## 3. EL DESTELLO ✦

El destello de 4 puntas es el ícono signature de Niki Beauty Bar.

```jsx
const Destello = ({size=16, color="#CAA150", style={}}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
    <path d="M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z"/>
  </svg>
);
```

### Animaciones del destello
```css
@keyframes destelloSpin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes destelloFloat  { 0%,100%{transform:translateY(0);opacity:.6} 50%{transform:translateY(-7px) rotate(15deg);opacity:1} }
@keyframes destelloPulse  { 0%,100%{opacity:.35;transform:scale(.85)} 50%{opacity:1;transform:scale(1.1)} }
@keyframes glowPulse      { 0%,100%{filter:blur(55px);opacity:.25} 50%{filter:blur(70px);opacity:.5} }
```
En el login, el glow cambia entre **teal** (encargada) y **rosa** (manicura) según el perfil seleccionado.

---

## 4. PATRÓN DE FONDO

```jsx
const PatternBg = ({opacity=0.05, id="pp"}) => (
  <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity,pointerEvents:"none"}}>
    <defs>
      <pattern id={id} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="18" fill="none" stroke="#A67A2E" strokeWidth="0.6"/>
        <circle cx="0"  cy="0"  r="18" fill="none" stroke="#A67A2E" strokeWidth="0.6"/>
        <circle cx="40" cy="0"  r="18" fill="none" stroke="#A67A2E" strokeWidth="0.6"/>
        <circle cx="0"  cy="40" r="18" fill="none" stroke="#A67A2E" strokeWidth="0.6"/>
        <circle cx="40" cy="40" r="18" fill="none" stroke="#A67A2E" strokeWidth="0.6"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`}/>
  </svg>
);
```
Uso: opacity entre 0.03 y 0.06, siempre `position:absolute` dentro de un `overflow:hidden`.

---

## 5. COMPONENTES BASE

Idénticos a la marca: Avatar (Bubble), Badge de perfil, Tarjeta de módulo (con barra de color en el top), Barra de progreso con color semáforo. Ver el `niki-os-prototype.jsx` del paquete original como referencia exacta.

```jsx
const Bubble = ({emoji, color, size=40}) => (
  <div style={{
    width:size, height:size, borderRadius:"50%",
    background:`${color}18`, border:`2px solid ${color}50`,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:size*0.44, flexShrink:0,
  }}>{emoji}</div>
);
```

---

## 6. LAYOUT

```
maxWidth: 430px
margin: 0 auto
background: #F1F1F2 (coolGray) para pantallas con contenido
background: #FDF5F6 (pinkBg) para login/registro
```

### Bottom navigation bar
```
position: fixed, bottom: 0
3 tabs: Inicio (◆), Módulos (⊞), Stay Tuned (✨)
```

---

## 7. ANIMACIONES GLOBALES

```css
@keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes shimmer   { 0%,100%{opacity:.5} 50%{opacity:1} }
@keyframes softPulse { 0%,100%{opacity:1} 50%{opacity:.6} }
@keyframes ticker    { from{transform:translateX(100%)} to{transform:translateX(-100%)} }
@keyframes spin      { to{transform:rotate(360deg)} }
```

---

## 8. TICKER (marquee del header) — versión Miami

```
Textos: "✨  NIKI OS MIAMI v1.0" | "◆  MIAMI FLAGSHIP" | "🧪  NIKI LAB ACTIVO" |
        "✨  JUNIOR → MASTER" | "💅  WELCOME TO NIKI MIAMI"
Velocidad: animation: ticker 28s linear infinite
Colores alternos: rosa (#DDA4AE) y dorado (#CAA150)
Height: 22px, borderBottom coolGray
```
