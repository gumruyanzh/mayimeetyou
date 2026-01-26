import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mayimeetyou.io'),
  title: 'MayIMeetYou.io - The most charming way to ask to meet',
  description: 'Create your personal link and let people say yes to meeting you',
  openGraph: {
    title: 'MayIMeetYou.io - The most charming way to ask to meet',
    description: 'Create your personal link and let people say yes to meeting you',
    siteName: 'MayIMeetYou.io',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MayIMeetYou.io - The most charming way to ask to meet',
    description: 'Create your personal link and let people say yes to meeting you',
    images: ['/og-default.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans flex flex-col min-h-screen bg-bg text-text-primary transition-colors duration-300">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
