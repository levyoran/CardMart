import React, { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'
import { useLanguageStore } from '../store/languageStore'

export const Contact: React.FC = () => {
  const { t } = useTranslation()
  const language = useLanguageStore((state) => state.language)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: לשמור בSupabase או לשלוח דוא"ל
      console.log('Contact form:', formData)
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-orange-500 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-orange-100 text-lg">{t('contact.subtitle')}</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {language === 'en' ? (
            <>
              {/* Contact Form - left in LTR (appears first in LTR) */}
              <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.sendMessage')}</h2>

            {submitted && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                {t('contact.successMessage')}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.fullName')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder={t('contact.fullName')}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="example@email.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.subject')}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder={t('contact.subjectPlaceholder')}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.message')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  placeholder={t('contact.messagePlaceholder')}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
              >
                {isLoading ? t('contact.sending') : t('contact.send')}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.contactInfo')}</h2>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{t('contact.emailLabel')}</h3>
                  <a href="mailto:info@cardmart.co.il" className="text-orange-500 hover:underline">
                    info@cardmart.co.il
                  </a>
                </div>
                <Mail className="text-orange-500 flex-shrink-0" size={24} />
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{t('contact.phoneLabel')}</h3>
                  <a href="tel:+972123456789" className="text-orange-500 hover:underline">
                    03-123-4567
                  </a>
                </div>
                <Phone className="text-orange-500 flex-shrink-0" size={24} />
              </div>

              {/* Address */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{t('contact.addressLabel')}</h3>
                  <p className="text-gray-600">{t('contact.address')}</p>
                </div>
                <MapPin className="text-orange-500 flex-shrink-0" size={24} />
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                {t('contact.responseTime')}
              </p>
            </div>
              </div>
            </>
          ) : (
            <>
              {/* Contact Form - right in RTL (appears first in RTL) */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.sendMessage')}</h2>

                {submitted && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {t('contact.successMessage')}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.fullName')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder={t('contact.fullName')}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="example@email.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.subject')}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder={t('contact.subjectPlaceholder')}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.message')}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                      placeholder={t('contact.messagePlaceholder')}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                  >
                    {isLoading ? t('contact.sending') : t('contact.send')}
                  </button>
                </form>
              </div>

              {/* Contact Info - left in RTL (appears second in RTL) */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.contactInfo')}</h2>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{t('contact.emailLabel')}</h3>
                      <a href="mailto:info@cardmart.co.il" className="text-orange-500 hover:underline">
                        info@cardmart.co.il
                      </a>
                    </div>
                    <Mail className="text-orange-500 flex-shrink-0" size={24} />
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{t('contact.phoneLabel')}</h3>
                      <a href="tel:+972123456789" className="text-orange-500 hover:underline">
                        03-123-4567
                      </a>
                    </div>
                    <Phone className="text-orange-500 flex-shrink-0" size={24} />
                  </div>

                  {/* Address */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{t('contact.addressLabel')}</h3>
                      <p className="text-gray-600">{t('contact.address')}</p>
                    </div>
                    <MapPin className="text-orange-500 flex-shrink-0" size={24} />
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    {t('contact.responseTime')}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
