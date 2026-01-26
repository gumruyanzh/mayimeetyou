'use client'

import { useState, useEffect } from 'react'
import {
  InstagramIcon,
  TwitterIcon,
  LinkedInIcon,
  GlobeIcon,
  EmailIcon,
  CalendarIcon,
  WhatsAppIcon,
} from './SocialIcons'

interface ProfileData {
  id: string
  username: string
  tagline: string | null
  avatarUrl: string | null
  mainQuestionText: string
  thankYouMessage: string | null
  noMessage: string | null
  socialInstagram: string | null
  socialTwitter: string | null
  socialLinkedIn: string | null
  socialWebsite: string | null
  contactEmail: string | null
  calendarUrl: string | null
  whatsappNumber: string | null
  user: {
    name: string
  }
}

interface ProfileCardProps {
  profile: ProfileData
  previewMode?: boolean
  previewState?: 'question' | 'yes' | 'no'
}

type Phase = 'question' | 'exiting' | 'yes' | 'no'

export default function ProfileCard({ profile, previewMode = false, previewState }: ProfileCardProps) {
  const [phase, setPhase] = useState<Phase>('question')
  const [visitTracked, setVisitTracked] = useState(false)

  // For preview mode, sync with external state
  useEffect(() => {
    if (previewMode && previewState) {
      setPhase(previewState)
    }
  }, [previewMode, previewState])

  // Track visit on mount (non-preview only)
  useEffect(() => {
    if (!previewMode && !visitTracked) {
      fetch(`/api/profile/${profile.username}/visit`, { method: 'POST' }).catch(() => {})
      setVisitTracked(true)
    }
  }, [profile.username, previewMode, visitTracked])

  const handleYesClick = () => {
    setPhase('exiting')
    setTimeout(() => setPhase('yes'), 300)

    if (!previewMode) {
      fetch(`/api/profile/${profile.username}/yes`, { method: 'POST' }).catch(() => {})
    }
  }

  const handleNoClick = () => {
    setPhase('exiting')
    setTimeout(() => setPhase('no'), 300)

    if (!previewMode) {
      fetch(`/api/profile/${profile.username}/no`, { method: 'POST' }).catch(() => {})
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatSocialLink = (platform: string, value: string) => {
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value
    }
    const handle = value.replace('@', '')
    switch (platform) {
      case 'instagram':
        return `https://instagram.com/${handle}`
      case 'twitter':
        return `https://x.com/${handle}`
      default:
        return value
    }
  }

  const socialLinks = [
    { key: 'instagram', value: profile.socialInstagram, icon: InstagramIcon, label: 'Instagram', href: profile.socialInstagram ? formatSocialLink('instagram', profile.socialInstagram) : '' },
    { key: 'twitter', value: profile.socialTwitter, icon: TwitterIcon, label: 'X / Twitter', href: profile.socialTwitter ? formatSocialLink('twitter', profile.socialTwitter) : '' },
    { key: 'linkedin', value: profile.socialLinkedIn, icon: LinkedInIcon, label: 'LinkedIn', href: profile.socialLinkedIn || '' },
    { key: 'website', value: profile.socialWebsite, icon: GlobeIcon, label: 'Website', href: profile.socialWebsite || '' },
    { key: 'email', value: profile.contactEmail, icon: EmailIcon, label: 'Send Email', href: profile.contactEmail ? `mailto:${profile.contactEmail}` : '' },
    { key: 'calendar', value: profile.calendarUrl, icon: CalendarIcon, label: 'Schedule a Time', href: profile.calendarUrl || '' },
    { key: 'whatsapp', value: profile.whatsappNumber, icon: WhatsAppIcon, label: 'WhatsApp', href: profile.whatsappNumber ? `https://wa.me/${profile.whatsappNumber.replace(/[^0-9]/g, '')}` : '' },
  ].filter((l) => l.value)

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface rounded-2xl shadow-soft-xl p-8 border border-border">
        <div className="text-center space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.user.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-surface-alt"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-[#B8654A] rounded-full flex items-center justify-center text-white text-3xl font-bold ring-4 ring-surface-alt">
                {getInitials(profile.user.name)}
              </div>
            )}
          </div>

          {/* Name and Tagline */}
          <div>
            <h1 className="text-2xl font-serif font-bold text-text-primary">
              Hi, I&apos;m {profile.user.name}
            </h1>
            {profile.tagline && (
              <p className="text-text-secondary mt-2">{profile.tagline}</p>
            )}
          </div>

          {/* Question Phase */}
          {phase === 'question' && (
            <div className="animate-fade-in">
              <div className="py-4">
                <p className="text-xl font-semibold text-text-primary">
                  {profile.mainQuestionText}
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleYesClick}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary-hover transition-all hover:shadow-glow active:scale-[0.98]"
                >
                  Yes, you may
                </button>
                <button
                  onClick={handleNoClick}
                  className="w-full border-2 border-border-strong text-text-secondary py-3.5 rounded-xl font-semibold hover:border-primary hover:text-primary transition-all active:scale-[0.98]"
                >
                  No, sorry
                </button>
              </div>
            </div>
          )}

          {/* Exiting Phase */}
          {phase === 'exiting' && (
            <div className="py-8 opacity-0 transition-opacity duration-300" />
          )}

          {/* Yes Phase */}
          {phase === 'yes' && (
            <div className="animate-fade-in-up">
              <div className="py-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4 animate-heart-beat">
                  <svg className="w-7 h-7 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <p className="text-lg text-text-primary mb-6">
                  {profile.thankYouMessage ||
                    'Thanks for saying yes! Feel free to connect with me:'}
                </p>

                {/* Social Links */}
                <div className="space-y-2.5">
                  {socialLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <a
                        key={link.key}
                        href={link.href}
                        target={link.key === 'email' ? undefined : '_blank'}
                        rel={link.key === 'email' ? undefined : 'noopener noreferrer'}
                        className={`opacity-0 animate-fade-in-up stagger-${index + 1} flex items-center justify-center gap-2.5 w-full bg-surface-alt hover:bg-bg-alt text-text-primary py-3 rounded-xl font-medium transition-all hover:shadow-soft border border-border`}
                      >
                        <Icon className="w-5 h-5" />
                        {link.label}
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* No Phase */}
          {phase === 'no' && (
            <div className="animate-fade-in py-4">
              <p className="text-lg text-text-secondary">
                {profile.noMessage || 'Fair enough. Respect.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Branding */}
      {!previewMode && (
        <div className="text-center mt-8">
          <p className="text-sm text-text-tertiary">
            Powered by{' '}
            <a href="/" className="text-primary hover:text-primary-hover font-medium transition-colors">
              MayIMeetYou.io
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
