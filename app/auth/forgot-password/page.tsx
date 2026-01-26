'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch (err) {
      // Still show success to not leak email existence
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">
            Forgot password
          </h1>
          <p className="text-text-secondary">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="bg-surface rounded-2xl shadow-soft-lg border border-border p-8">
          {sent ? (
            <div className="text-center space-y-4 animate-fade-in">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success/10 mb-2">
                <svg className="w-7 h-7 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <p className="text-text-primary font-medium">Check your email</p>
              <p className="text-text-secondary text-sm">
                If an account exists with that email, we&apos;ve sent a password reset link.
              </p>
              <Link
                href="/auth/login"
                className="inline-block mt-4 text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                  placeholder="alex@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow"
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          )}

          {!sent && (
            <p className="text-center text-sm text-text-secondary mt-6">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
                Login
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
