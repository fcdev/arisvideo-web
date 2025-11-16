import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'
const PYTHON_API_KEY = process.env.PYTHON_API_KEY || ''

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: video_id } = await params

    // Get status from Python service
    const pythonResponse = await fetch(`${PYTHON_SERVICE_URL}/status/${video_id}`, {
      headers: {
        'X-API-Key': PYTHON_API_KEY,
      },
    })

    if (!pythonResponse.ok) {
      if (pythonResponse.status === 404) {
        return NextResponse.json(
          { error: 'Video not found in generation service' },
          { status: 404 }
        )
      }
      throw new Error('Failed to fetch status from Python service')
    }

    const pythonStatus = await pythonResponse.json()

    // Update database with latest status
    const video = await prisma.video.findUnique({
      where: { videoId: video_id },
      include: {
        statuses: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (video) {
      // Update video status and file path if completed
      if (pythonStatus.status === 'completed' && pythonStatus.file_path) {
        // Use proxy URL instead of raw file path
        const proxyUrl = `/api/videos/file/${video_id}`
        await prisma.video.update({
          where: { videoId: video_id },
          data: {
            status: 'completed',
            videoUrl: proxyUrl,
            duration: pythonStatus.duration || null,
          }
        })
      } else if (pythonStatus.status === 'failed') {
        await prisma.video.update({
          where: { videoId: video_id },
          data: {
            status: 'failed',
          }
        })
      } else if (pythonStatus.status === 'processing') {
        await prisma.video.update({
          where: { videoId: video_id },
          data: {
            status: 'processing',
          }
        })
      }

      // Add new status step if it's different from the last one
      const lastStatus = video.statuses[video.statuses.length - 1]
      if (!lastStatus || lastStatus.step < pythonStatus.step || lastStatus.message !== pythonStatus.message) {
        await prisma.videoStatus.create({
          data: {
            videoId: video_id,
            step: pythonStatus.step,
            message: pythonStatus.message,
          }
        })
      }
    }

    // Return proxy URL instead of raw file path
    const file_path = pythonStatus.file_path
      ? `/api/videos/file/${video_id}`
      : null

    return NextResponse.json({
      video_id: video_id,
      status: pythonStatus.status,
      step: pythonStatus.step,
      message: pythonStatus.message,
      file_path: file_path,
      duration: pythonStatus.duration,
      error: pythonStatus.error,
      updated_at: pythonStatus.updated_at,
    })

  } catch (error) {
    console.error('Get video status error:', error)
    return NextResponse.json(
      { error: 'Failed to get video status' },
      { status: 500 }
    )
  }
}
