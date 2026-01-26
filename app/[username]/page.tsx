import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfileCard from '@/components/ProfileCard'

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params

  const profile = await prisma.profile.findUnique({
    where: { username },
    include: { user: { select: { name: true } } },
  })

  if (!profile) {
    return { title: 'Profile Not Found | MayIMeetYou.io' }
  }

  const title = `Meet ${profile.user.name} | MayIMeetYou.io`
  const description = profile.tagline || `${profile.user.name} wants to meet you. Say yes!`
  const image = profile.avatarUrl || '/og-default.png'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: [{ url: image, width: 1200, height: 630 }],
      siteName: 'MayIMeetYou.io',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params

  const profile = await prisma.profile.findUnique({
    where: { username },
    include: { user: { select: { name: true } } },
  })

  if (!profile) {
    notFound()
  }

  // Serialize for client component
  const profileData = {
    id: profile.id,
    username: profile.username,
    tagline: profile.tagline,
    avatarUrl: profile.avatarUrl,
    mainQuestionText: profile.mainQuestionText,
    thankYouMessage: profile.thankYouMessage,
    noMessage: profile.noMessage,
    socialInstagram: profile.socialInstagram,
    socialTwitter: profile.socialTwitter,
    socialLinkedIn: profile.socialLinkedIn,
    socialWebsite: profile.socialWebsite,
    contactEmail: profile.contactEmail,
    calendarUrl: profile.calendarUrl,
    whatsappNumber: profile.whatsappNumber,
    user: { name: profile.user.name },
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <ProfileCard profile={profileData} />
    </main>
  )
}
