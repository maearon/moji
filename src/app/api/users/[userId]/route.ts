// Get user profile by ID
import type { NextRequest } from "next/server"
import { authenticateRequest, createAuthResponse } from "@/lib/auth/middleware"
import { mockDB } from "@/lib/db/connection"
import type { User } from "@/lib/db/models"

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return createAuthResponse("Unauthorized")
    }

    const { userId } = await params
    const userData = mockDB.users.get(userId) as User

    if (!userData) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = userData

    return Response.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("[v0] Get user error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
