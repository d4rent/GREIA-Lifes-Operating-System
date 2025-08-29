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

    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        lastMessage: {
          include: {
            sender: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Get unread counts for each room
    const roomsWithUnreadCount = await Promise.all(
      chatRooms.map(async (room) => {
        const userChatRoom = await prisma.userChatRoom.findUnique({
          where: {
            userId_chatRoomId: {
              userId: session.user.id,
              chatRoomId: room.id
            }
          },
          select: {
            unreadCount: true
          }
        })

        return {
          ...room,
          unreadCount: userChatRoom?.unreadCount || 0
        }
      })
    )

    return NextResponse.json(roomsWithUnreadCount)
  } catch (error) {
    console.error('Error fetching chat rooms:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { participantIds, type = 'DIRECT', name } = body

    // Validate participant IDs
    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json(
        { message: 'Invalid participants' },
        { status: 400 }
      )
    }

    // Add current user to participants if not included
    if (!participantIds.includes(session.user.id)) {
      participantIds.push(session.user.id)
    }

    // For direct chats, check if a chat room already exists
    if (type === 'DIRECT' && participantIds.length === 2) {
      const existingRoom = await prisma.chatRoom.findFirst({
        where: {
          type: 'DIRECT',
          AND: [
            {
              participants: {
                some: {
                  userId: participantIds[0]
                }
              }
            },
            {
              participants: {
                some: {
                  userId: participantIds[1]
                }
              }
            }
          ]
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true
                }
              }
            }
          }
        }
      })

      if (existingRoom) {
        return NextResponse.json(existingRoom)
      }
    }

    // Create new chat room
    const chatRoom = await prisma.chatRoom.create({
      data: {
        type,
        name,
        participants: {
          create: participantIds.map((userId) => ({
            userId,
            isAdmin: userId === session.user.id
          }))
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(chatRoom, { status: 201 })
  } catch (error) {
    console.error('Error creating chat room:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}