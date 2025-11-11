import { NextRequest, NextResponse } from 'next/server';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
const PYTHON_API_KEY = process.env.PYTHON_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Prepare multipart form data for Python service
    const pythonFormData = new FormData();
    for (const file of files) {
      pythonFormData.append('files', file);
    }

    console.log('Uploading files to Python service:', `${PYTHON_SERVICE_URL}/upload`);

    // Forward to Python service with API key
    const response = await fetch(`${PYTHON_SERVICE_URL}/upload`, {
      method: 'POST',
      headers: {
        'X-API-Key': PYTHON_API_KEY,
      },
      body: pythonFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      console.error('Python service upload error:', response.status, errorData);
      return NextResponse.json(
        { error: errorData.error || `File upload failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('File upload successful:', result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Upload API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error during file upload' },
      { status: 500 }
    );
  }
}