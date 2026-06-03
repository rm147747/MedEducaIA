import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Brain, Layers, BarChart3, Trophy, ChevronDown, ChevronUp,
  GraduationCap, Users, Stethoscope, Wallet, Star, Check, Play,
  TrendingUp
} from 'lucide-react'
import Layout from '../components/Layout'

/* ─── easing ─── */
const easeOut = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
const easeInOut = [0.4, 0, 0.2, 1] as [number, number, number, number]
const spring = [0.34, 1.56, 0.64, 1] as [number, number, number, number]

/* ─── Scroll reveal helper ─── */
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: threshold })
  return { ref, inView }
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useReveal()
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Counter animation ─── */
function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2000, decimals = 0 }: { target: number; prefix?: string; suffix?: string; duration?: number; decimals?: number }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useReveal()
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!inView || hasAnimated.current) return
    hasAnimated.current = true
    const start = performance.now()
    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Number((eased * target).toFixed(decimals)))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target, duration])

  const formatted = count.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return <span ref={ref}>{prefix}{formatted}{suffix}</span>
}

/* ─── Decorative floating circles (memo-isolated) ─── */
const FloatingCircles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: [60, 40, 80, 50][i],
          height: [60, 40, 80, 50][i],
          backgroundColor: i % 2 === 0 ? 'rgba(13,115,119,0.08)' : 'rgba(212,148,58,0.08)',
          left: ['10%', '70%', '60%', '20%'][i],
          top: ['20%', '60%', '30%', '70%'][i],
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.8 + i * 0.2 },
          y: { duration: 4 + i, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    ))}
  </div>
)

