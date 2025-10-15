// Authentication middleware for API routes
import type { NextRequest } from "next/server"
import { TokenPayload, verifyAccessToken } from "./jwt"

export async function authenticateRequest(request: NextRequest): Promise<TokenPayload | null> {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  return await verifyAccessToken(token)
}

export function createAuthResponse(message: string, status = 401) {
  return Response.json({ error: message }, { status })
}
