import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    // Get current user (required)
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch user's videos
    const videos = await prisma.video.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        videoId: true,
        prompt: true,
        videoUrl: true,
        duration: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      videos,
      count: videos.length
    })

  } catch (error) {
    console.error('Get my videos error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}
