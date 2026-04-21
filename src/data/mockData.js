import { B } from '../design/tokens.js';

export const USUARIOS_INIT = [
  { id:"n1", nombre:"Nicole Barat",     email:"nicole@nikibb.com",  pass:"nicole123",  perfil:"casa_matriz",  local:null,            emoji:"👑" },
  { id:"n2", nombre:"Agustina Quaglia", email:"agus@nikibb.com",    pass:"agus123",    perfil:"casa_matriz",  local:null,            emoji:"🌸" },
  { id:"n3", nombre:"Laura Felipetti",  email:"laura@nikibb.com",   pass:"laura123",   perfil:"casa_matriz",  local:null,            emoji:"⭐" },
  { id:"n4", nombre:"Bárbara López",    email:"barbara@nikibb.com", pass:"barba123",   perfil:"casa_matriz",  local:null,            emoji:"💎" },
  { id:"n5", nombre:"Estefanía Soto",   email:"este@nikibb.com",    pass:"este123",    perfil:"manicura",     local:"Adrogue",       emoji:"💅" },
  { id:"n6", nombre:"Bárbara Ortiz",    email:"bartiz@nikibb.com",  pass:"ortiz123",   perfil:"encargada",    local:"Lomas",         emoji:"🌟" },
  { id:"n7", nombre:"Inv. Lomas",       email:"inv@nikibb.com",     pass:"inv123",     perfil:"inversor",     local:null,            emoji:"💰" },
];

export const MSGS_INIT = [
  { id:"m1", perfil:"casa_matriz", emoji:"👑", nombre:"Nicole Barat",       cat:"urgente",     texto:"Recordatorio: el evento del 17 de Mayo requiere confirmación de asistencia antes del 10/5.", fecha:"Hoy 9:00",    fijado:true,  reacciones:{like:4,love:2,star:1} },
  { id:"m2", perfil:"casa_matriz", emoji:"🌸", nombre:"Agustina",           cat:"marketing",   texto:"Campaña de Mayo lista para revisión. Incluye reels del evento y contenido para Stories. Revisamos mañana a las 11.", fecha:"Hoy 8:30",    fijado:false, reacciones:{like:3,love:1,star:0} },
  { id:"m3", perfil:"encargada",   emoji:"🌟", nombre:"Bárbara Ortiz",      cat:"operaciones", texto:"Lomas: semana con 100% de ocupación. 8 servicios de kapping complejo. Sin reclamos registrados.", fecha:"Ayer 18:00",  fijado:false, reacciones:{like:5,love:3,star:2} },
  { id:"m4", perfil:"casa_matriz", emoji:"⭐", nombre:"Laura Felipetti",    cat:"rrhh",        texto:"Ingresan 3 manicuras nuevas la semana que viene: Yasmin (Puerto Madero), Ángeles (Lomas), Abril (Recoleta).", fecha:"Ayer 14:00",  fijado:false, reacciones:{like:2,love:4,star:1} },
  { id:"m5", perfil:"franquiciada",emoji:"💜", nombre:"Franquiciada Cañitas",cat:"operaciones", texto:"Consulta: ¿cómo solicito la reposición de insumos antes del feriado? ¿Hay stock disponible?", fecha:"Lun 11:00",  fijado:false, reacciones:{like:0,love:0,star:0} },
];

