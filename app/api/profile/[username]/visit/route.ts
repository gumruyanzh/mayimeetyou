import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getVisitorIp, shouldTrackEvent, trackEvent } from '@/lib/analytics'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    const visitorIp = getVisitorIp(request)

    const profile = await prisma.profile.findUnique({
      where: { username },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const shouldTrack = await shouldTrackEvent(profile.id, 'visit', visitorIp)

    if (shouldTrack) {
      await Promise.all([
        prisma.profile.update({
          where: { username },
          data: { analyticsVisits: { increment: 1 } },
        }),
        trackEvent(profile.id, 'visit', visitorIp),
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Visit tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    )
  }
}
