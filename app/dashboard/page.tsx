'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import AddToWalletButton from '@/components/AddToWalletButton'
import ProfilePreview from '@/components/ProfilePreview'

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
  whatsappNumber: string | null
  analyticsVisits: number
  analyticsYes: number
  analyticsNo: number
  user?: { name: string }
}

interface User {
  id: string
  name: string
  email: string
  profile: Profile
}

type Tab = 'profile' | 'sharing' | 'account'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [showPreview, setShowPreview] = useState(false)

  // Change password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

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
    whatsappNumber: '',
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
        whatsappNumber: profileData.whatsappNumber || '',
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
    setSuccess('')
    setSaving(true)

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update profile')
        setSaving(false)
        return
      }

      setSuccess('Profile updated successfully!')
      setSaving(false)
      fetchUserData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    setPasswordLoading(true)

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setPasswordError(data.error || 'Failed to change password')
        setPasswordLoading(false)
        return
      }

      setPasswordSuccess('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordLoading(false)
      setTimeout(() => setPasswordSuccess(''), 3000)
    } catch (err) {
      setPasswordError('An error occurred. Please try again.')
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteError('')
    setDeleteLoading(true)

    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        setDeleteError(data.error || 'Failed to delete account')
        setDeleteLoading(false)
        return
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      setDeleteError('An error occurred. Please try again.')
      setDeleteLoading(false)
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

  const conversionRate = user?.profile
    ? user.profile.analyticsVisits > 0
      ? Math.round((user.profile.analyticsYes / user.profile.analyticsVisits) * 100)
      : 0
    : 0

  if (loading) {
    return (
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-10 w-48 skeleton rounded-lg" />
          <div className="h-32 skeleton rounded-2xl" />
          <div className="h-48 skeleton rounded-2xl" />
          <div className="h-96 skeleton rounded-2xl" />
        </div>
      </main>
    )
  }

  if (!user) {
    return null
  }

  // Build preview profile data
  const previewProfile = {
    id: user.profile.id,
    username: user.profile.username,
    tagline: formData.tagline || null,
    avatarUrl: formData.avatarUrl || null,
    mainQuestionText: formData.mainQuestionText || 'May I meet you?',
    thankYouMessage: formData.thankYouMessage || null,
    noMessage: formData.noMessage || null,
    socialInstagram: formData.socialInstagram || null,
    socialTwitter: formData.socialTwitter || null,
    socialLinkedIn: formData.socialLinkedIn || null,
    socialWebsite: formData.socialWebsite || null,
    contactEmail: formData.contactEmail || null,
    calendarUrl: formData.calendarUrl || null,
    whatsappNumber: formData.whatsappNumber || null,
    user: { name: formData.name || user.name },
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'sharing', label: 'Sharing' },
    { key: 'account', label: 'Account' },
  ]

  return (
    <main className="flex-1 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-text-primary mb-8">Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-surface-alt rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-surface text-text-primary shadow-soft'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ======= PROFILE TAB ======= */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fade-in">
            {/* Personal Link Card */}
            <div className="bg-surface rounded-2xl shadow-soft border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                Your Personal Link
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 px-4 py-3 bg-surface-alt rounded-xl font-mono text-sm break-all text-text-primary">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/{user.profile.username}
                </div>
                <button
                  onClick={copyLink}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-all hover:shadow-glow"
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="bg-surface rounded-2xl shadow-soft border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Analytics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-surface-alt rounded-xl">
                  <div className="text-3xl font-bold text-text-primary">
                    {user.profile.analyticsVisits}
                  </div>
                  <div className="text-sm text-text-secondary mt-1">Visits</div>
                </div>
                <div className="text-center p-4 bg-surface-alt rounded-xl">
                  <div className="text-3xl font-bold text-success">
                    {user.profile.analyticsYes}
                  </div>
                  <div className="text-sm text-text-secondary mt-1">Yes</div>
                </div>
                <div className="text-center p-4 bg-surface-alt rounded-xl">
                  <div className="text-3xl font-bold text-error">
                    {user.profile.analyticsNo}
                  </div>
                  <div className="text-sm text-text-secondary mt-1">No</div>
                </div>
                <div className="text-center p-4 bg-surface-alt rounded-xl">
                  <div className="text-3xl font-bold text-primary">
                    {conversionRate}%
                  </div>
                  <div className="text-sm text-text-secondary mt-1">Conversion</div>
                </div>
              </div>
            </div>

            {/* Profile Settings Form */}
            <div className="bg-surface rounded-2xl shadow-soft border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-text-primary">Profile Settings</h2>
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Preview
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-error/10 text-error p-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-success/10 text-success p-3 rounded-xl text-sm">
                    {success}
                  </div>
                )}

                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Basic Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Username</label>
                    <input
                      type="text"
                      value={user.profile.username}
                      disabled
                      className="w-full px-4 py-3 border border-border rounded-xl bg-surface-alt text-text-tertiary cursor-not-allowed"
                    />
                    <p className="text-xs text-text-tertiary mt-1.5">Username cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Tagline / Short Bio</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                      placeholder="Product designer & coffee enthusiast"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Avatar URL</label>
                    <div className="flex gap-3 items-start">
                      <input
                        type="url"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                        className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                        placeholder="https://example.com/avatar.jpg"
                      />
                      {formData.avatarUrl && (
                        <img
                          src={formData.avatarUrl}
                          alt="Avatar preview"
                          className="w-12 h-12 rounded-full object-cover border border-border"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Messages</h3>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Main Question Text</label>
                    <input
                      type="text"
                      value={formData.mainQuestionText}
                      onChange={(e) => setFormData({ ...formData, mainQuestionText: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                      placeholder="May I meet you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Thank You Message (after Yes)</label>
                    <textarea
                      value={formData.thankYouMessage}
                      onChange={(e) => setFormData({ ...formData, thankYouMessage: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary resize-none"
                      placeholder="Thanks for saying yes! Feel free to connect with me:"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">No Message (after No)</label>
                    <textarea
                      value={formData.noMessage}
                      onChange={(e) => setFormData({ ...formData, noMessage: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary resize-none"
                      placeholder="Fair enough. Respect."
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Social Links & Contact</h3>

                  {[
                    { label: 'Instagram', key: 'socialInstagram', placeholder: '@username or full URL', type: 'text' },
                    { label: 'X / Twitter', key: 'socialTwitter', placeholder: '@username or full URL', type: 'text' },
                    { label: 'LinkedIn', key: 'socialLinkedIn', placeholder: 'https://linkedin.com/in/username', type: 'url' },
                    { label: 'Website', key: 'socialWebsite', placeholder: 'https://yourwebsite.com', type: 'url' },
                    { label: 'Contact Email', key: 'contactEmail', placeholder: 'contact@example.com', type: 'email' },
                    { label: 'Calendar Link', key: 'calendarUrl', placeholder: 'https://calendly.com/username', type: 'url' },
                    { label: 'WhatsApp Number', key: 'whatsappNumber', placeholder: '+1234567890', type: 'tel' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        value={(formData as Record<string, string>)[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ======= SHARING TAB ======= */}
        {activeTab === 'sharing' && (
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
            <div className="bg-surface rounded-2xl shadow-soft border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">QR Code</h2>
              <QRCodeDisplay />
            </div>
            <div className="bg-surface rounded-2xl shadow-soft border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Apple Wallet</h2>
              <p className="text-sm text-text-secondary mb-6">
                Add your profile to Apple Wallet for quick access from your iPhone or Apple Watch.
              </p>
              <AddToWalletButton />
            </div>
          </div>
        )}

        {/* ======= ACCOUNT TAB ======= */}
        {activeTab === 'account' && (
          <div className="space-y-8 animate-fade-in">
            {/* Change Password */}
            <div className="bg-surface rounded-2xl shadow-soft border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">Change Password</h2>

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                {passwordError && (
                  <div className="bg-error/10 text-error p-3 rounded-xl text-sm">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="bg-success/10 text-success p-3 rounded-xl text-sm">
                    {passwordSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                    placeholder="At least 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-surface rounded-2xl shadow-soft border border-error/20 p-6">
              <h2 className="text-lg font-semibold text-error mb-2">Danger Zone</h2>
              <p className="text-sm text-text-secondary mb-4">
                Once you delete your account, there is no going back. This will permanently delete your profile, analytics, and all associated data.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-error/10 text-error px-6 py-3 rounded-xl font-semibold hover:bg-error/20 transition-colors"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-4 max-w-md animate-fade-in">
                  {deleteError && (
                    <div className="bg-error/10 text-error p-3 rounded-xl text-sm">
                      {deleteError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Enter your password to confirm
                    </label>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-4 py-3 bg-surface border border-error/30 rounded-xl focus:ring-2 focus:ring-error/30 focus:border-error outline-none transition-all text-text-primary"
                      placeholder="Your password"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading || !deletePassword}
                      className="bg-error text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteLoading ? 'Deleting...' : 'Permanently Delete'}
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false)
                        setDeletePassword('')
                        setDeleteError('')
                      }}
                      className="px-6 py-3 rounded-xl font-medium text-text-secondary hover:bg-surface-alt transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Preview Modal */}
      {showPreview && (
        <ProfilePreview
          profile={previewProfile}
          onClose={() => setShowPreview(false)}
        />
      )}
    </main>
  )
}
