'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './auth-context'

interface ChatContextType {
  socket: Socket | null
  connected: boolean
  onlineUsers: Set<string>
  typingUsers: Map<string, boolean>
  sendMessage: (chatRoomId: string, content: string, type?: string, file?: File) => Promise<void>
  markMessageAsRead: (chatRoomId: string, messageId: string) => void
  setTyping: (chatRoomId: string, isTyping: boolean) => void
}

const ChatContext = createContext<ChatContextType>({
  socket: null,
  connected: false,
  onlineUsers: new Set(),
  typingUsers: new Map(),
  sendMessage: async () => {},
  markMessageAsRead: () => {},
  setTyping: () => {},
})

export const useChatContext = () => useContext(ChatContext)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [typingUsers, setTypingUsers] = useState<Map<string, boolean>>(new Map())

  useEffect(() => {
    if (!user) return

    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      withCredentials: true,
    })

    socketInstance.on('connect', () => {
      setConnected(true)
    })

    socketInstance.on('disconnect', () => {
      setConnected(false)
    })

    // Handle user online/offline status
    socketInstance.on('userOnline', (userId: string) => {
      setOnlineUsers((prev) => new Set([...prev, userId]))
    })

    socketInstance.on('userOffline', (userId: string) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    })

    // Handle typing status
    socketInstance.on('userTyping', ({ userId, isTyping, chatRoomId }) => {
      setTypingUsers((prev) => {
        const newMap = new Map(prev)
        newMap.set(`${chatRoomId}-${userId}`, isTyping)
        return newMap
      })
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [user])

  const sendMessage = async (
    chatRoomId: string,
    content: string,
    type: string = 'TEXT',
    file?: File
  ) => {
    if (!socket) return

    let fileUrl = ''
    let fileName = ''
    let fileType = ''

    if (file) {
      // Upload file if provided
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload file')
      }

      const data = await response.json()
      fileUrl = data.url
      fileName = file.name
      fileType = file.type
    }

    socket.emit('message', {
      chatRoomId,
      content,
      type,
      fileUrl,
      fileName,
      fileType,
    })
  }

  const markMessageAsRead = (chatRoomId: string, messageId: string) => {
    if (!socket) return

    socket.emit('messageRead', {
      chatRoomId,
      messageId,
    })
  }

  const setTyping = (chatRoomId: string, isTyping: boolean) => {
    if (!socket) return

    socket.emit('typing', {
      chatRoomId,
      isTyping,
    })
  }

  return (
    <ChatContext.Provider
      value={{
        socket,
        connected,
        onlineUsers,
        typingUsers,
        sendMessage,
        markMessageAsRead,
        setTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}