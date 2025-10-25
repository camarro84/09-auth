'use client'

import { checkSession, getMe } from '@/lib/api/clientApi'
import { useUserStore } from '@/lib/store/authStore'
import React, { useEffect } from 'react'

type Props = {
  children: React.ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const setUser = useUserStore((state) => state.setUser)
  const clearUser = useUserStore((state) => state.clearUser)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const isAuthenticated = await checkSession()

        if (isAuthenticated) {
          const user = await getMe()
          if (user) {
            setUser(user)
          } else {
            clearUser()
          }
        } else {
          clearUser()
        }
      } catch (error) {
        console.error('AuthProvider error:', error)
        clearUser()
      } finally {
      }
    }

    // 🔹 Викликаємо лише на клієнті
    if (typeof window !== 'undefined') fetchUser()
  }, [setUser, clearUser])

  return <>{children}</>
}

export default AuthProvider
