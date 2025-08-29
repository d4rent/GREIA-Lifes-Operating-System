import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

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

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: session.user.id },
      include: {
        projects: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!portfolio) {
      // Create a new portfolio if one doesn't exist
      const newPortfolio = await prisma.portfolio.create({
        data: {
          userId: session.user.id,
          specialties: [],
        },
        include: {
          projects: true,
          reviews: {
            include: {
              reviewer: {
                select: {
                  name: true,
                  image: true
                }
              }
            }
          }
        }
      })
      return NextResponse.json(newPortfolio)
    }

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
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
      title,
      description,
      specialties,
      experience,
      website,
      instagram,
      linkedin,
      facebook
    } = body

    const portfolio = await prisma.portfolio.upsert({
      where: { userId: session.user.id },
      update: {
        title,
        description,
        specialties,
        experience,
        website,
        instagram,
        linkedin,
        facebook
      },
      create: {
        userId: session.user.id,
        title,
        description,
        specialties: specialties || [],
        experience,
        website,
        instagram,
        linkedin,
        facebook
      }
    })

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error updating portfolio:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}