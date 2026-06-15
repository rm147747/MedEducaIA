import { onRequest } from 'firebase-functions/v2/https'
import * as admin from 'firebase-admin'
import Stripe from 'stripe'

if (!admin.apps.length) {
  admin.initializeApp()
}

const PRICE_IDS: Record<string, string> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY ?? '',
  annual: process.env.STRIPE_PRICE_ANNUAL ?? '',
}

export const createCheckoutSession = onRequest(
  { cors: true, region: 'southamerica-east1' },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const { plan, idToken } = req.body as { plan?: string; idToken?: string }

    if (!plan || !idToken) {
      res.status(400).json({ error: 'plan e idToken são obrigatórios' })
      return
    }

    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      res.status(400).json({ error: 'Plano inválido' })
      return
    }

    let uid: string
    try {
      const decoded = await admin.auth().verifyIdToken(idToken)
      uid = decoded.uid
    } catch {
      res.status(401).json({ error: 'Token inválido' })
      return
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      res.status(500).json({ error: 'Configuração de pagamento ausente' })
      return
    }

    const stripe = new Stripe(stripeKey)
    const baseUrl = process.env.APP_URL ?? 'https://mededuca.com.br'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: uid,
      metadata: { firebaseUID: uid },
      success_url: `${baseUrl}/#/specialties?checkout=success`,
      cancel_url: `${baseUrl}/#/pricing?checkout=cancelled`,
    })

    res.json({ url: session.url, sessionId: session.id })
  },
)
