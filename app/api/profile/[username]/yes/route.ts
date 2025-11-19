import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    // Increment yes count
    await prisma.profile.update({
      where: { username },
      data: {
        analyticsYes: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Yes tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track yes click' },
      { status: 500 }
    )
  }
}
