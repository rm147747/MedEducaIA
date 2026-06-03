import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Chrome, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'form' | 'success'>('form')
  const { register, loginGoogle, error, clearError, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) return
    const ok = await register(name, email, password)
    if (ok) setStep('success')
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[420px] bg-white rounded-2xl border border-[#E8E4DA] p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#E8F5EE] flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-[#2D8A56]" />
          </div>
          <h2 className="font-heading text-xl font-bold text-[#1C1917] mb-2">
            Conta criada com sucesso!
          </h2>
          <p className="text-[#5C5852] font-body mb-6">
            Bem-vindo, Dr(a). {name}! Sua conta esta pronta para comecar a estudar.
          </p>
          <Link
            to="/specialties"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#0D7377] text-white font-body font-semibold hover:bg-[#095C60] transition-colors"
          >
            Comecar a estudar →
          </Link>
        </motion.div>
      </div>
    )
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
          <p className="text-[#5C5852] mt-2 font-body">Crie sua conta gratis e comece a estudar!</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E8E4DA] p-8 shadow-sm">
          <h1 className="font-heading text-xl font-bold text-[#1C1917] mb-6">
            Criar conta gratis
          </h1>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-[#FCEEEE] border border-[#C0392B] rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-[#C0392B] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#C0392B]">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5C5852] mb-1.5">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9C9890]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError() }}
                  placeholder="Dr. Seu Nome"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E8E4DA] bg-[#F7F5F0] font-body text-[#1C1917] placeholder:text-[#9C9890] focus:outline-none focus:ring-2 focus:ring-[#0D7377] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5C5852] mb-1.5">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9C9890]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError() }}
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
                  onChange={(e) => { setPassword(e.target.value); clearError() }}
                  placeholder="Minimo 6 caracteres"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E8E4DA] bg-[#F7F5F0] font-body text-[#1C1917] placeholder:text-[#9C9890] focus:outline-none focus:ring-2 focus:ring-[#0D7377] focus:border-transparent transition-all"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-[#9C9890] mt-1">Minimo 6 caracteres</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#0D7377] text-white font-body font-semibold hover:bg-[#095C60] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Criar conta gratis</>
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
            Cadastrar com Google
          </button>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-[#5C5852] font-body text-sm">
          Ja tem conta?{' '}
          <Link to="/login" className="text-[#0D7377] font-semibold hover:underline">
            Entrar
          </Link>
        </p>

        <p className="text-center mt-3">
          <Link to="/" className="text-sm text-[#9C9890] hover:text-[#5C5852] transition-colors font-body">
            ← Voltar para o inicio
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
