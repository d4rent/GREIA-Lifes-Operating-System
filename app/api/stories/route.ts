import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
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

    // Get stories from followed users and own stories
    const stories = await prisma.post.findMany({
      where: {
        type: 'STORY',
        expiresAt: {
          gt: new Date()
        },
        OR: [
          {
            user: {
              followers: {
                some: {
                  followerId: session.user.id
                }
              }
            }
          },
          { userId: session.user.id }
        ]
      },
      orderBy: [
        {
          user: {
            followers: {
              _count: 'desc'
            }
          }
        },
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

    // Get viewed stories
    const viewedStories = await prisma.post.findMany({
      where: {
        type: 'STORY',
        viewCount: {
          gt: 0
        },
        userId: session.user.id
      },
      select: {
        id: true
      }
    })

    const viewedStoryIds = new Set(viewedStories.map(story => story.id))

    // Transform stories to include viewed status
    const transformedStories = stories.map(story => ({
      ...story,
      hasViewed: viewedStoryIds.has(story.id)
    }))

    return NextResponse.json(transformedStories)
  } catch (error) {
    console.error('Error fetching stories:', error)
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
    const mediaFile = formData.get('media') as File

    if (!mediaFile) {
      return NextResponse.json(
        { message: 'Media file is required' },
        { status: 400 }
      )
    }

    // Upload media to S3
    const { url } = await uploadToS3(mediaFile)

    // Create story post
    const story = await prisma.post.create({
      data: {
        type: 'STORY',
        content: '',
        visibility: 'PUBLIC',
        userId: session.user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        media: {
          create: {
            type: mediaFile.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
            url,
            thumbnail: mediaFile.type.startsWith('video/') ? url : undefined,
            order: 0
          }
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

    return NextResponse.json(story, { status: 201 })
  } catch (error) {
    console.error('Error creating story:', error)
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
    const storyId = searchParams.get('id')

    if (!storyId) {
      return NextResponse.json(
        { message: 'Story ID is required' },
        { status: 400 }
      )
    }

    // Verify story ownership
    const story = await prisma.post.findUnique({
      where: {
        id: storyId,
        userId: session.user.id,
        type: 'STORY'
      }
    })

    if (!story) {
      return NextResponse.json(
        { message: 'Story not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete story
    await prisma.post.delete({
      where: { id: storyId }
    })

    return NextResponse.json({ message: 'Story deleted successfully' })
  } catch (error) {
    console.error('Error deleting story:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mark story as viewed
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
    const storyId = searchParams.get('id')

    if (!storyId) {
      return NextResponse.json(
        { message: 'Story ID is required' },
        { status: 400 }
      )
    }

    // Update story view count
    await prisma.post.update({
      where: {
        id: storyId,
        type: 'STORY'
      },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ message: 'Story marked as viewed' })
  } catch (error) {
    console.error('Error marking story as viewed:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}