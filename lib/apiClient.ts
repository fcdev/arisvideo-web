export interface GenerateVideoPayload {
  prompt: string;
  include_audio?: boolean;
  voice?: string;
  language?: string;
  sync_method?: string;
  uploaded_files_context?: string;
}

export interface VideoResponse {
  video_id: string;
  video_url: string;
  status: string;
  message: string;
}

export async function generateVideoRequest(payload: GenerateVideoPayload): Promise<VideoResponse> {
  const response = await fetch('/api/videos/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to generate video: ${response.statusText}`);
  }

  return response.json();
}
