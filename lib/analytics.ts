import { prisma } from '@/lib/prisma'

export function getVisitorIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }
  return 'unknown'
}

export async function shouldTrackEvent(
  profileId: string,
  type: string,
  visitorIp: string
): Promise<boolean> {
  if (visitorIp === 'unknown') return true

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const existing = await prisma.analyticsEvent.findFirst({
    where: {
      profileId,
      type,
      visitorIp,
      createdAt: { gte: twentyFourHoursAgo },
    },
  })

  return !existing
}

export async function trackEvent(
  profileId: string,
  type: string,
  visitorIp: string
): Promise<void> {
  await prisma.analyticsEvent.create({
    data: {
      profileId,
      type,
      visitorIp,
    },
  })
}
