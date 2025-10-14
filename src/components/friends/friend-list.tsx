"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { useSocket } from "@/lib/socket/socket-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { User as UserDTO  } from "@/lib/auth"
import { SOCKET_EVENTS } from "@/lib/socket/socket-server"

export function FriendList() {
  const { accessToken } = useAuth()
  const { socket } = useSocket()
  const [friends, setFriends] = useState<UserDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFriends()

    if (socket) {
      socket.on(SOCKET_EVENTS.USER_STATUS, ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
        setFriends((prev) => prev.map((friend) => (friend.id === userId ? { ...friend, isOnline } : friend)))
      })

      return () => {
        socket.off(SOCKET_EVENTS.USER_STATUS)
      }
    }
  }, [socket])

  const fetchFriends = async () => {
    try {
      const response = await fetch("/api/friends", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFriends(data.friends)
      }
    } catch (error) {
      console.error("[v0] Fetch friends error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading friends...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Friends ({friends.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {friends.length === 0 ? (
          <p className="text-center text-muted-foreground">No friends yet</p>
        ) : (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3 rounded-lg border p-3">
                <Avatar>
                  <AvatarImage src={friend.image || "/placeholder.svg"} />
                  <AvatarFallback>{friend.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-sm text-muted-foreground">@{friend.name}</p>
                </div>
                <Badge variant={friend.role ? "default" : "secondary"}>
                  {friend.role ? "Online" : "Offline"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
