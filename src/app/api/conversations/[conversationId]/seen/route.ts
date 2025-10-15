// Mark messages as seen
import type { NextRequest } from "next/server"
import { authenticateRequest, createAuthResponse } from "@/lib/auth/middleware"
import { mockDB } from "@/lib/db/connection"
import type { Message } from "@/lib/db/models"

export async function POST(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return createAuthResponse("Unauthorized")
    }

    const { conversationId } = await params

    // Mark all messages in conversation as seen by user
    Array.from(mockDB.messages.values())
      .filter((msg: Message) => msg.conversationId === conversationId && !msg.seenBy.includes(user.userId))
      .forEach((msg: Message) => {
        msg.seenBy.push(user.userId)
        mockDB.messages.set(msg.id, msg)
      })

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Mark seen error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
