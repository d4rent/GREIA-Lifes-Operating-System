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
      licenseType,
      licenseNumber,
      licenseExpiry,
      jurisdiction,
      companyName,
      companyAddress,
      taxId,
      insuranceInfo,
      verificationDocuments
    } = body

    // Validate required fields
    if (!licenseType || !licenseNumber || !licenseExpiry || !jurisdiction || !verificationDocuments?.length) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already has a verification submission
    const existingVerification = await prisma.professionalInfo.findUnique({
      where: { userId: session.user.id }
    })

    let professionalInfo

    if (existingVerification) {
      // Update existing verification
      professionalInfo = await prisma.professionalInfo.update({
        where: { userId: session.user.id },
        data: {
          licenseType,
          licenseNumber,
          licenseExpiry: new Date(licenseExpiry),
          jurisdiction,
          companyName,
          companyAddress,
          taxId,
          insuranceInfo,
          verificationDocuments,
          status: 'PENDING',
          submittedAt: new Date(),
          verifiedAt: null,
          verifiedBy: null,
          rejectionReason: null
        }
      })
    } else {
      // Create new verification
      professionalInfo = await prisma.professionalInfo.create({
        data: {
          userId: session.user.id,
          licenseType,
          licenseNumber,
          licenseExpiry: new Date(licenseExpiry),
          jurisdiction,
          companyName,
          companyAddress,
          taxId,
          insuranceInfo,
          verificationDocuments,
          status: 'PENDING'
        }
      })
    }

    // Update user verification status
    await prisma.user.update({
      where: { id: session.user.id },
      data: { verificationStatus: 'PENDING' }
    })

    // Create a notification for admins
    await prisma.message.create({
      data: {
        content: `New verification submission from ${session.user.email}`,
        senderId: session.user.id,
        // You would need to have a system admin user ID here
        receiverId: 'ADMIN_USER_ID',
      }
    })

    return NextResponse.json(professionalInfo, { status: 201 })
  } catch (error) {
    console.error('Error submitting verification:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}