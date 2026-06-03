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

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes - require login */}
      <Route path="/case/:id" element={
        <ProtectedRoute>
          <CaseViewer />
        </ProtectedRoute>
      } />
      <Route path="/specialties" element={
        <ProtectedRoute>
          <Specialties />
        </ProtectedRoute>
      } />
      <Route path="/flashcards" element={
        <ProtectedRoute>
          <Flashcards />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />
    </Routes>
  )
}
