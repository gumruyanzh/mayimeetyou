'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.15 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
  return inView
}

export default function HomePage() {
  const howRef = useRef<HTMLElement>(null)
  const demoRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)
  const howVisible = useInView(howRef)
  const demoVisible = useInView(demoRef)
  const ctaVisible = useInView(ctaRef)

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-surface-alt)_0%,_var(--color-bg)_70%)]" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-text-primary mb-6 animate-fade-in-up">
            The most charming way to ask to meet
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-10 max-w-2xl mx-auto opacity-0 animate-fade-in-up stagger-2">
            Create your personal link, share it anywhere, and see who says &ldquo;Yes&rdquo; to meeting you
          </p>
          <div className="opacity-0 animate-fade-in-up stagger-3">
            <Link
              href="/auth/signup"
              className="inline-block bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-hover transition-all hover:shadow-glow-lg"
            >
              Create My Link
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howRef} className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-3xl md:text-4xl font-serif font-bold text-center text-text-primary mb-16 transition-all duration-700 ${howVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { num: '1', title: 'Create your link', desc: 'Sign up and customize your profile with your social links and message' },
              { num: '2', title: 'Share it anywhere', desc: 'Add it to your bio, email signature, or share it directly with people' },
              { num: '3', title: 'See who says "Yes"', desc: 'Track your analytics and connect with people who want to meet you' },
            ].map((step, i) => (
              <div
                key={step.num}
                className={`text-center transition-all duration-700 ${howVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: howVisible ? `${(i + 1) * 150}ms` : '0ms' }}
              >
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-serif font-bold mx-auto mb-5">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section ref={demoRef} className="py-24 px-4 bg-surface-alt">
        <div className="max-w-md mx-auto">
          <h2 className={`text-3xl font-serif font-bold text-center text-text-primary mb-10 transition-all duration-700 ${demoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            See it in action
          </h2>

          <div className={`transition-all duration-700 ${demoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: demoVisible ? '200ms' : '0ms' }}>
            <div className="bg-surface rounded-2xl shadow-soft-xl p-8 border border-border">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-[#B8654A] rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold ring-4 ring-surface-alt">
                  A
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-text-primary">Hi, I&apos;m Alex</h3>
                  <p className="text-text-secondary mt-2">
                    Product designer &amp; coffee enthusiast
                  </p>
                </div>
                <div className="py-4">
                  <p className="text-xl font-semibold text-text-primary">
                    May I meet you?
                  </p>
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary-hover transition-all hover:shadow-glow cursor-default">
                    Yes, you may
                  </button>
                  <button className="w-full border-2 border-border-strong text-text-secondary py-3.5 rounded-xl font-semibold hover:border-primary hover:text-primary transition-all cursor-default">
                    No, sorry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-24 px-4">
        <div className={`max-w-2xl mx-auto text-center transition-all duration-700 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-6">
            Ready to make connections?
          </h2>
          <p className="text-xl text-text-secondary mb-10">
            Join MayIMeetYou.io and start building meaningful relationships
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-hover transition-all hover:shadow-glow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </main>
  )
}
