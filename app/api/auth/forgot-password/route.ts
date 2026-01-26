import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'If an account exists with that email, we\'ve sent a reset link.' },
        { status: 200 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      const token = crypto.randomUUID()
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
      const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: hashedToken,
          resetTokenExpiry: expiry,
        },
      })

      try {
        await sendPasswordResetEmail(email, token)
      } catch (emailError) {
        console.error('Failed to send reset email:', emailError)
      }
    }

    // Always return same response to not leak email existence
    return NextResponse.json({
      message: 'If an account exists with that email, we\'ve sent a reset link.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
