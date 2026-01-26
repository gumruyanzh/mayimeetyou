import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-serif font-bold text-text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-secondary mb-4">
          Profile not found
        </h2>
        <p className="text-text-tertiary mb-8">
          This user doesn&apos;t exist or the link is incorrect
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-all hover:shadow-glow"
        >
          Go to Homepage
        </Link>
      </div>
    </main>
  )
}
