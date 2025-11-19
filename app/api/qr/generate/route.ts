import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateQRCode, generateQRCodeBuffer, getProfileURL } from '@/lib/qrGenerator'

// GET: Generate QR code as data URL for display
export async function GET(request: Request) {
  try {
    const session = await requireAuth()

    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
      select: { username: true },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Generate profile URL
    const profileURL = getProfileURL(profile.username)

    // Get size from query params
    const { searchParams } = new URL(request.url)
    const size = parseInt(searchParams.get('size') || '300')

    // Generate QR code as data URL
    const qrCodeDataURL = await generateQRCode(profileURL, {
      size: size,
      errorCorrectionLevel: 'M',
    })

    return NextResponse.json({
      qrCode: qrCodeDataURL,
      profileURL: profileURL,
      username: profile.username,
    })
  } catch (error) {
    console.error('QR code generation error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}

// POST: Download QR code as PNG file
export async function POST(request: Request) {
  try {
    const session = await requireAuth()

    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
      select: { username: true },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Get size from request body
    const body = await request.json()
    const size = body.size || 600

    // Generate profile URL
    const profileURL = getProfileURL(profile.username)

    // Generate QR code as buffer
    const qrCodeBuffer = await generateQRCodeBuffer(profileURL, {
      size: size,
      errorCorrectionLevel: 'H', // Higher error correction for downloads
    })

    // Return as downloadable PNG
    return new NextResponse(qrCodeBuffer as any, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="mayimeetyou-${profile.username}-qr.png"`,
        'Content-Length': qrCodeBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('QR code download error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}