export const IDEAS_INIT = [
  { id:"i1", perfil:"manicura",     emoji:"💅", nombre:"Estefanía", titulo:"Línea de esmaltes nude para invierno ✨",       categoria:"colores",    estado:"analisis",   votos:{"casa_matriz":1,"franquiciada":1,"encargada":1,"manicura":0,"inversor":0}, comentarios:[{perfil:"encargada",emoji:"🌟",texto:"Lo más pedido en el local.",fecha:"18 Abr"}], fecha:"15 Abr" },
  { id:"i2", perfil:"franquiciada", emoji:"💜", nombre:"Franquiciada", titulo:"Ritual exprés 30 min para el lunch break ✨",categoria:"servicios",  estado:"nueva",      votos:{"casa_matriz":0,"franquiciada":0,"encargada":1,"manicura":1,"inversor":0}, comentarios:[], fecha:"16 Abr" },
  { id:"i3", perfil:"encargada",    emoji:"🌟", nombre:"Bárbara Ortiz", titulo:"App de fidelización para clientas ✨",      categoria:"proyectos",  estado:"analisis",   votos:{"casa_matriz":1,"franquiciada":1,"encargada":0,"manicura":1,"inversor":1}, comentarios:[], fecha:"14 Abr" },
  { id:"i4", perfil:"franquiciada", emoji:"💜", nombre:"Franquiciada", titulo:"Capacitación mensual en video ✨",          categoria:"operaciones",estado:"aprobada",   votos:{"casa_matriz":1,"franquiciada":1,"encargada":1,"manicura":1,"inversor":0}, comentarios:[{perfil:"casa_matriz",emoji:"👑",texto:"Aprobado. Empieza en Mayo.",fecha:"18 Abr"}], fecha:"12 Abr" },
];

export const REWARDS_PERSONAS = [
  { id:"r1", nombre:"Estefanía Soto",  local:"Adrogue",       destellos:340, mes:120 },
  { id:"r2", nombre:"Candela Amaya",   local:"Puerto Madero", destellos:280, mes:100 },
  { id:"r3", nombre:"Sol Martínez",    local:"Lomas",         destellos:190, mes:80  },
  { id:"r4", nombre:"Bárbara Ortiz",   local:"Lomas",         destellos:420, mes:200 },
  { id:"r5", nombre:"Brisa Ramírez",   local:"Lomas",         destellos:155, mes:60  },
  { id:"r6", nombre:"Daniela Gambarte",local:"Lomas",         destellos:310, mes:90  },
];

export const DESTELLOS_REWARDS = [
  { d:30,    p:30000,    premio:"Efectivo",                               emoji:"💰" },
  { d:200,   p:200000,   premio:"Merchandising Niki BB",                  emoji:"🎀" },
  { d:350,   p:350000,   premio:"Vaso Stanley",                           emoji:"🥤" },
  { d:500,   p:500000,   premio:"Set Victoria's Secret + Cena para dos",  emoji:"🌹" },
  { d:650,   p:650000,   premio:"Voucher $200.000 (spa/ropa/peluq.)",     emoji:"💅" },
  { d:800,   p:800000,   premio:"Lapicera Swarovski",                     emoji:"💎" },
  { d:900,   p:900000,   premio:"Cabina de manicura + Aros Swarovski",    emoji:"💍" },
  { d:1000,  p:1000000,  premio:"Tablet",                                 emoji:"📱" },
  { d:1200,  p:1200000,  premio:"Cartera Guess",                          emoji:"👜" },
  { d:2000,  p:2000000,  premio:"iPad",                                   emoji:"💻" },
  { d:2500,  p:2500000,  premio:"Viaje a Mar del Plata",                  emoji:"🌊" },
  { d:40000, p:4000000,  premio:"Viaje a Brasil ✈️",                     emoji:"✈️" },
];

