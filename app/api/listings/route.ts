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

    // Check user's verification status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        professionalInfo: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Verify user has appropriate permissions
    if (user.verificationStatus !== 'VERIFIED') {
      return NextResponse.json(
        { message: 'Professional verification required to create listings' },
        { status: 403 }
      )
    }

    // Check if license is expired
    if (user.professionalInfo && new Date(user.professionalInfo.licenseExpiry) < new Date()) {
      return NextResponse.json(
        { message: 'Professional license has expired' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      type,
      title,
      description,
      price,
      currency,
      location,
      features,
      images,
      category
    } = body

    // Validate required fields
    if (!type || !title || !price || !currency || !location) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate listing type based on user role
    const allowedTypes = {
      AGENT: ['RENTAL', 'SALE'],
      BROKER: ['RENTAL', 'SALE'],
      PROPERTY_MANAGER: ['RENTAL', 'SERVICE'],
      SERVICE_PROVIDER: ['SERVICE']
    }

    const userRole = user.role as keyof typeof allowedTypes
    if (!allowedTypes[userRole]?.includes(type)) {
      return NextResponse.json(
        { message: 'Unauthorized listing type for your role' },
        { status: 403 }
      )
    }

    const listing = await prisma.listing.create({
      data: {
        type,
        title,
        description,
        price,
        currency,
        location,
        features,
        images,
        category,
        ownerId: session.user.id,
        status: 'ACTIVE'
      }
    })

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')
    const ownerId = searchParams.get('ownerId')
    const status = searchParams.get('status')

    // Build filter conditions
    const where: any = { status: status || 'ACTIVE' }
    if (type) where.type = type
    if (category) where.category = category
    if (location) where.location = { contains: location, mode: 'insensitive' }
    if (ownerId) where.ownerId = ownerId
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            verificationStatus: true,
            professionalInfo: {
              select: {
                licenseType: true,
                licenseNumber: true,
                jurisdiction: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}