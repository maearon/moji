// Friend requests endpoints
import type { NextRequest } from "next/server"
import { authenticateRequest, createAuthResponse } from "@/lib/auth/middleware"
import { mockDB } from "@/lib/db/connection"
import type { FriendRequest, User } from "@/lib/db/models"

// Get friend requests (received)
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return createAuthResponse("Unauthorized")
    }

    // Get pending friend requests received by the user
    const requests = Array.from(mockDB.friendRequests.values())
      .filter((req: FriendRequest) => req.receiverId === user.userId && req.status === "pending")
      .map((req: FriendRequest) => {
        const sender = mockDB.users.get(req.senderId) as User
        const { password: _, ...senderWithoutPassword } = sender
        return {
          ...req,
          sender: senderWithoutPassword,
        }
      })

    return Response.json({ requests })
  } catch (error) {
    console.error("[v0] Get friend requests error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Send friend request
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return createAuthResponse("Unauthorized")
    }

    const body = await request.json()
    const { receiverId } = body

    if (!receiverId) {
      return Response.json({ error: "Receiver ID is required" }, { status: 400 })
    }

    // Check if receiver exists
    const receiver = mockDB.users.get(receiverId)
    if (!receiver) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    // Check if already friends
    const existingFriendship = Array.from(mockDB.friends.values()).find(
      (f: any) =>
        (f.userId === user.userId && f.friendId === receiverId) ||
        (f.userId === receiverId && f.friendId === user.userId),
    )

    if (existingFriendship) {
      return Response.json({ error: "Already friends" }, { status: 409 })
    }

    // Check if request already exists
    const existingRequest = Array.from(mockDB.friendRequests.values()).find(
      (req: FriendRequest) =>
        ((req.senderId === user.userId && req.receiverId === receiverId) ||
          (req.senderId === receiverId && req.receiverId === user.userId)) &&
        req.status === "pending",
    )

    if (existingRequest) {
      return Response.json({ error: "Friend request already sent" }, { status: 409 })
    }

    // Create friend request
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const friendRequest: FriendRequest = {
      id: requestId,
      senderId: user.userId,
      receiverId,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockDB.friendRequests.set(requestId, friendRequest)

    return Response.json({ request: friendRequest })
  } catch (error) {
    console.error("[v0] Send friend request error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
