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

    const userId = session.user.id
    const userRole = session.user.role

    let stats = {
      totalBookings: 0,
      totalProperties: 0,
      totalRevenue: 0,
      recentBookings: [],
      upcomingStays: []
    }

    if (userRole === 'HOST') {
      // Get host statistics
      const [
        bookingsCount,
        propertiesCount,
        revenue,
        recentBookings,
        upcomingBookings
      ] = await Promise.all([
        prisma.booking.count({
          where: {
            property: {
              ownerId: userId
            }
          }
        }),
        prisma.property.count({
          where: {
            ownerId: userId
          }
        }),
        prisma.booking.aggregate({
          where: {
            property: {
              ownerId: userId
            },
            status: 'COMPLETED'
          },
          _sum: {
            totalPrice: true
          }
        }),
        prisma.booking.findMany({
          where: {
            property: {
              ownerId: userId
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5,
          include: {
            property: {
              select: {
                title: true
              }
            }
          }
        }),
        prisma.booking.findMany({
          where: {
            property: {
              ownerId: userId
            },
            startDate: {
              gte: new Date()
            }
          },
          orderBy: {
            startDate: 'asc'
          },
          take: 5,
          include: {
            property: {
              select: {
                title: true
              }
            }
          }
        })
      ])

      stats = {
        totalBookings: bookingsCount,
        totalProperties: propertiesCount,
        totalRevenue: revenue._sum.totalPrice || 0,
        recentBookings,
        upcomingStays: upcomingBookings
      }
    } else {
      // Get user statistics
      const [
        bookingsCount,
        recentStays,
        upcomingStays
      ] = await Promise.all([
        prisma.booking.count({
          where: {
            userId
          }
        }),
        prisma.booking.findMany({
          where: {
            userId,
            endDate: {
              lte: new Date()
            }
          },
          orderBy: {
            endDate: 'desc'
          },
          take: 5,
          include: {
            property: {
              select: {
                title: true
              }
            }
          }
        }),
        prisma.booking.findMany({
          where: {
            userId,
            startDate: {
              gte: new Date()
            }
          },
          orderBy: {
            startDate: 'asc'
          },
          take: 5,
          include: {
            property: {
              select: {
                title: true
              }
            }
          }
        })
      ])

      stats = {
        totalBookings: bookingsCount,
        totalProperties: 0,
        totalRevenue: 0,
        recentBookings: recentStays,
        upcomingStays
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}