// JWT utilities for authentication
import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_SECRET || "your-refresh-secret-change-in-production",
)

export interface TokenPayload {
  userId: string
  username: string
  email: string
}

export async function generateAccessToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m") // 15 minutes
    .sign(JWT_SECRET)
}

export async function generateRefreshToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7 days
    .sign(REFRESH_SECRET)
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as TokenPayload
  } catch (error) {
    return null
  }
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET)
    return payload as TokenPayload
  } catch (error) {
    return null
  }
}
