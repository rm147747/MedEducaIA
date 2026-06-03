import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart,
  Brain,
  Wind,
  Droplets,
  Activity,
  CircleDot,
  Bone,
  ShieldAlert,
  ScanFace,
  PersonStanding,
  HeartPulse,
  Baby,
  Siren,
  Scissors,
  BrainCircuit,
  Eye,
  Search,
  Play,
  SearchX,
  LayoutGrid,
  Stethoscope,
  TrendingUp,
} from 'lucide-react'
import Layout from '../components/Layout'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Difficulty {
  basico: number
  intermediario: number
  avancado: number
}

interface Specialty {
  id: string
  name: string
  icon: string
  progress: number
  cases: number
  difficulty: Difficulty
}

const SPECIALTIES: Specialty[] = [
  { id: 'cardio', name: 'Cardiologia', icon: 'Heart', progress: 35, cases: 142, difficulty: { basico: 30, intermediario: 50, avancado: 20 } },
  { id: 'neuro', name: 'Neurologia', icon: 'Brain', progress: 22, cases: 98, difficulty: { basico: 25, intermediario: 45, avancado: 30 } },
  { id: 'gastro', name: 'Gastroenterologia', icon: 'Activity', progress: 45, cases: 115, difficulty: { basico: 40, intermediario: 40, avancado: 20 } },
  { id: 'pneumo', name: 'Pneumologia', icon: 'Wind', progress: 30, cases: 87, difficulty: { basico: 35, intermediario: 40, avancado: 25 } },
  { id: 'nefro', name: 'Nefrologia', icon: 'Droplets', progress: 18, cases: 72, difficulty: { basico: 20, intermediario: 50, avancado: 30 } },
  { id: 'endo', name: 'Endocrinologia', icon: 'Activity', progress: 40, cases: 95, difficulty: { basico: 30, intermediario: 50, avancado: 20 } },
  { id: 'hemato', name: 'Hematologia', icon: 'CircleDot', progress: 12, cases: 64, difficulty: { basico: 15, intermediario: 45, avancado: 40 } },
  { id: 'reuma', name: 'Reumatologia', icon: 'Bone', progress: 25, cases: 58, difficulty: { basico: 25, intermediario: 45, avancado: 30 } },
  { id: 'infecto', name: 'Infectologia', icon: 'ShieldAlert', progress: 55, cases: 128, difficulty: { basico: 30, intermediario: 40, avancado: 30 } },
  { id: 'derma', name: 'Dermatologia', icon: 'ScanFace', progress: 60, cases: 76, difficulty: { basico: 50, intermediario: 35, avancado: 15 } },
  { id: 'orto', name: 'Ortopedia', icon: 'PersonStanding', progress: 50, cases: 110, difficulty: { basico: 40, intermediario: 40, avancado: 20 } },
  { id: 'gyn', name: 'Ginecologia', icon: 'HeartPulse', progress: 35, cases: 89, difficulty: { basico: 35, intermediario: 40, avancado: 25 } },
  { id: 'obst', name: 'Obstetrícia', icon: 'Baby', progress: 30, cases: 82, difficulty: { basico: 30, intermediario: 45, avancado: 25 } },
  { id: 'peds', name: 'Pediatria', icon: 'Baby', progress: 48, cases: 105, difficulty: { basico: 45, intermediario: 35, avancado: 20 } },
  { id: 'emerg', name: 'Urgência/Emergência', icon: 'Siren', progress: 62, cases: 156, difficulty: { basico: 25, intermediario: 35, avancado: 40 } },
  { id: 'cirurg', name: 'Cirurgia Geral', icon: 'Scissors', progress: 28, cases: 94, difficulty: { basico: 20, intermediario: 50, avancado: 30 } },
  { id: 'psych', name: 'Psiquiatria', icon: 'BrainCircuit', progress: 38, cases: 68, difficulty: { basico: 40, intermediario: 35, avancado: 25 } },
  { id: 'oftal', name: 'Oftalmologia', icon: 'Eye', progress: 20, cases: 52, difficulty: { basico: 30, intermediario: 40, avancado: 30 } },
]

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Heart,
  Brain,
  Wind,
  Droplets,
  Activity,
  CircleDot,
  Bone,
  ShieldAlert,
  ScanFace,
  PersonStanding,
  HeartPulse,
  Baby,
  Siren,
  Scissors,
  BrainCircuit,
  Eye,
}

