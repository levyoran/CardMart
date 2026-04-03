import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useLanguageStore } from './store/languageStore'
import { Header } from './components/Header'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminOverview } from './pages/AdminOverview'
import { AdminOrders } from './pages/AdminOrders'
import { AdminUsers } from './pages/AdminUsers'
import { ProductDetail } from './pages/ProductDetail'
import { Account } from './pages/Account'
import { Orders } from './pages/Orders'
import { Contact } from './pages/Contact'

function App() {
  const { initialize, isLoading } = useAuthStore()
  const language = useLanguageStore((state) => state.language)

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50" dir={language === 'he' ? 'rtl' : 'ltr'} lang={language}>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/products" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
