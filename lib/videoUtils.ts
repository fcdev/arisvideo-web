export function estimateVideoGenerationTime(prompt: string): number {
  // Estimate time based on prompt complexity
  const wordCount = prompt.trim().split(/\s+/).length;
  
  // Base time: 30 seconds
  let estimatedTime = 30;
  
  // Add time based on word count
  if (wordCount > 50) {
    estimatedTime += 30; // Complex prompt: add 30 seconds
  } else if (wordCount > 20) {
    estimatedTime += 15; // Medium prompt: add 15 seconds
  }
  
  // Add buffer for audio generation if needed
  estimatedTime += 15;
  
  // Return in seconds
  return estimatedTime;
}

export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return 'Wrapping up...';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  return `${remainingSeconds}s`;
}

export function getProgressMessage(elapsedTime: number, estimatedTime: number): string {
  const progress = (elapsedTime / estimatedTime) * 100;
  
  if (progress < 20) {
    return 'Analyzing your request...';
  } else if (progress < 40) {
    return 'Generating the video script...';
  } else if (progress < 60) {
    return 'Rendering the animation...';
  } else if (progress < 80) {
    return 'Adding narration...';
  } else if (progress < 95) {
    return 'Finalizing output...';
  } else {
    return 'Almost done...';
  }
}

export function parseVideoId(url: string): string | null {
  // Extract video ID from URL or return as-is if already an ID
  if (!url) return null;
  
  // If it's already just an ID (UUID format)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(url)) {
    return url;
  }
  
  // Try to extract from URL path
  const match = url.match(/\/video\/([0-9a-f-]+)/i);
  return match ? match[1] : null;
}
