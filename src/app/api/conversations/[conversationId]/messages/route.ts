// Get messages for a conversation
import type { NextRequest } from "next/server"
import { authenticateRequest, createAuthResponse } from "@/lib/auth/middleware"
import { mockDB } from "@/lib/db/connection"
import type { Message, User, MessageWithSender } from "@/lib/db/models"

export async function GET(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return createAuthResponse("Unauthorized")
    }

    const { conversationId } = await params

    // Get messages for conversation
    const messages = Array.from(mockDB.messages.values())
      .filter((msg: Message) => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((msg: Message) => {
        const sender = mockDB.users.get(msg.senderId) as User
        const { password: _, ...senderWithoutPassword } = sender
        const messageWithSender: MessageWithSender = {
          ...msg,
          sender: senderWithoutPassword,
        }
        return messageWithSender
      })

    return Response.json({ messages })
  } catch (error) {
    console.error("[v0] Get messages error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Send message
export async function POST(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return createAuthResponse("Unauthorized")
    }

    const { conversationId } = await params
    const body = await request.json()
    const { content, type, fileUrl, fileName } = body

    if (!content && !fileUrl) {
      return Response.json({ error: "Content or file is required" }, { status: 400 })
    }

    // Create message
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const message: Message = {
      id: messageId,
      conversationId,
      senderId: user.userId,
      content: content || "",
      type: type || "text",
      fileUrl,
      fileName,
      seenBy: [user.userId], // Sender has seen it
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockDB.messages.set(messageId, message)

    // Update conversation's last message
    const conversation = mockDB.conversations.get(conversationId)
    if (conversation) {
      conversation.lastMessageId = messageId
      conversation.updatedAt = new Date()
      mockDB.conversations.set(conversationId, conversation)
    }

    // Get sender data
    const sender = mockDB.users.get(user.userId) as User
    const { password: _, ...senderWithoutPassword } = sender

    const messageWithSender: MessageWithSender = {
      ...message,
      sender: senderWithoutPassword,
    }

    return Response.json({ message: messageWithSender })
  } catch (error) {
    console.error("[v0] Send message error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
