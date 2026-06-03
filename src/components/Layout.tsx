import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import BottomNav from './BottomNav'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="min-h-[100dvh] flex flex-col"
    >
      <Navbar />
      <main className="pb-20 md:pb-0 flex-1">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </motion.div>
  )
}
