import { create } from 'zustand'
import { User } from '../types'
import { auth, userProfile } from '../services/supabase'

interface AuthStore {
  user: User | null
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),

  signUp: async (email, password, fullName) => {
    set({ isLoading: true, error: null })
    try {
      await auth.signUp(email, password, fullName)
      set({ isLoading: false })
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign up',
        isLoading: false,
      })
      throw error
    }
  },

  signIn: async (email, password) => {
  set({ isLoading: true, error: null })
  try {
    const data = await auth.signIn(email, password)
    if (data.user) {
      try {
        // קח את ה-role מה-database
        const profile = await userProfile.getProfile(data.user.id)
        
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            full_name: profile?.full_name || data.user.user_metadata?.full_name || '',
            role: profile?.role || 'customer',
            created_at: data.user.created_at || new Date().toISOString(),
          },
          isLoading: false,
        })
      } catch (err) {
        // אם אין profile, השתמש ב-default
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name || '',
            role: 'customer',
            created_at: data.user.created_at || new Date().toISOString(),
          },
          isLoading: false,
        })
      }
    }
  } catch (error: any) {
    set({
      error: error.message || 'Failed to sign in',
      isLoading: false,
    })
    throw error
  }
},


  signOut: async () => {
    set({ isLoading: true })
    try {
      await auth.signOut()
      set({ user: null, isLoading: false })
    } catch (error: any) {
      set({ error: error.message || 'Failed to sign out', isLoading: false })
      throw error
    }
  },

  initialize: async () => {
    try {
    const authUser = await auth.getCurrentUser()
    console.log('🔍 Auth User:', authUser) // DEBUG
    if (authUser) {
      try {
        const profile = await userProfile.getProfile(authUser.id)
        console.log('🔍 Profile from DB:', profile) // DEBUG
        
        set({
          user: {
            id: authUser.id,
            email: authUser.email || '',
            full_name: profile?.full_name || authUser.user_metadata?.full_name || '',
            role: profile?.role || 'customer',
            created_at: authUser.created_at || new Date().toISOString(),
          },
        })
      } catch (err) {
        console.log('❌ Error getting profile:', err) // DEBUG
        set({
          user: {
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.user_metadata?.full_name || '',
            role: 'customer',
            created_at: authUser.created_at || new Date().toISOString(),
          },
        })
      }
    }
  } catch (error) {
    console.log('No authenticated user')
  } finally {
    set({ isLoading: false })
  }
  },
}))
