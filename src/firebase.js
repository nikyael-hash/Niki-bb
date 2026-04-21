import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Pegá acá los valores de tu proyecto Firebase
// (console.firebase.google.com → Configuración ⚙️ → General → Tu app web)
const firebaseConfig = {
  apiKey:            "REEMPLAZAR",
  authDomain:        "REEMPLAZAR",
  projectId:         "REEMPLAZAR",
  storageBucket:     "REEMPLAZAR",
  messagingSenderId: "REEMPLAZAR",
  appId:             "REEMPLAZAR",
};

export const IS_CONFIGURED = firebaseConfig.apiKey !== "REEMPLAZAR";

let auth = null;
let db   = null;

if (IS_CONFIGURED) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db   = getFirestore(app);
}

export { auth, db };
