import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'
const PYTHON_API_KEY = process.env.PYTHON_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    // Get current user (optional - allows anonymous generation)
    const user = await getCurrentUser()

    // Parse request body
    const body = await request.json()
    const { prompt, resolution, include_audio, voice, language, sync_method, uploaded_files_context } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Call Python service to start video generation
    const pythonResponse = await fetch(`${PYTHON_SERVICE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': PYTHON_API_KEY,
      },
      body: JSON.stringify({
        prompt,
        resolution: resolution || 'm',
        include_audio: include_audio !== false,
        voice: voice || 'nova',
        language: language || undefined,
        sync_method: sync_method || 'timing_analysis',
        uploaded_files_context: uploaded_files_context || undefined,
      }),
    })

    if (!pythonResponse.ok) {
      const errorData = await pythonResponse.json().catch(() => ({}))
      throw new Error(errorData.detail || 'Python service returned error')
    }

    const pythonData = await pythonResponse.json()
    const { video_id } = pythonData

    // Create video record in database
    const video = await prisma.video.create({
      data: {
        videoId: video_id,
        userId: user?.id || null,
        prompt: prompt,
        status: 'processing',
      },
      select: {
        id: true,
        videoId: true,
        userId: true,
        prompt: true,
        status: true,
        createdAt: true,
      }
    })

    // Create initial status record
    await prisma.videoStatus.create({
      data: {
        videoId: video_id,
        step: 0,
        message: 'Video generation started',
      }
    })

    return NextResponse.json({
      success: true,
      video_id: video_id,
      database_id: video.id,
      status: 'processing',
      message: 'Video generation started successfully',
    })

  } catch (error) {
    console.error('Generate video error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start video generation' },
      { status: 500 }
    )
  }
}
