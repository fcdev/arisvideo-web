import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Fetch completed videos
    const videos = await prisma.video.findMany({
      where: {
        status: 'completed',
        videoUrl: { not: null }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit,
      select: {
        id: true,
        videoId: true,
        prompt: true,
        videoUrl: true,
        duration: true,
        createdAt: true,
        user: {
          select: {
            email: true,
          }
        }
      }
    })

    // Get total count for pagination
    const total = await prisma.video.count({
      where: {
        status: 'completed',
        videoUrl: { not: null }
      }
    })

    return NextResponse.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })

  } catch (error) {
    console.error('Explore videos error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}
