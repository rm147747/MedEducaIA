// POST /api/create-checkout-session
// Cria uma sessão de Stripe Checkout (assinatura) para o usuário autenticado.
// O usuário é identificado pelo Firebase ID token (verificado server-side),
// e o uid é propagado em client_reference_id + metadata para o webhook conceder o 'pro'.
import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { adminAuth } from './_lib/firebaseAdmin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const PRICE_BY_PLAN: Record<string, string | undefined> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  annual: process.env.STRIPE_PRICE_ANNUAL,
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { plan, idToken } = (req.body ?? {}) as { plan?: string; idToken?: string }

    if (plan !== 'monthly' && plan !== 'annual') {
      return res.status(400).json({ error: 'Plano inválido' })
    }
    if (!idToken) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    const decoded = await adminAuth().verifyIdToken(idToken)
    const uid = decoded.uid
    const email = decoded.email

    const price = PRICE_BY_PLAN[plan]
    if (!price) {
      return res.status(500).json({ error: 'Price ID não configurado no servidor' })
    }

    const appUrl = process.env.PUBLIC_APP_URL || `https://${req.headers.host}`

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      client_reference_id: uid,
      customer_email: email,
      allow_promotion_codes: true,
      metadata: { firebaseUID: uid },
      subscription_data: { metadata: { firebaseUID: uid } },
      success_url: `${appUrl}/#/specialties?checkout=success`,
      cancel_url: `${appUrl}/#/pricing?checkout=cancel`,
    })

    return res.status(200).json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('create-checkout-session error', err)
    return res.status(500).json({ error: 'Erro ao criar sessão de checkout' })
  }
}
