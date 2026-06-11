# DATA_MODELS.md — Modelos de Datos (Miami)

## Stack de base de datos recomendado
**Firebase Firestore** (NoSQL, tiempo real, autenticación integrada)
Alternativa: **Supabase** (PostgreSQL, open source)

> Diferencia clave vs. BsAs: solo 2 perfiles (`encargada`, `manicura`), un solo local (`"Miami"`), y montos en **USD**.

---

## COLECCIONES PRINCIPALES

### `/users/{userId}`
```typescript
interface User {
  id: string;
  nombre: string;
  email: string;
  perfil: "encargada" | "manicura";   // solo 2 perfiles en Miami
  local: "Miami";                       // siempre Miami en esta versión
  emoji: string;                        // Avatar emoji elegido al registrarse
  codigoUsado: string;                  // Código de invitación utilizado
  isAdmin: boolean;                     // true para encargada (hereda poderes de CM)
  createdAt: Timestamp;
  lastLogin: Timestamp;
  activo: boolean;
}
```

### `/codigos_invitacion/{codigo}`
```typescript
interface CodigoInvitacion {
  codigo: string;              // Ej: "NIKI-MIA-MAN-2026"
  perfil: "encargada" | "manicura";
  local: "Miami";
  usado: boolean;
  usadoPor: string | null;     // userId
  usadoAt: Timestamp | null;
  creadoPor: string;           // userId de la Encargada que lo generó
  creadoAt: Timestamp;
}
```

### `/mensajes/{mensajeId}`
```typescript
interface Mensaje {
  id: string;
  perfil: "encargada" | "manicura";
  userId: string;
  emoji: string;
  nombre: string;
  categoria: "urgente" | "operaciones" | "capacitacion" | "marketing" | "rrhh";
  texto: string;
  fecha: Timestamp;
  fijado: boolean;             // solo la Encargada puede fijar
  reacciones: { like: number; love: number; star: number };
  reactores: { like: string[]; love: string[]; star: string[] };
}
```

### `/ideas/{ideaId}`
```typescript
interface Idea {
  id: string;
  userId: string;
  perfil: "encargada" | "manicura";
  emoji: string;
  titulo: string;
  categoria: "colores" | "productos" | "proyectos" | "servicios" | "operaciones";
  descripcion: string;
  estado: "nueva" | "analisis" | "aprobada" | "descartada";  // solo Encargada cambia
  fecha: Timestamp;
  votos: { encargada: number; manicura: number };   // 0 o 1 cada uno
  votantes: string[];          // userIds (evita votos dobles)
  comentarios: Comentario[];
}

interface Comentario {
  id: string;
  userId: string;
  perfil: "encargada" | "manicura";
  emoji: string;
  texto: string;
  fecha: Timestamp;
}
```

### `/turnos/{turnoId}` (RRHH & Turnos)
```typescript
interface Turno {
  id: string;
  manicuraId: string;          // userId de la manicura
  manicuraNombre: string;
  dia: "lun" | "mar" | "mie" | "jue" | "vie" | "sab" | "dom";
  franja: "manana" | "tarde";
  semana: string;              // ej: "2026-W16"
  creadoPor: string;           // userId de la Encargada
  updatedAt: Timestamp;
}
```

### `/skills/{manicuraId}`
```typescript
interface Skill {
  manicuraId: string;          // userId
  nombre: string;
  serviciosDominados: number;
  serviciosTotales: number;    // total del menú de Miami (⚠️ confirmar)
  skillPct: number;            // serviciosDominados / serviciosTotales * 100
  nivel: "junior" | "senior" | "master";   // calculado: ≤60 / 61-85 / 86-100
  historial: { fecha: Timestamp; skillPct: number; nivel: string }[];
  updatedPor: string;          // userId de la Encargada
  updatedAt: Timestamp;
}
```

### `/unos/{unoId}` (Registros 1:1 Plan de Carrera)
```typescript
interface UnoUno {
  id: string;
  targetUserId: string;        // La manicura evaluada
  editorUserId: string;        // Quien registra (Encargada)
  fecha: Timestamp;
  proximoUno: Timestamp | null;
  desempeno: 1 | 2 | 3 | 4 | 5;
  notas: string;
  planMejora: string;
  objetivos: string[];
  estado: "completado";
}
```

### `/rewards_balance/{userId}`
```typescript
interface RewardsBalance {
  userId: string;
  destellos: number;           // Total acumulado
  destellosMes: number;        // Del mes actual
  historial: { mes: string; cantidad: number }[];
}
```

### `/rewards_canjes/{canjeId}`
```typescript
interface RewardsCanje {
  id: string;
  userId: string;              // manicura que canjea
  premioId: string;
  premioNombre: string;
  destellos: number;           // costo en destellos
  valorUSD: number;            // valor de referencia en USD
  estado: "solicitado" | "aprobado" | "entregado";  // Encargada aprueba/entrega
  fechaSolicitud: Timestamp;
  fechaResolucion: Timestamp | null;
  resueltoPor: string | null;  // userId de la Encargada
}
```

### `/blog/{postId}` (Stay Tuned)
```typescript
interface Post {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  emoji: string;
  fecha: Timestamp;
  countdownDate: Timestamp | null;   // para eventos con cuenta regresiva
  link: string | null;
}
```

---

## REGLAS DE FIRESTORE (Security Rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    // En Miami la admin es la Encargada (reemplaza a Casa Matriz)
    function isEncargada() {
      return isAuthenticated() && getUserData().perfil == 'encargada';
    }

    // Users — el propio y la Encargada pueden leer
    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isEncargada());
      allow write: if request.auth.uid == userId || isEncargada();
    }

    // Códigos de invitación — solo la Encargada los crea/lee
    match /codigos_invitacion/{codigo} {
      allow read: if isAuthenticated();   // se valida al registrarse
      allow write: if isEncargada();
    }

    // Mensajes — todos leen/crean; solo la Encargada fija (update)
    match /mensajes/{mensajeId} {
      allow read, create: if isAuthenticated();
      allow update: if isEncargada() ||
                       (isAuthenticated() && request.resource.data.diff(resource.data).affectedKeys()
                          .hasOnly(['reacciones', 'reactores']));   // reacciones cualquiera
    }

    // Ideas — todos leen/crean/votan; solo la Encargada cambia estado
    match /ideas/{ideaId} {
      allow read, create: if isAuthenticated();
      allow update: if isAuthenticated();   // votos/comentarios cualquiera; estado validar en app/función
    }

    // Turnos — la Encargada gestiona; la manicura lee los propios
    match /turnos/{turnoId} {
      allow read: if isEncargada() ||
                     (isAuthenticated() && resource.data.manicuraId == request.auth.uid);
      allow write: if isEncargada();
    }

    // Skills — la Encargada edita; la manicura lee el propio
    match /skills/{manicuraId} {
      allow read: if isEncargada() || request.auth.uid == manicuraId;
      allow write: if isEncargada();
    }

    // 1:1 Plan de Carrera — la Encargada escribe; la manicura lee los propios
    match /unos/{unoId} {
      allow read: if isEncargada() || resource.data.targetUserId == request.auth.uid;
      allow write: if isEncargada();
    }

    // Rewards — el propio lee su balance; la Encargada gestiona
    match /rewards_balance/{userId} {
      allow read: if request.auth.uid == userId || isEncargada();
      allow write: if isEncargada();
    }
    match /rewards_canjes/{canjeId} {
      allow read: if isEncargada() || resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated();
      allow update: if isEncargada();
    }
  }
}
```
