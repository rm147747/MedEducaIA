import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  X,
  Shield,
  CreditCard,
  CalendarClock,
} from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import Layout from '../components/Layout'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Feature {
  label: string
  free: string
  proMonthly: string
  proAnnual: string
  highlight?: boolean
}

const COMPARISON_FEATURES: Feature[] = [
  { label: 'Casos clínicos por mês', free: '3', proMonthly: 'Ilimitados', proAnnual: 'Ilimitados' },
  { label: 'Especialidades', free: '1', proMonthly: '18', proAnnual: '18' },
  { label: 'Flashcards', free: 'Básicos', proMonthly: 'SM-2 completo', proAnnual: 'SM-2 completo' },
  { label: 'Analytics', free: 'Básico', proMonthly: 'Completo', proAnnual: 'Completo' },
  { label: 'Gamificação (XP, Streaks)', free: '—', proMonthly: '✓', proAnnual: '✓', highlight: true },
  { label: 'Protocolos brasileiros atualizados', free: '—', proMonthly: '✓', proAnnual: '✓', highlight: true },
  { label: 'Exportar relatórios', free: '—', proMonthly: '✓', proAnnual: '✓', highlight: true },
  { label: 'Suporte prioritário', free: '—', proMonthly: '✓', proAnnual: '✓', highlight: true },
  { label: 'Garantia de 7 dias', free: '—', proMonthly: '✓', proAnnual: '✓', highlight: true },
  { label: 'Preço mensal', free: 'R$ 0', proMonthly: 'R$ 29,90', proAnnual: 'R$ 19,90' },
]

const FREE_FEATURES_INCLUDED = [
  '<strong>3 casos clínicos</strong> por mês gerados por IA',
  '<strong>1 especialidade</strong> à escolha',
  'Flashcards básicos sem repetição espaçada',
  'Feedback imediato nas questões',
  'Progresso básico de estudos',
]

const FREE_FEATURES_NOT_INCLUDED = [
  'Analytics avançado',
  'Streaks e gamificação',
  'Exportar relatórios',
]

const PRO_FEATURES = [
  '<strong>Casos clínicos ilimitados</strong> em todas as especialidades',
  '<strong>18 especialidades</strong> médicas completas',
  '<strong>Flashcards com SM-2</strong> — repetição espaçada inteligente',
  '<strong>Analytics completo</strong> — gráficos e relatórios',
  '<strong>Streaks, XP e conquistas</strong> — gamificação completa',
  '<strong>Conteúdo atualizado</strong> mensal para ENARE/ENARM',
  '<strong>Protocolos brasileiros</strong> — SUS, SBC, SBD, SBEM',
  '<strong>Exportar progresso</strong> em PDF/CSV',
  '<strong>Suporte prioritário</strong> por email',
]

const FAQ_ITEMS = [
  {
    q: 'Posso começar de graça e depois fazer upgrade?',
    a: 'Com certeza! É assim que recomendamos. Crie sua conta gratuita, experimente os 3 casos do mês e, quando sentir que a plataforma faz sentido para você, faça o upgrade para o Pro com apenas dois cliques. Seu progresso é mantido.',
  },
  {
    q: 'Como funciona a garantia de 7 dias?',
    a: 'Se você assinar o Pro e não ficar satisfeito por qualquer motivo, devolvemos 100% do valor pago nos primeiros 7 dias. Sem perguntas, sem burocracia. Basta enviar um email para suporte@mededuca.ai.',
  },
  {
    q: 'Posso cancelar a qualquer momento?',
    a: 'Sim, você pode cancelar sua assinatura a qualquer momento diretamente na página da sua conta. Seu acesso ao Pro continua até o final do período pago. Não há taxa de cancelamento.',
  },
  {
    q: 'O plano anual é realmente mais barato?',
    a: 'Sim! O plano anual sai a R$ 19,90/mês (R$ 238,80 cobrados uma vez por ano), enquanto o mensal é R$ 29,90/mês. No anual você economiza R$ 120 por ano — quase 5 meses grátis.',
  },
  {
    q: 'Aceitam quais formas de pagamento?',
    a: 'Aceitamos cartão de crédito (parcelado em até 12x no anual), PIX e boleto bancário. Pagamentos processados com segurança via Stripe.',
  },
  {
    q: 'O preço vai aumentar no futuro?',
    a: 'Ao assinar, seu preço fica garantido pelo tempo da sua assinatura ativa. Se houver ajustes futuros, eles não afetarão assinantes existentes.',
  },
]

