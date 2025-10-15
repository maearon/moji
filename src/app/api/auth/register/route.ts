// Registration API endpoint
import type { NextRequest } from "next/server"
import { hashPassword } from "@/lib/auth/password"
import { generateAccessToken, generateRefreshToken } from "@/lib/auth/jwt"
import { mockDB } from "@/lib/db/connection"
import type { User } from "@/lib/db/models"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, name } = body

    // Validation
    if (!username || !email || !password || !name) {
      return Response.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = Array.from(mockDB.users.values()).find(
      (u: User) => u.username === username || u.email === email,
    )

    if (existingUser) {
      return Response.json({ error: "Username or email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newUser: User = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      name,
      isOnline: false,
      lastSeen: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockDB.users.set(userId, newUser)

    // Generate tokens
    const tokenPayload = { userId, username, email }
    const accessToken = await generateAccessToken(tokenPayload)
    const refreshToken = await generateRefreshToken(tokenPayload)

    // Return user data (without password) and tokens
    const { password: _, ...userWithoutPassword } = newUser

    return Response.json({
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