const TOTAL_CASES = SPECIALTIES.reduce((acc, s) => acc + s.cases, 0)

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Specialties() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('Todas')

  const filters = ['Todas', 'Básico', 'Intermediário', 'Avançado']

  const filtered = useMemo(() => {
    let list = [...SPECIALTIES]

    if (search.trim()) {
      const term = search.toLowerCase()
      list = list.filter((s) => s.name.toLowerCase().includes(term))
    }

    if (activeFilter === 'Básico') {
      list = list.filter((s) => s.difficulty.basico >= s.difficulty.intermediario && s.difficulty.basico >= s.difficulty.avancado)
    } else if (activeFilter === 'Intermediário') {
      list = list.filter((s) => s.difficulty.intermediario >= s.difficulty.basico && s.difficulty.intermediario >= s.difficulty.avancado)
    } else if (activeFilter === 'Avançado') {
      list = list.filter((s) => s.difficulty.avancado >= s.difficulty.basico && s.difficulty.avancado >= s.difficulty.intermediario)
    }

    return list
  }, [search, activeFilter])

  const handleCardClick = (id: string) => {
    navigate(`/case/${id}`)
  }

  /* Card animation variants */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    },
  }

  return (
    <Layout>
      <div className="overflow-x-hidden">
      {/* Page Header */}
      <section className="bg-white border-b border-[#E8E4DA]">
        <div className="max-w-[1100px] mx-auto px-6 py-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-heading text-[32px] font-bold text-[#1C1917]"
          >
            Especialidades
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-body text-[16px] text-[#5C5852] mt-2"
          >
            Escolha uma especialidade e comece a resolver casos clínicos. Seu progresso é salvo automaticamente.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 mt-5"
          >
            <span className="flex items-center gap-1.5 text-[14px] text-[#5C5852]">
              <LayoutGrid size={16} className="text-[#9C9890]" />
              18 especialidades
            </span>
            <span className="flex items-center gap-1.5 text-[14px] text-[#5C5852]">
              <Stethoscope size={16} className="text-[#9C9890]" />
              {TOTAL_CASES.toLocaleString()} casos disponíveis
            </span>
            <span className="flex items-center gap-1.5 text-[14px] text-[#0D7377] font-medium">
              <TrendingUp size={16} />
              Seu progresso: 23%
            </span>
          </motion.div>
        </div>
      </section>

      {/* Filters Bar */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="sticky top-[60px] z-30 bg-[#F7F5F0]/95 backdrop-blur-sm border-b border-[#E8E4DA]/50"
      >
        <div className="max-w-[1100px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-[280px]">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9C9890]" />
            <input
              type="text"
              placeholder="Buscar especialidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-[1.5px] border-[#E8E4DA] rounded-[10px] pl-10 pr-4 py-2.5 font-body text-[14px] text-[#1C1917] placeholder-[#9C9890] focus:border-[#0D7377] focus:shadow-[0_0_0_3px_rgba(13,115,119,0.1)] focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-white border border-[#E8E4DA] rounded-[10px] p-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-[8px] rounded-[8px] font-body font-medium text-[14px] transition-all duration-200 ${
                  activeFilter === f
                    ? 'bg-[#0D7377] text-white'
                    : 'text-[#5C5852] hover:text-[#1C1917]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Specialty Grid */}
      <section className="max-w-[1100px] mx-auto px-6 py-6 pb-12">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <SearchX size={64} className="text-[#9C9890] mb-4" />
            <h3 className="font-heading text-[20px] font-medium text-[#5C5852] mb-2">
              Nenhuma especialidade encontrada
            </h3>
            <p className="font-body text-[16px] text-[#9C9890] mb-6">
              Tente ajustar seus filtros ou termo de busca.
            </p>
            <button
              onClick={() => { setSearch(''); setActiveFilter('Todas') }}
              className="font-body font-medium text-[14px] border-[1.5px] border-[#0D7377] text-[#0D7377] px-5 py-2.5 rounded-[10px] hover:bg-[#E6F2F2] active:scale-[0.98] transition-all duration-200"
            >
              Limpar filtros
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={activeFilter + search}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((spec) => {
              const IconComp = ICON_MAP[spec.icon] || Heart
              const resolved = Math.round((spec.progress / 100) * spec.cases)

              return (
                <motion.div
                  key={spec.id}
                  variants={cardVariants}
                  onClick={() => handleCardClick(spec.id)}
                  className="group bg-white rounded-[14px] border border-[#E8E4DA] p-6 cursor-pointer transition-all duration-300 hover:border-[#0D7377] hover:shadow-[0_4px_16px_rgba(13,115,119,0.1)] hover:-translate-y-0.5 active:scale-[0.98] active:bg-[#F0F7F7]"
                >
                  {/* Top Row: Icon + Title + Case Count */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#E6F2F2] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[#0D7377]">
                      <IconComp
                        size={24}
                        className="text-[#0D7377] transition-colors duration-300 group-hover:text-white"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-body font-semibold text-[16px] text-[#1C1917] truncate">
                        {spec.name}
                      </h3>
                    </div>
                    <span className="font-body text-[12px] text-[#5C5852] shrink-0">
                      {spec.cases} casos
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full h-[6px] bg-[#E8E4DA] rounded-[3px] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${spec.progress}%` }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], delay: 0.2 }}
                        className="h-full bg-[#0D7377] rounded-[3px]"
                      />
                    </div>
                    <p className="font-body text-[12px] text-[#5C5852] mt-1.5">
                      {resolved}/{spec.cases} resolvidos
                    </p>
                  </div>

                  {/* Difficulty Distribution */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 text-[12px] font-body px-2.5 py-1 rounded-full bg-[#E8F5EE] text-[#2D8A56]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D8A56]" />
                      Fácil {spec.difficulty.basico}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[12px] font-body px-2.5 py-1 rounded-full bg-[#FDF3E3] text-[#D4943A]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4943A]" />
                      Médio {spec.difficulty.intermediario}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[12px] font-body px-2.5 py-1 rounded-full bg-[#FCEEEE] text-[#C0392B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" />
                      Difícil {spec.difficulty.avancado}
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="mt-4 pt-4 border-t border-[#E8E4DA]">
                    <button className="w-full flex items-center justify-center gap-2 font-body font-medium text-[14px] border-[1.5px] border-[#0D7377] text-[#0D7377] px-4 py-2.5 rounded-[10px] hover:bg-[#E6F2F2] active:scale-[0.98] transition-all duration-200">
                      <Play size={16} />
                      {spec.progress > 0 ? 'Continuar' : 'Iniciar'}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </section>
      </div>
    </Layout>
  )
}
