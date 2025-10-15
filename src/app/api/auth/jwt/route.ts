import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateJWT } from "@/lib/jwt"

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = Date.now()
    const accessExpiresInMs = 3600 * 1000 // 1h
    const refreshExpiresInMs = 24 * 3600 * 1000 // 1d

    const accessToken = generateJWT({ sub: session.user.id }, "1h")
    const refreshToken = generateJWT({ sub: session.user.id }, "1d")

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        token: accessToken,
      },
      tokens: {
        access: {
          token: accessToken,
          expires: new Date(now + accessExpiresInMs).toISOString(),
        },
        refresh: {
          token: refreshToken,
          expires: new Date(now + refreshExpiresInMs).toISOString(),
        },
      },
    })
  } catch (err) {
    console.error("JWT generation failed", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
