import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status, rejectionReason } = body

    // Validate status
    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      )
    }

    // If rejecting, require a reason
    if (status === 'REJECTED' && !rejectionReason) {
      return NextResponse.json(
        { message: 'Rejection reason is required' },
        { status: 400 }
      )
    }

    // Get the verification
    const verification = await prisma.professionalInfo.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    })

    if (!verification) {
      return NextResponse.json(
        { message: 'Verification not found' },
        { status: 404 }
      )
    }

    // Update verification and user status
    const [updatedVerification] = await prisma.$transaction([
      prisma.professionalInfo.update({
        where: { id: params.id },
        data: {
          status,
          rejectionReason: status === 'REJECTED' ? rejectionReason : null,
          verifiedAt: status === 'VERIFIED' ? new Date() : null,
          verifiedBy: status === 'VERIFIED' ? session.user.id : null
        }
      }),
      prisma.user.update({
        where: { id: verification.user.id },
        data: {
          verificationStatus: status,
          role: status === 'VERIFIED' ? 
            verification.licenseType === 'REAL_ESTATE_BROKER' ? 'BROKER' :
            verification.licenseType === 'REAL_ESTATE_AGENT' ? 'AGENT' :
            verification.licenseType === 'PROPERTY_MANAGER' ? 'PROPERTY_MANAGER' :
            'SERVICE_PROVIDER'
            : 'USER'
        }
      })
    ])

    // Send notification to user
    await prisma.message.create({
      data: {
        content: status === 'VERIFIED' ?
          'Your professional verification has been approved! You can now create listings.' :
          `Your professional verification was rejected. Reason: ${rejectionReason}`,
        senderId: session.user.id,
        receiverId: verification.user.id
      }
    })

    return NextResponse.json(updatedVerification)
  } catch (error) {
    console.error('Error updating verification:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}