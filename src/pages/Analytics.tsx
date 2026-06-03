import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts'
import {
  BarChart3,
  Target,
  Flame,
  Star,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Layout from '../components/Layout'

/* ------------------------------------------------------------------ */
/*  Easing                                                              */
/* ------------------------------------------------------------------ */

const easeOut = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

/* ------------------------------------------------------------------ */
/*  Animation wrapper component                                         */
/* ------------------------------------------------------------------ */

function ScrollReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const weeklyCasesData = [
  { week: 'S1', cases: 8 },
  { week: 'S2', cases: 12 },
  { week: 'S3', cases: 15 },
  { week: 'S4', cases: 12 },
]

const accuracyData = [
  { specialty: 'Infectologia', accuracy: 88 },
  { specialty: 'Emergencia', accuracy: 82 },
  { specialty: 'Cardiologia', accuracy: 78 },
  { specialty: 'Pediatria', accuracy: 74 },
  { specialty: 'Pneumologia', accuracy: 71 },
  { specialty: 'Gastro', accuracy: 65 },
  { specialty: 'Neurologia', accuracy: 62 },
  { specialty: 'Nefrologia', accuracy: 55 },
]

function getAccuracyColor(acc: number) {
  if (acc >= 80) return '#2D8A56'
  if (acc >= 60) return '#D4943A'
  return '#C0392B'
}

/* ------------------------------------------------------------------ */
/*  Circular Progress Ring                                              */
/* ------------------------------------------------------------------ */

function CircularProgress({
  size = 120,
  strokeWidth = 8,
  progress,
  color = '#0D7377',
  children,
}: {
  size?: number
  strokeWidth?: number
  progress: number
  color?: string
  children?: React.ReactNode
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - progress * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8E4DA"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay: 0.3, ease: easeOut }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Stat Card                                                           */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  change,
  delay = 0,
}: {
  icon: React.ElementType
  iconColor: string
  iconBg: string
  label: string
  value: string
  change: string
  delay?: number
}) {
  return (
    <ScrollReveal delay={delay}>
      <div className="bg-white rounded-[12px] border border-[#E8E4DA] p-5 sm:p-6 h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-body text-[12px] sm:text-[13px] text-[#5C5852] mb-1">{label}</p>
            <p className="font-heading text-[28px] sm:text-[36px] font-bold text-[#1C1917]">{value}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp size={12} className="text-[#2D8A56]" />
              <span className="font-body text-[11px] sm:text-[12px] text-[#2D8A56]">{change}</span>
            </div>
          </div>
          <div
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full shrink-0"
            style={{ backgroundColor: iconBg }}
          >
            <Icon size={20} style={{ color: iconColor }} />
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}

/* ------------------------------------------------------------------ */
/*  Tooltip styles for charts                                           */
/* ------------------------------------------------------------------ */

const tooltipStyle = {
  backgroundColor: '#1C1917',
  borderRadius: '8px',
  padding: '8px 12px',
  border: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
}

const tooltipLabelStyle = {
  color: '#FFFFFF',
  fontSize: '12px',
  fontFamily: '"Source Sans 3", system-ui, sans-serif',
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                           */
/* ------------------------------------------------------------------ */

export default function Analytics() {
  /* ---- generate 30-day streak data (mock) ---- */
  const streakData = useMemo(() => {
    const today = new Date()
    const data: { date: Date; completed: boolean; isToday: boolean; intensity: 'high' | 'medium' | 'low' }[] = []
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i)
      // Deterministic completion pattern (75% completion rate)
      const completed = (i % 4 !== 0) || i === 0
      const intensity: 'high' | 'medium' | 'low' = completed
        ? (i % 3 === 0) ? 'high' : (i % 2 === 0) ? 'medium' : 'low'
        : 'low'
      data.push({
        date,
        completed,
        isToday: i === 0,
        intensity,
      })
    }
    return data
  }, [])
  const [chartInView, setChartInView] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setChartInView(true)
      },
      { threshold: 0.1 },
    )
    if (chartRef.current) observer.observe(chartRef.current)
    return () => observer.disconnect()
  }, [])

  const monthLabel = format(today, 'MMMM yyyy', { locale: ptBR })
  const currentStreak = 12
  const recordStreak = 23

  // XP data
  const currentXP = 2340
  const nextLevelXP = 3000
  const xpProgress = currentXP / nextLevelXP
  const currentLevel = 8

  return (
    <Layout>
      <div className="pt-[72px] sm:pt-[80px] pb-20 sm:pb-12 bg-[#F7F5F0] min-h-[100dvh]">
        {/* ===================== HEADER ===================== */}
        <div className="bg-white border-b border-[#E8E4DA]">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut }}
              className="font-heading text-[28px] sm:text-[32px] font-bold text-[#1C1917]"
            >
              Seu Progresso
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
              className="font-body text-[14px] sm:text-[16px] text-[#5C5852] mt-2"
            >
              Acompanhe sua evolucao e identifique onde focar seus estudos.
            </motion.p>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
          {/* ===================== SUMMARY STATS ===================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              icon={BarChart3}
              iconColor="#0D7377"
              iconBg="#E6F2F2"
              label="Casos Resolvidos"
              value="47"
              change="+12 este mes"
              delay={0}
            />
            <StatCard
              icon={Target}
              iconColor="#0D7377"
              iconBg="#E6F2F2"
              label="Taxa de Acertos"
              value="73%"
              change="+5% vs mes anterior"
              delay={0.08}
            />
            <StatCard
              icon={Flame}
              iconColor="#D4943A"
              iconBg="#FDF3E3"
              label="Streak Atual"
              value="12 dias"
              change={`Recorde: ${recordStreak} dias`}
              delay={0.16}
            />
            <StatCard
              icon={Star}
              iconColor="#F5A623"
              iconBg="#FDF3E3"
              label="XP Total"
              value="2.340"
              change="Nivel 8"
              delay={0.24}
            />
          </div>

          {/* ===================== WEEKLY CASES CHART ===================== */}
          <ScrollReveal delay={0.1} className="mt-6">
            <div
              ref={chartRef}
              className="bg-white rounded-[16px] border border-[#E8E4DA] p-5 sm:p-7"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                <div>
                  <h2 className="font-heading text-[16px] sm:text-[18px] font-bold text-[#1C1917]">
                    Casos por Semana
                  </h2>
                  <p className="font-body text-[11px] sm:text-[12px] text-[#5C5852] mt-0.5">
                    Total de casos resolvidos neste mes
                  </p>
                </div>
                <span className="font-body text-[11px] sm:text-[12px] text-[#5C5852]">
                  Media: 12 casos/sem
                </span>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={weeklyCasesData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE6" vertical={false} />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: '#9C9890', fontSize: 12, fontFamily: '"Source Sans 3", system-ui' }}
                    axisLine={{ stroke: '#E8E4DA' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#9C9890', fontSize: 12, fontFamily: '"Source Sans 3", system-ui' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    itemStyle={tooltipLabelStyle}
                    formatter={(value: number) => [`${value} casos`, 'Casos']}
                  />
                  <Bar
                    dataKey="cases"
                    radius={[6, 6, 0, 0]}
                    fill="#0D7377"
                    maxBarSize={40}
                  >
                    {weeklyCasesData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === weeklyCasesData.length - 1 ? '#D4943A' : '#0D7377'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ScrollReveal>

          {/* ===================== ACCURACY BY SPECIALTY ===================== */}
          <ScrollReveal delay={0.15} className="mt-6">
            <div className="bg-white rounded-[16px] border border-[#E8E4DA] p-5 sm:p-7">
              <div className="mb-5">
                <h2 className="font-heading text-[16px] sm:text-[18px] font-bold text-[#1C1917]">
                  Acuracia por Especialidade
                </h2>
                <p className="font-body text-[11px] sm:text-[12px] text-[#5C5852] mt-0.5">
                  Porcentagem de respostas corretas por area
                </p>
              </div>

              <div className="space-y-3">
                {accuracyData.map((item, i) => {
                  const color = getAccuracyColor(item.accuracy)
                  return (
                    <div key={item.specialty} className="flex items-center gap-3">
                      <span className="font-body text-[12px] sm:text-[13px] text-[#1C1917] w-24 sm:w-28 shrink-0 text-right truncate">
                        {item.specialty}
                      </span>
                      <div className="flex-1 h-5 sm:h-6 bg-[#F0EDE6] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full flex items-center justify-end pr-2"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={chartInView ? { width: `${item.accuracy}%` } : { width: 0 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.3 + i * 0.06,
                            ease: easeOut,
                          }}
                        >
                          <span className="font-mono text-[10px] sm:text-[11px] font-medium text-white">
                            {item.accuracy}%
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#E8E4DA]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#2D8A56]" />
                  <span className="font-body text-[11px] text-[#5C5852]">&gt;= 80%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#D4943A]" />
                  <span className="font-body text-[11px] text-[#5C5852]">60-79%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#C0392B]" />
                  <span className="font-body text-[11px] text-[#5C5852]">&lt; 60%</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ===================== STREAK CALENDAR + XP LEVEL ===================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
            {/* Streak Calendar */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-[16px] border border-[#E8E4DA] p-5 sm:p-7">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-heading text-[16px] sm:text-[18px] font-bold text-[#1C1917]">
                      Calendario de Streaks
                    </h2>
                    <p className="font-body text-[12px] text-[#5C5852] mt-0.5 capitalize">
                      {monthLabel}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[#D4943A]">
                    <Flame size={16} />
                    <span className="font-body text-[12px] font-medium">{currentStreak} dias</span>
                  </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1.5 mb-1.5">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                    <div
                      key={i}
                      className="text-center font-body text-[11px] text-[#9C9890] font-medium py-1"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar grid - last 30 days */}
                <div className="grid grid-cols-7 gap-1.5">
                  {streakData.map((day, i) => {
                    const isToday = day.isToday
                    const dayNum = format(day.date, 'd')
                    const intensityClass =
                      day.intensity === 'high'
                        ? 'bg-[#0D7377] text-white'
                        : day.intensity === 'medium'
                          ? 'bg-[#7BC4C6] text-white'
                          : 'bg-[#C8E6E7] text-[#0D7377]'

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: i * 0.01,
                          ease: easeOut,
                        }}
                        className={`
                          aspect-square rounded-[8px] flex items-center justify-center
                          font-body text-[11px] sm:text-[12px] font-medium
                          ${isToday ? 'ring-2 ring-[#D4943A] ring-offset-1 shadow-[0_0_8px_rgba(212,148,58,0.3)]' : ''}
                          ${day.completed ? intensityClass : 'bg-[#F7F5F0] text-[#9C9890]'}
                        `}
                        title={format(day.date, 'dd/MM/yyyy')}
                      >
                        {dayNum}
                      </motion.div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-[#E8E4DA]">
                  <span className="font-body text-[10px] text-[#9C9890]">Menos</span>
                  <div className="w-3 h-3 rounded-sm bg-[#C8E6E7]" />
                  <div className="w-3 h-3 rounded-sm bg-[#7BC4C6]" />
                  <div className="w-3 h-3 rounded-sm bg-[#0D7377]" />
                  <span className="font-body text-[10px] text-[#9C9890]">Mais</span>
                </div>
              </div>
            </ScrollReveal>

            {/* XP Level Progress */}
            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-[16px] border border-[#E8E4DA] p-5 sm:p-7">
                <div className="mb-4">
                  <h2 className="font-heading text-[16px] sm:text-[18px] font-bold text-[#1C1917]">
                    Nivel & XP
                  </h2>
                  <p className="font-body text-[12px] text-[#7C5CFF] font-medium mt-0.5">
                    Nivel {currentLevel} — R2 de Clinica
                  </p>
                </div>

                {/* Circular Progress */}
                <div className="flex flex-col items-center">
                  <CircularProgress
                    size={140}
                    strokeWidth={8}
                    progress={xpProgress}
                    color="#0D7377"
                  >
                    <span className="font-heading text-[36px] font-bold text-[#0D7377]">
                      {currentLevel}
                    </span>
                    <span className="font-body text-[11px] text-[#5C5852]">Nivel</span>
                  </CircularProgress>
                </div>

                {/* XP Stats */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading text-[18px] sm:text-[20px] font-bold text-[#1C1917]">
                      {currentXP.toLocaleString()} XP
                    </span>
                    <span className="font-body text-[11px] text-[#5C5852]">
                      prox: R3 de Clinica
                    </span>
                  </div>

                  {/* XP Bar */}
                  <div className="w-full h-2.5 bg-[#E8E4DA] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: '#0D7377' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.5, ease: easeOut }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-mono text-[10px] sm:text-[11px] text-[#5C5852]">
                      {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
                    </span>
                    <span className="font-body text-[10px] sm:text-[11px] text-[#9C9890]">
                      Faltam {(nextLevelXP - currentXP).toLocaleString()} XP
                    </span>
                  </div>
                </div>

                {/* XP Breakdown */}
                <div className="mt-5 pt-4 border-t border-[#E8E4DA]">
                  <p className="font-body text-[12px] font-medium text-[#1C1917] mb-3">
                    Ganhos por atividade
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: 'Casos clinicos', value: 1240 },
                      { label: 'Flashcards', value: 680 },
                      { label: 'Streaks', value: 240 },
                      { label: 'Conquistas', value: 180 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="font-body text-[11px] sm:text-[12px] text-[#5C5852]">
                          {item.label}
                        </span>
                        <span className="font-mono text-[11px] sm:text-[12px] text-[#1C1917] font-medium">
                          +{item.value.toLocaleString()} XP
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="mt-5 pt-4 border-t border-[#E8E4DA]">
                  <p className="font-body text-[12px] font-medium text-[#1C1917] mb-3">
                    Conquistas recentes
                  </p>
                  <div className="flex items-center gap-4">
                    {[
                      { icon: Award, label: 'Primeiro Caso', color: '#2D8A56' },
                      { icon: Flame, label: 'Streak 7 dias', color: '#D4943A' },
                      { icon: Layers, label: '50 Cards', color: '#0D7377' },
                    ].map((ach, i) => (
                      <motion.div
                        key={ach.label}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.6 + i * 0.1,
                          ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
                        }}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: ach.color }}
                        >
                          <ach.icon size={18} style={{ color: ach.color }} />
                        </div>
                        <span className="font-body text-[9px] sm:text-[10px] text-[#5C5852] text-center leading-tight">
                          {ach.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </Layout>
  )
}
