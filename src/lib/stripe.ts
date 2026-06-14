// Stripe Checkout — fluxo seguro.
// O client NÃO conhece nenhuma chave secreta: ele pede ao backend (/api/create-checkout-session)
// uma sessão de Checkout autenticada pelo Firebase ID token e é redirecionado para a URL do Stripe.
// O entitlement ('pro') só é concedido pelo webhook server-side (/api/stripe-webhook).
import { auth } from '@/lib/firebase'

export async function redirectToCheckout(plan: 'monthly' | 'annual'): Promise<void> {
  try {
    const user = auth.currentUser
    if (!user) {
      window.location.hash = '#/login'
      return
    }

    const idToken = await user.getIdToken()
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, idToken }),
    })

    if (!res.ok) {
      const detail = await res.text()
      throw new Error(`HTTP ${res.status}: ${detail}`)
    }

    const { url } = (await res.json()) as { url?: string }
    if (!url) {
      throw new Error('Resposta de checkout sem URL')
    }

    // Redireciona para o Stripe Checkout hospedado.
    window.location.href = url
  } catch (err) {
    console.error('redirectToCheckout falhou', err)
    alert('Não foi possível iniciar o pagamento agora. Tente novamente em instantes.')
  }
}
