import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

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
      portfolioId,
      rating,
      comment,
      images,
      verified
    } = body

    // Validate required fields
    if (!portfolioId || !rating) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if portfolio exists
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId }
    })

    if (!portfolio) {
      return NextResponse.json(
        { message: 'Portfolio not found' },
        { status: 404 }
      )
    }

    // Prevent self-reviews
    if (portfolio.userId === session.user.id) {
      return NextResponse.json(
        { message: 'Cannot review your own portfolio' },
        { status: 400 }
      )
    }

    // Check if user has already reviewed this portfolio
    const existingReview = await prisma.review.findFirst({
      where: {
        portfolioId,
        reviewerId: session.user.id
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { message: 'You have already reviewed this portfolio' },
        { status: 400 }
      )
    }

    const review = await prisma.review.create({
      data: {
        portfolioId,
        reviewerId: session.user.id,
        rating,
        comment,
        images: images || [],
        verified: verified || false
      }
    })

    // Update portfolio average rating
    const reviews = await prisma.review.findMany({
      where: { portfolioId }
    })

    const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length

    await prisma.portfolio.update({
      where: { id: portfolioId },
      data: { avgRating }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
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
    const reviewId = searchParams.get('id')

    if (!reviewId) {
      return NextResponse.json(
        { message: 'Review ID is required' },
        { status: 400 }
      )
    }

    // Verify the review belongs to the user
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        reviewerId: session.user.id
      }
    })

    if (!review) {
      return NextResponse.json(
        { message: 'Review not found' },
        { status: 404 }
      )
    }

    await prisma.review.delete({
      where: { id: reviewId }
    })

    // Update portfolio average rating
    const reviews = await prisma.review.findMany({
      where: { portfolioId: review.portfolioId }
    })

    const avgRating = reviews.length > 0
      ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
      : null

    await prisma.portfolio.update({
      where: { id: review.portfolioId },
      data: { avgRating }
    })

    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Error deleting review:', error)
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

    const body = await request.json()
    const {
      id,
      rating,
      comment,
      images
    } = body

    if (!id) {
      return NextResponse.json(
        { message: 'Review ID is required' },
        { status: 400 }
      )
    }

    // Verify the review belongs to the user
    const existingReview = await prisma.review.findFirst({
      where: {
        id,
        reviewerId: session.user.id
      }
    })

    if (!existingReview) {
      return NextResponse.json(
        { message: 'Review not found' },
        { status: 404 }
      )
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { message: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: rating || existingReview.rating,
        comment,
        images: images || existingReview.images
      }
    })

    // Update portfolio average rating
    const reviews = await prisma.review.findMany({
      where: { portfolioId: existingReview.portfolioId }
    })

    const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length

    await prisma.portfolio.update({
      where: { id: existingReview.portfolioId },
      data: { avgRating }
    })

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}