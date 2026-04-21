export const B = {
  pink:        "#DDA4AE",
  pinkLight:   "#F2D6DA",
  pinkDeep:    "#C4808C",
  pinkBg:      "#FDF5F6",
  gold:        "#A67A2E",
  goldLight:   "#CAA150",
  goldPale:    "#F5EDD8",
  white:       "#FFFFFF",
  coolGray:    "#F1F1F2",
  glacier:     "#D0D2D3",
  mid:         "#7A6A6C",
  text:        "#3D2B2D",
  green:       "#5A9E6E",
  greenPale:   "#EBF5EE",
  red:         "#C0392B",
  redPale:     "#FDECEA",
  teal:        "#7A9E9F",
  tealPale:    "#EBF5F5",
  orange:      "#E07A30",
  orangePale:  "#FEF0E4",
  purple:      "#9B8EA6",
  purplePale:  "#F0EDF5",
  englishGreen:"#2E7D5A",
  englishGreenPale:"#E8F5EE",
};

export const PERFILES = {
  casa_matriz:  { label:"Casa Matriz",  color:"#CAA150", glow:"rgba(202,161,80,0.4)"   },
  franquiciada: { label:"Franquiciada", color:"#C4808C", glow:"rgba(196,128,140,0.4)"  },
  encargada:    { label:"Encargada",    color:"#7A9E9F", glow:"rgba(122,158,159,0.4)"  },
  manicura:     { label:"Manicura",     color:"#DDA4AE", glow:"rgba(221,164,174,0.4)"  },
  inversor:     { label:"Inversor",     color:"#2E7D5A", glow:"rgba(46,125,90,0.4)"    },
};

export const PERMISOS = {
  casa_matriz:  ["comunicaciones","rewards","cotizador","obras","rrhh","auditorias","lab","plan_carrera","proyectos","stock","manicuras","skills","youtube","blog","inversores","frases"],
  franquiciada: ["comunicaciones","rewards","cotizador","obras","auditorias","lab","youtube","blog","frases"],
  encargada:    ["comunicaciones","rewards","cotizador","rrhh","lab","youtube","blog","frases"],
  manicura:     ["cotizador","rewards","rrhh","lab","blog","youtube"],
  inversor:     ["inversores","obras","blog"],
};

export const CODIGOS = {
  "NIKI-CM-2026":  { perfil:"casa_matriz",  local:null },
  "NIKI-FRQ-2026": { perfil:"franquiciada", local:"Lomas" },
  "NIKI-ENC-2026": { perfil:"encargada",    local:"Puerto Madero" },
  "NIKI-MAN-2026": { perfil:"manicura",     local:"Adrogue" },
  "NIKI-INV-2026": { perfil:"inversor",     local:null },
};

export const EMOJI_GRUPOS = [
  { label:"Caras",   items:["😊","😎","🥰","😏","🤩","😌","🥳","😇","🤗","😄","🌸","✨"] },
  { label:"Brillos", items:["✨","💫","⭐","🌟","💎","👑","🏆","🎀","💅","💄","🔮","🦄"] },
  { label:"Flores",  items:["🌸","🌺","🌹","🌷","💐","🌻","🌼","🍀","🌿","🦋","🌙","🌈"] },
  { label:"Gestos",  items:["💅","🙌","👏","🤌","💪","🫶","❤️","🩷","🤍","🖤","💜","💛"] },
];

export const MODULES_LIST = [
  { id:"comunicaciones", emoji:"💬", label:"Comunicaciones",  color:B.pink,        desc:"Canal interno" },
  { id:"rewards",        emoji:"✨", label:"Niki Rewards",    color:"#CAA150",     desc:"Destellos" },
  { id:"cotizador",      emoji:"💅", label:"Cotizador IA",    color:B.pinkDeep,    desc:"Nail art → precio" },
  { id:"obras",          emoji:"🏗️", label:"Obras",           color:B.teal,        desc:"Aperturas" },
  { id:"rrhh",           emoji:"👥", label:"RRHH & Turnos",   color:B.purple,      desc:"Vacantes" },
  { id:"auditorias",     emoji:"📋", label:"Auditorías",       color:"#CAA150",     desc:"Misterioso Shopper" },
  { id:"lab",            emoji:"🧪", label:"Niki Lab",         color:B.green,       desc:"Ideas del equipo" },
  { id:"frases",         emoji:"☕", label:"Frases del Café",  color:B.pinkDeep,    desc:"Para clientas" },
  { id:"plan_carrera",   emoji:"🌱", label:"Plan de Carrera",  color:B.pink,        desc:"1:1 y crecimiento" },
  { id:"proyectos",      emoji:"📁", label:"Proyectos CM",     color:"#CAA150",     desc:"Gestión directoras" },
  { id:"stock",          emoji:"📦", label:"Stock Depósito",   color:B.teal,        desc:"Inventario obras" },
  { id:"inversores",     emoji:"💰", label:"Inversores",       color:B.englishGreen,desc:"Informes y dividendos" },
  { id:"manicuras",      emoji:"🤝", label:"Solicitud Mani",   color:B.pinkDeep,    desc:"Pedí por nivel" },
  { id:"skills",         emoji:"📊", label:"Skills",           color:"#CAA150",     desc:"Junior → Master" },
  { id:"youtube",        emoji:"▶️", label:"YouTube",          color:B.pinkDeep,    desc:"Canal oficial" },
  { id:"blog",           emoji:"✨", label:"Stay Tuned",       color:"#CAA150",     desc:"Novedades" },
];

export const CSS_GLOBAL = `
  @keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer   { 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes softPulse { 0%,100%{opacity:1} 50%{opacity:.6} }
  @keyframes destelloSpin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes destelloFloat { 0%,100%{transform:translateY(0);opacity:.6} 50%{transform:translateY(-7px) rotate(15deg);opacity:1} }
  @keyframes destelloPulse { 0%,100%{opacity:.35;transform:scale(.85)} 50%{opacity:1;transform:scale(1.1)} }
  @keyframes glowPulse     { 0%,100%{filter:blur(55px);opacity:.25} 50%{filter:blur(70px);opacity:.5} }
  @keyframes ticker        { from{transform:translateX(100%)} to{transform:translateX(-100%)} }
  @keyframes spin          { to{transform:rotate(360deg)} }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#F1F1F2;font-family:'Lato',sans-serif;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-thumb{background:#F2D6DA;}
  button{cursor:pointer;border:none;font-family:inherit;}
  input,textarea,select{font-family:inherit;outline:none;}
  .card:active{transform:scale(.98);}
`;
