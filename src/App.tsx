import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CaseViewer from './pages/CaseViewer'
import Specialties from './pages/Specialties'
import Flashcards from './pages/Flashcards'
import Analytics from './pages/Analytics'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import PremiumRoute from './components/PremiumRoute'

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Free routes - require login only */}
      <Route path="/specialties" element={
        <ProtectedRoute>
          <Specialties />
        </ProtectedRoute>
      } />

      {/* Pro routes - require active subscription */}
      <Route path="/case/:id" element={
        <PremiumRoute>
          <CaseViewer />
        </PremiumRoute>
      } />
      <Route path="/flashcards" element={
        <PremiumRoute>
          <Flashcards />
        </PremiumRoute>
      } />
      <Route path="/analytics" element={
        <PremiumRoute>
          <Analytics />
        </PremiumRoute>
      } />
    </Routes>
  )
}
