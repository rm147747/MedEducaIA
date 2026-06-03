import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const navLinks = [
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Especialidades', href: '/specialties' },
  { label: 'Planos', href: '#planos' },
  { label: 'Depoimentos', href: '#depoimentos' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(247,245,240,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #E8E4DA' : '1px solid transparent',
        }}
      >
        <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-0 shrink-0">
            <span className="font-heading font-bold text-[20px] text-[#0D7377]">MedEduca</span>
            <span className="font-heading font-bold text-[20px] text-[#D4943A]">AI</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              >
                {link.href.startsWith('/') ? (
                  <Link
                    to={link.href}
                    className="font-body font-medium text-[15px] text-[#5C5852] hover:text-[#0D7377] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="font-body font-medium text-[15px] text-[#5C5852] hover:text-[#0D7377] transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Desktop CTA / User */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="hidden md:block"
          >
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/80 rounded-full pl-1 pr-4 py-1 border border-[#E8E4DA]">
                  <div className="w-8 h-8 rounded-full bg-[#E6F2F2] flex items-center justify-center">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="w-4 h-4 text-[#0D7377]" />
                    )}
                  </div>
                  <span className="font-body text-sm text-[#1C1917] font-medium">
                    {user.displayName || user.email?.split('@')[0] || 'Medico'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-[#9C9890] hover:text-[#C0392B] transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center font-body font-medium text-[14px] bg-[#0D7377] text-white px-5 py-2.5 rounded-[10px] hover:bg-[#095C60] hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(13,115,119,0.25)] active:scale-[0.98] transition-all duration-200"
              >
                Comecar Gratis
              </Link>
            )}
          </motion.div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-[#1C1917]"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[rgba(28,25,23,0.5)] backdrop-blur-[4px] z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
              className="fixed top-0 right-0 bottom-0 w-[320px] max-w-[85vw] bg-white z-50 p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <Link to="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
                  <span className="font-heading font-bold text-[20px] text-[#0D7377]">MedEduca</span>
                  <span className="font-heading font-bold text-[20px] text-[#D4943A]">AI</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X size={24} className="text-[#1C1917]" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="font-body font-medium text-[16px] text-[#5C5852] hover:text-[#0D7377] transition-colors py-2 block"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleNavClick(link.href)}
                        className="font-body font-medium text-[16px] text-[#5C5852] hover:text-[#0D7377] transition-colors py-2 block"
                      >
                        {link.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center font-body font-medium text-[16px] bg-[#0D7377] text-white px-5 py-3 rounded-[10px] hover:bg-[#095C60] active:scale-[0.98] transition-all duration-200 w-full"
                >
                  Comecar Gratis
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
