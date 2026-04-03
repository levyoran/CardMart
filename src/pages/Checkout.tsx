import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { orders } from '../services/supabase'
import { processPayment } from '../services/stripe'
import { useTranslation } from '../hooks/useTranslation'

interface FormData {
  fullName: string
  email: string
  address: string
  city: string
  zipCode: string
  country: string
  cardNumber: string
  expiryDate: string
  cvc: string
}

export const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const { items, getTotal, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [formData, setFormData] = useState<FormData>({
    fullName: user?.full_name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Israel',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  })

  const total = getTotal()
  const tax = total * 0.17
  const finalTotal = total + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateShippingForm = () => {
    if (!formData.fullName || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
      setError('Please fill in all shipping fields')
      return false
    }
    return true
  }

  const validatePaymentForm = () => {
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvc) {
      setError('Please fill in all payment details')
      return false
    }
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be 16 digits')
      return false
    }
    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      setError('Expiry date must be in MM/YY format')
      return false
    }
    if (formData.cvc.length !== 3) {
      setError('CVV must be 3 digits')
      return false
    }
    return true
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateShippingForm()) {
      setStep('payment')
      setError(null)
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePaymentForm()) return

    setIsLoading(true)
    setError(null)

    try {
      // Create order
      const order = await orders.create({
        user_id: user?.id,
        items: items,
        total_amount: finalTotal,
        payment_status: 'pending',
        status: 'pending',
      })

      // Process payment
      const paymentResult = await processPayment(finalTotal, order.id)

      if (paymentResult.success) {
        // Update order payment status
        await orders.updatePaymentStatus(order.id, 'completed', paymentResult.paymentId || '')

        // Clear cart
        clearCart()

        // Show confirmation
        setStep('confirmation')
      } else {
        throw new Error(paymentResult.error || 'Payment failed')
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.')
      setIsLoading(false)
    }
  }

  if (step === 'confirmation') {
    return (
      <main className="min-h-screen bg-gray-50 py-12" dir="rtl">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('checkout.orderConfirmed')}</h1>
            <p className="text-gray-600 mb-6">
              {t('checkout.thankYou')}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {t('checkout.confirmationSent')} {formData.email}
            </p>
            <button
              onClick={() => {
                navigate('/')
              }}
              className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-bold"
            >
              {t('cart.continueShopping')}
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-8">
              {/* Progress Indicator */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                  step === 'shipping' || step === 'payment' || step === 'confirmation'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <div className={`flex-1 h-0.5 ${step !== 'shipping' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                  step === 'payment' || step === 'confirmation'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {step === 'shipping' ? 'Shipping Address' : 'Payment Information'}
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
                  {error}
                </div>
              )}

              {step === 'shipping' ? (
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>Israel</option>
                    <option>USA</option>
                    <option>UK</option>
                    <option>Canada</option>
                  </select>

                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-bold"
                  >
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number (16 digits)"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="text"
                      name="cvc"
                      placeholder="CVC"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                    <p className="font-semibold mb-2">🧪 Test Card Numbers:</p>
                    <p>Success: 4242 4242 4242 4242</p>
                    <p>Decline: 4000 0000 0000 0002</p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-orange-500 transition font-bold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition font-bold"
                    >
                      {isLoading ? 'Processing...' : `Pay ₪${finalTotal.toFixed(2)}`}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg p-6 sticky top-20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4 pb-4 border-b max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-sm text-gray-700">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>₪{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₪{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (17%)</span>
                  <span>₪{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900 mt-4 pt-4 border-t">
                <span>Total</span>
                <span className="text-orange-500">₪{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
