// Stripe Checkout integration
// REPLACE with your actual Stripe publishable key and price IDs

const STRIPE_CONFIG = {
  publishableKey: 'pk_test_YOUR_PUBLISHABLE_KEY', // Replace with your key
  prices: {
    monthly: 'price_monthly_id',  // Replace with Stripe Price ID
    annual: 'price_annual_id',    // Replace with Stripe Price ID
  },
  successUrl: 'https://mededuca-ai.vercel.app/#/success',
  cancelUrl: 'https://mededuca-ai.vercel.app/#/pricing',
}

// Redirect to Stripe Checkout
export function redirectToCheckout(plan: 'monthly' | 'annual') {
  const priceId = STRIPE_CONFIG.prices[plan]
  const amount = plan === 'monthly' ? 'R$ 29,90' : 'R$ 238,80'

  console.log('Stripe Price ID:', priceId)
  alert(
    `Pagamento via Stripe\n\n` +
    `Plano: ${plan === 'monthly' ? 'Pro Mensal' : 'Pro Anual'}\n` +
    `Valor: ${amount}\n\n` +
    `Para ativar pagamentos reais:\n` +
    `1. Crie conta em https://stripe.com/br\n` +
    `2. Copie sua Publishable Key\n` +
    `3. Cole em src/lib/stripe.ts\n` +
    `4. Crie os Price IDs no Stripe Dashboard\n\n` +
    `Enquanto isso, use o PIX manual:\n` +
    `Chave PIX: contato@mededuca.ai`
  )
}

// For production, replace with:
// import { loadStripe } from '@stripe/stripe-js'
// const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey)
// export async function redirectToCheckout(plan: 'monthly' | 'annual') {
//   const stripe = await stripePromise
//   await stripe?.redirectToCheckout({
//     lineItems: [{ price: STRIPE_CONFIG.prices[plan], quantity: 1 }],
//     mode: 'subscription',
//     successUrl: STRIPE_CONFIG.successUrl,
//     cancelUrl: STRIPE_CONFIG.cancelUrl,
//   })
// }