/* ------------------------------------------------------------------ */
/*  Animation Variants                                                 */
/* ------------------------------------------------------------------ */

const cardContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

const featuredCardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <Layout>
      {/* Page Header */}
      <section className="pt-[72px] bg-[#F7F5F0]">
        <div className="max-w-[800px] mx-auto px-6 text-center py-16 md:py-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="font-body text-[12px] font-semibold text-[#D4943A] uppercase tracking-[0.1em]"
          >
            Planos e Preços
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-[28px] md:text-[42px] font-bold text-[#1C1917] mt-3 leading-tight"
          >
            Invista na sua aprovação
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-body text-[18px] text-[#5C5852] mt-4 max-w-[600px] mx-auto leading-relaxed"
          >
            Comece gratuitamente e suba de nível quando estiver pronto. Pro planos a partir de R$ 19,90 por mês — menos que um lanche por semana.
          </motion.p>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-8"
          >
            {[
              { icon: Shield, text: '7 dias de garantia' },
              { icon: CalendarClock, text: 'Cancele quando quiser' },
              { icon: CreditCard, text: 'Pagamento seguro com PIX e cartão' },
            ].map((item) => (
              <span
                key={item.text}
                className="flex items-center gap-1.5 font-body text-[14px] text-[#2D8A56]"
              >
                <item.icon size={16} />
                {item.text}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="bg-[#F7F5F0]">
        <div className="max-w-[1100px] mx-auto px-6 flex justify-center pb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="inline-flex items-center bg-white border border-[#E8E4DA] rounded-[12px] p-1"
          >
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2.5 rounded-[10px] font-body font-medium text-[14px] transition-all duration-200 ${
                billing === 'monthly'
                  ? 'bg-[#0D7377] text-white'
                  : 'text-[#5C5852] hover:text-[#1C1917]'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-5 py-2.5 rounded-[10px] font-body font-medium text-[14px] transition-all duration-200 flex items-center gap-1.5 ${
                billing === 'annual'
                  ? 'bg-[#0D7377] text-white'
                  : 'text-[#5C5852] hover:text-[#1C1917]'
              }`}
            >
              Anual
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                billing === 'annual' ? 'bg-white/20 text-white' : 'bg-[#D4943A] text-white'
              }`}>
                Economize 33%
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-[#F7F5F0] py-8">
        <motion.div
          variants={cardContainer}
          initial="hidden"
          animate="visible"
          className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
        >
          {/* Free Plan */}
          <motion.div
            variants={cardVariant}
            className="bg-white rounded-[16px] border border-[#E8E4DA] p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:border-[#0D7377] hover:shadow-[0_8px_24px_rgba(13,115,119,0.1)]"
          >
            <h3 className="font-heading text-[24px] font-bold text-[#1C1917]">Gratuito</h3>
            <p className="font-body text-[14px] text-[#5C5852] mt-1">Para experimentar a plataforma</p>
            <div className="flex items-baseline mt-4">
              <span className="font-heading text-[48px] font-bold text-[#1C1917]">R$ 0</span>
              <span className="font-body text-[16px] text-[#5C5852] ml-1">/mês</span>
            </div>
            <div className="h-px bg-[#E8E4DA] my-6" />
            <ul className="space-y-3">
              {FREE_FEATURES_INCLUDED.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={20} className="text-[#2D8A56] shrink-0 mt-0.5" />
                  <span className="font-body text-[14px] text-[#1C1917]" dangerouslySetInnerHTML={{ __html: f }} />
                </li>
              ))}
              {FREE_FEATURES_NOT_INCLUDED.map((f, i) => (
                <li key={`no-${i}`} className="flex items-start gap-3 opacity-50">
                  <X size={20} className="text-[#9C9890] shrink-0 mt-0.5" />
                  <span className="font-body text-[14px] text-[#9C9890] line-through">{f}</span>
                </li>
              ))}
            </ul>
            <button className="w-full mt-6 font-body font-medium text-[14px] border-[1.5px] border-[#0D7377] text-[#0D7377] px-4 py-3 rounded-[10px] hover:bg-[#E6F2F2] active:scale-[0.98] transition-all duration-200">
              Criar conta grátis
            </button>
          </motion.div>

          {/* Pro Monthly (Featured) */}
          <motion.div
            variants={featuredCardVariant}
            className="relative bg-white rounded-[16px] border-2 border-[#0D7377] shadow-[0_12px_40px_rgba(13,115,119,0.12)] p-8 md:p-10 lg:-translate-y-2 transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_16px_48px_rgba(13,115,119,0.16)]"
          >
            {/* Badge */}
            <div className="absolute -top-[14px] left-1/2 -translate-x-1/2">
              <span className="font-body font-semibold text-[11px] text-white bg-[#0D7377] px-4 py-1 rounded-full uppercase tracking-wide">
                Mais Popular
              </span>
            </div>

            <h3 className="font-heading text-[24px] font-bold text-[#1C1917]">Pro Mensal</h3>
            <p className="font-body text-[14px] text-[#5C5852] mt-1">Acesso completo, mês a mês</p>
            <div className="flex items-baseline mt-4">
              <span className="font-heading text-[48px] font-bold text-[#0D7377]">R$ 29,90</span>
              <span className="font-body text-[16px] text-[#5C5852] ml-1">/mês</span>
            </div>
            <p className="font-body text-[12px] text-[#5C5852] mt-2">
              Cobrado mensalmente. Cancele quando quiser.
            </p>
            <div className="h-px bg-[#E8E4DA] my-6" />
            <ul className="space-y-3">
              {PRO_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={20} className="text-[#2D8A56] shrink-0 mt-0.5" />
                  <span className="font-body text-[14px] text-[#1C1917]" dangerouslySetInnerHTML={{ __html: f }} />
                </li>
              ))}
            </ul>
            <button className="w-full mt-6 font-body font-medium text-[14px] bg-[#0D7377] text-white px-4 py-3 rounded-[10px] hover:bg-[#095C60] hover:shadow-[0_4px_12px_rgba(13,115,119,0.25)] active:scale-[0.98] transition-all duration-200">
              Assinar Pro Mensal
            </button>
          </motion.div>

          {/* Pro Annual */}
          <motion.div
            variants={cardVariant}
            className="relative bg-white rounded-[16px] border border-[#E8E4DA] p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:border-[#0D7377] hover:shadow-[0_8px_24px_rgba(13,115,119,0.1)]"
          >
            {/* Badge */}
            <div className="absolute -top-[14px] left-1/2 -translate-x-1/2">
              <span className="font-body font-semibold text-[11px] text-white bg-[#D4943A] px-4 py-1 rounded-full uppercase tracking-wide">
                Economize 33%
              </span>
            </div>

            <h3 className="font-heading text-[24px] font-bold text-[#1C1917]">Pro Anual</h3>
            <p className="font-body text-[14px] text-[#5C5852] mt-1">Melhor custo-benefício</p>
            <div className="flex items-baseline mt-4 flex-wrap gap-x-2">
              <span className="font-heading text-[48px] font-bold text-[#D4943A]">R$ 19,90</span>
              <span className="font-body text-[16px] text-[#5C5852]">/mês</span>
              <span className="font-body text-[14px] text-[#9C9890] line-through ml-1">R$ 29,90</span>
            </div>
            <p className="font-body text-[12px] text-[#5C5852] mt-2">
              R$ 238,80 cobrados anualmente (12 × R$ 19,90)
            </p>
            <p className="inline-block mt-2 font-body text-[12px] text-[#2D8A56] bg-[#E8F5EE] px-3 py-1 rounded-full">
              Você economiza R$ 120 por ano
            </p>
            <div className="h-px bg-[#E8E4DA] my-6" />
            <ul className="space-y-3">
              {PRO_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={20} className="text-[#2D8A56] shrink-0 mt-0.5" />
                  <span className="font-body text-[14px] text-[#1C1917]" dangerouslySetInnerHTML={{ __html: f }} />
                </li>
              ))}
            </ul>
            <button className="w-full mt-6 font-body font-medium text-[14px] bg-[#D4943A] text-white px-4 py-3 rounded-[10px] hover:bg-[#B07A2E] hover:shadow-[0_4px_12px_rgba(212,148,58,0.25)] active:scale-[0.98] transition-all duration-200">
              Assinar Pro Anual
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-[#F7F5F0] py-12">
        <div className="max-w-[900px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="font-heading text-[32px] font-bold text-[#1C1917]">Compare os planos</h2>
            <p className="font-body text-[16px] text-[#5C5852] mt-2">
              Veja todos os recursos disponíveis em cada plano
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-[16px] border border-[#E8E4DA] overflow-hidden"
          >
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-[#F0F7F7]">
              <div className="px-6 py-4 font-body font-medium text-[14px] text-[#0D7377]">Recurso</div>
              <div className="px-4 py-4 font-body font-medium text-[14px] text-[#0D7377] text-center">Gratuito</div>
              <div className="px-4 py-4 font-body font-medium text-[14px] text-[#0D7377] text-center">Pro Mensal</div>
              <div className="px-4 py-4 font-body font-medium text-[14px] text-[#0D7377] text-center">Pro Anual</div>
            </div>

            {/* Table Rows */}
            {COMPARISON_FEATURES.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr] border-t border-[#E8E4DA] ${
                  i % 2 === 1 ? 'bg-[#F7F5F0]' : 'bg-white'
                }`}
              >
                <div className="px-6 py-3.5 font-body text-[14px] text-[#1C1917]">{row.label}</div>
                <div className="px-4 py-3.5 font-body text-[14px] text-[#1C1917] text-center">
                  {row.free === '✓' ? (
                    <Check size={18} className="text-[#2D8A56] mx-auto" />
                  ) : row.free === '—' ? (
                    <span className="text-[#9C9890]">—</span>
                  ) : (
                    row.free
                  )}
                </div>
                <div className={`px-4 py-3.5 font-body text-[14px] text-[#1C1917] text-center ${row.highlight ? 'bg-[#F0F7F7]' : ''}`}>
                  {row.proMonthly === '✓' ? (
                    <Check size={18} className="text-[#2D8A56] mx-auto" />
                  ) : (
                    row.proMonthly
                  )}
                </div>
                <div className={`px-4 py-3.5 font-body text-[14px] text-[#1C1917] text-center ${row.highlight ? 'bg-[#F0F7F7]' : ''}`}>
                  {row.proAnnual === '✓' ? (
                    <Check size={18} className="text-[#2D8A56] mx-auto" />
                  ) : (
                    row.proAnnual
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#F7F5F0] py-12">
        <div className="max-w-[800px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="font-heading text-[32px] font-bold text-[#1C1917]">
              Dúvidas sobre os planos?
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-b border-[#E8E4DA]">
                  <AccordionTrigger className="font-body font-medium text-[16px] text-[#1C1917] py-5 hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-[15px] text-[#5C5852] leading-relaxed pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-[#0D7377] py-16 md:py-20">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="font-heading text-[36px] font-bold text-white"
          >
            Pronto para começar?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="font-body text-[18px] text-white/80 mt-4"
          >
            Crie sua conta gratuita em menos de 1 minuto. Não precisa de cartão de crédito.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <button className="font-body font-medium text-[16px] bg-white text-[#0D7377] px-8 py-3.5 rounded-[10px] hover:bg-[#F0F7F7] active:scale-[0.98] transition-all duration-200">
              Criar conta grátis
            </button>
            <button className="font-body font-medium text-[16px] border-[1.5px] border-white text-white px-8 py-3.5 rounded-[10px] hover:bg-white/10 active:scale-[0.98] transition-all duration-200">
              Falar conosco
            </button>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}
