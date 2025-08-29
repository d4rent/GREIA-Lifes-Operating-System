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

    // Get user's portfolio
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: session.user.id }
    })

    if (!portfolio) {
      return NextResponse.json(
        { message: 'Portfolio not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      category,
      images,
      videos,
      client,
      location,
      completedAt,
      duration,
      materials,
      techniques,
      dimensions,
      beforeImages,
      afterImages
    } = body

    // Validate required fields
    if (!title || !category) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        portfolioId: portfolio.id,
        title,
        description,
        category,
        images,
        videos,
        client,
        location,
        completedAt: completedAt ? new Date(completedAt) : null,
        duration,
        materials,
        techniques,
        dimensions,
        beforeImages,
        afterImages
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
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
      title,
      description,
      category,
      images,
      videos,
      client,
      location,
      completedAt,
      duration,
      materials,
      techniques,
      dimensions,
      beforeImages,
      afterImages
    } = body

    if (!id) {
      return NextResponse.json(
        { message: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Verify the project belongs to the user's portfolio
    const project = await prisma.project.findFirst({
      where: {
        id,
        portfolio: {
          userId: session.user.id
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      )
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        category,
        images,
        videos,
        client,
        location,
        completedAt: completedAt ? new Date(completedAt) : null,
        duration,
        materials,
        techniques,
        dimensions,
        beforeImages,
        afterImages
      }
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
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
    const projectId = searchParams.get('id')

    if (!projectId) {
      return NextResponse.json(
        { message: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Verify the project belongs to the user's portfolio
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        portfolio: {
          userId: session.user.id
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      )
    }

    await prisma.project.delete({
      where: { id: projectId }
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}