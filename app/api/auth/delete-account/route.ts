import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, verifyPassword, clearSession } from '@/lib/auth'

export async function DELETE(request: Request) {
  try {
    const session = await requireAuth()
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const isValid = await verifyPassword(password, user.passwordHash)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 400 }
      )
    }

    // Delete user (cascade deletes profile and analytics events)
    await prisma.user.delete({
      where: { id: user.id },
    })

    await clearSession()

    return NextResponse.json({ message: 'Account deleted successfully' })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Delete account error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
