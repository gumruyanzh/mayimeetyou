import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PUT(request: Request) {
  try {
    // Require authentication
    const session = await requireAuth()

    const body = await request.json()
    const {
      name,
      tagline,
      avatarUrl,
      mainQuestionText,
      thankYouMessage,
      noMessage,
      socialInstagram,
      socialTwitter,
      socialLinkedIn,
      socialWebsite,
      contactEmail,
      calendarUrl,
    } = body

    // Update user name if provided
    if (name) {
      await prisma.user.update({
        where: { id: session.userId },
        data: { name },
      })
    }

    // Update profile
    const profile = await prisma.profile.update({
      where: { userId: session.userId },
      data: {
        tagline: tagline || null,
        avatarUrl: avatarUrl || null,
        mainQuestionText: mainQuestionText || 'May I meet you?',
        thankYouMessage: thankYouMessage || null,
        noMessage: noMessage || null,
        socialInstagram: socialInstagram || null,
        socialTwitter: socialTwitter || null,
        socialLinkedIn: socialLinkedIn || null,
        socialWebsite: socialWebsite || null,
        contactEmail: contactEmail || null,
        calendarUrl: calendarUrl || null,
      },
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile,
    })
  } catch (error) {
    console.error('Profile update error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
