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
    const type = searchParams.get('type')
    const propertyType = searchParams.get('propertyType')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const furnished = searchParams.get('furnished')
    const location = searchParams.get('location')
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build filter conditions
    const where: any = {
      type: 'PROPERTY',
      status: 'ACTIVE',
      ...(type && { propertyType: type }),
      ...(propertyType && { propertyType }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
      ...(bedrooms && { bedrooms: { gte: parseInt(bedrooms) } }),
      ...(bathrooms && { bathrooms: { gte: parseInt(bathrooms) } }),
      ...(furnished && { furnished: furnished === 'true' }),
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
    console.error('Error fetching property listings:', error)
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
    const type = formData.get('type') as string
    const propertyType = formData.get('propertyType') as string
    const bedrooms = parseInt(formData.get('bedrooms') as string)
    const bathrooms = parseInt(formData.get('bathrooms') as string)
    const area = parseFloat(formData.get('area') as string)
    const furnished = formData.get('furnished') === 'true'
    const location = formData.get('location') as string
    const mediaFiles = formData.getAll('media') as File[]

    // Validate required fields
    if (!title || !description || !price || !type || !location) {
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
        type: 'PROPERTY',
        category: type,
        propertyType,
        bedrooms,
        bathrooms,
        area,
        furnished,
        location,
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
    console.error('Error creating property listing:', error)
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
    console.error('Error deleting property listing:', error)
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
      if (key === 'price' || key === 'bedrooms' || key === 'bathrooms' || key === 'area') {
        updates[key] = parseFloat(value as string)
      } else if (key === 'furnished') {
        updates[key] = value === 'true'
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
    console.error('Error updating property listing:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}