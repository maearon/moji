// Search users by username or name
import type { NextRequest } from "next/server"
import { authenticateRequest, createAuthResponse } from "@/lib/auth/middleware"
import { mockDB } from "@/lib/db/connection"
import type { User } from "@/lib/db/models"

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return createAuthResponse("Unauthorized")
    }

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")?.toLowerCase()

    if (!query) {
      return Response.json({ users: [] })
    }

    // Search users by username or name
    const users = Array.from(mockDB.users.values())
      .filter((u: User) => {
        return (
          u.id !== user.userId && (u.username.toLowerCase().includes(query) || u.name.toLowerCase().includes(query))
        )
      })
      .slice(0, 10) // Limit to 10 results
      .map((u: User) => {
        const { password: _, ...userWithoutPassword } = u
        return userWithoutPassword
      })

    return Response.json({ users })
  } catch (error) {
    console.error("[v0] Search users error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
