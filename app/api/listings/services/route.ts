import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { uploadToS3 } from '@/lib/s3'

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
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build filter conditions
    const where: any = {
      type: 'SERVICE',
      status: 'ACTIVE',
      ...(category && { category }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
      ...(location && {
        location: {
          contains: location,
          mode: 'insensitive'
        }
      })
    }

    // Get listings with pagination
    const listings = await prisma.liveListing.findMany({
      where,
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [
        { createdAt: 'desc' }
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        media: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error('Error fetching service listings:', error)
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

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const category = formData.get('category') as string
    const serviceType = formData.get('serviceType') as string
    const location = formData.get('location') as string
    const availability = JSON.parse(formData.get('availability') as string)
    const duration = parseInt(formData.get('duration') as string)
    const mediaFiles = formData.getAll('media') as File[]

    // Validate required fields
    if (!title || !description || !price || !category || !location || !availability || !duration) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Upload media files to S3
    const mediaPromises = mediaFiles.map(async (file, index) => {
      const { url } = await uploadToS3(file)
      return {
        type: file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
        url,
        thumbnail: file.type.startsWith('video/') ? url : undefined,
        order: index
      }
    })

    const mediaResults = await Promise.all(mediaPromises)

    // Create listing with media
    const listing = await prisma.liveListing.create({
      data: {
        title,
        description,
        price,
        type: 'SERVICE',
        category,
        serviceType,
        location,
        availability,
        duration,
        status: 'ACTIVE',
        userId: session.user.id,
        media: {
          create: mediaResults
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        media: true
      }
    })

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error('Error creating service listing:', error)
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
    const listingId = searchParams.get('id')

    if (!listingId) {
      return NextResponse.json(
        { message: 'Listing ID is required' },
        { status: 400 }
      )
    }

    // Verify listing ownership
    const listing = await prisma.liveListing.findUnique({
      where: {
        id: listingId,
        userId: session.user.id
      }
    })

    if (!listing) {
      return NextResponse.json(
        { message: 'Listing not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete listing
    await prisma.liveListing.delete({
      where: { id: listingId }
    })

    return NextResponse.json({ message: 'Listing deleted successfully' })
  } catch (error) {
    console.error('Error deleting service listing:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('id')

    if (!listingId) {
      return NextResponse.json(
        { message: 'Listing ID is required' },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const updates: any = {}

    // Only include fields that are present in the form data
    formData.forEach((value, key) => {
      if (key === 'price' || key === 'duration') {
        updates[key] = parseFloat(value as string)
      } else if (key === 'availability') {
        updates[key] = JSON.parse(value as string)
      } else if (key !== 'media') {
        updates[key] = value
      }
    })

    // Handle media updates if present
    const mediaFiles = formData.getAll('media') as File[]
    if (mediaFiles.length > 0) {
      const mediaPromises = mediaFiles.map(async (file, index) => {
        const { url } = await uploadToS3(file)
        return {
          type: file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
          url,
          thumbnail: file.type.startsWith('video/') ? url : undefined,
          order: index
        }
      })

      const mediaResults = await Promise.all(mediaPromises)

      // Delete existing media and create new ones
      await prisma.listingMedia.deleteMany({
        where: { listingId }
      })

      updates.media = {
        create: mediaResults
      }
    }

    // Update listing
    const listing = await prisma.liveListing.update({
      where: {
        id: listingId,
        userId: session.user.id
      },
      data: updates,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        media: true
      }
    })

    return NextResponse.json(listing)
  } catch (error) {
    console.error('Error updating service listing:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}