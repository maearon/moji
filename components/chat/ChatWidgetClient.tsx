// "use client"

// import { useState, useEffect, useRef } from "react"
// import { MessageCircle, X, Minus, Square, Send } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { io, Socket } from "socket.io-client"
// import { getUiAvatarUrl } from "@/utils/ui-avatar"
// import { useCurrentUser } from "@/api/hooks/useCurrentUser";
// import { playSound } from "@/utils/play-sound"
// import Image from "next/image"
// import { type Session } from "@/lib/auth"
// import { useAppSelector } from "@/store/hooks"
// import { useTranslations } from "@/hooks/useTranslations"
// import { setTokens } from "@/lib/token"
// import axiosInstance from "@/lib/axios"

// interface ChatMessage {
//   content: string
//   is_ai: boolean
//   created_at: Date
//   id: string
//   room_id: string
//   type: string
//   updated_at: Date
//   user_id: string
//   users?: {
//     email: string
//     id: string
//     name: string
//     // avatar?: string
//   } | null
// }

// interface ChatWidgetClientProps {
//   session: Session | null;
// }

// export default function ChatWidgetClient({ session }: ChatWidgetClientProps) {
//   const { data: userData, status } = useCurrentUser();
//   const t = useTranslations("chat");
//   const [isOpen, setIsOpen] = useState(false)
//   const [isMinimized, setIsMinimized] = useState(false)
//   const [messages, setMessages] = useState<ChatMessage[]>([])
//   const [inputMessage, setInputMessage] = useState("")
//   const [isConnected, setIsConnected] = useState(false)
//   const [isTyping, setIsTyping] = useState(false)
//   const socketRef = useRef<Socket | null>(null)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   // const repliedMessages = useRef<Set<string>>(new Set());

//   // Get user data from Redux
//   const sessionStateRedux = useAppSelector((state) => state.session)
//   // Get user data from Better Auth
//   const sessionState = session
//   const isLoggedIn = sessionState?.session?.id ? true : false
//   const userName = sessionState?.user?.name || "Guest"
//   const userLevel = sessionStateRedux?.value?.level || "LEVEL 1"
//   // Assuming you have JWT token in session
//   // const userToken = sessionStateRedux?.value?.token || sessionState?.session?.token
//   // const { 
//   //     data: sessionClient, 
//   //     isPending, //loading state
//   //     error, //error object
//   //     refetch //refetch the session
//   // } = authClient.useSession()
//   // const { data: sessionClientGet, error } = await authClient.getSession()
//   // const userToken = generateJWT({ sub: sessionClient?.user?.id || 'YnhAyaqjpK7Z7SCs0FWO1M2CuhSBhD1h' }, "1h"); 
//   // const userToken = getAccessToken() || access.token;
//   const [userToken, setUserToken] = useState<string | null>(null)

//   // ✅ Lấy token khi FE mount, chỉ gọi 1 lần
//   useEffect(() => {
//     const fetchToken = async () => {
//       try {
//         const response = await axiosInstance.post("/api/auth/jwt")
//         const { access, refresh } = response.data.tokens
//         setTokens(access.token, refresh.token, true)
//         setUserToken(access.token)
//       } catch (err) {
//         console.error("❌ Cannot fetch JWT:", err)
//       }
//     }

//     if (isLoggedIn) fetchToken()
//   }, [isLoggedIn])

//   // Scroll to bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages, isMinimized, isOpen])

//   // Initialize socket connection
//   useEffect(() => {
//     if (isLoggedIn && userToken && isOpen && status === "success") {
//       // Base URL config
//       const CHAT_SERVICE_URL = process.env.NODE_ENV === "development"
//         ? "http://localhost:3002"
//         : "https://adidas-chat-service.onrender.com"
//       // Replace with your deployed chat service URL
//       // const CHAT_SERVICE_URL = "https://your-chat-service.onrender.com"

//       socketRef.current = io(CHAT_SERVICE_URL, {
//         query: { token: userToken },
//         transports: ['websocket', 'polling']
//       })

//       const socket = socketRef.current

//       // Connection events
//       socket.on('connect', () => {
//         console.log('✅ Connected to chat service')
//         setIsConnected(true)
//         // Join general room
//         socket.emit('join_room', { roomId: 'general' })
//       })

