// types/chat/chat.ts
export interface UserSummary {
  id: string
  name: string
  email?: string
  avatar?: string | null
}

export interface MessageSummary {
  id: string
  senderId: string
  content: string
  createdAt: string
}

export interface ConversationWithDetails {
  id: string
  name?: string | null
  type: "private" | "group"
  avatar?: string | null
  // người còn lại trong cuộc hội thoại (nếu là private)
  otherParticipants?: UserSummary[]
  // tin nhắn cuối cùng
  lastMessage?: MessageSummary | null
  // số tin nhắn chưa đọc (client tính hoặc backend gửi về)
  unreadCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface MessageWithSender {
  id: string
  conversationId: string
  senderId: string
  content: string
  type: "text" | "image" | "file"
  fileUrl?: string | null
  fileName?: string | null
  createdAt: string
  updatedAt?: string
  sender: {
    id: string
    name: string
    email?: string
    avatar?: string | null
  }
}
