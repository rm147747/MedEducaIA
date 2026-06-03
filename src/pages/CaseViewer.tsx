import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList,
  Activity,
  FlaskConical,
  Scan,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  Flame,
  Clock,
  CircleUser,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trophy,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Vital {
  label: string
  value: string
  abnormal: boolean
}

interface Lab {
  name: string
  value: string
  ref: string
  abnormal: boolean
}

interface Option {
  id: string
  text: string
}

interface Question {
  id: number
  text: string
  options: Option[]
  correctAnswer: string
  explanation: string
}

interface CaseData {
  id: string
  specialty: string
  difficulty: string
  title: string
  patient: {
    name: string
    age: number
    gender: string
    occupation: string
  }
  presentation: {
    chiefComplaint: string
    hpi: string
    history: string
    medications: string
    familyHistory: string
    allergies: string
  }
  physicalExam: {
    vitals: Vital[]
    general: string
    cardiovascular: string
    respiratory: string
    abdomen: string
    extremities: string
  }
  labs: Lab[]
  imaging: {
    type: string
    description: string
    interpretation: string
  }
  questions: Question[]
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */
const MOCK_CASE: CaseData = {
  id: 'card-001',
  specialty: 'Cardiologia',
  difficulty: 'Intermediario',
  title: 'Dor toracica em paciente masculino',
  patient: {
    name: 'Jose Carlos M.',
    age: 58,
    gender: 'Masculino',
    occupation: 'Motorista de onibus',
  },
  presentation: {
    chiefComplaint:
      'Dor toracica precordial em aperto, iniciada ha 2 horas',
    hpi: 'Paciente relata dor toracica precordial em aperto, com irradiacao para membro superior esquerdo, iniciada em repouso, sem melhora com repouso. Associada a diorese profusa e nauseas. Negou dispneia ou sincope.',
    history:
      'HAS ha 10 anos (uso irregular de medicacao). Tabagismo: 30 maco-ano. Dislipidemia em uso de atorvastatina. Negou DM ou doenca coronariana previa.',
    medications:
      'Losartana 50mg 1x/dia (uso irregular), Atorvastatina 20mg 1x/noite',
    familyHistory: 'Pai com IAM aos 55 anos. Irmao com IAM aos 60 anos.',
    allergies: 'Nega alergias medicamentosas',
  },
  physicalExam: {
    vitals: [
      { label: 'PA', value: '165/98 mmHg', abnormal: true },
      { label: 'FC', value: '92 bpm', abnormal: true },
      { label: 'FR', value: '18 irpm', abnormal: false },
      { label: 'Temp', value: '36.8 C', abnormal: false },
      { label: 'SpO2', value: '97% em ar ambiente', abnormal: false },
      { label: 'Peso', value: '88 kg', abnormal: false },
      { label: 'Altura', value: '1.72 m', abnormal: false },
      { label: 'IMC', value: '29.7 kg/m2', abnormal: true },
    ],
    general:
      'Paciente em regular estado geral, orientado, corado, hidratado, acianotico, anicterico.',
    cardiovascular:
      'Bulhas ritmicas em dois tempos, normofoneticas. S4 presente. Sopro sistemico de regurgitacao mitral (grau II/VI).',
    respiratory:
      'Murmulhos vesiculares presentes bilateralmente, simetricos. Sem ruidos adventicios.',
    abdomen:
      'Flacido, indolor a palpacao superficial e profunda. RHA presentes.',
    extremities:
      'Pulsos perifericos palpaveis e simetricos. Edema de MMII ausente.',
  },
  labs: [
    { name: 'Hemoglobina', value: '14.2 g/dL', ref: '13.5-17.5', abnormal: false },
    { name: 'Leucocitos', value: '11.800/mm3', ref: '4.000-11.000', abnormal: true },
    { name: 'Creatinina', value: '1.1 mg/dL', ref: '0.7-1.3', abnormal: false },
    { name: 'Sodio', value: '138 mEq/L', ref: '135-145', abnormal: false },
    { name: 'Potassio', value: '4.2 mEq/L', ref: '3.5-5.0', abnormal: false },
    { name: 'Troponina I (hs)', value: '0.45 ng/mL', ref: '<0.04', abnormal: true },
    { name: 'CK-MB', value: '45 U/L', ref: '<25', abnormal: true },
    { name: 'LDL', value: '142 mg/dL', ref: '<100', abnormal: true },
    { name: 'Glicemia', value: '108 mg/dL', ref: '70-100', abnormal: true },
    { name: 'TAP/INR', value: '1.0', ref: '0.9-1.1', abnormal: false },
  ],
  imaging: {
    type: 'Eletrocardiograma (ECG 12 derivacoes)',
    description:
      'Ritmo sinusal, FC 92 bpm. Supradesnivelamento do segmento ST de 2mm em V1-V4 com ondas T invertidas em DII, DIII, aVF. Presenca de Q patologico em V1-V3. Derrame pericardico ausente.',
    interpretation:
      'Padrao compativel com IAM com supradesnivelamento de ST (IAMCSST) em parede anterior estendida (V1-V4), com provavel comprometimento de parede inferior (DII, DIII, aVF).',
  },
  questions: [
    {
      id: 1,
      text: 'Considerando o caso clinico apresentado, qual e o diagnostico mais provavel e a conduta inicial mais adequada?',
      options: [
        {
          id: 'A',
          text: 'Angina instavel; iniciar AAS, clopidogrel, heparina e realizar cateterismo em ate 72h',
        },
        {
          id: 'B',
          text: 'IAM com supradesnivelamento de ST (IAMCSST) anterior; trombolise imediata ou angioplastia primaria',
        },
        {
          id: 'C',
          text: 'Pericardite aguda; iniciar AINEs e colchicina',
        },
        {
          id: 'D',
          text: 'Disseccao aortica; iniciar betabloqueadores e realizar angiotomografia de torax',
        },
      ],
      correctAnswer: 'B',
      explanation:
        'O ECG mostra supradesnivelamento de ST em V1-V4 (parede anterior) com ondas T invertidas em DII, DIII, aVF, consistente com IAMCSST. A troponina esta elevada (0.45 ng/mL, ref <0.04). A conduta de emergencia e reperfusao imediata -- trombolise ou angioplastia primaria conforme Diretriz SBC 2022.',
    },
    {
      id: 2,
      text: 'Qual fator de risco cardiovascular modificavel NAO esta presente neste paciente?',
      options: [
        { id: 'A', text: 'Hipertensao arterial sistemica' },
        { id: 'B', text: 'Tabagismo' },
        { id: 'C', text: 'Diabetes mellitus tipo 2' },
        { id: 'D', text: 'Dislipidemia' },
      ],
      correctAnswer: 'C',
      explanation:
        'O paciente apresenta HAS (irregular), tabagismo (30 maco-ano) e dislipidemia (LDL 142 mg/dL). A glicemia de 108 mg/dL indica pre-diabetes, mas nao DM diagnosticado. Segundo a Diretriz SBC de Prevencao Cardiovascular 2022, todos os outros sao fatores de risco modificaveis confirmados.',
    },
    {
      id: 3,
      text: 'Segundo a Diretriz SBC 2022 para IAMCSST, qual e o tempo-alvo para a angioplastia primaria apos o primeiro contato medico?',
      options: [
        { id: 'A', text: '30 minutos (door-to-balloon)' },
        { id: 'B', text: '60 minutos (door-to-balloon)' },
        { id: 'C', text: '90 minutos (door-to-balloon)' },
        { id: 'D', text: '120 minutos (door-to-balloon)' },
      ],
      correctAnswer: 'C',
      explanation:
        'A Diretriz SBC 2022 recomenda tempo door-to-balloon <= 90 minutos. Se o tempo de transporte para centro com hemodinamica for > 120 minutos, a trombolise farmacologica deve ser considerada (preferencialmente em ate 10 minutos do primeiro contato medico).',
    },
  ],
}

const MOCK_CASES: Record<string, CaseData> = {
  'card-001': MOCK_CASE,
  'cardio': MOCK_CASE,
  'neuro': {
    ...MOCK_CASE,
    id: 'neuro',
    specialty: 'Neurologia',
    difficulty: 'Intermediario',
    title: 'Cefaleia em paciente jovem',
    patient: {
      name: 'Ana Paula R.',
      age: 24,
      gender: 'Feminino',
      occupation: 'Estudante',
    },
    presentation: {
      chiefComplaint: 'Cefaleia pulsatile intensa ha 6 horas',
      hpi: 'Paciente relata cefaleia frontal e temporal direita, pulsatile, intensidade 8/10, iniciada apos período de stress durante provas. Associada a fotofobia, fonofobia e nauseas. Negou trauma craniano previo.',
      history: 'Migraine desde os 16 anos (1-2 episodios/mes). Uso de contraceptivo oral combinado ha 2 anos. Mae com historia de migraine.',
      medications: 'Paracetamol 750mg em caso de dor, nao melhora completamente.',
      familyHistory: 'Mae e irma com migraine com aura.',
      allergies: 'Nega alergias medicamentosas',
    },
    physicalExam: {
      vitals: [
        { label: 'PA', value: '118/76 mmHg', abnormal: false },
        { label: 'FC', value: '78 bpm', abnormal: false },
        { label: 'FR', value: '16 irpm', abnormal: false },
        { label: 'Temp', value: '36.5 C', abnormal: false },
        { label: 'SpO2', value: '99% em ar ambiente', abnormal: false },
        { label: 'Peso', value: '62 kg', abnormal: false },
        { label: 'Altura', value: '1.65 m', abnormal: false },
        { label: 'IMC', value: '22.8 kg/m2', abnormal: false },
      ],
      general: 'Lucida, orientada em tempo e espaco. Comunicativa, em moderado desconforto devido a dor.',
      cardiovascular: 'Bulhas ritmicas em dois tempos, normofoneticas. Sem sopros.',
      respiratory: 'Murmulhos vesiculares presentes bilateralmente. Sem ruidos adventicios.',
      abdomen: 'Flacido, indolor. RHA presentes.',
      extremities: 'Pulsos perifericos palpaveis e simetricos. Forca muscular preservada e simetrica em todos os grupos.',
    },
    labs: [
      { name: 'Hemoglobina', value: '13.8 g/dL', ref: '12.0-16.0', abnormal: false },
      { name: 'Leucocitos', value: '7.200/mm3', ref: '4.000-11.000', abnormal: false },
      { name: 'Creatinina', value: '0.8 mg/dL', ref: '0.7-1.3', abnormal: false },
      { name: 'Sodio', value: '140 mEq/L', ref: '135-145', abnormal: false },
      { name: 'Potassio', value: '4.0 mEq/L', ref: '3.5-5.0', abnormal: false },
      { name: 'Glicemia', value: '92 mg/dL', ref: '70-100', abnormal: false },
      { name: 'TSH', value: '2.1 mIU/L', ref: '0.4-4.0', abnormal: false },
    ],
    imaging: {
      type: 'Tomografia Computadorizada de Cranio',
      description: 'TC de cranio sem contraste: sem alteracoes de densidade, sem sinais de hemorragia ou infarto agudo. Ventriculos de tamanho normal. Sulcos e cisternas preservados.',
      interpretation: 'TC de cranio normal. Nao ha contraindicacao ao uso de triptanos. Considerar ressonancia magnetica em caso de mudanca de padrao da cefaleia.',
    },
    questions: [
      {
        id: 1,
        text: 'Qual e o provavel diagnostico e conduta inicial mais adequada?',
        options: [
          { id: 'A', text: 'Cefaleia tensional; relaxantes musculares e fisioterapia' },
          { id: 'B', text: 'Migraine sem aura; sumatriptano 50mg VO e repouso em ambiente escuro' },
          { id: 'C', text: 'Meningite bacteriana; ceftriaxona + vancomicina e corticoides' },
          { id: 'D', text: 'Hematoma subdural; neurocirurgia de urgencia' },
        ],
        correctAnswer: 'B',
        explanation: 'A paciente apresenta cefaleia pulsatile intensa com fotofobia, fonofobia e nauseas, compatível com migraine sem aura (critérios ICHD-3). A TC normal exclui causa secundaria. Sumatriptano é primeira linha.',
      },
      {
        id: 2,
        text: 'Qual fator de risco modificavel para cronificacao da migraine esta presente?',
        options: [
          { id: 'A', text: 'Uso de contraceptivo oral combinado' },
          { id: 'B', text: 'Idade inferior a 30 anos' },
          { id: 'C', text: 'Historia familiar de migraine' },
          { id: 'D', text: 'Sexo feminino' },
        ],
        correctAnswer: 'A',
        explanation: 'O contraceptivo oral combinado pode exacerbar a migraine e aumentar o risco de AVE isquemico em mulheres com migraine com aura. Deve ser considerada a suspensao ou troca para metodo nao hormonal.',
      },
    ],
  },
  'emergencia': {
    ...MOCK_CASE,
    id: 'emergencia',
    specialty: 'Emergência',
    difficulty: 'Avancado',
    title: 'Parada cardiorrespiratoria em UTI',
    patient: {
      name: 'Roberto S.',
      age: 67,
      gender: 'Masculino',
      occupation: 'Aposentado',
    },
    presentation: {
      chiefComplaint: 'PCR monitorada em UTI durante internacao para pneumonia',
      hpi: 'Paciente internado para pneumonia aspirativa em uso de VM invasiva. Apresentou subita perda de pulsos, inicio de compressoes toracicas pelo enfermeiro. Monitor mostrou fibrilacao ventricular.',
      history: 'DPOC ha 15 anos, HAS, DM2. Internacao previa ha 3 meses para descompensacao de ICC.',
      medications: 'Norepinefrina 0.5 mcg/kg/min, Fentanil 2 mcg/kg/h, Midazolam 0.1 mg/kg/h, Meropenem 2g 8/8h.',
      familyHistory: 'Pai com IAM aos 60 anos.',
      allergies: 'Nega alergias medicamentosas',
    },
    physicalExam: {
      vitals: [
        { label: 'PA', value: 'INDET', abnormal: true },
        { label: 'FC', value: 'Fibrilacao ventricular', abnormal: true },
        { label: 'FR', value: 'Ventilacao mecanica', abnormal: true },
        { label: 'Temp', value: '37.2 C', abnormal: false },
        { label: 'SpO2', value: '85% pre-oxigenacao', abnormal: true },
        { label: 'ETCO2', value: '18 mmHg', abnormal: true },
        { label: 'Glasgow', value: '3 (E1V1M1)', abnormal: true },
        { label: 'RC', value: '28 mm', abnormal: true },
      ],
      general: 'Paciente em PCR, sem pulsos palpaveis. Compressoes toracicas em andamento.',
      cardiovascular: 'Bulhas ausentes. Pulso carotideo nao palpavel.',
      respiratory: 'Ventilacao mecanica com FIO2 100%. Murmulhos vesiculares diminuidos bilateralmente.',
      abdomen: 'Flacido, indolor.',
      extremities: 'Extremidades frias, palidez cutanea. Pulsos ausentes.',
    },
    labs: [
      { name: 'pH', value: '7.18', ref: '7.35-7.45', abnormal: true },
      { name: 'pCO2', value: '52 mmHg', ref: '35-45', abnormal: true },
      { name: 'pO2', value: '68 mmHg', ref: '80-100', abnormal: true },
      { name: 'HCO3', value: '18 mEq/L', ref: '22-26', abnormal: true },
      { name: 'Lactato', value: '4.2 mmol/L', ref: '<2.0', abnormal: true },
      { name: 'Potassio', value: '3.2 mEq/L', ref: '3.5-5.0', abnormal: true },
      { name: 'Creatinina', value: '1.4 mg/dL', ref: '0.7-1.3', abnormal: true },
    ],
    imaging: {
      type: 'Monitor Cardiaco / Desfibrilador',
      description: 'Ritmo inicial: Fibrilacao ventricular. Apos 1 choque (200J bifasico): Ritmo sinusal, FC 110 bpm.',
      interpretation: 'PCR por FV revertida apos choque unico. ROSC obtido em 4 minutos desde o inicio da PCR.',
    },
    questions: [
      {
        id: 1,
        text: 'Segundo o algoritmo de PCR adulto da AHA 2020, qual e a proxima conduta apos confirmar FV?',
        options: [
          { id: 'A', text: 'Administracao de adrenalina 1mg IV imediatamente' },
          { id: 'B', text: 'Choque de 200J (bifasico) o mais rapido possivel' },
          { id: 'C', text: 'Trombolise com tenecteplase 50mg IV' },
          { id: 'D', text: 'Puncao pericardica imediata' },
        ],
        correctAnswer: 'B',
        explanation: 'No algoritmo AHA 2020 para PCR adulto, ritmos desfibrilaveis (FV/VT sem pulso) devem receber choque imediato. Adrenalina vem apos o segundo choque.',
      },
    ],
  },
  'gastro': {
    ...MOCK_CASE,
    id: 'gastro',
    specialty: 'Gastroenterologia',
    difficulty: 'Iniciante',
    title: 'Dor abdominal epigastrica recorrente',
    patient: {
      name: 'Maria Helena K.',
      age: 45,
      gender: 'Feminino',
      occupation: 'Professora',
    },
    presentation: {
      chiefComplaint: 'Dor epigastrica queimada ha 3 meses, piorando ha 1 semana',
      hpi: 'Dor epigastrica em queimada, relacionada a alimentacao, melhora com antiacidos. Piora quando jejum por longos periodos. Sem vomitos, sem melena. Perda de peso de 2kg em 3 meses.',
      history: 'Uso cronico de AINEs para dor lombar (ibuprofeno 600mg 3x/dia) ha 6 meses. Nao fumante.',
      medications: 'Ibuprofeno 600mg 3x/dia, omeprazol 20mg 1x/dia (automedicao, irregular).',
      familyHistory: 'Mae com cancer gastrico aos 70 anos.',
      allergies: 'Nega alergias medicamentosas',
    },
    physicalExam: {
      vitals: [
        { label: 'PA', value: '128/82 mmHg', abnormal: false },
        { label: 'FC', value: '76 bpm', abnormal: false },
        { label: 'FR', value: '16 irpm', abnormal: false },
        { label: 'Temp', value: '36.6 C', abnormal: false },
        { label: 'SpO2', value: '98% em ar ambiente', abnormal: false },
      ],
      general: 'Lucida, orientada. Bem nutrida. Sem sinais de anemia.',
      cardiovascular: 'Bulhas ritmicas em dois tempos, normofoneticas.',
      respiratory: 'Murmulhos vesiculares presentes bilateralmente.',
      abdomen: 'Plano, doloroso a palpacao profunda em epigastrio, sem defesa ou rebote. RHA presentes. Apendice de McBurney nao doloroso.',
      extremities: 'Pulsos perifericos palpaveis. Sem edema.',
    },
    labs: [
      { name: 'Hemoglobina', value: '12.8 g/dL', ref: '12.0-16.0', abnormal: false },
      { name: 'Hematocrito', value: '38%', ref: '36-48', abnormal: false },
      { name: 'Leucocitos', value: '8.100/mm3', ref: '4.000-11.000', abnormal: false },
      { name: 'PCR', value: '3.2 mg/L', ref: '<5.0', abnormal: false },
      { name: 'Creatinina', value: '0.9 mg/dL', ref: '0.7-1.3', abnormal: false },
    ],
    imaging: {
      type: 'Endoscopia Digestiva Alta',
      description: 'Lesao ulcerada em antro gastrico de aproximadamente 1.2cm, com fundo limpo, bordos regulares. Sem sinais de sangramento ativo. Biopsia realizada.',
      interpretation: 'Ulceras gastricas requerem biopsia para exclusao de neoplasia (historia familiar de cancer gastrico). Provavel ulcera peptica associada a AINEs.',
    },
    questions: [
      {
        id: 1,
        text: 'Qual e o manejo mais adequado para esta paciente?',
        options: [
          { id: 'A', text: 'Manter ibuprofeno e aumentar omeprazol para 40mg/dia' },
          { id: 'B', text: 'Suspender AINEs, iniciar PPI em dose completa e teste de H. pylori' },
          { id: 'C', text: 'Cirurgia gastrica de emergencia' },
          { id: 'D', text: 'Quimioterapia neoadjuvante' },
        ],
        correctAnswer: 'B',
        explanation: 'Paciente com ulcera peptica associada a AINEs. Conduta: suspender AINEs, PPI em dose completa (omeprazol 40mg/dia), teste de H. pylori. A biopsia e obrigatoria devido a historia familiar de cancer gastrico.',
      },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
}

const tabContentVariants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
}

const shakeVariants = {
  shake: {
    x: [0, -8, 8, -4, 4, 0],
    transition: { duration: 0.4 },
  },
}

const xpPopVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 0 },
  visible: {
    opacity: [0, 1, 1, 0],
    scale: [0.5, 1.2, 1.0, 1.0],
    y: [0, -10, -30, -50],
    transition: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] },
  },
}

const slideDownVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
}

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.08 } },
}

const staggerChild = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
}

/* ------------------------------------------------------------------ */
/*  Section label component                                            */
/* ------------------------------------------------------------------ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-body font-semibold text-[14px] text-[#0D7377] uppercase tracking-[0.05em] mb-2">
      {children}
    </h4>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: Apresentacao                                                  */
/* ------------------------------------------------------------------ */
function PresentationTab({ data }: { data: CaseData['presentation'] }) {
  const sections = [
    { label: 'Queixa Principal', content: data.chiefComplaint },
    { label: 'Historia da Doenca Atual', content: data.hpi },
    { label: 'Historia Pregressa', content: data.history },
    { label: 'Medicamentos em Uso', content: data.medications },
    { label: 'Historico Familiar', content: data.familyHistory },
    { label: 'Alergias', content: data.allergies },
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {sections.map((section) => (
        <motion.div
          key={section.label}
          variants={staggerChild}
          className="bg-[#FAFAF7] rounded-[12px] p-5 border border-[#F0EDE6]"
        >
          <SectionLabel>{section.label}</SectionLabel>
          <p className="font-body text-[16px] leading-[1.7] text-[#1C1917]">
            {section.content}
          </p>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: Exame Fisico                                                  */
/* ------------------------------------------------------------------ */
function PhysicalExamTab({ data }: { data: CaseData['physicalExam'] }) {
  const systemSections = [
    { label: 'Exame Geral', content: data.general },
    { label: 'Cardiovascular', content: data.cardiovascular },
    { label: 'Respiratorio', content: data.respiratory },
    { label: 'Abdome', content: data.abdomen },
    { label: 'Extremidades', content: data.extremities },
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Vital Signs Grid */}
      <motion.div variants={staggerChild}>
        <SectionLabel>Sinais Vitais</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
          {data.vitals.map((vital) => (
            <div
              key={vital.label}
              className={`rounded-[10px] px-4 py-3 border ${
                vital.abnormal
                  ? 'bg-[#FCEEEE] border-[#C0392B]/20'
                  : 'bg-[#F7F5F0] border-[#E8E4DA]'
              }`}
            >
              <span className="font-body text-[12px] text-[#5C5852] block mb-1">
                {vital.label}
              </span>
              <span
                className={`font-mono font-medium text-[16px] ${
                  vital.abnormal ? 'text-[#C0392B]' : 'text-[#1C1917]'
                }`}
              >
                {vital.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* System sections */}
      {systemSections.map((section) => (
        <motion.div
          key={section.label}
          variants={staggerChild}
          className="bg-[#FAFAF7] rounded-[12px] p-5 border border-[#F0EDE6]"
        >
          <SectionLabel>{section.label}</SectionLabel>
          <p className="font-body text-[16px] leading-[1.7] text-[#1C1917]">
            {section.content}
          </p>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: Laboratorio                                                   */
/* ------------------------------------------------------------------ */
function LabsTab({ labs }: { labs: Lab[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={staggerChild}>
        <div className="overflow-hidden rounded-[10px] border border-[#E8E4DA]">
          {/* Header */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_140px_140px_100px] bg-[#F0F7F7] px-5 py-3 border-b border-[#E8E4DA]">
            <span className="font-body font-semibold text-[14px] text-[#0D7377]">
              Exame
            </span>
            <span className="font-body font-semibold text-[14px] text-[#0D7377]">
              Resultado
            </span>
            <span className="font-body font-semibold text-[14px] text-[#0D7377]">
              Referencia
            </span>
            <span className="font-body font-semibold text-[14px] text-[#0D7377]">
              Status
            </span>
          </div>

          {/* Rows */}
          {labs.map((lab, idx) => (
            <div
              key={lab.name}
              className={`grid grid-cols-1 sm:grid-cols-[1fr_140px_140px_100px] px-5 py-3 border-b border-[#E8E4DA] last:border-b-0 transition-colors hover:bg-[#F0F7F7] ${
                idx % 2 === 0 ? 'bg-white' : 'bg-[#F7F5F0]'
              } ${lab.abnormal ? 'bg-[#FCEEEE]/30' : ''}`}
            >
              <span className="font-body text-[15px] text-[#1C1917] font-medium">
                {lab.name}
              </span>
              <span
                className={`font-mono text-[14px] ${
                  lab.abnormal ? 'text-[#C0392B] font-semibold' : 'text-[#1C1917]'
                }`}
              >
                {lab.value}
              </span>
              <span className="font-mono text-[14px] text-[#5C5852]">
                {lab.ref}
              </span>
              <div className="flex items-center gap-1.5">
                {lab.abnormal ? (
                  <>
                    <AlertTriangle size={16} className="text-[#C0392B] shrink-0" />
                    <span className="font-body text-[14px] font-medium text-[#C0392B]">
                      Alterado
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} className="text-[#2D8A56] shrink-0" />
                    <span className="font-body text-[14px] text-[#2D8A56]">
                      Normal
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: Imagem                                                        */
/* ------------------------------------------------------------------ */
function ImagingTab({ imaging }: { imaging: CaseData['imaging'] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      <motion.div variants={staggerChild}>
        <div className="bg-white rounded-[12px] border border-[#E8E4DA] p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E8E4DA]">
          <div className="w-10 h-10 rounded-lg bg-[#E6F2F2] flex items-center justify-center">
            <Scan size={20} className="text-[#0D7377]" />
          </div>
          <div>
            <h3 className="font-heading text-base font-medium text-[#1C1917]">Laudo de Imagem</h3>
            <p className="text-sm text-[#5C5852]">{imaging.type}</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="bg-[#F7F5F0] rounded-lg p-4 border border-[#E8E4DA]">
            <p className="text-xs font-medium text-[#5C5852] uppercase tracking-wide mb-2">Descricao</p>
            <p className="font-body text-[15px] text-[#1C1917] leading-relaxed">{imaging.description}</p>
          </div>

          <div className="bg-[#F0F7F7] rounded-lg p-4 border-l-4 border-[#0D7377]">
            <p className="text-xs font-medium text-[#0D7377] uppercase tracking-wide mb-2">Interpretacao</p>
            <p className="font-body text-[15px] text-[#1C1917] leading-relaxed">{imaging.interpretation}</p>
          </div>

          <div className="mt-4 p-3 bg-[#FDF3E3] rounded-lg border border-[#D4943A] flex items-start gap-2">
            <AlertTriangle size={16} className="text-[#D4943A] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[#B07A2E]">Laudo ilustrativo para fins educacionais. Imagens reais de exames serao disponibilizadas em breve.</p>
          </div>
        </div>
      </div>

      {/* Original placeholder - kept for future image display */}
      <div className="bg-[#F0EDE6] rounded-[10px] aspect-video flex flex-col items-center justify-center border-2 border-dashed border-[#E8E4DA]">
          <Scan size={40} className="text-[#9C9890] mb-3" />
          <span className="font-body text-[14px] text-[#9C9890]">
            Imagem do exame
          </span>
        </div>
      </motion.div>

      <motion.div variants={staggerChild} className="bg-white rounded-[12px] p-5 border border-[#E8E4DA]">
        <SectionLabel>{imaging.type}</SectionLabel>
        <p className="font-body text-[16px] leading-[1.7] text-[#1C1917]">
          {imaging.description}
        </p>
      </motion.div>

      <motion.div
        variants={staggerChild}
        className="rounded-[12px] p-5 border-2 border-[#0D7377]/20 bg-[#F0F7F7]"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={18} className="text-[#0D7377]" />
          <span className="font-body font-semibold text-[14px] text-[#0D7377]">
            Interpretacao
          </span>
        </div>
        <p className="font-body text-[15px] leading-[1.7] text-[#1C1917]">
          {imaging.interpretation}
        </p>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Single Question Card                                               */
/* ------------------------------------------------------------------ */
function QuestionCard({
  question,
  qIndex,
  total,
  selectedAnswer,
  isRevealed,
  onSelect,
  onNext,
  score: _score,
  onScore,
}: {
  question: Question
  qIndex: number
  total: number
  selectedAnswer: string | null
  isRevealed: boolean
  onSelect: (qId: number, optionId: string) => void
  onNext: () => void
  score: number
  onScore: (points: number) => void
}) {
  const [showXp, setShowXp] = useState(false)
  const [, setShakeTrigger] = useState(0)
  const isCorrect = selectedAnswer === question.correctAnswer

  const handleSelect = useCallback(
    (optionId: string) => {
      if (isRevealed) return
      onSelect(question.id, optionId)
    },
    [isRevealed, onSelect, question.id],
  )

  const handleConfirm = useCallback(() => {
    if (!selectedAnswer || isRevealed) return
    if (isCorrect) {
      onScore(50)
      setShowXp(true)
      setTimeout(() => setShowXp(false), 1400)
    } else {
      onScore(5)
      setShakeTrigger((prev) => prev + 1)
    }
  }, [selectedAnswer, isRevealed, isCorrect, onScore])

  return (
    <div className="space-y-5">
      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === qIndex
                ? 'w-6 bg-[#0D7377]'
                : i < qIndex
                  ? 'w-2 bg-[#2D8A56]'
                  : 'w-2 bg-[#E8E4DA]'
            }`}
          />
        ))}
        <span className="ml-2 font-body text-[12px] text-[#5C5852]">
          Questao {qIndex + 1} de {total}
        </span>
      </div>

      {/* Question stem */}
      <p className="font-body text-[16px] font-medium text-[#1C1917] leading-[1.6]">
        {question.text}
      </p>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id
          const isCorrectOption = option.id === question.correctAnswer
          const showCorrect = isRevealed && isCorrectOption
          const showIncorrect = isRevealed && isSelected && !isCorrect

          let borderColor = 'border-[#E8E4DA]'
          let bgColor = 'bg-white'
          let leftAccent = 'bg-transparent'
          let letterBg = 'bg-[#F0EDE6]'
          let letterText = 'text-[#5C5852]'

          if (showCorrect) {
            borderColor = 'border-[#2D8A56]'
            bgColor = 'bg-[#E8F5EE]'
            leftAccent = 'bg-[#2D8A56]'
            letterBg = 'bg-[#2D8A56]'
            letterText = 'text-white'
          } else if (showIncorrect) {
            borderColor = 'border-[#C0392B]'
            bgColor = 'bg-[#FCEEEE]'
            leftAccent = 'bg-[#C0392B]'
            letterBg = 'bg-[#C0392B]'
            letterText = 'text-white'
          } else if (isSelected && !isRevealed) {
            borderColor = 'border-[#0D7377]'
            bgColor = 'bg-[#E6F2F2]'
            leftAccent = 'bg-[#0D7377]'
            letterBg = 'bg-[#0D7377]'
            letterText = 'text-white'
          }

          return (
            <motion.button
              key={option.id}
              animate={showIncorrect ? 'shake' : undefined}
              variants={shakeVariants}
              onClick={() => handleSelect(option.id)}
              disabled={isRevealed}
              className={`w-full text-left relative flex items-start gap-4 rounded-[12px] border-2 ${borderColor} ${bgColor} px-5 py-4 transition-all duration-200 ${
                !isRevealed
                  ? 'hover:border-[#0D7377] hover:bg-[#F0F7F7] cursor-pointer'
                  : ''
              }`}
            >
              {/* Left accent bar */}
              <div
                className={`absolute left-0 top-3 bottom-3 w-1 rounded-r ${leftAccent} transition-colors duration-200`}
              />

              {/* Letter badge */}
              <span
                className={`shrink-0 w-8 h-8 rounded-full ${letterBg} ${letterText} flex items-center justify-center font-body font-semibold text-[14px] transition-colors duration-200`}
              >
                {option.id}
              </span>

              {/* Option text */}
              <span className="font-body text-[15px] text-[#1C1917] leading-[1.5] pt-0.5">
                {option.text}
              </span>

              {/* Status icons */}
              {showCorrect && (
                <CheckCircle2
                  size={20}
                  className="shrink-0 text-[#2D8A56] ml-auto mt-0.5"
                />
              )}
              {showIncorrect && (
                <XCircle
                  size={20}
                  className="shrink-0 text-[#C0392B] ml-auto mt-0.5"
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Confirm / Next button */}
      <div className="relative">
        {!isRevealed ? (
          <button
            onClick={handleConfirm}
            disabled={!selectedAnswer}
            className={`w-full font-body font-medium text-[16px] py-3.5 rounded-[10px] transition-all duration-200 ${
              selectedAnswer
                ? 'bg-[#0D7377] text-white hover:bg-[#095C60] hover:shadow-[0_4px_12px_rgba(13,115,119,0.25)] active:scale-[0.98]'
                : 'bg-[#E8E4DA] text-[#9C9890] cursor-not-allowed'
            }`}
          >
            Confirmar Resposta
          </button>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={onNext}
            className="w-full font-body font-medium text-[16px] bg-[#0D7377] text-white py-3.5 rounded-[10px] hover:bg-[#095C60] hover:shadow-[0_4px_12px_rgba(13,115,119,0.25)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            {qIndex < total - 1 ? (
              <>
                Proxima Questao
                <ChevronRight size={18} />
              </>
            ) : (
              <>
                <Trophy size={18} />
                Finalizar Caso
              </>
            )}
          </motion.button>
        )}

        {/* XP pop animation */}
        <AnimatePresence>
          {showXp && (
            <motion.div
              variants={xpPopVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 pointer-events-none"
            >
              <span className="font-mono font-bold text-[20px] text-[#F5A623]">
                +50 XP!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Explanation panel */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            variants={slideDownVariants}
            initial="hidden"
            animate="visible"
            className="overflow-hidden"
          >
            <div
              className={`rounded-[12px] p-5 border ${
                isCorrect
                  ? 'bg-[#E8F5EE] border-[#2D8A56]/20'
                  : 'bg-[#FCEEEE] border-[#C0392B]/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {isCorrect ? (
                  <>
                    <CheckCircle2 size={20} className="text-[#2D8A56]" />
                    <span className="font-body font-semibold text-[16px] text-[#2D8A56]">
                      Isso ai!
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle size={20} className="text-[#C0392B]" />
                    <span className="font-body font-semibold text-[16px] text-[#C0392B]">
                      Quase la!
                    </span>
                  </>
                )}
              </div>

              <div className="mb-3">
                <span className="font-body font-semibold text-[14px] text-[#0D7377] block mb-1">
                  Explicacao
                </span>
                <p className="font-body text-[15px] leading-[1.7] text-[#1C1917]">
                  {question.explanation}
                </p>
              </div>

              <div className="flex items-center gap-1.5 pt-3 border-t border-[#1C1917]/10">
                <span className="font-body font-semibold text-[12px] text-[#5C5852]">
                  Referencia:
                </span>
                <span className="font-body text-[12px] text-[#5C5852]">
                  Diretriz SBC 2022
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: Questoes                                                      */
/* ------------------------------------------------------------------ */
function QuestionsTab({
  questions,
  selectedAnswers,
  revealedAnswers,
  onSelect,
  currentQIndex,
  onNext,
  score,
  onScore,
  caseCompleted,
  correctCount,
  onReset,
}: {
  questions: Question[]
  selectedAnswers: Record<number, string>
  revealedAnswers: Record<number, boolean>
  onSelect: (qId: number, optionId: string) => void
  currentQIndex: number
  onNext: () => void
  score: number
  onScore: (points: number) => void
  caseCompleted: boolean
  correctCount: number
  onReset: () => void
}) {
  if (caseCompleted) {
    const percentage = questions.length > 0 ? correctCount / questions.length : 0
    const scoreColor =
      percentage >= 0.66 ? '#2D8A56' : percentage >= 0.33 ? '#D4943A' : '#C0392B'
    const message =
      percentage === 1
        ? 'Perfeito! Voce dominou este caso.'
        : percentage >= 0.66
          ? 'Muito bom! Continue praticando.'
          : percentage >= 0.33
            ? 'Continue estudando! Revise os conceitos.'
            : 'Nao desista! Cada erro e uma oportunidade de aprender.'

    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center py-8 space-y-5"
      >
        <motion.div
          variants={staggerChild}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
        >
          <Trophy size={64} className="text-[#D4943A]" />
        </motion.div>

        <motion.h3
          variants={staggerChild}
          className="font-heading text-[24px] font-bold text-[#1C1917]"
        >
          Caso concluido!
        </motion.h3>

        <motion.div
          variants={staggerChild}
          className="font-heading text-[32px] font-bold"
          style={{ color: scoreColor }}
        >
          {correctCount}/{questions.length} corretas
        </motion.div>

        <motion.div variants={staggerChild} className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={18} className="text-[#F5A623]" />
            <span className="font-mono font-bold text-[18px] text-[#F5A623]">
              +{score} XP ganhos
            </span>
          </div>
          <div className="space-y-1 pt-2">
            {questions.map((q, i) => {
              const userAns = selectedAnswers[q.id]
              const correct = userAns === q.correctAnswer
              return (
                <div
                  key={q.id}
                  className="flex items-center gap-2 justify-center"
                >
                  {correct ? (
                    <CheckCircle2 size={14} className="text-[#2D8A56]" />
                  ) : (
                    <XCircle size={14} className="text-[#C0392B]" />
                  )}
                  <span
                    className={`font-mono text-[13px] ${
                      correct ? 'text-[#2D8A56]' : 'text-[#C0392B]'
                    }`}
                  >
                    {correct ? '+50 XP' : '+5 XP'} Questao {i + 1}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.p
          variants={staggerChild}
          className="font-body text-[15px]"
          style={{ color: scoreColor }}
        >
          {message}
        </motion.p>

        <motion.div variants={staggerChild} className="w-full space-y-3 pt-4">
          <button
            onClick={onReset}
            className="w-full font-body font-medium text-[16px] bg-[#0D7377] text-white py-3.5 rounded-[10px] hover:bg-[#095C60] hover:shadow-[0_4px_12px_rgba(13,115,119,0.25)] active:scale-[0.98] transition-all duration-200"
          >
            Refazer Caso
          </button>
          <button className="w-full font-body font-medium text-[16px] border-[1.5px] border-[#0D7377] text-[#0D7377] py-3.5 rounded-[10px] hover:bg-[#E6F2F2] active:scale-[0.98] transition-all duration-200">
            Voltar as Especialidades
          </button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={tabContentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <QuestionCard
        question={questions[currentQIndex]}
        qIndex={currentQIndex}
        total={questions.length}
        selectedAnswer={selectedAnswers[questions[currentQIndex]?.id] ?? null}
        isRevealed={!!revealedAnswers[questions[currentQIndex]?.id]}
        onSelect={onSelect}
        onNext={onNext}
        score={score}
        onScore={onScore}
      />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Confetti Particles (inline, lightweight)                           */
/* ------------------------------------------------------------------ */
function ConfettiBurst({ trigger }: { trigger: number }) {
  if (trigger === 0) return null

  const particles = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: Math.cos((i / 8) * Math.PI * 2) * 60,
    y: Math.sin((i / 8) * Math.PI * 2) * 60 - 20,
    color: ['#0D7377', '#D4943A', '#F5A623', '#2D8A56'][i % 4],
    size: [6, 8, 5, 7][i % 4],
  }))

  return (
    <div className="absolute left-1/2 top-1/2 pointer-events-none z-50">
      {particles.map((p) => (
        <motion.div
          key={`${trigger}-${p.id}`}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: 0.5,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
const TABS = [
  { id: 0, label: 'Apresentacao', icon: ClipboardList },
  { id: 1, label: 'Exame Fisico', icon: Activity },
  { id: 2, label: 'Laboratorio', icon: FlaskConical },
  { id: 3, label: 'Imagem', icon: Scan },
  { id: 4, label: 'Questoes', icon: HelpCircle },
] as const

export default function CaseViewer() {
  const _navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const currentCase = MOCK_CASES[id || ''] || MOCK_CASE

  const [activeTab, setActiveTab] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {},
  )
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>(
    {},
  )
  const [score, setScore] = useState(0)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [caseCompleted, setCaseCompleted] = useState(false)
  const [confettiTrigger, setConfettiTrigger] = useState(0)

  const handleSelectAnswer = useCallback(
    (qId: number, optionId: string) => {
      if (revealedAnswers[qId]) return
      setSelectedAnswers((prev) => ({ ...prev, [qId]: optionId }))
    },
    [revealedAnswers],
  )

  const handleScore = useCallback(
    (points: number) => {
      setScore((prev) => prev + points)
      const q = currentCase.questions[currentQIndex]
      if (q) {
        setRevealedAnswers((prev) => ({ ...prev, [q.id]: true }))
        if (selectedAnswers[q.id] === q.correctAnswer) {
          setConfettiTrigger((prev) => prev + 1)
        }
      }
    },
    [currentQIndex, selectedAnswers],
  )

  const handleNext = useCallback(() => {
    if (currentQIndex < currentCase.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1)
    } else {
      setCaseCompleted(true)
    }
  }, [currentQIndex])

  const handleReset = useCallback(() => {
    setActiveTab(0)
    setSelectedAnswers({})
    setRevealedAnswers({})
    setScore(0)
    setCurrentQIndex(0)
    setCaseCompleted(false)
    setConfettiTrigger(0)
  }, [])

  const correctCount = currentCase.questions.filter(
    (q) => selectedAnswers[q.id] === q.correctAnswer,
  ).length

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[100dvh] bg-[#F7F5F0] pt-[72px]"
    >
      {/* App Header Bar */}
      <div className="bg-white border-b border-[#E8E4DA] sticky top-[72px] z-30">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
          {/* Left: Logo + Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button className="hidden sm:flex items-center gap-1.5 text-[#5C5852] hover:text-[#1C1917] transition-colors shrink-0" onClick={() => _navigate("/specialties")}>
              <ArrowLeft size={16} />
              <span className="font-body text-[13px]">Voltar</span>
            </button>
            <span className="hidden sm:inline text-[#E8E4DA]">|</span>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-heading font-bold text-[15px] text-[#0D7377] shrink-0">
                MedEduca
              </span>
              <ChevronRight size={14} className="text-[#9C9890] shrink-0" />
              <span className="font-body text-[13px] text-[#5C5852] truncate">
                {currentCase.specialty}
              </span>
              <ChevronRight size={14} className="text-[#9C9890] shrink-0" />
              <span className="font-body text-[13px] text-[#5C5852] truncate max-w-[120px]">
                {currentCase.title}
              </span>
            </div>
          </div>

          {/* Right: XP, Streak, Timer, Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-1.5 bg-[#FDF3E3] px-3 py-1.5 rounded-full">
              <Sparkles size={14} className="text-[#D4943A]" />
              <span className="font-mono font-medium text-[12px] text-[#D4943A]">
                {score} XP
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[#E85D2A]">
              <Flame size={16} />
              <span className="font-mono font-medium text-[12px]">12</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[#5C5852]">
              <Clock size={14} />
              <span className="font-mono text-[12px]">08:32</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0D7377] flex items-center justify-center">
              <CircleUser size={18} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Medical Record Card */}
          <div className="flex-1 lg:flex-[0.65]">
            <div className="bg-white rounded-[16px] border border-[#E8E4DA] shadow-[0_2px_8px_rgba(28,25,23,0.06)] overflow-hidden">
              {/* Patient Header Bar */}
              <div className="bg-[#F0F7F7] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0D7377]/10 flex items-center justify-center shrink-0">
                    <CircleUser size={22} className="text-[#0D7377]" />
                  </div>
                  <div>
                    <h2 className="font-body font-semibold text-[16px] text-[#1C1917]">
                      {currentCase.patient.name},{' '}
                      <span className="font-normal">{currentCase.patient.age} anos</span>
                    </h2>
                    <p className="font-body text-[13px] text-[#5C5852]">
                      {currentCase.patient.gender} &middot; {currentCase.patient.occupation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <span className="font-body text-[12px] font-medium bg-[#E6F2F2] text-[#0D7377] px-3 py-1 rounded-full">
                    {currentCase.specialty}
                  </span>
                  <span className="font-body text-[12px] font-medium bg-[#FDF3E3] text-[#D4943A] px-3 py-1 rounded-full">
                    {currentCase.difficulty}
                  </span>
                  <span className="font-body text-[12px] text-[#5C5852] bg-white px-3 py-1 rounded-full border border-[#E8E4DA]">
                    Questao {Math.min(currentQIndex + 1, currentCase.questions.length)} de{' '}
                    {currentCase.questions.length}
                  </span>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b-2 border-[#E8E4DA] overflow-x-auto">
                <div className="flex min-w-full">
                  {TABS.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-2 px-4 sm:px-5 py-3.5 font-body font-medium text-[14px] shrink-0 transition-colors duration-200 whitespace-nowrap ${
                          isActive
                            ? 'text-[#0D7377]'
                            : 'text-[#5C5852] hover:text-[#1C1917] hover:bg-[#F7F5F0]'
                        }`}
                      >
                        <Icon
                          size={18}
                          className={
                            isActive ? 'text-[#0D7377]' : 'text-[#9C9890]'
                          }
                        />
                        <span>{tab.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeTabIndicator"
                            className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-[#0D7377]"
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-5 sm:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {activeTab === 0 && (
                      <PresentationTab data={currentCase.presentation} />
                    )}
                    {activeTab === 1 && (
                      <PhysicalExamTab data={currentCase.physicalExam} />
                    )}
                    {activeTab === 2 && <LabsTab labs={currentCase.labs} />}
                    {activeTab === 3 && (
                      <ImagingTab imaging={currentCase.imaging} />
                    )}
                    {activeTab === 4 && (
                      <QuestionsTab
                        questions={currentCase.questions}
                        selectedAnswers={selectedAnswers}
                        revealedAnswers={revealedAnswers}
                        onSelect={handleSelectAnswer}
                        currentQIndex={currentQIndex}
                        onNext={handleNext}
                        score={score}
                        onScore={handleScore}
                        caseCompleted={caseCompleted}
                        correctCount={correctCount}
                        onReset={handleReset}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: Questions Sidebar (Desktop only) */}
          <div className="hidden lg:block lg:flex-[0.35]">
            <div className="sticky top-[150px] bg-white rounded-[16px] border border-[#E8E4DA] shadow-[0_2px_8px_rgba(28,25,23,0.06)] p-6 max-h-[calc(100dvh-180px)] overflow-y-auto">
              {/* Confetti */}
              <div className="relative">
                <ConfettiBurst trigger={confettiTrigger} />
              </div>

              {caseCompleted ? (
                <div className="text-center py-6 space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <Trophy size={56} className="text-[#D4943A] mx-auto" />
                  </motion.div>
                  <h3 className="font-heading text-[20px] font-bold text-[#1C1917]">
                    Caso concluido!
                  </h3>
                  <div
                    className="font-heading text-[28px] font-bold"
                    style={{
                      color:
                        correctCount / currentCase.questions.length >= 0.66
                          ? '#2D8A56'
                          : correctCount / currentCase.questions.length >= 0.33
                            ? '#D4943A'
                            : '#C0392B',
                    }}
                  >
                    {correctCount}/{currentCase.questions.length}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles size={16} className="text-[#F5A623]" />
                    <span className="font-mono font-bold text-[16px] text-[#F5A623]">
                      +{score} XP
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="w-full font-body font-medium text-[15px] bg-[#0D7377] text-white py-3 rounded-[10px] hover:bg-[#095C60] active:scale-[0.98] transition-all duration-200"
                  >
                    Refazer Caso
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-body text-[13px] text-[#5C5852]">
                      Questao {currentQIndex + 1} de {currentCase.questions.length}
                    </span>
                    <div className="flex items-center gap-1.5 bg-[#FDF3E3] px-2.5 py-1 rounded-full">
                      <Sparkles size={12} className="text-[#D4943A]" />
                      <span className="font-mono font-medium text-[11px] text-[#D4943A]">
                        {score} XP
                      </span>
                    </div>
                  </div>

                  {/* Mini progress dots */}
                  <div className="flex items-center gap-1.5 mb-5">
                    {currentCase.questions.map((q, i) => {
                      const isAnswered = !!revealedAnswers[q.id]
                      const isCorrect =
                        selectedAnswers[q.id] === q.correctAnswer
                      return (
                        <div
                          key={q.id}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            i === currentQIndex
                              ? 'w-5 bg-[#0D7377]'
                              : isAnswered
                                ? isCorrect
                                  ? 'w-2 bg-[#2D8A56]'
                                  : 'w-2 bg-[#C0392B]'
                                : 'w-2 bg-[#E8E4DA]'
                          }`}
                        />
                      )
                    })}
                  </div>

                  <div className="border-t border-[#E8E4DA] pt-4">
                    <QuestionCard
                      question={currentCase.questions[currentQIndex]}
                      qIndex={currentQIndex}
                      total={currentCase.questions.length}
                      selectedAnswer={
                        selectedAnswers[currentCase.questions[currentQIndex]?.id] ??
                        null
                      }
                      isRevealed={
                        !!revealedAnswers[
                          currentCase.questions[currentQIndex]?.id
                        ]
                      }
                      onSelect={handleSelectAnswer}
                      onNext={handleNext}
                      score={score}
                      onScore={handleScore}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
