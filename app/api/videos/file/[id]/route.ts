import { NextRequest, NextResponse } from 'next/server'

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'
const PYTHON_API_KEY = process.env.PYTHON_API_KEY || ''

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params

    // Get range header from client request
    const range = request.headers.get('range')

    // Prepare headers for Python service request
    const pythonHeaders: HeadersInit = {
      'X-API-Key': PYTHON_API_KEY,
    }

    // Forward range header if present (for video seeking)
    if (range) {
      pythonHeaders['Range'] = range
    }

    // Fetch video file from Python service
    const pythonResponse = await fetch(`${PYTHON_SERVICE_URL}/video/${videoId}`, {
      headers: pythonHeaders,
    })

    if (!pythonResponse.ok) {
      if (pythonResponse.status === 404) {
        return NextResponse.json(
          { error: 'Video file not found' },
          { status: 404 }
        )
      }
      throw new Error('Failed to fetch video from Python service')
    }

    // Stream the video response directly (don't buffer in memory)
    const responseHeaders = new Headers({
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
    })

    // Copy relevant headers from Python service response
    const headersToForward = ['content-length', 'content-range', 'content-type']
    headersToForward.forEach(header => {
      const value = pythonResponse.headers.get(header)
      if (value) {
        responseHeaders.set(header, value)
      }
    })

    // Determine status code (206 for partial content, 200 for full)
    const status = pythonResponse.status === 206 ? 206 : 200

    // Stream the response body directly from Python service
    return new NextResponse(pythonResponse.body, {
      status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('Get video file error:', error)
    return NextResponse.json(
      { error: 'Failed to get video file' },
      { status: 500 }
    )
  }
}
