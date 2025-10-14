"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { io, type Socket } from "socket.io-client"
import { useSession } from "@/lib/auth-client"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  jwtToken: string | null
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [jwtToken, setJwtToken] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user) {
      setJwtToken(null)
      return
    }

    const fetchJWT = async () => {
      try {
        const response = await fetch("/api/auth/jwt", {
          method: "POST",
        })

        if (response.ok) {
          const data = await response.json()
          setJwtToken(data.tokens.access.token)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch JWT:", error)
      }
    }

    fetchJWT()
  }, [session])

  useEffect(() => {
    if (!session?.user || !jwtToken) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
      return
    }

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3002", {
      query: {
        token: jwtToken,
      },
      transports: ["websocket", "polling"],
    })

    socketInstance.on("connect", () => {
      console.log("[v0] Socket connected")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("[v0] Socket disconnected")
      setIsConnected(false)
    })

    socketInstance.on("connect_error", (error) => {
      console.error("[v0] Socket connection error:", error)
    })

    socketInstance.on("error", (data: { message: string }) => {
      console.error("[v0] Socket error:", data.message)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [session, jwtToken])

  return <SocketContext.Provider value={{ socket, isConnected, jwtToken }}>{children}</SocketContext.Provider>
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}
