import { PKPass } from 'passkit-generator'
import { readFileSync } from 'fs'
import { join } from 'path'
import { getProfileURL } from './qrGenerator'
import sharp from 'sharp'

export interface WalletPassData {
  username: string
  name: string
  tagline?: string | null
  profileURL: string
}

/**
 * Generate icon image for Apple Wallet pass
 * @param size Icon size in pixels
 * @returns Promise<Buffer> PNG image buffer
 */
async function generateIcon(size: number): Promise<Buffer> {
  // Create a simple blue square icon with white "M" letter
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#2563eb"/>
      <text
        x="50%"
        y="50%"
        font-family="Arial, sans-serif"
        font-size="${size * 0.6}"
        font-weight="bold"
        fill="white"
        text-anchor="middle"
        dominant-baseline="central">M</text>
    </svg>
  `
  return await sharp(Buffer.from(svg)).png().toBuffer()
}

/**
 * Generate an Apple Wallet pass for a user profile
 * @param passData User profile data for the pass
 * @returns Promise<Buffer> The signed .pkpass file
 */
export async function generateWalletPass(
  passData: WalletPassData
): Promise<Buffer> {
  try {
    // Path to certificates directory
    const certsPath = join(process.cwd(), 'certificates')

    // Load certificates and keys
    const signerCert = readFileSync(join(certsPath, 'signerCert.pem'))
    const signerKey = readFileSync(join(certsPath, 'signerKey.pem'))
    const wwdr = readFileSync(join(certsPath, 'wwdr.pem'))

    // Get Apple Developer credentials from env
    const teamIdentifier = process.env.APPLE_TEAM_ID
    const passTypeIdentifier = process.env.APPLE_PASS_TYPE_ID

    if (!teamIdentifier || !passTypeIdentifier) {
      throw new Error('Apple Developer credentials not configured')
    }

    // Create pass.json structure
    const passJson = {
      formatVersion: 1,
      passTypeIdentifier,
      teamIdentifier,
      organizationName: 'MayIMeetYou',
      description: 'MayIMeetYou Profile Card',
      serialNumber: `${passData.username}-${Date.now()}`,
      foregroundColor: 'rgb(255,255,255)',
      backgroundColor: 'rgb(37,99,235)', // Blue-600
      labelColor: 'rgb(255,255,255)',
      logoText: 'MayIMeetYou.io',
      generic: {
        primaryFields: [
          {
            key: 'name',
            label: 'Name',
            value: passData.name,
          },
        ],
        secondaryFields: passData.tagline
          ? [
              {
                key: 'tagline',
                label: 'About',
                value: passData.tagline,
              },
            ]
          : [],
        auxiliaryFields: [
          {
            key: 'question',
            label: '',
            value: 'May I meet you?',
          },
        ],
        backFields: [
          {
            key: 'url',
            label: 'Profile URL',
            value: passData.profileURL,
          },
          {
            key: 'username',
            label: 'Username',
            value: `@${passData.username}`,
          },
        ],
      },
      barcodes: [
        {
          format: 'PKBarcodeFormatQR',
          message: passData.profileURL,
          messageEncoding: 'iso-8859-1',
        },
      ],
    }

    // Generate icon images (required for Apple Wallet)
    const icon1x = await generateIcon(29)
    const icon2x = await generateIcon(58)
    const icon3x = await generateIcon(87)

    // Create certificates config
    const certificatesConfig: any = {
      wwdr,
      signerCert,
      signerKey,
    }

    // Only add passphrase if it's set (library doesn't allow empty string)
    if (process.env.APPLE_KEY_PASSPHRASE) {
      certificatesConfig.signerKeyPassphrase = process.env.APPLE_KEY_PASSPHRASE
    }

    // Create pass using passkit-generator API
    // Constructor signature: new PKPass(buffers, certificates, props)
    const pass = new PKPass(
      {
        'pass.json': Buffer.from(JSON.stringify(passJson)),
        'icon.png': icon1x,
        'icon@2x.png': icon2x,
        'icon@3x.png': icon3x,
      },
      certificatesConfig,
      {} // Empty props since we're providing everything in pass.json
    )

    // Generate the pass buffer
    const passBuffer = await pass.getAsBuffer()

    return passBuffer
  } catch (error) {
    console.error('Wallet pass generation failed:', error)
    throw new Error(
      error instanceof Error
        ? `Failed to generate wallet pass: ${error.message}`
        : 'Failed to generate wallet pass'
    )
  }
}

/**
 * Check if Apple Wallet is properly configured
 * @returns boolean True if all required certificates and configs exist
 */
export function isWalletConfigured(): boolean {
  try {
    const certsPath = join(process.cwd(), 'certificates')
    const signerCertExists = readFileSync(join(certsPath, 'signerCert.pem'))
    const signerKeyExists = readFileSync(join(certsPath, 'signerKey.pem'))
    const wwdrExists = readFileSync(join(certsPath, 'wwdr.pem'))

    return !!(
      signerCertExists &&
      signerKeyExists &&
      wwdrExists &&
      process.env.APPLE_TEAM_ID &&
      process.env.APPLE_PASS_TYPE_ID
    )
  } catch {
    return false
  }
}
