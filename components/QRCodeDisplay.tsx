'use client'

import { useState, useEffect } from 'react'

interface QRCodeData {
  qrCode: string
  profileURL: string
  username: string
}

export default function QRCodeDisplay() {
  const [qrData, setQrData] = useState<QRCodeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchQRCode()
  }, [])

  const fetchQRCode = async () => {
    try {
      const response = await fetch('/api/qr/generate')
      if (!response.ok) {
        throw new Error('Failed to generate QR code')
      }
      const data = await response.json()
      setQrData(data)
    } catch (err) {
      setError('Failed to load QR code')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = async () => {
    if (!qrData) return

    setDownloading(true)
    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size: 1000 }),
      })

      if (!response.ok) {
        throw new Error('Failed to download QR code')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mayimeetyou-${qrData.username}-qr.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Failed to download QR code')
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-64 h-64 skeleton rounded-xl" />
        </div>
        <div className="h-4 w-40 mx-auto skeleton rounded" />
        <div className="h-12 skeleton rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-error/10 text-error p-4 rounded-xl">
        {error}
      </div>
    )
  }

  if (!qrData) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-xl shadow-soft border border-border">
          <img
            src={qrData.qrCode}
            alt="Profile QR Code"
            className="w-64 h-64"
          />
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-text-tertiary mb-1">Scan to visit</p>
        <p className="font-mono text-sm text-text-primary break-all">
          {qrData.profileURL}
        </p>
      </div>

      <button
        onClick={downloadQRCode}
        disabled={downloading}
        className="w-full bg-surface-alt hover:bg-bg-alt text-text-primary py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-border"
      >
        {downloading ? 'Downloading...' : 'Download QR Code'}
      </button>

      <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl">
        <h4 className="font-semibold text-text-primary mb-2 text-sm">
          How to use your QR code:
        </h4>
        <ul className="text-sm text-text-secondary space-y-1">
          <li>Print it on business cards</li>
          <li>Add it to your email signature</li>
          <li>Display it at events or conferences</li>
          <li>Share it on social media</li>
        </ul>
      </div>
    </div>
  )
}
