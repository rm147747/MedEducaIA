// Firebase Admin SDK — usado APENAS nas Vercel Functions (server-side).
// Inicializa com a service account fornecida via env FIREBASE_SERVICE_ACCOUNT
// (JSON puro ou base64). O Admin SDK ignora as Security Rules, então é o único
// caminho autorizado a gravar o entitlement ('plan') do usuário.
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT não definido no ambiente.')
  }
  const json = raw.trim().startsWith('{')
    ? JSON.parse(raw)
    : JSON.parse(Buffer.from(raw, 'base64').toString('utf8'))

  return cert({
    projectId: json.project_id,
    clientEmail: json.client_email,
    // Chaves geradas pelo Firebase vêm com \n escapado quando passadas por env.
    privateKey: (json.private_key as string)?.replace(/\\n/g, '\n'),
  })
}

let cached: App | null = null
function adminApp(): App {
  if (cached) return cached
  cached = getApps().length > 0 ? getApps()[0]! : initializeApp({ credential: loadServiceAccount() })
  return cached
}

export const adminAuth = () => getAuth(adminApp())
export const adminDb = () => getFirestore(adminApp())
