'use client'

import { useState, useEffect } from 'react'

export default function AddToWalletButton() {
  const [loading, setLoading] = useState(false)
  const [configured, setConfigured] = useState(false)
  const [checkingConfig, setCheckingConfig] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    checkWalletConfig()
  }, [])

  const checkWalletConfig = async () => {
    try {
      const response = await fetch('/api/wallet/generate')
      const data = await response.json()
      setConfigured(data.configured)
    } catch (err) {
      console.error('Failed to check wallet config:', err)
    } finally {
      setCheckingConfig(false)
    }
  }

  const handleAddToWallet = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/wallet/generate', {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to generate wallet pass')
      }

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mayimeetyou.pkpass'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to wallet')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (checkingConfig) {
    return (
      <div className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
    )
  }

  if (!configured) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          Apple Wallet integration is being set up. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleAddToWallet}
        disabled={loading}
        className="w-full bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          'Generating...'
        ) : (
          <>
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21.5 8H19V6.5C19 5.12 17.88 4 16.5 4H14V2.5C14 1.12 12.88 0 11.5 0H3.5C2.12 0 1 1.12 1 2.5V15.5C1 16.88 2.12 18 3.5 18H5V19.5C5 20.88 6.12 22 7.5 22H21.5C22.88 22 24 20.88 24 19.5V10.5C24 9.12 22.88 8 21.5 8ZM3.5 16C3.22 16 3 15.78 3 15.5V2.5C3 2.22 3.22 2 3.5 2H11.5C11.78 2 12 2.22 12 2.5V4H7.5C6.12 4 5 5.12 5 6.5V16H3.5ZM22 19.5C22 19.78 21.78 20 21.5 20H7.5C7.22 20 7 19.78 7 19.5V6.5C7 6.22 7.22 6 7.5 6H16.5C16.78 6 17 6.22 17 6.5V8H12C10.62 8 9.5 9.12 9.5 10.5V14.5C9.5 15.88 10.62 17 12 17H22V19.5ZM22 15H12C11.72 15 11.5 14.78 11.5 14.5V10.5C11.5 10.22 11.72 10 12 10H21.5C21.78 10 22 10.22 22 10.5V15ZM15 13.5C15 14.33 14.33 15 13.5 15C12.67 15 12 14.33 12 13.5C12 12.67 12.67 12 13.5 12C14.33 12 15 12.67 15 13.5Z" />
            </svg>
            Add to Apple Wallet
          </>
        )}
      </button>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-xs text-gray-600">
          Your profile card will be added to your Apple Wallet with a QR code
          for easy sharing. Works on iPhone and Apple Watch.
        </p>
      </div>
    </div>
  )
}
