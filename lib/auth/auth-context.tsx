"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "../auth"

interface AuthContextType {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, name: string) => Promise<void>
  logout: () => void
  refreshAccessToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load tokens from localStorage on mount
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken")
    const storedRefreshToken = localStorage.getItem("refreshToken")

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken)
      fetchCurrentUser(storedAccessToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  // Fetch current user
  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Token might be expired, try to refresh
        await refreshAccessToken()
      }
    } catch (error) {
      console.error("[v0] Failed to fetch user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Login function
  const login = async (username: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Login failed")
    }

    const data = await response.json()
    setUser(data.user)
    setAccessToken(data.accessToken)
    localStorage.setItem("accessToken", data.accessToken)
    localStorage.setItem("refreshToken", data.refreshToken)
  }

  // Register function
  const register = async (username: string, email: string, password: string, name: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, name }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Registration failed")
    }

    const data = await response.json()
    setUser(data.user)
    setAccessToken(data.accessToken)
    localStorage.setItem("accessToken", data.accessToken)
    localStorage.setItem("refreshToken", data.refreshToken)
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setAccessToken(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }

  // Refresh access token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken")

    if (!refreshToken) {
      logout()
      return
    }

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        setAccessToken(data.accessToken)
        localStorage.setItem("accessToken", data.accessToken)
        await fetchCurrentUser(data.accessToken)
      } else {
        logout()
      }
    } catch (error) {
      console.error("[v0] Failed to refresh token:", error)
      logout()
    }
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, register, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
