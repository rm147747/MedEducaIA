import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CaseViewer from './pages/CaseViewer'
import Specialties from './pages/Specialties'
import Flashcards from './pages/Flashcards'
import Analytics from './pages/Analytics'
import Pricing from './pages/Pricing'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/case/:id" element={<CaseViewer />} />
      <Route path="/specialties" element={<Specialties />} />
      <Route path="/flashcards" element={<Flashcards />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/pricing" element={<Pricing />} />
    </Routes>
  )
}
