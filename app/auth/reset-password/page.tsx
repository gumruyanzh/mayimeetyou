'use client'

import { useState, FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-error font-medium">Invalid reset link</p>
        <p className="text-text-secondary text-sm">
          This link is invalid or has already been used.
        </p>
        <Link
          href="/auth/forgot-password"
          className="inline-block mt-4 text-primary hover:text-primary-hover font-medium transition-colors"
        >
          Request a new link
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to reset password')
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4 animate-fade-in">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success/10 mb-2">
          <svg className="w-7 h-7 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-text-primary font-medium">Password reset successfully</p>
        <p className="text-text-secondary text-sm">
          You can now log in with your new password.
        </p>
        <Link
          href="/auth/login"
          className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-all hover:shadow-glow"
        >
          Go to login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-error/10 text-error p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
          New Password
        </label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
          placeholder="At least 6 characters"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
          placeholder="Confirm your password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow"
      >
        {loading ? 'Resetting...' : 'Reset password'}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">
            Reset password
          </h1>
          <p className="text-text-secondary">
            Choose a new password for your account
          </p>
        </div>

        <div className="bg-surface rounded-2xl shadow-soft-lg border border-border p-8">
          <Suspense fallback={<div className="h-40 skeleton rounded-xl" />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
