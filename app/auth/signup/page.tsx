'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Signup failed')
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">
            Create your account
          </h1>
          <p className="text-text-secondary">
            Start connecting with people in a more charming way
          </p>
        </div>

        <div className="bg-surface rounded-2xl shadow-soft-lg border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-error/10 text-error p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                placeholder="Alex Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                placeholder="alex@example.com"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1.5">
                Username
              </label>
              <input
                type="text"
                id="username"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                placeholder="alexsmith"
              />
              <p className="text-xs text-text-tertiary mt-1.5">
                Your profile will be at: mayimeetyou.io/{formData.username || 'username'}
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
