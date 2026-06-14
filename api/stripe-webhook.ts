// POST /api/stripe-webhook
// Único caminho autorizado a conceder/revogar o entitlement 'pro'.
// Verifica a assinatura do Stripe (corpo cru) e grava o plano no Firestore via Admin SDK.
// Configure o endpoint no Stripe Dashboard apontando para:  https://<app>/api/stripe-webhook
import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from './_lib/firebaseAdmin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

// Precisamos do corpo CRU para validar a assinatura — desliga o parser do Vercel.
export const config = { api: { bodyParser: false } }

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

async function setEntitlement(
  uid: string,
  plan: 'free' | 'pro',
  extra: Record<string, unknown> = {},
): Promise<void> {
  await adminDb()
    .collection('users')
    .doc(uid)
    .set({ plan, updatedAt: FieldValue.serverTimestamp(), ...extra }, { merge: true })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).send('Method Not Allowed')
  }

  const signature = req.headers['stripe-signature']
  if (!signature) {
    return res.status(400).send('Assinatura ausente')
  }

  let event: Stripe.Event
  try {
    const raw = await readRawBody(req)
    event = stripe.webhooks.constructEvent(raw, signature, webhookSecret)
  } catch (err) {
    console.error('Falha na verificação de assinatura do webhook', err)
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as Stripe.Checkout.Session
        const uid = s.client_reference_id || (s.metadata?.firebaseUID as string | undefined)
        if (uid) {
          await setEntitlement(uid, 'pro', {
            stripeCustomerId: typeof s.customer === 'string' ? s.customer : s.customer?.id,
            stripeSubscriptionId:
              typeof s.subscription === 'string' ? s.subscription : s.subscription?.id,
            subscriptionStatus: 'active',
          })
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const uid = sub.metadata?.firebaseUID
        if (uid) {
          const active = sub.status === 'active' || sub.status === 'trialing'
          await setEntitlement(uid, active ? 'pro' : 'free', {
            subscriptionStatus: sub.status,
            currentPeriodEnd: (sub as unknown as { current_period_end?: number }).current_period_end,
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const uid = sub.metadata?.firebaseUID
        if (uid) {
          await setEntitlement(uid, 'free', { subscriptionStatus: 'canceled' })
        }
        break
      }

      default:
        // Eventos não tratados são apenas confirmados.
        break
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('Erro ao processar evento do webhook', err)
    return res.status(500).send('Erro ao processar evento')
  }
}
