import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Pegá acá los valores de tu proyecto Firebase
// (console.firebase.google.com → Configuración ⚙️ → General → Tu app web)
const firebaseConfig = {
  apiKey:            "AIzaSyCjrBsuWf6Nn3WYrTKTayGS5NFo8rFJltY",
  authDomain:        "niki-os.firebaseapp.com",
  projectId:         "niki-os",
  storageBucket:     "niki-os.firebasestorage.app",
  messagingSenderId: "746098913985",
  appId:             "1:746098913985:web:a3e40d39fe6087a2cbda40",
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
