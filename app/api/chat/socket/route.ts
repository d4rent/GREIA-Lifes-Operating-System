import { NextResponse } from 'next/server'
import { Server as SocketIOServer } from 'socket.io'
import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export const config = {
  api: {
    bodyParser: false,
  },
}

interface SocketUser {
  userId: string
  socketId: string
}

let io: SocketIOServer | null = null
const connectedUsers = new Map<string, SocketUser>()

export async function GET(req: NextApiRequest) {
  if (!io) {
    const server = new NetServer()
    io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    })

    io.on('connection', async (socket) => {
      const session = await getServerSession(authOptions)
      if (!session?.user) {
        socket.disconnect()
        return
      }

      const userId = session.user.id

      // Store user connection
      connectedUsers.set(userId, {
        userId,
        socketId: socket.id,
      })

      // Join user's chat rooms
      const userChatRooms = await prisma.userChatRoom.findMany({
        where: { userId },
        select: { chatRoomId: true },
      })

      userChatRooms.forEach((room) => {
        socket.join(room.chatRoomId)
      })

      // Handle new message
      socket.on('message', async (data) => {
        try {
          const { chatRoomId, content, type, fileUrl, fileName, fileType } = data

          // Verify user is in chat room
          const userInRoom = await prisma.userChatRoom.findUnique({
            where: {
              userId_chatRoomId: {
                userId,
                chatRoomId,
              },
            },
          })

          if (!userInRoom) {
            socket.emit('error', 'Not authorized to send message to this room')
            return
          }

          // Create message
          const message = await prisma.chatMessage.create({
            data: {
              chatRoomId,
              senderId: userId,
              content,
              type,
              fileUrl,
              fileName,
              fileType,
            },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          })

          // Update chat room's last message
          await prisma.chatRoom.update({
            where: { id: chatRoomId },
            data: {
              lastMessageId: message.id,
              updatedAt: new Date(),
            },
          })

          // Update unread count for other participants
          await prisma.userChatRoom.updateMany({
            where: {
              chatRoomId,
              userId: {
                not: userId,
              },
            },
            data: {
              unreadCount: {
                increment: 1,
              },
            },
          })

          // Broadcast message to room
          io?.to(chatRoomId).emit('message', message)

          // Send notifications to offline users
          const roomParticipants = await prisma.userChatRoom.findMany({
            where: { chatRoomId },
            select: { userId: true },
          })

          for (const participant of roomParticipants) {
            if (
              participant.userId !== userId &&
              !connectedUsers.has(participant.userId)
            ) {
              // Create notification for offline user
              await prisma.notification.create({
                data: {
                  userId: participant.userId,
                  type: 'CHAT_MESSAGE',
                  title: `New message from ${session.user.name}`,
                  content: content.substring(0, 100),
                  data: {
                    chatRoomId,
                    messageId: message.id,
                  },
                },
              })
            }
          }
        } catch (error) {
          console.error('Error handling message:', error)
          socket.emit('error', 'Failed to send message')
        }
      })

      // Handle typing status
      socket.on('typing', (data) => {
        const { chatRoomId, isTyping } = data
        socket.to(chatRoomId).emit('userTyping', {
          userId,
          isTyping,
        })
      })

      // Handle read receipts
      socket.on('messageRead', async (data) => {
        try {
          const { chatRoomId, messageId } = data

          // Update message read status
          await prisma.chatMessage.update({
            where: { id: messageId },
            data: {
              isRead: true,
              readAt: new Date(),
            },
          })

          // Reset unread count for user
          await prisma.userChatRoom.update({
            where: {
              userId_chatRoomId: {
                userId,
                chatRoomId,
              },
            },
            data: {
              unreadCount: 0,
              lastReadAt: new Date(),
            },
          })

          // Broadcast read receipt
          socket.to(chatRoomId).emit('messageRead', {
            userId,
            messageId,
          })
        } catch (error) {
          console.error('Error handling read receipt:', error)
        }
      })

      // Handle disconnect
      socket.on('disconnect', () => {
        connectedUsers.delete(userId)
        // Broadcast user offline status
        io?.emit('userOffline', userId)
      })

      // Broadcast user online status
      io.emit('userOnline', userId)
    })

    server.listen(process.env.SOCKET_PORT || 3001)
  }

  return NextResponse.json({ success: true })
}