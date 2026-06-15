import { useState, useEffect, useCallback, useRef } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  type User,
} from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, googleProvider, db } from '@/lib/firebase'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  plan: 'free' | 'pro'
}

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_MS = 60_000

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Rate limiting de login no client (useRef não dispara re-render).
  const attempts = useRef(0)
  const lockedUntil = useRef(0)

  useEffect(() => {
    let unsubDoc: (() => void) | null = null

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (unsubDoc) {
        unsubDoc()
        unsubDoc = null
      }

      if (firebaseUser) {
        // Estado inicial 'free' — o entitlement real é server-authoritative e chega
        // pelo snapshot do doc users/{uid} (gravado só pelo webhook do Stripe).
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          plan: 'free',
        })

        unsubDoc = onSnapshot(
          doc(db, 'users', firebaseUser.uid),
          (snap) => {
            const plan = snap.data()?.plan === 'pro' ? 'pro' : 'free'
            setUser((prev) => (prev ? { ...prev, plan } : prev))
          },
          () => {
            // Falha de leitura (ex: rules) → mantém 'free' por segurança.
          },
        )
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      if (unsubDoc) unsubDoc()
      unsubAuth()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)

    const now = Date.now()
    if (lockedUntil.current > now) {
      const secs = Math.ceil((lockedUntil.current - now) / 1000)
      setError(`Muitas tentativas. Tente novamente em ${secs}s.`)
      return false
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      attempts.current = 0
      return true
    } catch (err: any) {
      attempts.current += 1
      if (attempts.current >= MAX_LOGIN_ATTEMPTS) {
        lockedUntil.current = Date.now() + LOCKOUT_MS
        attempts.current = 0
        setError('Muitas tentativas de login. Aguarde 1 minuto e tente novamente.')
      } else {
        setError(traduzirErro(err.code))
      }
      return false
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null)
    try {
      const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(fbUser, { displayName: name })
      // Envia verificação de e-mail (não bloqueia o cadastro se falhar).
      try {
        await sendEmailVerification(fbUser)
      } catch (verifyErr) {
        console.warn('Falha ao enviar e-mail de verificação', verifyErr)
      }
      return true
    } catch (err: any) {
      setError(traduzirErro(err.code))
      return false
    }
  }, [])

  const loginGoogle = useCallback(async () => {
    setError(null)
    try {
      await signInWithPopup(auth, googleProvider)
      return true
    } catch (err: any) {
      setError(traduzirErro(err.code))
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
    setUser(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { user, loading, error, login, register, loginGoogle, logout, clearError }
}

function traduzirErro(code: string): string {
  // Erros de configuração — causa nº1 de "não consigo cadastrar".
  // Dizem a verdade em vez do genérico, pra facilitar o diagnóstico em produção.
  const setup = [
    'auth/api-key-not-valid',
    'auth/api-key-not-valid.-please-pass-a-valid-api-key.',
    'auth/invalid-api-key',
    'auth/configuration-not-found',
    'auth/operation-not-allowed',
    'auth/unauthorized-domain',
  ]
  if (setup.some((c) => code?.startsWith(c))) {
    return 'Login ainda não está configurado (falta configurar o Firebase). Avise o suporte.'
  }

  const erros: Record<string, string> = {
    // Anti-enumeração: não revelamos se o e-mail existe ou se a senha está errada.
    'auth/user-not-found': 'E-mail ou senha incorretos',
    'auth/wrong-password': 'E-mail ou senha incorretos',
    'auth/invalid-credential': 'E-mail ou senha incorretos',
    'auth/invalid-email': 'E-mail inválido',
    'auth/user-disabled': 'Conta desativada',
    'auth/email-already-in-use': 'E-mail já cadastrado',
    'auth/weak-password': 'Senha fraca (mínimo 6 caracteres)',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/popup-closed-by-user': 'Login cancelado',
    'auth/network-request-failed': 'Sem conexão com a internet',
  }
  return erros[code] || 'Erro ao autenticar. Tente novamente.'
}
