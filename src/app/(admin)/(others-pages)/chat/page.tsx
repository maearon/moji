"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdidasButton } from "@/components/ui/adidas-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, Send, MessageSquare, Users } from "lucide-react"

interface ChatRoom {
  id: number
  customer_name: string
  customer_email: string
  avatar?: string
  last_message: string
  last_message_time: string
  unread_count: number
  status: "online" | "offline" | "away"
  room_type: "support" | "sales" | "complaint"
}

interface Message {
  id: number
  sender: "customer" | "admin"
  content: string
  timestamp: string
  read: boolean
}

export default function ChatPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const mockChatRooms: ChatRoom[] = [
    {
      id: 1,
      customer_name: "Nguyễn Văn A",
      customer_email: "nguyenvana@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      last_message: "Tôi muốn hỏi về sản phẩm Ultraboost 22",
      last_message_time: "2024-01-16T10:30:00Z",
      unread_count: 3,
      status: "online",
      room_type: "sales",
    },
    {
      id: 2,
      customer_name: "Trần Thị B",
      customer_email: "tranthib@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      last_message: "Đơn hàng của tôi có vấn đề gì không?",
      last_message_time: "2024-01-16T09:15:00Z",
      unread_count: 1,
      status: "online",
      room_type: "support",
    },
    {
      id: 3,
      customer_name: "Lê Văn C",
      customer_email: "levanc@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      last_message: "Cảm ơn bạn đã hỗ trợ!",
      last_message_time: "2024-01-16T08:45:00Z",
      unread_count: 0,
      status: "offline",
      room_type: "support",
    },
  ]

  const mockMessages: Message[] = [
    {
      id: 1,
      sender: "customer",
      content: "Xin chào, tôi muốn hỏi về sản phẩm Ultraboost 22",
      timestamp: "2024-01-16T10:25:00Z",
      read: true,
    },
    {
      id: 2,
      sender: "admin",
      content: "Chào bạn! Tôi có thể giúp bạn tìm hiểu về Ultraboost 22. Bạn muốn biết thông tin gì cụ thể?",
      timestamp: "2024-01-16T10:26:00Z",
      read: true,
    },
    {
      id: 3,
      sender: "customer",
      content: "Tôi muốn biết về size và màu sắc có sẵn",
      timestamp: "2024-01-16T10:28:00Z",
      read: true,
    },
    {
      id: 4,
      sender: "customer",
      content: "Và giá cả như thế nào?",
      timestamp: "2024-01-16T10:30:00Z",
      read: false,
    },
  ]

  useEffect(() => {
    setChatRooms(mockChatRooms)
    if (mockChatRooms.length > 0) {
      setSelectedRoom(mockChatRooms[0])
      setMessages(mockMessages)
    }
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return

    const message: Message = {
      id: messages.length + 1,
      sender: "admin",
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleRoomSelect = (room: ChatRoom) => {
    setSelectedRoom(room)
    setMessages(mockMessages)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case "sales":
        return "bg-blue-100 text-blue-800"
      case "support":
        return "bg-green-100 text-green-800"
      case "complaint":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredRooms = chatRooms.filter(
    (room) =>
      room.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.customer_email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">Chat Support</h1>
          <p className="text-muted-foreground">Manage customer conversations and support requests.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            <Users className="mr-1 h-4 w-4" />
            {chatRooms.filter((r) => r.status === "online").length} Online
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <MessageSquare className="mr-1 h-4 w-4" />
            {chatRooms.reduce((sum, r) => sum + r.unread_count, 0)} Unread
          </Badge>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat Rooms List */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle className="uppercase tracking-wide">Chat Rooms</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 border-2 border-foreground"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[450px]">
              {filteredRooms.map((room) => (
                <div key={room.id}>
                  <div
                    className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                      selectedRoom?.id === room.id ? "bg-muted" : ""
                    }`}
                    onClick={() => handleRoomSelect(room)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={room.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{room.customer_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(room.status)}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{room.customer_name}</p>
                          <div className="flex items-center gap-2">
                            {room.unread_count > 0 && (
                              <Badge className="h-5 w-5 p-0 text-xs bg-red-500 text-white">{room.unread_count}</Badge>
                            )}
                            <Badge className={`text-xs ${getRoomTypeColor(room.room_type)}`}>{room.room_type}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">{room.last_message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(room.last_message_time).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-2 border-2 border-foreground">
          {selectedRoom ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedRoom.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{selectedRoom.customer_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(selectedRoom.status)}`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedRoom.customer_name}</CardTitle>
                      <CardDescription>{selectedRoom.customer_email}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getRoomTypeColor(selectedRoom.room_type)}>
                    {selectedRoom.room_type.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.sender === "admin" ? "bg-foreground text-background" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "admin" ? "text-background/70" : "text-muted-foreground"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="border-2 border-foreground"
                    />
                    <AdidasButton onClick={handleSendMessage} className="border-2 border-foreground">
                      <Send className="h-4 w-4" />
                    </AdidasButton>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a conversation to start chatting</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
