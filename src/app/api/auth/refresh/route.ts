// Refresh token API endpoint
import type { NextRequest } from "next/server"
import { verifyRefreshToken, generateAccessToken } from "@/lib/auth/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return Response.json({ error: "Refresh token is required" }, { status: 400 })
    }

    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken)

    if (!payload) {
      return Response.json({ error: "Invalid or expired refresh token" }, { status: 401 })
    }

    // Generate new access token
    const accessToken = await generateAccessToken(payload)

    return Response.json({ accessToken })
  } catch (error) {
    console.error("[v0] Token refresh error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
