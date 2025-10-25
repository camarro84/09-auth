'use client'

import { useEffect, useState } from 'react'
import { checkSession, getMe, logout } from '@/lib/api/clientApi'
import { useUserStore } from '@/lib/store/authStore'

type Props = {
  children: React.ReactNode
}

export default function AuthProvider({ children }: Props) {
  const setUser = useUserStore((s) => s.setUser)
  const clearUser = useUserStore((s) => s.clearUser)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function syncAuth() {
      try {
        const sessionUser = await checkSession()

        if (!sessionUser) {
          await logout().catch(() => {})
          if (isMounted) clearUser()
          return
        }

        const me = await getMe()
        if (isMounted && me) {
          setUser(me)
        }
      } catch {
        if (isMounted) {
          clearUser()
        }
      } finally {
        if (isMounted) setInitialized(true)
      }
    }

    if (typeof window !== 'undefined') {
      syncAuth()
    }

    return () => {
      isMounted = false
    }
  }, [setUser, clearUser])

  return <>{children}</>
}
