import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  RotateCw,
  CheckCircle,
  Flame,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Zap,
  Sparkles,
} from 'lucide-react'
import Layout from '../components/Layout'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Flashcard {
  id: number
  specialty: string
  front: string
  back: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    specialty: 'Cardiologia',
    front: 'Qual e o criterio diagnostico de HAS em adultos segundo a Diretriz Brasileira?',
    back: 'PA >= 140/90 mmHg em duas medidas em dias diferentes. PA >= 130/80 mmHg para diabeticos, IRC ou portadores de DAC.',
    difficulty: 'medium',
  },
  {
    id: 2,
    specialty: 'Cardiologia',
    front: 'Quais sao os 4 farmacos de primeira linha para tratamento da HAS segundo a Diretriz SBC?',
    back: 'IECA/ARA II, Betabloqueadores, Bloqueadores de canais de calcio, Diureticos tiazidicos.',
    difficulty: 'easy',
  },
  {
    id: 3,
    specialty: 'Emergencia',
    front: 'Qual e a dose de adrenalina no PCR adulto (via IV/IO)?',
    back: '1 mg a cada 3-5 minutos (dose unica fixa no adulto).',
    difficulty: 'easy',
  },
  {
    id: 4,
    specialty: 'Neurologia',
    front: 'Quais sao os criterios FAST para identificacao precoce de AVC?',
    back: 'Face (assimetria facial), Arm (queda de membro), Speech (disfasia), Time (tempo e cerebral).',
    difficulty: 'easy',
  },
  {
    id: 5,
    specialty: 'Gastroenterologia',
    front: 'Qual e a causa mais comum de hemorragia digestiva alta no Brasil?',
    back: 'Doenca ulcerosa peptica (DUP), seguida por varizes esofagianas em pacientes com hepatopatia.',
    difficulty: 'medium',
  },
  {
    id: 6,
    specialty: 'Infectologia',
    front: 'Quais sao os criterios de sepse (Sepsis-3)?',
    back: 'Disfuncao organica life-threatening causada por resposta desregulada do hospedeiro a infeccao. qSOFA >= 2 pontos (PA sistolica <=100, FR >=22, alteracao mental).',
    difficulty: 'hard',
  },
  {
    id: 7,
    specialty: 'Pneumologia',
    front: 'Qual e o tratamento de primeira linha para asma persistente moderada segundo a diretriz brasileira?',
    back: 'Corticosteroide inalatorio (BAI) de baixa a moderada dose + beta2-agonista longo de acao (LABA).',
    difficulty: 'medium',
  },
  {
    id: 8,
    specialty: 'Endocrinologia',
    front: 'Quais sao os criterios diagnosticos de Diabetes Mellitus segundo a ADA/SBD?',
    back: 'Glicemia de jejum >= 126 mg/dL, Glicemia 2h apos TTOG >= 200 mg/dL, HbA1c >= 6.5%, ou glicemia casual >= 200 mg/dL com sintomas.',
    difficulty: 'hard',
  },
]

/* ------------------------------------------------------------------ */
/*  Easing                                                             */
/* ------------------------------------------------------------------ */

const easeInOut = [0.4, 0, 0.2, 1] as [number, number, number, number]
const easeOut = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

/* ------------------------------------------------------------------ */
/*  Difficulty button config                                           */
/* ------------------------------------------------------------------ */

const RATING_BUTTONS = [
  { key: 'again', label: 'De Novo', interval: '1 min', color: '#C0392B', bg: '#FCEEEE' },
  { key: 'hard', label: 'Dificil', interval: '6 min', color: '#D4943A', bg: '#FDF3E3' },
  { key: 'good', label: 'Bom', interval: '10 min', color: '#2D8A56', bg: '#E8F5EE' },
  { key: 'easy', label: 'Facil', interval: '4 dias', color: '#0D7377', bg: '#E6F2F2' },
] as const

/* ------------------------------------------------------------------ */
/*  Confetti particle component                                        */
/* ------------------------------------------------------------------ */