//       socket.on('disconnect', () => {
//         console.log('❌ Disconnected from chat service')
//         setIsConnected(false)
//       })

//       // Message events
//       socket.on('message_history', (data: { messages: ChatMessage[] }) => {
//         console.log("messages", data.messages)
//         const formattedMessages = data.messages.map((msg: ChatMessage) => {
//           const isBot = msg.users?.email?.includes('admin') || msg.users?.email?.includes('support');

//           return {
//             content: msg.content,
//             is_ai: !!msg.is_ai,
//             created_at: msg.created_at ? new Date(msg.created_at) : new Date(),
//             id: msg.id,
//             room_id: msg.room_id,
//             type: msg.type,
//             updated_at: msg.updated_at ? new Date(msg.updated_at) : new Date(),
//             user_id: msg.user_id,
//             users: msg.users ?? null,
//           }
//         })

//         setMessages(formattedMessages)
//       })

//       // Khi nhận tin nhắn mới
//       socket.on('new_message', async (msg: ChatMessage) => {
//         console.log("message.user", msg.users)
//         const isAi =
//           msg.is_ai ||
//           msg.users?.email?.includes('admin') ||
//           msg.users?.email?.includes('support');

//         const formattedMessage: ChatMessage = {
//           content: msg.content,
//           is_ai: !!msg.is_ai,
//           created_at: msg.created_at ? new Date(msg.created_at) : new Date(),
//           id: msg.id,
//           room_id: msg.room_id,
//           type: msg.type,
//           updated_at: msg.updated_at ? new Date(msg.updated_at) : new Date(),
//           user_id: msg.user_id,
//           users: msg.users ?? {
//             email: userData.email,
//             name: userName,
//             id: msg.user_id ?? null,
//           },
//         }

//         setMessages(prev => [...prev, formattedMessage])

//         if (msg.users?.email !== userData?.email) {
//           playSound('/sounds/receive.wav')
//         }

//         // 🚀 Auto-reply logic nếu không phải admin và chưa trả lời Gọi AI reply
//         if (!isAi) {
//           try {
//             const botReply = await fetch("/api/ai-reply", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ message: msg.content, history: messages.slice(-20) })
//             }).then(res => res.json());
//             socket.emit('message', {
//               roomId: 'general',
//               // content: botReply.text.slice(0, 150),  Giới hạn hiện 50 ký tự
//               content: botReply.text,
//               is_ai: true,
//               type: 'text'
//             });
//           } catch (err) {
//             console.error("Bot reply error:", err);
//           }
//         }
//       })

//       socket.on('user_typing', (data: { userEmail: string; isTyping: boolean }) => {
//         if (data.userEmail !== sessionStateRedux?.value?.email) {
//           setIsTyping(data.isTyping)
//         }
//       })

//       socket.on('error', (error: { message: string }) => {
//         console.error('Chat error:', error.message)
//       })

//       return () => {
//         socket.off('connect');
//         socket.off('disconnect');
//         socket.off('message_history');
//         socket.off('new_message');
//         socket.off('user_typing');
//         socket.off('error');

//         socket.disconnect()
//         socketRef.current = null
//         setIsConnected(false)
//       }
//     }
//   }, [status, userData?.email, userName, isLoggedIn, userToken, isOpen, sessionStateRedux?.value?.email])

//   // useEffect(() => {
//   //   const interval = setInterval(() => {
//   //     repliedMessages.current.clear();
//   //   }, 60000); // 1 phút
//   //   return () => clearInterval(interval);
//   // }, []);

