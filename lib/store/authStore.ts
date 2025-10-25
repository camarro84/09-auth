'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/user'

type UserState = {
  user: User | null
  isAuthenticated: boolean
  hydrated: boolean
  setUser: (user: User) => void
  clearUser: () => void
  setHydrated: (value: boolean) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hydrated: false,
      setUser: (user: User) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
      setHydrated: (value: boolean) => set({ hydrated: value }),
    }),
    {
      name: 'auth-user',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hydrated: state.hydrated,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
)