/* ═══════════════════════════════════════════
   SECTION 1 — HERO
   ═══════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-[90dvh] bg-[#F7F5F0] overflow-hidden">
      <FloatingCircles />
      <div className="max-w-[1200px] mx-auto px-6 pt-[120px] pb-16 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        {/* Left — Content */}
        <div className="relative z-10 order-2 md:order-1 w-full md:w-[55%]">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
            className="inline-flex items-center gap-2 bg-[#E6F2F2] border border-[#0D7377]/20 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="font-body text-[12px] font-medium text-[#0D7377]">
              Para estudantes de medicina no Brasil
            </span>
          </motion.div>

          {/* Headline */}
          <div className="mb-5">
            {[
              'Casos clinicos gerados',
              'por IA para sua',
              'prova de residencia',
            ].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: easeOut }}
              >
                <h1
                  className={`font-heading font-bold leading-[1.1] tracking-[-0.02em] text-[36px] sm:text-[48px] lg:text-[56px] ${
                    i === 2 ? 'text-[#0D7377]' : 'text-[#1C1917]'
                  }`}
                >
                  {line}
                </h1>
              </motion.div>
            ))}
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: easeOut }}
            className="font-body text-[16px] sm:text-[18px] text-[#5C5852] leading-[1.6] max-w-[520px] mb-8"
          >
            Milhares de casos clinicos interativos baseados nas provas ENARE e ENARM.
            Estude com feedback instantaneo, acompanhe seu progresso e passe na residencia dos seus sonhos.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0, ease: easeOut }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <Link
              to="/specialties"
              className="inline-flex items-center gap-2 font-body font-medium text-[16px] bg-[#0D7377] text-white px-7 py-[14px] rounded-[10px] hover:bg-[#095C60] hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(13,115,119,0.25)] active:scale-[0.98] transition-all duration-200"
            >
              Comecar Gratis
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <button className="inline-flex items-center gap-2 font-body font-medium text-[16px] text-[#5C5852] px-5 py-[14px] rounded-[10px] hover:bg-[#F0EDE6] hover:text-[#1C1917] active:scale-[0.98] transition-all duration-200">
              <Play size={18} />
              Ver demonstracao
            </button>
          </motion.div>

          {/* Trust Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2, ease: easeOut }}
            className="flex flex-wrap gap-6 sm:gap-8"
          >
            {[
              { icon: Stethoscope, text: '3.200+ casos' },
              { icon: Brain, text: '18 especialidades' },
              { icon: TrendingUp, text: '98% de aprovacao' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon size={16} className="text-[#9C9890]" />
                <span className="font-body text-[12px] text-[#9C9890]">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: easeOut }}
          className="relative flex items-center justify-center order-1 md:order-2 w-full md:w-[45%]"
        >
          <motion.img
            src="/hero-illustration.png"
            alt="Estudante de medicina estudando"
            className="w-full max-w-[500px] h-auto rounded-2xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 2 — STATS BAR
   ═══════════════════════════════════════════ */
function StatsSection() {
  const { ref, inView } = useReveal()

  const stats = [
    { icon: GraduationCap, value: 266507, suffix: '+', label: 'Estudantes de medicina no Brasil', color: '#0D7377' as const },
    { icon: Users, value: 87040, suffix: '', label: 'Candidatos ao ENARE em 2026', color: '#0D7377' as const, badge: '+63.7%' },
    { icon: Stethoscope, value: 3200, suffix: '+', label: 'Casos clinicos gerados por IA', color: '#0D7377' as const },
    { icon: Wallet, value: 29.90, prefix: 'R$ ', suffix: '', label: 'Preco do plano Pro mensal', color: '#D4943A' as const, sublabel: 'ou R$ 19,90/mes no anual' },
  ]

  return (
    <section className="bg-white py-16 sm:py-20">
      <div ref={ref} className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: easeOut }}
                className="bg-[#F7F5F0] border border-[#E8E4DA] rounded-[16px] p-8 text-center"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon size={28} style={{ color: stat.color }} />
                </div>
                <div className="font-heading text-[36px] sm:text-[42px] font-bold mb-1" style={{ color: stat.color }}>
                  {stat.prefix && <span>{stat.prefix}</span>}
                  <AnimatedCounter target={stat.value} duration={2000} decimals={stat.prefix === 'R$ ' ? 2 : 0} />
                  {stat.suffix && <span className="text-[#D4943A]">{stat.suffix}</span>}
                  {stat.prefix === 'R$ ' && (
                    <span className="text-[16px] font-body font-normal text-[#5C5852] ml-1">/mes</span>
                  )}
                </div>
                <p className="font-body text-[14px] text-[#5C5852] mb-2">{stat.label}</p>
                {stat.badge && (
                  <span className="inline-block bg-[#E8F5EE] text-[#2D8A56] font-body text-[12px] font-medium px-3 py-1 rounded-full">
                    {stat.badge}
                  </span>
                )}
                {stat.sublabel && (
                  <p className="font-body text-[12px] text-[#5C5852]">{stat.sublabel}</p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 3 — FEATURES
   ═══════════════════════════════════════════ */
function FeaturesSection() {
  const { ref, inView } = useReveal()

  const features = [
    {
      image: '/feature-cases.png',
      icon: Brain,
      title: 'Casos Clinicos por IA',
      description: 'Casos gerados em tempo real baseados em protocolos SUS, SBC e SBD. Cada caso e unico e adaptado ao seu nivel de conhecimento.',
      link: 'Ver exemplo',
      linkTo: '/case/demo',
    },
    {
      image: '/feature-flashcards.png',
      icon: Layers,
      title: 'Flashcards com Repeticao Espacada',
      description: 'Sistema SM-2 integrado que ajusta automaticamente a frequencia de revisao baseada na sua performance. Nunca mais esqueca o que estudou.',
      link: 'Como funciona',
      linkTo: '/flashcards',
    },
    {
      image: '/feature-analytics.png',
      icon: BarChart3,
      title: 'Acompanhe seu Progresso',
      description: 'Graficos detalhados de casos por semana, acuracia por especialidade, calendario de streaks e nivel de XP. Veja exatamente onde melhorar.',
      link: 'Ver dashboard',
      linkTo: '/analytics',
    },
    {
      image: '/og-image.jpg',
      icon: Trophy,
      title: 'Aprenda Jogando',
      description: 'Ganhe XP, mantenha streaks diarios, suba de nivel e desbloqueie conquistas. Estudar nunca foi tao viciante — no bom sentido.',
      link: 'Ver conquistas',
      linkTo: '/',
    },
  ]

  return (
    <section id="funcionalidades" className="bg-[#F7F5F0] py-20 sm:py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <Reveal>
            <p className="font-body text-[12px] font-semibold text-[#D4943A] uppercase tracking-[0.1em] mb-3">
              POR QUE MEDEDUCA?
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading text-[28px] sm:text-[32px] font-bold text-[#1C1917] max-w-[600px]">
              Tudo que voce precisa para passar na residencia
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-body text-[16px] text-[#5C5852] max-w-[560px] mt-3">
              Uma plataforma completa com casos clinicos realistas, flashcards inteligentes e acompanhamento de progresso.
            </p>
          </Reveal>
        </div>

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.12, ease: easeOut }}
                className="group bg-white border border-[#E8E4DA] rounded-[16px] p-6 shadow-[0_1px_3px_rgba(28,25,23,0.04)] hover:shadow-[0_12px_32px_rgba(28,25,23,0.1)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="overflow-hidden rounded-[12px] mb-5 aspect-[16/10]">
                  <img
                    src={f.image}
                    alt={f.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-400"
                  />
                </div>

                {/* Icon + Title */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#E6F2F2] flex items-center justify-center">
                    <Icon size={20} className="text-[#0D7377]" />
                  </div>
                  <h3 className="font-heading text-[20px] font-bold text-[#1C1917]">{f.title}</h3>
                </div>

                {/* Description */}
                <p className="font-body text-[14px] text-[#5C5852] leading-relaxed mb-4">{f.description}</p>

                {/* Link */}
                <Link
                  to={f.linkTo}
                  className="inline-flex items-center font-body text-[14px] font-medium text-[#0D7377] hover:underline"
                >
                  {f.link} <span className="ml-1" aria-hidden="true">&rarr;</span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 4 — HOW IT WORKS
   ═══════════════════════════════════════════ */
function HowItWorksSection() {
  const { ref, inView } = useReveal()

  const steps = [
    {
      num: '1',
      title: 'Escolha a especialidade',
      description: 'Selecione entre 18 especialidades medicas. Filtre por dificuldade e encontre casos alinhados com a sua prova de residencia.',
      color: '#0D7377',
    },
    {
      num: '2',
      title: 'Resolva casos clinicos',
      description: 'Leia o prontuario do paciente, analise exames e responda questoes de multipla escolha. Receba feedback imediato com explicacoes detalhadas.',
      color: '#0D7377',
    },
    {
      num: '3',
      title: 'Acompanhe sua evolucao',
      description: 'Veja seu progresso em tempo real, revise flashcards no momento ideal e mantenha sua streak diaria. Voce esta mais perto da aprovacao a cada caso.',
      color: '#D4943A',
    },
  ]

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-[1000px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <Reveal>
            <h2 className="font-heading text-[28px] sm:text-[32px] font-bold text-[#1C1917] mb-3">
              Como funciona
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-body text-[16px] text-[#5C5852]">
              Tres passos para comecar a estudar de forma inteligente
            </p>
          </Reveal>
        </div>

        {/* Steps */}
        <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Dashed connector line (desktop only) */}
          <div className="hidden md:block absolute top-6 left-[20%] right-[20%] h-0 border-t-2 border-dashed border-[#E8E4DA]" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: easeOut }}
              className="relative text-center"
            >
              {/* Number circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.15 + 0.2, ease: spring }}
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 relative z-10"
                style={{ backgroundColor: step.color }}
              >
                <span className="font-heading text-[18px] font-bold text-white">{step.num}</span>
              </motion.div>

              <h3 className="font-heading text-[20px] font-bold text-[#1C1917] mb-3">{step.title}</h3>
              <p className="font-body text-[14px] text-[#5C5852] leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 5 — TESTIMONIALS
   ═══════════════════════════════════════════ */
function TestimonialsSection() {
  const { ref, inView } = useReveal()

  const testimonials = [
    {
      quote: 'O MedEduca mudou completamente minha forma de estudar. Os casos clinicos sao extremamente realistas e o feedback imediato me ajudou a identificar minhas lacunas. Passei no ENARE na primeira tentativa!',
      name: 'Dra. Mariana Costa',
      role: 'Aprovada no ENARE 2025 — Radiologia',
      initials: 'MC',
      bgColor: '#E6F2F2',
    },
    {
      quote: 'Depois de usar AMBOSS e UWorld, finalmente encontrei uma plataforma que entende a realidade do medico brasileiro. Os protocolos do SUS, as diretrizes da SBC... e como se o caso tivesse saido do meu plantao.',
      name: 'Dr. Lucas Mendes',
      role: 'R2 de Clinica Medica — HC-FMUSP',
      initials: 'LM',
      bgColor: '#FDF3E3',
    },
    {
      quote: 'A gamificacao e viciante no melhor sentido. Minha streak de 45 dias me manteve motivada mesmo nos dias mais cansativos do internato. E o preco? Incomparavel.',
      name: 'Ana Paula Ribeiro',
      role: '6 ano — UFPR, candidata ao ENARE',
      initials: 'AP',
      bgColor: '#E8F5EE',
    },
    {
      quote: 'Resolvo 3-4 casos no onibus para o hospital. A interface mobile e perfeita para estudar nos intervalos. Em 3 meses minha acuracia subiu de 62% para 89%.',
      name: 'Dr. Pedro Henrique',
      role: 'Aprovado no ENARM 2025 — Cirurgia Geral',
      initials: 'PH',
      bgColor: '#FCEEEE',
    },
  ]

  return (
    <section id="depoimentos" className="bg-white py-20 sm:py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Reveal>
            <h2 className="font-heading text-[28px] sm:text-[32px] font-bold text-[#1C1917] mb-3">
              O que nossos alunos dizem
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-body text-[16px] text-[#5C5852]">
              Historias reais de estudantes que transformaram seus estudos
            </p>
          </Reveal>
        </div>

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: easeOut }}
              className="relative bg-[#F7F5F0] border border-[#E8E4DA] rounded-[14px] p-7"
            >
              {/* Quote mark */}
              <span className="absolute top-4 left-4 font-heading text-[48px] leading-none text-[#0D7377] opacity-15 select-none">
                &ldquo;
              </span>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={14} fill="#D4943A" color="#D4943A" />
                ))}
              </div>

              {/* Quote text */}
              <p className="font-body text-[15px] text-[#1C1917] italic leading-[1.7] mb-5 relative z-10">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-heading font-bold text-[#1C1917] border-2 border-[#E8E4DA]"
                  style={{ backgroundColor: t.bgColor }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-body text-[14px] font-medium text-[#1C1917]">{t.name}</p>
                  <p className="font-body text-[12px] text-[#5C5852]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 6 — PRICING PREVIEW
   ═══════════════════════════════════════════ */
function PricingSection() {
  const { ref, inView } = useReveal()

  const plans = [
    {
      name: 'Gratuito',
      price: '0',
      period: '/mes',
      featured: false,
      features: [
        '3 casos clinicos por mes',
        '1 especialidade',
        'Flashcards basicos',
        'Progresso limitado',
      ],
      cta: 'Comecar Gratis',
      ctaStyle: 'outline' as const,
    },
    {
      name: 'Pro Mensal',
      price: '29,90',
      period: '/mes',
      featured: true,
      badge: 'MAIS POPULAR',
      badgeColor: '#0D7377',
      features: [
        'Casos ilimitados',
        'Todas as 18 especialidades',
        'Flashcards com SM-2',
        'Analytics completo',
        'Streaks e gamificacao',
        'Exportar progresso',
      ],
      cta: 'Assinar Pro',
      ctaStyle: 'primary' as const,
    },
    {
      name: 'Pro Anual',
      price: '19,90',
      period: '/mes',
      featured: false,
      badge: 'ECONOMIZE 33%',
      badgeColor: '#D4943A',
      sublabel: 'R$ 238,80 cobrados anualmente',
      features: [
        'Casos ilimitados',
        'Todas as 18 especialidades',
        'Flashcards com SM-2',
        'Analytics completo',
        'Streaks e gamificacao',
        'Exportar progresso',
      ],
      cta: 'Assinar Anual',
      ctaStyle: 'amber' as const,
    },
  ]

  return (
    <section id="planos" className="bg-[#F7F5F0] py-20 sm:py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Reveal>
            <h2 className="font-heading text-[28px] sm:text-[32px] font-bold text-[#1C1917] mb-3">
              Planos acessiveis para todo estudante
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-body text-[16px] text-[#5C5852]">
              Comece gratuitamente. Suba de nivel quando estiver pronto.
            </p>
          </Reveal>
        </div>

        {/* Cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: plan.featured ? 0.8 : 0.7,
                delay: i * 0.1,
                ease: easeOut,
              }}
              className={`relative bg-white rounded-[16px] p-9 ${
                plan.featured
                  ? 'border-2 border-[#0D7377] shadow-[0_8px_32px_rgba(13,115,119,0.12)] md:-translate-y-2'
                  : 'border border-[#E8E4DA] hover:-translate-y-1 hover:border-[#0D7377]'
              } transition-all duration-300`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className="font-body text-[11px] font-semibold text-white px-4 py-1 rounded-full"
                    style={{ backgroundColor: plan.badgeColor }}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <h3 className="font-heading text-[24px] font-bold text-[#1C1917] mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-1">
                <span className="font-heading text-[42px] font-bold text-[#1C1917]">
                  {plan.price === '0' ? 'R$ 0' : `R$ ${plan.price}`}
                </span>
                <span className="font-body text-[16px] text-[#5C5852] ml-1">{plan.period}</span>
              </div>
              {plan.sublabel && (
                <p className="font-body text-[12px] text-[#5C5852] mb-4">{plan.sublabel}</p>
              )}

              <div className="border-t border-[#E8E4DA] my-5" />

              <ul className="space-y-3 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={18} className="text-[#2D8A56] mt-0.5 shrink-0" />
                    <span className="font-body text-[14px] text-[#1C1917]">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full font-body font-medium text-[16px] py-3 rounded-[10px] transition-all duration-200 active:scale-[0.98] ${
                  plan.ctaStyle === 'primary'
                    ? 'bg-[#0D7377] text-white hover:bg-[#095C60] hover:shadow-[0_4px_12px_rgba(13,115,119,0.25)]'
                    : plan.ctaStyle === 'amber'
                    ? 'bg-[#D4943A] text-white hover:bg-[#B07A2E] hover:shadow-[0_4px_12px_rgba(212,148,58,0.25)]'
                    : 'border-[1.5px] border-[#0D7377] text-[#0D7377] hover:bg-[#E6F2F2]'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 7 — FAQ
   ═══════════════════════════════════════════ */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { ref, inView } = useReveal()

  const faqs = [
    {
      q: 'Os casos clinicos sao realmente gerados por IA?',
      a: 'Sim! Utilizamos modelos de linguagem avancados treinados com diretrizes medicas brasileiras (SUS, SBC, SBD, SBEM) para gerar casos unicos a cada sessao. Cada caso passa por validacao medica para garantir precisao clinica e aderencia aos protocolos nacionais.',
    },
    {
      q: 'O conteudo e atualizado para o ENARE 2026?',
      a: 'Absolutamente. Nossa base de conhecimento e atualizada mensalmente com as mais recentes diretrizes e os casos sao calibrados para refletir o perfil atual das provas ENARE e ENARM, incluindo as novas areas de concentracao anunciadas pelo MEC.',
    },
    {
      q: 'Posso usar no celular durante o plantao?',
      a: 'Com certeza! O MedEduca foi projetado mobile-first. A interface e otimizada para telas pequenas e funciona perfeitamente nos intervalos do plantao, no onibus ou em qualquer lugar. E uma PWA — voce pode instalar direto na tela inicial.',
    },
    {
      q: 'Como funciona o plano gratuito?',
      a: 'O plano gratuito inclui 3 casos clinicos por mes em 1 especialidade e flashcards basicos. E perfeito para experimentar a plataforma. Para acesso ilimitado, todas as especialidades e recursos avancados, upgrade para o plano Pro.',
    },
    {
      q: 'Os casos cobrem doencas tropicais e patologias brasileiras?',
      a: 'Sim, esse e nosso diferencial. Alem das patologias comuns, nossos casos incluem dengue, chicungunha, leptospirose, esquistossomose, hanseniase, malaria e outras doencas prevalentes no Brasil, seguindo os protocolos do Ministerio da Saude.',
    },
    {
      q: 'Posso cancelar a assinatura a qualquer momento?',
      a: 'Sim, voce pode cancelar sua assinatura Pro a qualquer momento sem taxas ou burocracia. Seu acesso continua ate o final do periodo pago. Oferecemos tambem garantia de 7 dias — se nao gostar, devolvemos seu dinheiro.',
    },
    {
      q: 'Como a repeticao espacada dos flashcards funciona?',
      a: 'Utilizamos o algoritmo SM-2, o mesmo base do Anki. Apos revisar um flashcard, voce avalia sua dificuldade (De novo / Dificil / Bom / Facil) e o sistema calcula automaticamente o proximo intervalo de revisao ideal para maximizar a retencao a longo prazo.',
    },
  ]

  return (
    <section className="bg-[#F7F5F0] py-20 sm:py-24">
      <div className="max-w-[800px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Reveal>
            <h2 className="font-heading text-[28px] sm:text-[32px] font-bold text-[#1C1917] mb-3">
              Perguntas frequentes
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-body text-[16px] text-[#5C5852]">
              Tire suas duvidas sobre o MedEduca AI
            </p>
          </Reveal>
        </div>

        {/* Accordion */}
        <div ref={ref} className="space-y-0">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06, ease: easeOut }}
              className="border-b border-[#E8E4DA]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left hover:bg-[#F0EDE6] px-2 -mx-2 rounded-lg transition-colors duration-200"
              >
                <span className="font-body font-medium text-[16px] text-[#1C1917] pr-4">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: easeInOut }}
                  className="shrink-0"
                >
                  {openIndex === i ? (
                    <ChevronUp size={20} className="text-[#5C5852]" />
                  ) : (
                    <ChevronDown size={20} className="text-[#5C5852]" />
                  )}
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: easeInOut }}
                    className="overflow-hidden"
                  >
                    <p className="font-body text-[15px] text-[#5C5852] leading-relaxed pb-5 px-2">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 8 — FINAL CTA
   ═══════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="relative bg-[#0D7377] py-20 sm:py-24 overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: [200, 150, 300, 100, 250, 180][i],
              height: [200, 150, 300, 100, 250, 180][i],
              opacity: 0.05,
              left: ['-5%', '60%', '30%', '80%', '10%', '70%'][i],
              top: ['-10%', '20%', '-20%', '60%', '50%', '40%'][i],
            }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto px-6 text-center">
        <Reveal>
          <h2 className="font-heading text-[28px] sm:text-[42px] font-bold text-white mb-4">
            Pronto para transformar seus estudos?
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="font-body text-[16px] sm:text-[18px] text-white/80 max-w-[560px] mx-auto mb-8">
            Junte-se a milhares de estudantes que ja estao estudando de forma mais inteligente.
            Comece gratuitamente hoje.
          </p>
        </Reveal>
        <Reveal delay={0.4}>
          <Link
            to="/"
            className="inline-flex items-center font-body font-medium text-[16px] bg-white text-[#0D7377] px-9 py-4 rounded-[10px] hover:bg-[#F7F5F0] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            Criar conta gratis
          </Link>
        </Reveal>
        <Reveal delay={0.5}>
          <p className="font-body text-[12px] text-white/60 mt-4">
            ou assine o Pro por R$ 29,90/mes
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </Layout>
  )
}
