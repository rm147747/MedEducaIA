import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/spinner'

// Rota que exige assinatura 'pro' (entitlement gravado pelo servidor via webhook Stripe).
// Usuário não logado -> /login. Logado mas free -> /pricing.
export default function PremiumRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-8 h-8 text-[#0D7377] mx-auto mb-3" />
          <p className="text-[#5C5852] font-body">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.plan !== 'pro') {
    return <Navigate to="/pricing" replace />
  }

  return <>{children}</>
}
