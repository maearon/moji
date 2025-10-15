// Get friends list
import type { NextRequest } from "next/server"
import { authenticateRequest, createAuthResponse } from "@/lib/auth/middleware"
import { mockDB } from "@/lib/db/connection"
import type { Friend, User } from "@/lib/db/models"

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return createAuthResponse("Unauthorized")
    }

    // Get all friendships for the user
    const friendships = Array.from(mockDB.friends.values()).filter(
      (f: Friend) => f.userId === user.userId || f.friendId === user.userId,
    )

    // Get friend user data
    const friends = friendships.map((f: Friend) => {
      const friendId = f.userId === user.userId ? f.friendId : f.userId
      const friendData = mockDB.users.get(friendId) as User
      const { password: _, ...friendWithoutPassword } = friendData
      return friendWithoutPassword
    })

    return Response.json({ friends })
  } catch (error) {
    console.error("[v0] Get friends error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
