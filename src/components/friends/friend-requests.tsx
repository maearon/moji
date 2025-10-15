"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2, X } from "lucide-react"

interface FriendRequestWithSender {
  id: string
  senderId: string
  receiverId: string
  status: string
  createdAt: string
  sender: {
    id: string
    username: string
    name: string
    avatar?: string
  }
}

export function FriendRequests() {
  const { accessToken } = useAuth()
  const [requests, setRequests] = useState<FriendRequestWithSender[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received")

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/friends/requests", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests)
      }
    } catch (error) {
      console.error("[v0] Fetch requests error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequest = async (requestId: string, action: "accept" | "reject") => {
    try {
      const response = await fetch(`/api/friends/requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        setRequests(requests.filter((req) => req.id !== requestId))
      }
    } catch (error) {
      console.error("[v0] Handle request error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[248px] w-full rounded-2xl bg-white p-6 shadow-xl">
        <Loader2 className="text-purple-600 size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative w-full rounded-2xl bg-white p-6 shadow-xl">
      {/* Close button */}
      <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
        <X className="h-5 w-5" />
      </button>

      {/* Title */}
      <h2 className="mb-4 text-xl font-bold text-gray-900">Lời mời kết bạn</h2>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 rounded-xl bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab("received")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "received" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Đã nhận
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "sent" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Đã gửi
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {requests.length === 0 ? (
          <p className="py-8 text-center text-gray-500">No pending requests</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={request.sender.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-teal-500 text-lg font-semibold text-white">
                  {request.sender.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{request.sender.name}</p>
                <p className="text-sm text-gray-500">@{request.sender.username}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleRequest(request.id, "accept")}
                  className="rounded-full border-2 border-purple-600 bg-white px-4 text-purple-600 hover:bg-purple-50"
                >
                  Chấp nhận
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRequest(request.id, "reject")}
                  className="rounded-full bg-red-600 px-4 hover:bg-red-700"
                >
                  Từ chối
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
