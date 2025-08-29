import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

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
    const {
      type,
      message,
      listingId,
      receiverId
    } = body

    // Validate required fields
    if (!type || !message || !listingId || !receiverId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        type,
        message,
        listingId,
        creatorId: session.user.id,
        receiverId,
        status: 'PENDING'
      },
      include: {
        listing: {
          select: {
            title: true,
            type: true
          }
        },
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Create a notification message for the receiver
    await prisma.message.create({
      data: {
        content: `New ${type.toLowerCase().replace('_', ' ')} for "${inquiry.listing.title}" from ${inquiry.creator.name}`,
        senderId: session.user.id,
        receiverId
      }
    })

    // If it's a direct booking or purchase request, create a transaction
    if (type === 'BOOKING_REQUEST' || type === 'PURCHASE_INTENT') {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId }
      })

      if (listing) {
        await prisma.transaction.create({
          data: {
            type: listing.type === 'RENTAL' ? 'RENTAL' :
                  listing.type === 'SERVICE' ? 'SERVICE' :
                  listing.type === 'TICKET' ? 'TICKET' : 'SALE',
            status: 'PENDING',
            amount: listing.price,
            currency: listing.currency,
            listingId,
            userId: session.user.id,
            inquiryId: inquiry.id
          }
        })

        // Update inquiry status to CONVERTED
        await prisma.inquiry.update({
          where: { id: inquiry.id },
          data: { status: 'CONVERTED' }
        })
      }
    }

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const listingId = searchParams.get('listingId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // Build filter conditions
    const where: any = {
      OR: [
        { creatorId: session.user.id },
        { receiverId: session.user.id }
      ]
    }

    if (listingId) where.listingId = listingId
    if (status) where.status = status
    if (type) where.type = type

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        listing: {
          select: {
            title: true,
            type: true,
            price: true,
            currency: true
          }
        },
        creator: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        receiver: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        transaction: {
          select: {
            id: true,
            status: true,
            amount: true,
            currency: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}