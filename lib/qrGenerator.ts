import QRCode from 'qrcode'

export interface QRCodeOptions {
  size?: number
  margin?: number
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

/**
 * Generate a QR code as a data URL (base64 PNG)
 * @param url The URL to encode in the QR code
 * @param options QR code generation options
 * @returns Promise<string> Data URL of the QR code image
 */
export async function generateQRCode(
  url: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const {
    size = 300,
    margin = 2,
    errorCorrectionLevel = 'M',
  } = options

  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: size,
      margin: margin,
      errorCorrectionLevel: errorCorrectionLevel,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    return qrCodeDataURL
  } catch (error) {
    console.error('QR Code generation failed:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Generate a QR code as a buffer (for downloads or wallet passes)
 * @param url The URL to encode in the QR code
 * @param options QR code generation options
 * @returns Promise<Buffer> QR code image buffer
 */
export async function generateQRCodeBuffer(
  url: string,
  options: QRCodeOptions = {}
): Promise<Buffer> {
  const {
    size = 300,
    margin = 2,
    errorCorrectionLevel = 'M',
  } = options

  try {
    const buffer = await QRCode.toBuffer(url, {
      width: size,
      margin: margin,
      errorCorrectionLevel: errorCorrectionLevel,
      type: 'png',
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    return buffer
  } catch (error) {
    console.error('QR Code buffer generation failed:', error)
    throw new Error('Failed to generate QR code buffer')
  }
}

/**
 * Generate profile URL for QR code
 * @param username User's username
 * @returns Full profile URL
 */
export function getProfileURL(username: string): string {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'https://mayimeetyou.io'
  return `${baseURL}/${username}`
}