export const BLOG_POSTS = [
  { id:1, titulo:"Evento Niki Beauty Bar ✨", sub:"17 de Mayo — Encuentro presencial",    fecha:"17 MAY 2026", color:B.pink,        emoji:"🎀", tag:"PRÓXIMO EVENTO",  link:"https://nikibeautybar.my.canva.site/", cta:"VER EVENTO",  countdown:true },
  { id:2, titulo:"Niki Lab ya está activo 🧪", sub:"Proponé ideas, votá y participá",     fecha:"21 ABR 2026", color:B.green,       emoji:"🧪", tag:"NUEVO MÓDULO",    link:null, cta:"IR AL LAB",   countdown:false },
  { id:3, titulo:"NIKI OS v1.0 lanzado ✨",    sub:"Toda la red conectada",               fecha:"21 ABR 2026", color:"#CAA150",     emoji:"◆",  tag:"LANZAMIENTO",     link:null, cta:"EXPLORAR",    countdown:false },
  { id:4, titulo:"Junior → Senior → Master", sub:"Sistema de niveles desde Junio 2026",  fecha:"JUN 2026",    color:B.teal,        emoji:"⭐", tag:"PRÓXIMAMENTE",    link:null, cta:"VER SKILL",   countdown:false },
  { id:5, titulo:"3 Obras en marcha ✨",      sub:"Ramos Mejía, Caballito, San Isidro",  fecha:"ABR 2026",    color:B.teal,        emoji:"🏗️", tag:"EXPANSIÓN",        link:null, cta:"VER OBRAS",   countdown:false },
];

export const AUDITORIAS_INIT = [
  {
    id:"a1", local:"Puerto Madero", tipo:"cm", fecha:"18 Abr 2026",
    ejes:[
      { nombre:"Estado General",      score:9.2, obs:"Excelente limpieza y orden." },
      { nombre:"Operación y Personal", score:8.8, obs:"Dotación completa, uniforme impecable." },
      { nombre:"Imagen y Marca",       score:9.5, obs:"Coherencia visual perfecta." },
      { nombre:"Equipamiento",         score:8.0, obs:"Un torno necesita revisión." },
      { nombre:"Experiencia Cliente",  score:9.1, obs:"Protocolo de bienvenida excelente." },
      { nombre:"Bioseguridad",         score:9.3, obs:"Esterilización correcta." },
    ],
    conclusiones:"Local en condiciones premium. Mantener estándares.",
    mejoras:["Revisar torno nro 3","Reponer stock de insumos descartables"],
  },
  {
    id:"a2", local:"Lomas", tipo:"shopper", fecha:"15 Abr 2026",
    ejes:[
      { nombre:"Estado General",      score:7.5, obs:"Orden general correcto, limpieza a mejorar." },
      { nombre:"Operación y Personal", score:6.8, obs:"Faltó una manicura en turno tarde." },
      { nombre:"Imagen y Marca",       score:7.0, obs:"Elemento decorativo fuera de estética." },
      { nombre:"Equipamiento",         score:8.2, obs:"Todo en orden." },
      { nombre:"Experiencia Cliente",  score:7.8, obs:"Tiempos de espera algo largos." },
      { nombre:"Bioseguridad",         score:8.5, obs:"Protocolos cumplidos." },
    ],
    conclusiones:"Local en buen estado general. Puntos a mejorar en operación.",
    mejoras:["Mejorar gestión de turnos","Revisar protocolo de limpieza entre clientas"],
  },
];

export const OBRAS_INIT = [
  {
    id:"o1", nombre:"Ramos Mejía", etapa:"Búsqueda Local", flag:"🔍",
    items:[],
  },
  {
    id:"o2", nombre:"Caballito", etapa:"Búsqueda Local", flag:"🔍",
    items:[],
  },
  {
    id:"o3", nombre:"San Isidro", etapa:"Búsqueda Local", flag:"🔍",
    items:[],
  },
];

