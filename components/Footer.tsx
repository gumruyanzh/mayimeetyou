import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-bg-alt border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Home
            </Link>
            <Link href="/auth/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Login
            </Link>
            <Link href="/auth/signup" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Sign up
            </Link>
          </div>
          <p className="text-text-tertiary text-sm">
            &copy; {currentYear} MayIMeetYou.io
          </p>
        </div>
      </div>
    </footer>
  )
}
