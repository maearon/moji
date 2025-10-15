// Update current user profile
import type { NextRequest } from "next/server"
import { authenticateRequest, createAuthResponse } from "@/lib/auth/middleware"
import { mockDB } from "@/lib/db/connection"
import type { User } from "@/lib/db/models"

export async function PATCH(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return createAuthResponse("Unauthorized")
    }

    const body = await request.json()
    const { name, bio, avatar } = body

    const userData = mockDB.users.get(user.userId) as User

    if (!userData) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    // Update user data
    const updatedUser: User = {
      ...userData,
      name: name ?? userData.name,
      bio: bio ?? userData.bio,
      avatar: avatar ?? userData.avatar,
      updatedAt: new Date(),
    }

    mockDB.users.set(user.userId, updatedUser)

    // Return updated user (without password)
    const { password: _, ...userWithoutPassword } = updatedUser

    return Response.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("[v0] Update profile error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
