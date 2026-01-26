'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import ThemeToggle from './ThemeToggle'

interface User {
  id: string
  name: string
  email: string
  username: string
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchSession()
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error('Failed to fetch session:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setMenuOpen(false)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="bg-surface/80 backdrop-blur-xl border-b border-border sticky top-0 z-50" ref={menuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-serif font-bold text-text-primary">
            MayIMeetYou.io
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            {loading ? (
              <div className="h-9 w-20 skeleton rounded-lg" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-text-secondary hover:text-text-primary font-medium transition-colors px-3 py-2 rounded-lg hover:bg-surface-alt"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-text-secondary hover:text-text-primary font-medium transition-colors px-3 py-2 rounded-lg hover:bg-surface-alt"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-text-secondary hover:text-text-primary font-medium transition-colors px-3 py-2 rounded-lg hover:bg-surface-alt"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-primary text-white px-5 py-2 rounded-xl hover:bg-primary-hover transition-colors font-medium"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-surface-alt transition-colors"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-text-secondary transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-text-secondary transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-text-secondary transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-border py-3 animate-fade-in">
            {loading ? (
              <div className="h-10 skeleton rounded-lg mx-2" />
            ) : user ? (
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  className="block px-3 py-2.5 text-text-secondary hover:text-text-primary hover:bg-surface-alt rounded-lg font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2.5 text-text-secondary hover:text-text-primary hover:bg-surface-alt rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/auth/login"
                  className="block px-3 py-2.5 text-text-secondary hover:text-text-primary hover:bg-surface-alt rounded-lg font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2.5 text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
