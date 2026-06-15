import { onRequest } from 'firebase-functions/v2/https'
import * as admin from 'firebase-admin'
import Stripe from 'stripe'

if (!admin.apps.length) {
  admin.initializeApp()
}

export const stripeWebhook = onRequest(
  { cors: false, region: 'southamerica-east1' },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed')
      return
    }

    const sig = req.headers['stripe-signature']
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    const stripeKey = process.env.STRIPE_SECRET_KEY

    if (!sig || !webhookSecret || !stripeKey) {
      res.status(400).send('Missing configuration')
      return
    }

    const stripe = new Stripe(stripeKey)
    let event: Stripe.Event

    try {
      // req.rawBody é um Buffer disponível automaticamente nas Cloud Functions
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      res.status(400).send(`Webhook Error: ${err}`)
      return
    }

    const db = admin.firestore()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const uid = session.metadata?.firebaseUID ?? session.client_reference_id
        if (uid) {
          await db.collection('users').doc(uid).set(
            {
              plan: 'pro',
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
            },
            { merge: true },
          )
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const snap = await db
          .collection('users')
          .where('stripeSubscriptionId', '==', sub.id)
          .limit(1)
          .get()
        if (!snap.empty) {
          const active = ['active', 'trialing'].includes(sub.status)
          await snap.docs[0].ref.set(
            { plan: active ? 'pro' : 'free', subscriptionStatus: sub.status },
            { merge: true },
          )
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const snap = await db
          .collection('users')
          .where('stripeSubscriptionId', '==', sub.id)
          .limit(1)
          .get()
        if (!snap.empty) {
          await snap.docs[0].ref.set(
            { plan: 'free', subscriptionStatus: 'cancelled' },
            { merge: true },
          )
        }
        break
      }
    }

    res.json({ received: true })
  },
)