function ConfettiParticle({ index }: { index: number }) {
  const colors = ['#0D7377', '#D4943A', '#2D8A56', '#C0392B', '#7C5CFF', '#E85D2A']
  const color = colors[index % colors.length]
  const angle = (index / 20) * Math.PI * 2
  const distance = 80 + Math.random() * 150
  const tx = Math.cos(angle) * distance
  const ty = Math.sin(angle) * distance - 100
  const rot = Math.random() * 720 - 360
  const size = 6 + Math.random() * 8

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
      animate={{
        x: tx,
        y: ty,
        opacity: [1, 1, 0],
        scale: [1, 1, 0.3],
        rotate: rot,
      }}
      transition={{ duration: 1.5, delay: index * 0.03, ease: easeOut }}
      className="absolute left-1/2 top-1/2 rounded-sm pointer-events-none"
      style={{
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        marginLeft: -size / 2,
        marginTop: -(size * 0.6) / 2,
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [reviewed, setReviewed] = useState<Set<number>>(new Set())
  const [showCompletion, setShowCompletion] = useState(false)
  const [difficultyCounts, setDifficultyCounts] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  })

  const currentCard = FLASHCARDS[currentIndex]
  const total = FLASHCARDS.length
  const toReview = 5
  const mastered = 3
  const streak = 7

  /* ---- keyboard shortcuts ---- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showCompletion) return
      if (e.code === 'Space') {
        e.preventDefault()
        setIsFlipped((f) => !f)
      } else if (e.key === 'ArrowRight') {
        goNext()
      } else if (e.key === 'ArrowLeft') {
        goPrev()
      } else if (['1', '2', '3', '4'].includes(e.key) && isFlipped) {
        handleRate(RATING_BUTTONS[parseInt(e.key) - 1].key as 'again' | 'hard' | 'good' | 'easy')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isFlipped, currentIndex, showCompletion])

  const goNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setDirection('next')
      setIsFlipped(false)
      setTimeout(() => setCurrentIndex((i) => i + 1), 150)
    }
  }, [currentIndex, total])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection('prev')
      setIsFlipped(false)
      setTimeout(() => setCurrentIndex((i) => i - 1), 150)
    }
  }, [currentIndex])

  const handleRate = useCallback(
    (rating: 'again' | 'hard' | 'good' | 'easy') => {
      setDifficultyCounts((prev) => ({ ...prev, [rating]: prev[rating] + 1 }))
      setReviewed((prev) => {
        const next = new Set(prev)
        next.add(currentCard.id)
        if (next.size >= total) {
          setTimeout(() => setShowCompletion(true), 600)
        } else if (currentIndex < total - 1) {
          setDirection('next')
          setIsFlipped(false)
          setTimeout(() => setCurrentIndex((i) => i + 1), 150)
        }
        return next
      })
    },
    [currentCard, currentIndex, total],
  )

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setReviewed(new Set())
    setShowCompletion(false)
    setDifficultyCounts({ again: 0, hard: 0, good: 0, easy: 0 })
  }

  /* ---- card animation variants ---- */
  const cardVariants = {
    enter: (dir: 'next' | 'prev') => ({
      x: dir === 'next' ? 300 : -300,
      opacity: 0,
      rotateZ: dir === 'next' ? 5 : -5,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateZ: 0,
    },
    exit: (dir: 'next' | 'prev') => ({
      x: dir === 'next' ? -300 : 300,
      opacity: 0,
      rotateZ: dir === 'next' ? -5 : 5,
    }),
  }

  /* ---- specialty color map ---- */
  const specialtyColor = (sp: string) => {
    const map: Record<string, string> = {
      Cardiologia: '#0D7377',
      Neurologia: '#7C5CFF',
      Emergencia: '#C0392B',
      Gastroenterologia: '#D4943A',
      Infectologia: '#E85D2A',
      Pneumologia: '#3B82F6',
      Endocrinologia: '#2D8A56',
    }
    return map[sp] || '#0D7377'
  }

  return (
    <Layout>
      <div className="pt-[72px] sm:pt-[80px] pb-20 sm:pb-12 bg-[#F7F5F0] min-h-[100dvh]">
        {/* ======================== HEADER ======================== */}
        <div className="bg-white border-b border-[#E8E4DA]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut }}
              className="font-heading text-[28px] sm:text-[32px] font-bold text-[#1C1917]"
            >
              Flashcards
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
              className="font-body text-[14px] sm:text-[16px] text-[#5C5852] mt-2"
            >
              Toque no card para revelar a resposta
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4"
            >
              <div className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-[#5C5852]" />
                <span className="font-body text-[12px] text-[#5C5852]">{total} cards</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCw size={14} className="text-[#0D7377]" />
                <span className="font-body text-[12px] font-medium text-[#0D7377]">
                  {toReview} p/ revisar
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-[#2D8A56]" />
                <span className="font-body text-[12px] text-[#2D8A56]">{mastered} dominadas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame size={14} className="text-[#E85D2A]" />
                <span className="font-body text-[12px] text-[#D4943A] font-medium">
                  {streak} dias
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ======================== MAIN CONTENT ======================== */}
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 mt-8 sm:mt-10">
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-[12px] text-[#5C5852]">
                Sessao de hoje
              </span>
              <span className="font-mono text-[12px] text-[#5C5852]">
                {reviewed.size}/{total}
              </span>
            </div>
            <div className="w-full h-2 bg-[#E8E4DA] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#0D7377] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(reviewed.size / total) * 100}%` }}
                transition={{ duration: 0.6, ease: easeInOut }}
              />
            </div>
          </motion.div>

          {/* ===================== FLASHCARD ===================== */}
          <div className="relative" style={{ perspective: '1200px' }}>
            <AnimatePresence mode="wait" custom={direction}>
              {!showCompletion ? (
                <motion.div
                  key={currentCard.id}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: easeInOut }}
                  className="w-full"
                >
                  {/* Card Container with 3D flip */}
                  <div
                    className="relative w-full cursor-pointer mx-auto"
                    style={{ maxWidth: '640px', aspectRatio: '4/3', minHeight: '380px' }}
                    onClick={() => setIsFlipped((f) => !f)}
                  >
                    <div
                      className="relative w-full h-full"
                      style={{
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      {/* ---- FRONT FACE ---- */}
                      <div
                        className="absolute inset-0 bg-white rounded-[16px] border border-[#E8E4DA] shadow-[0_4px_16px_rgba(28,25,23,0.08)] flex flex-col items-center justify-center p-6 sm:p-10"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        {/* Specialty Badge */}
                        <span
                          className="inline-block px-3 py-1 rounded-full font-body text-[11px] font-medium mb-6"
                          style={{
                            backgroundColor: `${specialtyColor(currentCard.specialty)}15`,
                            color: specialtyColor(currentCard.specialty),
                          }}
                        >
                          {currentCard.specialty}
                        </span>

                        {/* Question */}
                        <p className="font-body text-[18px] sm:text-[22px] font-medium text-[#1C1917] text-center leading-relaxed">
                          {currentCard.front}
                        </p>

                        {/* Hint */}
                        <p className="font-body text-[12px] text-[#9C9890] italic mt-4 text-center">
                          Toque para revelar a resposta
                        </p>

                        {/* Bottom flip hint */}
                        <div className="mt-auto flex items-center gap-1.5 text-[#9C9890]">
                          <RotateCcw size={14} />
                          <span className="font-body text-[11px]">Clique para virar</span>
                        </div>
                      </div>

                      {/* ---- BACK FACE ---- */}
                      <div
                        className="absolute inset-0 bg-white rounded-[16px] border border-[#E8E4DA] shadow-[0_4px_16px_rgba(28,25,23,0.08)] flex flex-col p-6 sm:p-10 overflow-auto"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        {/* Specialty Badge */}
                        <span
                          className="inline-block self-start px-3 py-1 rounded-full font-body text-[11px] font-medium mb-4"
                          style={{
                            backgroundColor: `${specialtyColor(currentCard.specialty)}15`,
                            color: specialtyColor(currentCard.specialty),
                          }}
                        >
                          {currentCard.specialty}
                        </span>

                        {/* Answer */}
                        <p className="font-body text-[16px] sm:text-[18px] text-[#1C1917] leading-[1.7] flex-1">
                          {currentCard.back}
                        </p>

                        {/* Divider */}
                        <div className="w-full h-px bg-[#E8E4DA] my-4" />

                        {/* Source */}
                        <p className="font-body text-[11px] text-[#5C5852]">
                          Referencia: Diretriz Brasileira
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* ===================== COMPLETION STATE ===================== */
                <motion.div
                  key="completion"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: easeOut }}
                  className="relative bg-white rounded-[16px] border border-[#E8E4DA] shadow-[0_4px_16px_rgba(28,25,23,0.08)] p-10 sm:p-16 text-center overflow-hidden"
                  style={{ maxWidth: '640px', margin: '0 auto' }}
                >
                  {/* Confetti particles */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <ConfettiParticle key={i} index={i} />
                    ))}
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FDF3E3] mb-6"
                  >
                    <Sparkles size={32} className="text-[#D4943A]" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="font-heading text-[24px] font-bold text-[#1C1917] mb-2"
                  >
                    Sessao concluida!
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="font-body text-[14px] text-[#5C5852] mb-6"
                  >
                    Voce revisou todos os {total} cards programados para hoje.
                  </motion.p>

                  {/* Stats summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-4 mb-8"
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-[#2D8A56]" />
                      <span className="font-body text-[12px] text-[#2D8A56] font-medium">
                        {difficultyCounts.good} Bom
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap size={14} className="text-[#0D7377]" />
                      <span className="font-body text-[12px] text-[#0D7377] font-medium">
                        {difficultyCounts.easy} Facil
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Flame size={14} className="text-[#D4943A]" />
                      <span className="font-body text-[12px] text-[#D4943A] font-medium">
                        {difficultyCounts.hard} Dificil
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RotateCcw size={14} className="text-[#C0392B]" />
                      <span className="font-body text-[12px] text-[#C0392B] font-medium">
                        {difficultyCounts.again} De novo
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                  >
                    <button
                      onClick={handleRestart}
                      className="inline-flex items-center justify-center gap-2 font-body font-medium text-[14px] bg-[#0D7377] text-white px-6 py-3 rounded-[10px] hover:bg-[#095C60] hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(13,115,119,0.25)] active:scale-[0.98] transition-all duration-200"
                    >
                      <RotateCcw size={16} />
                      Recomecar
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===================== DIFFICULTY RATING BUTTONS ===================== */}
          <AnimatePresence>
            {isFlipped && !showCompletion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: easeOut }}
                className="mt-6"
              >
                <p className="font-body text-[13px] font-medium text-[#5C5852] text-center mb-4">
                  Como foi sua lembranca?
                </p>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {RATING_BUTTONS.map((btn, i) => (
                    <motion.button
                      key={btn.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05, ease: easeOut }}
                      onClick={() => handleRate(btn.key as 'again' | 'hard' | 'good' | 'easy')}
                      className="flex flex-col items-center justify-center rounded-[12px] border-2 border-transparent py-3 px-2 sm:px-3 transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{ backgroundColor: btn.bg }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = btn.color
                        e.currentTarget.style.boxShadow = `0 4px 12px ${btn.color}25`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <span
                        className="font-body text-[11px] sm:text-[13px] font-semibold"
                        style={{ color: btn.color }}
                      >
                        {btn.label}
                      </span>
                      <span className="font-body text-[10px] sm:text-[11px] text-[#5C5852] mt-1">
                        {btn.interval}
                      </span>
                      <span
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full font-mono text-[10px] font-medium mt-1.5"
                        style={{
                          backgroundColor: `${btn.color}25`,
                          color: btn.color,
                        }}
                      >
                        {i + 1}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===================== NAVIGATION ===================== */}
          {!showCompletion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex items-center justify-center gap-3 mt-6"
            >
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 font-body text-[13px] font-medium text-[#5C5852] px-4 py-2.5 rounded-[10px] hover:bg-[#F0EDE6] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft size={16} />
                Anterior
              </button>

              <span className="font-mono text-[12px] text-[#9C9890] px-3">
                {currentIndex + 1} / {total}
              </span>

              <button
                onClick={goNext}
                disabled={currentIndex === total - 1}
                className="inline-flex items-center gap-1.5 font-body text-[13px] font-medium text-[#5C5852] px-4 py-2.5 rounded-[10px] hover:bg-[#F0EDE6] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                Proximo
                <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {/* Keyboard shortcuts hint */}
          {!showCompletion && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="font-body text-[11px] text-[#9C9890] text-center mt-3"
            >
              Espaco = virar | 1-4 = dificuldade | Setas = navegar
            </motion.p>
          )}
        </div>
      </div>
    </Layout>
  )
}
