import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resend = getResend()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const resetUrl = `${appUrl}/auth/reset-password?token=${token}`

  await resend.emails.send({
    from: 'MayIMeetYou.io <noreply@mayimeetyou.io>',
    to: email,
    subject: 'Reset your password - MayIMeetYou.io',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF9F7; margin: 0; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <h1 style="font-size: 24px; color: #1A1714; margin: 0 0 8px;">Reset your password</h1>
            <p style="color: #6B6560; font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
              We received a request to reset your password. Click the button below to choose a new one.
            </p>
            <a href="${resetUrl}" style="display: inline-block; background: #D97757; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
            <p style="color: #9C958D; font-size: 14px; line-height: 1.5; margin: 24px 0 0;">
              This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  })
}
