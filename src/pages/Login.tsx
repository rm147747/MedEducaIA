import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, Chrome, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, firstError } from '@/lib/authSchemas'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const { login, loginGoogle, error, clearError, loading } = useAuth()

  const shownError = validationError || error

  const resetErrors = () => {
    setValidationError(null)
    clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = loginSchema.safeParse({ email, password })
    const msg = firstError(parsed)
    if (msg) {
      setValidationError(msg)
      return
    }
    setValidationError(null)
    await login(parsed.data!.email, parsed.data!.password)
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px]"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1">
            <span className="font-heading text-2xl font-bold text-[#0D7377]">MedEduca</span>
            <span className="font-heading text-2xl font-bold text-[#D4943A]">AI</span>
          </Link>
          <p className="text-[#5C5852] mt-2 font-body">Bem-vindo de volta, doutor!</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E8E4DA] p-8 shadow-sm">
          <h1 className="font-heading text-xl font-bold text-[#1C1917] mb-6">
            Entrar na sua conta
          </h1>

          {/* Error */}
          {shownError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-[#FCEEEE] border border-[#C0392B] rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-[#C0392B] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#C0392B]">{shownError}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5C5852] mb-1.5">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9C9890]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); resetErrors() }}
                  placeholder="seu@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E8E4DA] bg-[#F7F5F0] font-body text-[#1C1917] placeholder:text-[#9C9890] focus:outline-none focus:ring-2 focus:ring-[#0D7377] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5C5852] mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9C9890]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); resetErrors() }}
                  placeholder="Sua senha"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E8E4DA] bg-[#F7F5F0] font-body text-[#1C1917] placeholder:text-[#9C9890] focus:outline-none focus:ring-2 focus:ring-[#0D7377] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#0D7377] text-white font-body font-semibold hover:bg-[#095C60] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#E8E4DA]" />
            <span className="text-xs text-[#9C9890] font-body">ou</span>
            <div className="flex-1 h-px bg-[#E8E4DA]" />
          </div>

          {/* Google */}
          <button
            onClick={loginGoogle}
            disabled={loading}
            className="w-full py-3 rounded-xl border-2 border-[#E8E4DA] text-[#5C5852] font-body font-medium hover:border-[#0D7377] hover:text-[#0D7377] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Chrome className="w-5 h-5" />
            Entrar com Google
          </button>
        </div>

        {/* Register link */}
        <p className="text-center mt-6 text-[#5C5852] font-body text-sm">
          Ainda nao tem conta?{' '}
          <Link to="/register" className="text-[#0D7377] font-semibold hover:underline">
            Cadastre-se gratis
          </Link>
        </p>

        {/* Back */}
        <p className="text-center mt-3">
          <Link to="/" className="text-sm text-[#9C9890] hover:text-[#5C5852] transition-colors font-body">
            ← Voltar para o inicio
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
