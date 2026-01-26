'use client'

import { useState } from 'react'
import ProfileCard from './ProfileCard'

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

interface ProfilePreviewProps {
  profile: ProfileData
  onClose: () => void
}

export default function ProfilePreview({ profile, onClose }: ProfilePreviewProps) {
  const [previewState, setPreviewState] = useState<'question' | 'yes' | 'no'>('question')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {/* Preview Mode Banner */}
        <div className="bg-primary text-white text-center py-2 px-4 rounded-t-2xl text-sm font-medium">
          Preview Mode
        </div>

        {/* State Toggle */}
        <div className="bg-surface border-x border-border flex">
          {(['question', 'yes', 'no'] as const).map((state) => (
            <button
              key={state}
              onClick={() => setPreviewState(state)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors capitalize ${
                previewState === state
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-tertiary hover:text-text-secondary border-b-2 border-transparent'
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        {/* Profile Card */}
        <div className="bg-bg rounded-b-2xl p-4">
          <ProfileCard profile={profile} previewMode previewState={previewState} />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:bg-surface-alt transition-colors"
        >
          Close Preview
        </button>
      </div>
    </div>
  )
}
