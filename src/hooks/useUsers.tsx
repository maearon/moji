"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { UserWithRole } from "better-auth/plugins/admin"

type AuthClientError = {
  code?: string
  message?: string
  status: number
  statusText: string
}

export function useUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AuthClientError | null>(null)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        const res = await authClient.admin.listUsers({ query: {} })
        if (res.data) {
          setUsers(res.data.users)
          setTotal(res.data.total)
        }
        if (res.error) {
          setError(res.error)
        }
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  return { users, total, isLoading, error }
}
