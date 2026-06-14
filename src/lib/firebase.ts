// Firebase web SDK — configuração via variáveis de ambiente (import.meta.env.VITE_*).
// Os valores são públicos por design; a segurança vem das Firestore Security Rules
// (ver firestore.rules) + entitlement gravado SOMENTE pelo servidor (webhook Stripe).
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Falha rápido se faltar config (evita app "fantasma" que loga erros obscuros em runtime).
const missing = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key)
if (missing.length > 0) {
  throw new Error(
    `Configuração do Firebase ausente: ${missing.join(', ')}. ` +
      `Defina as variáveis VITE_FIREBASE_* (veja .env.example).`,
  )
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

export default app
