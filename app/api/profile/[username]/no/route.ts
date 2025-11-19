import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    // Increment no count
    await prisma.profile.update({
      where: { username },
      data: {
        analyticsNo: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('No tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track no click' },
      { status: 500 }
    )
  }
}
