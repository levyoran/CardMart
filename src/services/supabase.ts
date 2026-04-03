import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth Functions
export const auth = {
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  },

  async onAuthStateChange(callback: any) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Product Functions
export const products = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async create(product: any) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}

// Order Functions
export const orders = {
  async create(order: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async updatePaymentStatus(orderId: string, status: string, stripePaymentId: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: status, stripe_payment_id: stripePaymentId })
      .eq('id', orderId)
      .select()
      .single()
    if (error) throw error
    return data
  }
}

// User Profile Functions
export const userProfile = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  },

  async updateProfile(userId: string, profile: any) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(profile)
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async createProfile(userId: string, profile: any) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{ id: userId, ...profile }])
      .select()
      .single()
    if (error) throw error
    return data
  }
}
