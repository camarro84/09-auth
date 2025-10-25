'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/user'

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
        })
      },

      clearUser: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-user',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