export const STOCK_INIT = [
  { id:"s1",  nombre:"Tornos profesionales",    cantidad:6,  estado:"disponible", obs:"" },
  { id:"s2",  nombre:"Cabinas LED",              cantidad:10, estado:"disponible", obs:"" },
  { id:"s3",  nombre:"Mesas de manicura",        cantidad:4,  estado:"disponible", obs:"" },
  { id:"s4",  nombre:"Sillas pana",              cantidad:8,  estado:"disponible", obs:"" },
  { id:"s5",  nombre:"Sillones reclinables",     cantidad:2,  estado:"disponible", obs:"" },
  { id:"s6",  nombre:"Mueble recepción",         cantidad:1,  estado:"disponible", obs:"" },
  { id:"s7",  nombre:"Apoyamanos",               cantidad:9,  estado:"disponible", obs:"" },
  { id:"s8",  nombre:"Cabinas de manicura",      cantidad:2,  estado:"en_uso",     obs:"Canning" },
  { id:"s9",  nombre:"Tornos 2021",              cantidad:2,  estado:"dañado",     obs:"Sin reparación" },
  { id:"s10", nombre:"Mesa recepción vidrio",    cantidad:1,  estado:"dañado",     obs:"Vidrio roto" },
];

export const MANICURAS_DATA = [
  { id:"mani1", nombre:"Estefanía Soto",      local:"Adrogue",       skill:100, nivel:"Master",  estado:"activa", telefono:"11-1234-5678" },
  { id:"mani2", nombre:"Candela Amaya",        local:"Puerto Madero", skill:97,  nivel:"Master",  estado:"activa", telefono:"11-2345-6789" },
  { id:"mani3", nombre:"Rosibel Gutiérrez",    local:"Puerto Madero", skill:100, nivel:"Master",  estado:"activa", telefono:"11-3456-7890" },
  { id:"mani4", nombre:"Brisa Ramírez",        local:"Lomas",         skill:97,  nivel:"Master",  estado:"activa", telefono:"11-4567-8901" },
  { id:"mani5", nombre:"Florencia Antogiovanni",local:"Puerto Madero",skill:82,  nivel:"Senior",  estado:"activa", telefono:"11-5678-9012" },
  { id:"mani6", nombre:"Daniela Gambarte",      local:"Lomas",         skill:91,  nivel:"Master",  estado:"activa", telefono:"11-6789-0123" },
  { id:"mani7", nombre:"Soledad Gómez",         local:"Canning",       skill:91,  nivel:"Master",  estado:"activa", telefono:"11-7890-1234" },
  { id:"mani8", nombre:"Felicitas Capó",        local:"Canning",       skill:91,  nivel:"Master",  estado:"activa", telefono:"11-8901-2345" },
  { id:"mani9", nombre:"Sol Martínez",          local:"Lomas",         skill:74,  nivel:"Senior",  estado:"activa", telefono:"11-9012-3456" },
  { id:"mani10",nombre:"Alexandra Pérez",       local:"Canning",       skill:71,  nivel:"Senior",  estado:"activa", telefono:"11-0123-4567" },
  { id:"mani11",nombre:"Noelia Acevedo",        local:"Adrogue",       skill:65,  nivel:"Senior",  estado:"activa", telefono:"11-1234-5679" },
];

export const INVERSORES_INIT = [
  {
    id:"inv1", nombre:"Inversor A", local:"Lomas de Zamora", porcentaje:30, tipo:"Franquicia",
    informes:[
      { mes:"Marzo 2026", fecha_envio:"05 Abr", facturacion:8500000, gastos:5100000, resultado_neto:3400000, ocupacion:94, ticket_promedio:38000, servicios:224, observaciones:"Mes récord en ocupación.", dividendo:1020000, estado_dividendo:"pagado", fecha_pago:"08 Abr", metodo:"transferencia" },
      { mes:"Febrero 2026", fecha_envio:"05 Mar", facturacion:7800000, gastos:4900000, resultado_neto:2900000, ocupacion:88, ticket_promedio:36000, servicios:217, observaciones:"", dividendo:870000, estado_dividendo:"pagado", fecha_pago:"09 Mar", metodo:"transferencia" },
    ],
    proximo_retiro:{ fecha:"08 May 2026", metodo:"transferencia", monto_estimado:1050000 },
  },
  {
    id:"inv2", nombre:"Inversor B", local:"Puerto Madero", porcentaje:20, tipo:"Propio",
    informes:[
      { mes:"Marzo 2026", fecha_envio:"05 Abr", facturacion:12000000, gastos:7200000, resultado_neto:4800000, ocupacion:98, ticket_promedio:52000, servicios:231, observaciones:"Local flagship con máxima ocupación.", dividendo:960000, estado_dividendo:"coordinando", fecha_pago:"15 Abr", metodo:"presencial" },
    ],
    proximo_retiro:{ fecha:"15 Abr 2026", metodo:"presencial", monto_estimado:960000 },
  },
  {
    id:"inv3", nombre:"Inversor C", local:"Canning", porcentaje:40, tipo:"Franquicia",
    informes:[
      { mes:"Marzo 2026", fecha_envio:"05 Abr", facturacion:6200000, gastos:3900000, resultado_neto:2300000, ocupacion:82, ticket_promedio:33000, servicios:188, observaciones:"", dividendo:920000, estado_dividendo:"pendiente", fecha_pago:null, metodo:null },
    ],
    proximo_retiro:{ fecha:"20 Abr 2026", metodo:"transferencia", monto_estimado:920000 },
  },
];

