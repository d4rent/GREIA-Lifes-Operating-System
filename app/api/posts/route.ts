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

    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get posts with pagination
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { visibility: 'PUBLIC' },
          {
            visibility: 'FRIENDS',
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
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        media: true,
        likes: {
          where: {
            userId: session.user.id
          },
          take: 1
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            shares: true
          }
        }
      }
    })

    // Transform posts to include like status and counts
    const transformedPosts = posts.map((post) => ({
      ...post,
      isLiked: post.likes.length > 0,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      shareCount: post._count.shares,
      likes: undefined,
      _count: undefined
    }))

    return NextResponse.json(transformedPosts)
  } catch (error) {
    console.error('Error fetching posts:', error)
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
    const content = formData.get('content') as string
    const mediaFiles = formData.getAll('media') as File[]
    const visibility = formData.get('visibility') as 'PUBLIC' | 'FRIENDS' | 'PRIVATE' || 'PUBLIC'
    const location = formData.get('location') as string
    const hashtags = (formData.get('hashtags') as string || '').split(',').filter(Boolean)
    const mentions = (formData.get('mentions') as string || '').split(',').filter(Boolean)

    // Upload media files to S3
    const mediaPromises = mediaFiles.map(async (file) => {
      const { url } = await uploadToS3(file)
      return {
        type: file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
        url,
        thumbnail: file.type.startsWith('video/') ? url : undefined // Generate video thumbnail if needed
      }
    })

    const mediaResults = await Promise.all(mediaPromises)

    // Create post with media
    const post = await prisma.post.create({
      data: {
        content,
        visibility,
        location,
        hashtags,
        mentions,
        userId: session.user.id,
        media: {
          create: mediaResults.map((media, index) => ({
            ...media,
            order: index
          }))
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

    // Update user's post count
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        postCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
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
    const postId = searchParams.get('id')

    if (!postId) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Verify post ownership
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        userId: session.user.id
      }
    })

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete post and update counts
    await prisma.$transaction([
      prisma.post.delete({
        where: { id: postId }
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          postCount: {
            decrement: 1
          }
        }
      })
    ])

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}