// Login API endpoint
import type { NextRequest } from "next/server"
import { verifyPassword } from "@/lib/auth/password"
import type { User } from "@/lib/db/models"
import { generateJWT } from "@/lib/jwt"
import { mockDB } from "@/lib/db/connection"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Validation
    if (!username || !password) {
      return Response.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Find user
    const user = Array.from(mockDB.users.values()).find((u: User) => u.username === username)

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    }
    const accessToken = generateJWT({ sub: tokenPayload.userId }, "1h")
    const refreshToken = generateJWT({ sub: tokenPayload.userId }, "1d")

    // Return user data (without password) and tokens
    const { password: _, ...userWithoutPassword } = user

    return Response.json({
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
