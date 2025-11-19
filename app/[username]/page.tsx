'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'

interface Profile {
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
  user: {
    name: string
  }
}

type PageProps = {
  params: { username: string }
}

export default function ProfilePage({ params }: PageProps) {
  const { username } = params
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showResponse, setShowResponse] = useState<'yes' | 'no' | null>(null)
  const [visitTracked, setVisitTracked] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [username])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${username}`)

      if (!response.ok) {
        setLoading(false)
        return
      }

      const data = await response.json()
      setProfile(data)
      setLoading(false)

      // Track visit (only once per page load)
      if (!visitTracked) {
        trackVisit()
        setVisitTracked(true)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setLoading(false)
    }
  }

  const trackVisit = async () => {
    try {
      await fetch(`/api/profile/${username}/visit`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Error tracking visit:', error)
    }
  }

  const handleYesClick = async () => {
    setShowResponse('yes')

    try {
      await fetch(`/api/profile/${username}/yes`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Error tracking yes click:', error)
    }
  }

  const handleNoClick = async () => {
    setShowResponse('no')

    try {
      await fetch(`/api/profile/${username}/no`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Error tracking no click:', error)
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
    // If already a full URL, return as is
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value
    }

    // Handle @username format
    const username = value.replace('@', '')

    switch (platform) {
      case 'instagram':
        return `https://instagram.com/${username}`
      case 'twitter':
        return `https://x.com/${username}`
      default:
        return value
    }
  }

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  if (!profile) {
    notFound()
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center space-y-6">
            {/* Avatar */}
            <div className="flex justify-center">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {getInitials(profile.user.name)}
                </div>
              )}
            </div>

            {/* Name and Tagline */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hi, I'm {profile.user.name}
              </h1>
              {profile.tagline && (
                <p className="text-gray-600 mt-2">{profile.tagline}</p>
              )}
            </div>

            {/* Main Question or Response */}
            {!showResponse ? (
              <>
                {/* Question */}
                <div className="py-4">
                  <p className="text-xl font-semibold text-gray-900">
                    {profile.mainQuestionText}
                  </p>
                </div>

                {/* Yes/No Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleYesClick}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Yes, you may
                  </button>
                  <button
                    onClick={handleNoClick}
                    className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors"
                  >
                    No, sorry
                  </button>
                </div>
              </>
            ) : showResponse === 'yes' ? (
              <>
                {/* Thank You Message */}
                <div className="py-4">
                  <p className="text-lg text-gray-900 mb-6">
                    {profile.thankYouMessage ||
                      'Thanks for saying yes! Feel free to connect with me:'}
                  </p>

                  {/* Social Links */}
                  <div className="space-y-3">
                    {profile.socialInstagram && (
                      <a
                        href={formatSocialLink('instagram', profile.socialInstagram)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors"
                      >
                        Instagram
                      </a>
                    )}

                    {profile.socialTwitter && (
                      <a
                        href={formatSocialLink('twitter', profile.socialTwitter)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                      >
                        X / Twitter
                      </a>
                    )}

                    {profile.socialLinkedIn && (
                      <a
                        href={profile.socialLinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}

                    {profile.socialWebsite && (
                      <a
                        href={profile.socialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                      >
                        Website
                      </a>
                    )}

                    {profile.contactEmail && (
                      <a
                        href={`mailto:${profile.contactEmail}`}
                        className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        Send Email
                      </a>
                    )}

                    {profile.calendarUrl && (
                      <a
                        href={profile.calendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                      >
                        Schedule a Time
                      </a>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* No Message */}
                <div className="py-4">
                  <p className="text-lg text-gray-700">
                    {profile.noMessage || 'Fair enough. Respect 🫡'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Branding */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Powered by{' '}
            <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              MayIMeetYou.io
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