export const PROYECTOS_INIT = [
  { id:"p1", nombre:"Campaña Evento 17 Mayo",        owner:"Agustina Quaglia", area:"Marketing",        prioridad:"alta",  fecha:"10 May 2026", desc:"Reels, stories y email marketing.", tareas:[{t:"Brief creativo",done:true},{t:"Producción reels",done:true},{t:"Programar posteos",done:false},{t:"Email a clientas",done:false}] },
  { id:"p2", nombre:"Onboarding 3 manicuras nuevas", owner:"Laura Felipetti",  area:"RRHH",             prioridad:"alta",  fecha:"30 Abr 2026", desc:"Yasmin, Ángeles y Abril.", tareas:[{t:"Contrato firmado",done:true},{t:"Uniforme entregado",done:false},{t:"Capacitación inicial",done:false}] },
  { id:"p3", nombre:"Stock Miami checklist",         owner:"Bárbara López",    area:"Obras y Stock",    prioridad:"alta",  fecha:"15 May 2026", desc:"Completar Anexo II para Miami.", tareas:[{t:"Inventario depósito",done:true},{t:"Lista a comprar",done:true},{t:"Cotizar proveedores",done:false},{t:"Órdenes de compra",done:false}] },
  { id:"p4", nombre:"Catálogo de insumos Q2",        owner:"Lucía Becker",     area:"Stock e insumos",  prioridad:"media", fecha:"30 Abr 2026", desc:"Actualizar precios y proveedores.", tareas:[{t:"Relevar precios actuales",done:true},{t:"Nuevos proveedores",done:false}] },
];

export const FRASES_INIT = [
  { id:"f1", cat:"actitud", texto:"A mal día, lindas uñas." },
  { id:"f2", cat:"poder",   texto:"Ella no espera que la arreglen. Ella se arregla sola." },
  { id:"f3", cat:"belleza", texto:"Manicura hecha, semana ganada." },
  { id:"f4", cat:"bienestar",texto:"El autocuidado no es un lujo. Es una necesidad." },
  { id:"f5", cat:"humor",   texto:"Café, uñas y buena vibra. El plan perfecto." },
  { id:"f6", cat:"actitud", texto:"Las uñas son el único accesorio que siempre llevás puesto." },
  { id:"f7", cat:"poder",   texto:"No necesitás corona para reinar. Solo uñas lindas." },
  { id:"f8", cat:"belleza", texto:"Cada color cuenta una historia. ¿Cuál es la tuya hoy?" },
  { id:"f9", cat:"bienestar",texto:"Una hora para vos. Sin excusas, sin culpas." },
  { id:"f10",cat:"humor",   texto:"La manicura es terapia, pero más barata y con más colores." },
  { id:"f11",cat:"actitud", texto:"El detalle que nadie espera y todas notan." },
  { id:"f12",cat:"poder",   texto:"Decidida, arreglada y lista para lo que venga." },
  { id:"f13",cat:"belleza", texto:"La belleza empieza en la punta de los dedos." },
  { id:"f14",cat:"bienestar",texto:"Cuidarse es el acto más revolucionario." },
  { id:"f15",cat:"humor",   texto:"¿Hablar de los problemas? Sí. Pero con las uñas secas." },
  { id:"f16",cat:"actitud", texto:"No existe mal humor que resista unas uñas recién hechas." },
  { id:"f17",cat:"poder",   texto:"El éxito huele a esmalte y sabe a café." },
  { id:"f18",cat:"belleza", texto:"Chica de nail bar: porque lo ordinario nunca fue una opción." },
  { id:"f19",cat:"bienestar",texto:"Pausa. Respira. Pinta. Repite." },
  { id:"f20",cat:"humor",   texto:"Mi terapeuta usa esmalte. Se llama Niki Beauty Bar." },
];

