// Accept or reject friend request
import type { NextRequest } from "next/server"
import { authenticateRequest, createAuthResponse } from "@/lib/auth/middleware"
import { mockDB } from "@/lib/db/connection"
import type { FriendRequest, Friend } from "@/lib/db/models"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ requestId: string }> }) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return createAuthResponse("Unauthorized")
    }

    const { requestId } = await params
    const body = await request.json()
    const { action } = body // "accept" or "reject"

    if (!action || !["accept", "reject"].includes(action)) {
      return Response.json({ error: "Invalid action" }, { status: 400 })
    }

    const friendRequest = mockDB.friendRequests.get(requestId) as FriendRequest

    if (!friendRequest) {
      return Response.json({ error: "Friend request not found" }, { status: 404 })
    }

    if (friendRequest.receiverId !== user.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (friendRequest.status !== "pending") {
      return Response.json({ error: "Friend request already processed" }, { status: 409 })
    }

    // Update request status
    friendRequest.status = action === "accept" ? "accepted" : "rejected"
    friendRequest.updatedAt = new Date()
    mockDB.friendRequests.set(requestId, friendRequest)

    // If accepted, create friendship
    if (action === "accept") {
      const friendshipId = `friend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const friendship: Friend = {
        id: friendshipId,
        userId: user.userId,
        friendId: friendRequest.senderId,
        createdAt: new Date(),
      }
      mockDB.friends.set(friendshipId, friendship)
    }

    return Response.json({ request: friendRequest })
  } catch (error) {
    console.error("[v0] Process friend request error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
