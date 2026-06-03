import { Link } from 'react-router-dom'

const productLinks = [
  { label: 'Casos Clinicos', href: '/case/demo' },
  { label: 'Flashcards', href: '/flashcards' },
  { label: 'Especialidades', href: '/specialties' },
  { label: 'Analytics', href: '/analytics' },
]

const companyLinks = [
  { label: 'Sobre', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Carreiras', href: '#' },
  { label: 'Contato', href: '#' },
]

const legalLinks = [
  { label: 'Termos de Uso', href: '#' },
  { label: 'Privacidade', href: '#' },
  { label: 'LGPD', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-[#1C1917] text-[#9C9890] pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-0 mb-4">
              <span className="font-heading font-bold text-[20px] text-[#0D7377]">MedEduca</span>
              <span className="font-heading font-bold text-[20px] text-[#D4943A]">AI</span>
            </Link>
            <p className="font-body text-[14px] text-[#9C9890] leading-relaxed mb-6">
              Estudos inteligentes para medicos brasileiros
            </p>
            {/* Newsletter */}
            <div>
              <p className="font-body text-[12px] text-[#9C9890] mb-2">Dicas de estudo no seu email</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="flex-1 bg-transparent border-[1.5px] border-[#5C5852] rounded-[10px] px-3 py-2 text-[12px] text-[#F7F5F0] placeholder-[#9C9890] focus:border-[#0D7377] focus:outline-none transition-colors"
                />
                <button className="border-[1.5px] border-[#0D7377] text-[#0D7377] hover:bg-[#0D7377] hover:text-white px-3 py-2 rounded-[10px] text-[12px] font-medium transition-all duration-200 shrink-0">
                  Inscrever
                </button>
              </div>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-heading font-bold text-[14px] text-[#F7F5F0] uppercase tracking-wider mb-4">
              Produto
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="font-body text-[14px] text-[#9C9890] hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-heading font-bold text-[14px] text-[#F7F5F0] uppercase tracking-wider mb-4">
              Empresa
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <span className="font-body text-[14px] text-[#9C9890] hover:text-white transition-colors duration-200 cursor-pointer">
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-heading font-bold text-[14px] text-[#F7F5F0] uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <span className="font-body text-[14px] text-[#9C9890] hover:text-white transition-colors duration-200 cursor-pointer">
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#5C5852] pt-6">
          <p className="font-body text-[12px] text-[#9C9890] text-center mb-4">
            © 2025 MedEduca AI. Todos os direitos reservados.
          </p>
          <p className="font-body text-[11px] text-[#9C9890] text-center opacity-70 leading-relaxed max-w-[600px] mx-auto">
            MedEduca AI e uma ferramenta de estudo e nao substitui o parecer medico qualificado.
            Sempre consulte um profissional de saude para decisoes clinicas.
          </p>
        </div>
      </div>
    </footer>
  )
}
