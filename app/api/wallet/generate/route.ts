import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateWalletPass, isWalletConfigured } from '@/lib/walletPassGenerator'
import { getProfileURL } from '@/lib/qrGenerator'

export async function POST(request: Request) {
  try {
    // Check if Apple Wallet is configured
    if (!isWalletConfigured()) {
      return NextResponse.json(
        {
          error: 'Apple Wallet is not configured',
          message:
            'Apple Developer certificates are required. Please contact support.',
        },
        { status: 503 }
      )
    }

    const session = await requireAuth()

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { profile: true },
    })

    if (!user || !user.profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Prepare pass data
    const profileURL = getProfileURL(user.profile.username)

    const passData = {
      username: user.profile.username,
      name: user.name,
      tagline: user.profile.tagline,
      profileURL: profileURL,
    }

    // Generate wallet pass
    const passBuffer = await generateWalletPass(passData)

    // Return as downloadable .pkpass file
    return new NextResponse(passBuffer as any, {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="mayimeetyou-${user.profile.username}.pkpass"`,
        'Content-Length': passBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Wallet pass generation error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to generate wallet pass',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// GET: Check if wallet is configured
export async function GET() {
  const configured = isWalletConfigured()

  return NextResponse.json({
    configured,
    message: configured
      ? 'Apple Wallet is configured and ready'
      : 'Apple Wallet requires configuration',
  })
}
