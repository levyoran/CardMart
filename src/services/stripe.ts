import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key')
}

export const stripe = loadStripe(stripePublishableKey)

export const createPaymentIntent = async (amount: number, orderId: string) => {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // Convert to cents
      orderId,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create payment intent')
  }

  const data = await response.json()
  return data.clientSecret
}

export const confirmPayment = async (clientSecret: string, paymentMethod: any) => {
  const stripeInstance = await stripe
  if (!stripeInstance) throw new Error('Stripe not initialized')

  const result = await stripeInstance.confirmCardPayment(clientSecret, {
    payment_method: paymentMethod,
  })

  if (result.error) {
    throw new Error(result.error.message)
  }

  return result.paymentIntent
}

// Simplified payment for testing (without payment method details)
export const processPayment = async (amount: number, orderId: string) => {
  const response = await fetch('/api/process-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      orderId,
    }),
  })

  if (!response.ok) {
    throw new Error('Payment processing failed')
  }

  return response.json()
}