export const PLAN_CARRERA_INIT = [
  {
    id:"pc1", manicura:"Estefanía Soto", local:"Adrogue", nivel:"Master", skill:100,
    reuniones:[
      { fecha:"15 Mar 2026", proximo:"15 Jun 2026", escala:5, notas:"Excelente desempeño. Candidata a encargada.", mejora:"", objetivos:["Mentoría a manicuras junior","Evaluación para encargada Q3"], quien:"Nicole Barat" },
    ],
  },
  {
    id:"pc2", manicura:"Sol Martínez", local:"Lomas", nivel:"Senior", skill:74,
    reuniones:[
      { fecha:"10 Mar 2026", proximo:"10 Jun 2026", escala:3, notas:"En desarrollo. Trabajar baby boomer complejo.", mejora:"Práctica diaria de baby boomer en mano izquierda.", objetivos:["Dominar baby boomer complejo","Llegar a 85% skill en Jun"], quien:"Bárbara Ortiz" },
    ],
  },
];

export const PRECIOS_NAILART = {
  incluido: {
    label:"INCLUIDO", color:B.green, desc:"Sin costo adicional",
    items:[
      "Francesita / líneas / puntos",
      "Baby shine",
      "Chromas (1 solo tono) / Aurora (1 solo tono) / Cat eyes (sin diseño)",
      "Papel oro / papel plata (en líneas)",
      "Strass y caviar (10 x set)",
      "Corazones / estrellas / flores / hojas / fuegos / print (2 en total)",
      "Nail art — por definir",
      "French con diseño: chrome, multicolor, cat eye, french alta (4 uñas en total)",
    ],
    estandar:{efectivo:0,tarjeta:0}, premium:{efectivo:0,tarjeta:0}
  },
  simple: {
    label:"SIMPLE ×2", color:B.pink, desc:"Un diseño por mano",
    items:[
      "Baby boomer (esponja o pincel) / Baby boomer + brillo",
      "Papel oro y plata (en toda la uña)",
      "Cat eye con diseño",
      "Strass / caviar (+ 10 unidades)",
      "Corazones / estrellas / flores / hojas / fuegos / print (+ 2 unidades)",
    ],
    estandar:{efectivo:4500,tarjeta:5200}, premium:{efectivo:5500,tarjeta:6000}
  },
  complejo: {
    label:"COMPLEJO", color:"#CAA150", desc:"Diseño en todas las uñas",
    items:[
      "Baby boomer / Aura (todas las uñas)",
      "French con diseño: multicolor, cat eye, french alta, doble francesita, french cromo (en todas las uñas)",
      "Nail art complejo (uno por mano): mármol / carey / cocodrilo / letras / mariposas",
    ],
    estandar:{efectivo:6500,tarjeta:7000}, premium:{efectivo:7500,tarjeta:8200}
  },
};
