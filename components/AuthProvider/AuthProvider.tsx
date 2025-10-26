'use client'

import { useEffect, useState } from 'react'
import { checkSession, getMe } from '@/lib/api/clientApi'
import { useUserStore } from '@/lib/store/authStore'

type Props = {
  children: React.ReactNode
}

export default function AuthProvider({ children }: Props) {
  const setUser = useUserStore((s) => s.setUser)
  const clearUser = useUserStore((s) => s.clearUser)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function syncAuth() {
      try {
        const sessionUser = await checkSession()

        if (!isMounted) return

        if (!sessionUser) {
          clearUser()
          setIsLoading(false)
          return
        }

        const me = await getMe()

        if (!isMounted) return

        setUser(me)
      } catch {
        if (isMounted) {
          clearUser()
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    syncAuth()

    return () => {
      isMounted = false
    }
  }, [setUser, clearUser])

  return <>{children}</>
}
