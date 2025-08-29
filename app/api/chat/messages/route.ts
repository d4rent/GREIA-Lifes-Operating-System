import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before')

    if (!roomId) {
      return NextResponse.json(
        { message: 'Room ID is required' },
        { status: 400 }
      )
    }

    // Verify user is in chat room
    const userInRoom = await prisma.userChatRoom.findUnique({
      where: {
        userId_chatRoomId: {
          userId: session.user.id,
          chatRoomId: roomId
        }
      }
    })

    if (!userInRoom) {
      return NextResponse.json(
        { message: 'Not authorized to access this chat room' },
        { status: 403 }
      )
    }

    // Fetch messages with pagination
    const messages = await prisma.chatMessage.findMany({
      where: {
        chatRoomId: roomId,
        ...(before && {
          createdAt: {
            lt: new Date(before)
          }
        })
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // Mark messages as read
    await prisma.chatMessage.updateMany({
      where: {
        chatRoomId: roomId,
        senderId: {
          not: session.user.id
        },
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    // Reset unread count for user
    await prisma.userChatRoom.update({
      where: {
        userId_chatRoomId: {
          userId: session.user.id,
          chatRoomId: roomId
        }
      },
      data: {
        unreadCount: 0,
        lastReadAt: new Date()
      }
    })

    return NextResponse.json(messages.reverse())
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('id')

    if (!messageId) {
      return NextResponse.json(
        { message: 'Message ID is required' },
        { status: 400 }
      )
    }

    // Verify message belongs to user
    const message = await prisma.chatMessage.findFirst({
      where: {
        id: messageId,
        senderId: session.user.id
      }
    })

    if (!message) {
      return NextResponse.json(
        { message: 'Message not found or not authorized to delete' },
        { status: 404 }
      )
    }

    // Delete message
    await prisma.chatMessage.delete({
      where: { id: messageId }
    })

    // Update last message in chat room if needed
    const lastMessage = await prisma.chatMessage.findFirst({
      where: { chatRoomId: message.chatRoomId },
      orderBy: { createdAt: 'desc' }
    })

    if (lastMessage) {
      await prisma.chatRoom.update({
        where: { id: message.chatRoomId },
        data: { lastMessageId: lastMessage.id }
      })
    }

    return NextResponse.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}