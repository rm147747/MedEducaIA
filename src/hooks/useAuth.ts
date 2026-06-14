import { useState, useEffect, useCallback } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User
} from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, googleProvider, db } from '@/lib/firebase'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  plan: 'free' | 'pro'
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubDoc: (() => void) | null = null

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      // Limpa o listener do doc anterior em qualquer mudança de auth.
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
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (err: any) {
      setError(traduzirErro(err.code))
      return false
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null)
    try {
      const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(fbUser, { displayName: name })
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
  const erros: Record<string, string> = {
    'auth/invalid-email': 'E-mail invalido',
    'auth/user-disabled': 'Conta desativada',
    'auth/user-not-found': 'Usuario nao encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/email-already-in-use': 'E-mail ja cadastrado',
    'auth/weak-password': 'Senha fraca (minimo 6 caracteres)',
    'auth/invalid-credential': 'E-mail ou senha incorretos',
    'auth/popup-closed-by-user': 'Login cancelado',
    'auth/network-request-failed': 'Sem conexao com internet',
  }
  return erros[code] || 'Erro ao autenticar. Tente novamente.'
}
