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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size: 1000 }), // High quality for download
      })

      if (!response.ok) {
        throw new Error('Failed to download QR code')
      }

      // Create blob and download
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
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    )
  }

  if (!qrData) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* QR Code Display */}
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <img
            src={qrData.qrCode}
            alt="Profile QR Code"
            className="w-64 h-64"
          />
        </div>
      </div>

      {/* Profile URL */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Scan to visit</p>
        <p className="font-mono text-sm text-gray-900 break-all">
          {qrData.profileURL}
        </p>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadQRCode}
        disabled={downloading}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {downloading ? 'Downloading...' : 'Download QR Code'}
      </button>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">
          How to use your QR code:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Print it on business cards</li>
          <li>• Add it to your email signature</li>
          <li>• Display it at events or conferences</li>
          <li>• Share it on social media</li>
        </ul>
      </div>
    </div>
  )
}
