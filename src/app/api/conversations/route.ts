// Get conversations for current user
import type { NextRequest } from "next/server"
import { authenticateRequest, createAuthResponse } from "@/lib/auth/middleware"
import { mockDB } from "@/lib/db/connection"
import type { Conversation, Message, User, ConversationWithDetails } from "@/lib/db/models"

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return createAuthResponse("Unauthorized")
    }

    // Get conversations where user is a participant
    const conversations = Array.from(mockDB.conversations.values())
      .filter((conv: Conversation) => conv.participantIds.includes(user.userId))
      .map((conv: Conversation) => {
        // Get last message
        const lastMessage = conv.lastMessageId ? (mockDB.messages.get(conv.lastMessageId) as Message) : undefined

        // Get other participants
        const otherParticipants = conv.participantIds
          .filter((id) => id !== user.userId)
          .map((id) => {
            const userData = mockDB.users.get(id) as User
            const { password: _, ...userWithoutPassword } = userData
            return userWithoutPassword
          })

        // Count unread messages
        const messages = Array.from(mockDB.messages.values()).filter(
          (msg: Message) => msg.conversationId === conv.id && !msg.seenBy.includes(user.userId),
        )
        const unreadCount = messages.length

        const conversationWithDetails: ConversationWithDetails = {
          ...conv,
          lastMessage,
          otherParticipants,
          unreadCount,
        }

        return conversationWithDetails
      })
      .sort((a, b) => {
        const aTime = a.lastMessage?.createdAt || a.createdAt
        const bTime = b.lastMessage?.createdAt || b.createdAt
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      })

    return Response.json({ conversations })
  } catch (error) {
    console.error("[v0] Get conversations error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Create new conversation
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return createAuthResponse("Unauthorized")
    }

    const body = await request.json()
    const { participantIds, type, name } = body

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return Response.json({ error: "Participant IDs are required" }, { status: 400 })
    }

    // Check if direct conversation already exists
    if (type === "direct" && participantIds.length === 1) {
      const existingConv = Array.from(mockDB.conversations.values()).find(
        (conv: Conversation) =>
          conv.type === "direct" &&
          conv.participantIds.length === 2 &&
          conv.participantIds.includes(user.userId) &&
          conv.participantIds.includes(participantIds[0]),
      )

      if (existingConv) {
        return Response.json({ conversation: existingConv })
      }
    }

    // Create conversation
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const conversation: Conversation = {
      id: conversationId,
      type: type || "direct",
      name,
      participantIds: [user.userId, ...participantIds],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockDB.conversations.set(conversationId, conversation)

    return Response.json({ conversation })
  } catch (error) {
    console.error("[v0] Create conversation error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