//   // Don't show chat widget if user is not logged in
//   if (!isLoggedIn) {
//     return null
//   }

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!inputMessage.trim() || !socketRef.current || !isConnected) {
//       return
//     }

//     socketRef.current.emit('message', {
//       roomId: 'general',
//       content: inputMessage.trim(),
//       is_ai: false,
//       type: 'text'
//     })

//     setInputMessage("")
//     playSound('/sounds/send.wav')
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputMessage(e.target.value)
    
//     // Send typing indicator
//     if (socketRef.current && isOpen) {
//       socketRef.current.emit('typing', {
//         roomId: 'general',
//         isTyping: e.target.value.length > 0
//       })
//     }
//   }

//   const toggleChat = () => {
//     setIsOpen(!isOpen)
//     setIsMinimized(false)
//   }

//   const toggleMinimize = () => {
//     setIsMinimized(prev => !prev)
//   }

//   const emojiMap: Record<string, string> = {
//   "<3": "❤️",
//   ":)": "😊",
//   ":(": "🙁",
//   ":P": "👍",
//   ":D": "😄",
//   ":F": "😛",
//   }

// // Regex patterns để chỉ match 1 ký tự cười/buồn, không match nhiều
// const patterns: Record<string, RegExp> = {
//   ":)": /:\)(?!\))/g,     // match ":)" nhưng không match :))
//   ":(": /:\((?!\()/g,     // match ":(" nhưng không match :((
//   ":P": /:P(?!P)/g,        // match ":P" nhưng không match :PP
//   ":D": /:D(?!D)/g,        // match ":D" nhưng không match :DD
//   "<3": /<3(?!3)/g,         // match "<3" nhưng không match <33
//   ":F": /:F(?!F)/g,
// };

// // Hàm thay thế emoji
// function replaceEmojis(text: string): string {
//   for (const [symbol, pattern] of Object.entries(patterns)) {
//     text = text.replace(pattern, emojiMap[symbol]);
//   }
//   return text;
// }

//   return (
//     <>
//       {/* Chat Widget Button */}
//       {!isOpen && (
//         <button
//           onClick={toggleChat}
//           className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition z-99"
//         >
//           <MessageCircle className="h-6 w-6" />
//         </button>
//       )}

//       {/* Chat Window */}
//       {isOpen && (
//         <div
//           className={`
//             fixed z-99 bg-white dark:bg-black text-foreground border border-gray-200 shadow-xl transition-all duration-300
//             ${isMinimized
//               // ? "w-96 h-16 sm:w-96 sm:h-16 bottom-6 right-6" 
//               // iPhone 15 Pro Max: w-96 = 384px → Exceeds 375px → Overflows off the left screen if you use right-6.
//               ? "w-80 h-16 sm:w-96 sm:h-16 bottom-6 right-6" 
//               : "w-screen h-screen bottom-0 right-0 sm:w-96 sm:h-96 sm:bottom-6 sm:right-6"
//             }
//           `}
//         >
//           {/* Chat Header */}
//           <div className="bg-background border-b border-gray-200 p-4 flex items-center justify-between h-16">
//             <div className="flex items-center space-x-2 overflow-hidden">
//               <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
//                 <span className="text-white dark:text-black text-xs font-bold">A</span>
//               </div>
//               <div className="truncate">
//                 <h3 className="font-bold text-base leading-none truncate">{t?.chat || "CHAT"}</h3>
//                 <p className="text-xs text-gray-500 truncate">
//                   adiclub {userLevel} 
//                   {isConnected ? (
//                     <>
//                       {' '}
//                       <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
//                       {' ' + (t?.online || "Online")}
//                     </>
//                   ) : (
//                     <>
//                       {' '}
//                       <span className="inline-block h-2 w-2 rounded-full bg-gray-400 animate-pulse"></span>
//                       {' ' + (t?.connecting || "Connecting...")}
//                     </>
//                   )}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <button onClick={toggleMinimize} className="p-1 rounded">
//                 {isMinimized ? <Square className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
//               </button>
//               <button onClick={() => setIsOpen(false)} className="p-1 rounded">
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           {/* Chat Content */}
//           {!isMinimized && (
//             <div className="flex flex-col h-[calc(100%-4rem)] sm:h-[calc(24rem-4rem)]">
//               {/* Messages */}
//               <div className="flex-1 p-4 overflow-y-auto space-y-4">
//                 {messages.map((message) => (
//                   <div key={message.id} className={`${(message.is_ai || message.users?.email.includes("admin")) ? "text-left" : "text-right"}`}>
//                     {(message.is_ai || message.users?.email.includes("admin")) ? (
//                       <div className="flex items-start space-x-2">
//                         <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
//                           <span className="text-white dark:text-black text-xs font-bold">A</span>
//                         </div>
//                         {message.is_ai ? (
//                           <div className="bg-black dark:bg-white text-white dark:text-black rounded-lg p-3 max-w-xs">
//                             <p className="text-base text-gray-500 italic">{t?.systemMessage || "[System message]"}</p>
//                             <p className="text-base text-[#0066FF]">{t?.userEmail || "User Email:"} {t?.systemMessage || "[System message]"} {t?.gemini || "Gemini"}</p>
//                             <p className="text-base text-[#E32B2B]">{t?.userName || "User Name:"} {t?.systemMessage || "[System message]"}</p>
//                             <p className="text-base mt-1">{message.content}</p>
//                             <p className="text-xs text-gray-500 mt-1">
//                               {message.created_at.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
//                             </p>
//                           </div>
//                         ) : (
//                           <div className="bg-black dark:bg-white text-white dark:text-black rounded-lg p-3 max-w-xs">
//                             <p className="text-base text-gray-500 italic">{t?.adminMessage || "[Admin message]"}</p>
//                             <p className="text-base text-[#0066FF]">{t?.userEmail || "User Email:"} {t?.adminMessage || "[Admin message]"} {t?.admin || "Admin"}</p>
//                             <p className="text-base text-[#E32B2B]">{t?.userName || "User Name:"} {t?.adminMessage || "[Admin message]"}</p>
//                             <p className="text-base text-white">{replaceEmojis(message.content)}</p>
//                             <p className="text-xs text-gray-500 mt-1">
//                               {message.created_at.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       // <div className="bg-black text-white rounded-lg p-3 max-w-xs ml-auto">
//                       //   <p className="text-base">{message.content}</p>
//                       //   <p className="text-xs text-gray-300 mt-1">
//                       //     {message.timestamp.toLocaleTimeString()}
//                       //   </p>
//                       // </div>
//                       <div className="flex items-end justify-end space-x-2">
//                         <div className="bg-[#5B34FB] rounded-lg p-3 max-w-xs ml-auto">
//                           <p className="text-base text-gray-500 italic">{t?.userMessage || "[User message]"}</p>
//                             <p className="text-base text-[#0066FF]">{t?.userEmail || "User Email:"} {t?.userMessage || "[User message]"} {(message.users?.email)}</p>
//                             <p className="text-base text-[#E32B2B]">{t?.userName || "User Name:"} {t?.userMessage || "[User message]"} {(message.users?.name)}</p>
//                           <p className="text-base text-white">{replaceEmojis(message.content)}</p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             {message.created_at.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
//                           </p>
//                         </div>
//                         {/* <img
//                           src={getUiAvatarUrl(message.users?.name)}
//                           title={message.created_at.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
//                           alt={message.users?.name || "User"}
//                           className="w-8 h-8 rounded-full"
//                         /> */}
//                         <Image
//                           src={getUiAvatarUrl(message.users?.name)}
//                           title={message.created_at.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
//                           alt={message.users?.name || "User"}
//                           width={32} // must set width
//                           height={32} // must set height
//                           className="w-8 h-8 rounded-full" // 2rem
//                         />
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 {/* Typing indicator */}
//                 {isTyping && (
//                   <div className="flex items-start space-x-2">
//                     <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
//                       <span className="text-white dark:text-black text-xs font-bold">A</span>
//                     </div>
//                     <div className="bg-black dark:bg-white rounded-lg p-3">
//                       <p className="text-base text-white dark:text-black">{t?.typing || "Typing...."}</p>
//                     </div>
//                   </div>
//                 )}

//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Message Input */}
//               <div className="border-t border-gray-200 p-4">
//                 <form onSubmit={handleSendMessage} className="flex space-x-2">
//                   <Input
//                     value={inputMessage}
//                     onChange={handleInputChange}
//                     placeholder={isConnected ? (t?.typeMessage || "Type a message...") : (t?.connectingPlaceholder || "Connecting...")}
//                     disabled={!isConnected}
//                     className="flex-1"
//                   />
//                   <Button
//                     type="submit"
//                     disabled={!inputMessage.trim() || !isConnected}
//                     size="sm"
//                   >
//                     <Send className="h-4 w-4" />
//                   </Button>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   )
// }
