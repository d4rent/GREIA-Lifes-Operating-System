'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/app/contexts/auth-context'
import { useChatContext } from '@/app/contexts/chat-context'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ChatRoom {
  id: string
  name?: string
  type: 'DIRECT' | 'GROUP'
  participants: {
    user: {
      id: string
      name: string
      image: string
    }
  }[]
  lastMessage?: {
    content: string
    createdAt: string
    sender: {
      name: string
    }
  }
  unreadCount: number
}

interface Message {
  id: string
  content: string
  type: 'TEXT' | 'IMAGE' | 'FILE'
  senderId: string
  createdAt: string
  fileUrl?: string
  fileName?: string
  fileType?: string
  sender: {
    name: string
    image: string
  }
  isRead: boolean
  readAt?: string
}

export default function ChatPage() {
  const { user } = useAuth()
  const { socket, connected, onlineUsers, typingUsers, sendMessage, markMessageAsRead, setTyping } = useChatContext()
  const router = useRouter()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadingFile, setUploadingFile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchChatRooms()
  }, [user])

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom)
    }
  }, [selectedRoom])

  useEffect(() => {
    if (socket) {
      socket.on('message', (message: Message) => {
        if (message.senderId !== user?.id) {
          markMessageAsRead(message.id, selectedRoom!)
        }
        setMessages((prev) => [...prev, message])
        scrollToBottom()
      })

      socket.on('messageRead', ({ userId, messageId }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, isRead: true, readAt: new Date().toISOString() }
              : msg
          )
        )
      })
    }

    return () => {
      if (socket) {
        socket.off('message')
        socket.off('messageRead')
      }
    }
  }, [socket, selectedRoom])

  const fetchChatRooms = async () => {
    try {
      const response = await fetch('/api/chat/rooms')
      if (!response.ok) throw new Error('Failed to fetch chat rooms')
      const data = await response.json()
      setChatRooms(data)
      setLoading(false)
    } catch (error) {
      setError('Error loading chat rooms')
      setLoading(false)
    }
  }

  const fetchMessages = async (roomId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?roomId=${roomId}`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()
      setMessages(data)
      scrollToBottom()
    } catch (error) {
      setError('Error loading messages')
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedRoom) return

    try {
      await sendMessage(selectedRoom, messageInput)
      setMessageInput('')
    } catch (error) {
      setError('Failed to send message')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedRoom) return

    setUploadingFile(true)
    try {
      await sendMessage(selectedRoom, '', file.type.startsWith('image/') ? 'IMAGE' : 'FILE', file)
    } catch (error) {
      setError('Failed to upload file')
    } finally {
      setUploadingFile(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(event.target.value)
    if (selectedRoom) {
      setTyping(selectedRoom, event.target.value.length > 0)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="h-screen flex">
      {/* Chat Rooms List */}
      <div className="w-1/4 border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Messages</h2>
          <div className="space-y-2">
            {chatRooms.map((room) => (
              <Card
                key={room.id}
                className={`cursor-pointer ${
                  selectedRoom === room.id ? 'bg-primary/10' : ''
                }`}
                onClick={() => setSelectedRoom(room.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={room.participants[0].user.image}
                        alt={room.name || room.participants[0].user.name}
                      />
                      <AvatarFallback>
                        {(room.name || room.participants[0].user.name)
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {room.name || room.participants[0].user.name}
                        </span>
                        {room.unreadCount > 0 && (
                          <Badge variant="default">{room.unreadCount}</Badge>
                        )}
                      </div>
                      {room.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {room.lastMessage.sender.name}: {room.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage
                    src={
                      chatRooms.find((r) => r.id === selectedRoom)?.participants[0]
                        .user.image
                    }
                    alt={
                      chatRooms.find((r) => r.id === selectedRoom)?.name ||
                      chatRooms.find((r) => r.id === selectedRoom)?.participants[0]
                        .user.name
                    }
                  />
                  <AvatarFallback>
                    {(
                      chatRooms.find((r) => r.id === selectedRoom)?.name ||
                      chatRooms.find((r) => r.id === selectedRoom)?.participants[0]
                        .user.name
                    )
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    {chatRooms.find((r) => r.id === selectedRoom)?.name ||
                      chatRooms.find((r) => r.id === selectedRoom)?.participants[0]
                        .user.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {onlineUsers.has(
                      chatRooms.find((r) => r.id === selectedRoom)?.participants[0]
                        .user.id!
                    )
                      ? 'Online'
                      : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === user?.id
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[70%] ${
                        message.senderId === user?.id ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={message.sender.image}
                          alt={message.sender.name}
                        />
                        <AvatarFallback>
                          {message.sender.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.senderId === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.type === 'TEXT' && (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                        {message.type === 'IMAGE' && (
                          <Image
                            src={message.fileUrl!}
                            alt="Image"
                            width={300}
                            height={200}
                            className="rounded"
                          />
                        )}
                        {message.type === 'FILE' && (
                          <a
                            href={message.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-blue-500 hover:underline"
                          >
                            <span>📎</span>
                            <span>{message.fileName}</span>
                          </a>
                        )}
                        <div className="mt-1 text-xs opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString()}
                          {message.senderId === user?.id && (
                            <span className="ml-2">
                              {message.isRead ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                >
                  📎
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <Input
                  value={messageInput}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
              {typingUsers.get(`${selectedRoom}-${user?.id}`) && (
                <p className="text-sm text-gray-500 mt-1">Typing...</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  )
}