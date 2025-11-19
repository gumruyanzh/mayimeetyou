'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import AddToWalletButton from '@/components/AddToWalletButton'

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
  analyticsVisits: number
  analyticsYes: number
  analyticsNo: number
}

interface User {
  id: string
  name: string
  email: string
  profile: Profile
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    avatarUrl: '',
    mainQuestionText: '',
    thankYouMessage: '',
    noMessage: '',
    socialInstagram: '',
    socialTwitter: '',
    socialLinkedIn: '',
    socialWebsite: '',
    contactEmail: '',
    calendarUrl: '',
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()

      if (!data.user) {
        router.push('/auth/login')
        return
      }

      // Fetch full profile data
      const profileResponse = await fetch(`/api/profile/${data.user.username}`)
      const profileData = await profileResponse.json()

      if (profileData.error) {
        setError('Failed to load profile')
        setLoading(false)
        return
      }

      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        profile: profileData,
      }

      setUser(userData)

      // Populate form data
      setFormData({
        name: data.user.name || '',
        tagline: profileData.tagline || '',
        avatarUrl: profileData.avatarUrl || '',
        mainQuestionText: profileData.mainQuestionText || '',
        thankYouMessage: profileData.thankYouMessage || '',
        noMessage: profileData.noMessage || '',
        socialInstagram: profileData.socialInstagram || '',
        socialTwitter: profileData.socialTwitter || '',
        socialLinkedIn: profileData.socialLinkedIn || '',
        socialWebsite: profileData.socialWebsite || '',
        contactEmail: profileData.contactEmail || '',
        calendarUrl: profileData.calendarUrl || '',
      })

      setLoading(false)
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Failed to load profile')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update profile')
        setSaving(false)
        return
      }

      setSuccess(true)
      setSaving(false)

      // Refresh user data
      fetchUserData()

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setSaving(false)
    }
  }

  const copyLink = () => {
    if (user?.profile.username) {
      const link = `${window.location.origin}/${user.profile.username}`
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="flex-1 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Profile Link Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Personal Link
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 px-4 py-3 bg-gray-50 rounded-lg font-mono text-sm break-all">
              {window.location.origin}/{user.profile.username}
            </div>
            <button
              onClick={copyLink}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Analytics
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {user.profile.analyticsVisits}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Visits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {user.profile.analyticsYes}
              </div>
              <div className="text-sm text-gray-600 mt-1">Yes Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {user.profile.analyticsNo}
              </div>
              <div className="text-sm text-gray-600 mt-1">No Clicks</div>
            </div>
          </div>
        </div>

        {/* Share Your Link Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* QR Code Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              QR Code
            </h2>
            <QRCodeDisplay />
          </div>

          {/* Apple Wallet Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Apple Wallet
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Add your profile to Apple Wallet for quick access from your
              iPhone or Apple Watch.
            </p>
            <AddToWalletButton />
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Profile Settings
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                Profile updated successfully!
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={user.profile.username}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Username cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tagline / Short Bio
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Product designer & coffee enthusiast"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to your profile picture
                </p>
              </div>
            </div>

            {/* Messages & Behavior */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900">Messages & Behavior</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Question Text
                </label>
                <input
                  type="text"
                  value={formData.mainQuestionText}
                  onChange={(e) => setFormData({ ...formData, mainQuestionText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="May I meet you?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thank You Message (after Yes)
                </label>
                <textarea
                  value={formData.thankYouMessage}
                  onChange={(e) => setFormData({ ...formData, thankYouMessage: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Thanks for saying yes! Feel free to connect with me:"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No Message (after No)
                </label>
                <textarea
                  value={formData.noMessage}
                  onChange={(e) => setFormData({ ...formData, noMessage: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Fair enough. Respect 🫡"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900">Social Links & Contact</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  value={formData.socialInstagram}
                  onChange={(e) => setFormData({ ...formData, socialInstagram: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="@username or full URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  X / Twitter
                </label>
                <input
                  type="text"
                  value={formData.socialTwitter}
                  onChange={(e) => setFormData({ ...formData, socialTwitter: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="@username or full URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.socialLinkedIn}
                  onChange={(e) => setFormData({ ...formData, socialLinkedIn: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.socialWebsite}
                  onChange={(e) => setFormData({ ...formData, socialWebsite: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calendar / Scheduling Link
                </label>
                <input
                  type="url"
                  value={formData.calendarUrl}
                  onChange={(e) => setFormData({ ...formData, calendarUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://calendly.com/username"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
