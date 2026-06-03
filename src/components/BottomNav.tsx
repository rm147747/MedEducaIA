import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Stethoscope, Layers, BarChart3, User } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Inicio', href: '/' },
  { icon: Stethoscope, label: 'Casos', href: '/case/demo' },
  { icon: Layers, label: 'Flashcards', href: '/flashcards' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: User, label: 'Perfil', href: '#' },
]

export default function BottomNav() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const check = () => setVisible(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!visible) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E8E4DA] z-50 sm:hidden">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href !== '/' && location.pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              to={item.href}
              className="flex flex-col items-center gap-0.5 py-1 px-2 min-w-[56px]"
            >
              <Icon
                size={22}
                className={isActive ? 'text-[#0D7377]' : 'text-[#9C9890]'}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span
                className={`text-[11px] font-medium ${
                  isActive ? 'text-[#0D7377]' : 'text-[#9C9890]'
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
