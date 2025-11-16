'use client';

import { useState, useEffect, useRef, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { Pacifico } from 'next/font/google';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  createdAt: string;
}

interface Video {
  id: string;
  videoId: string;
  prompt: string | null;
  videoUrl: string | null;
  duration: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  video_id?: string; // For compatibility
  video_url?: string | null; // For compatibility
}

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function VideoPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const videoId = resolvedParams.id;
  const [user, setUser] = useState<User | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const isAuthenticating = useRef(false);
  const isFetchingVideo = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticating.current) return;
      isAuthenticating.current = true;

      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          const currentUser = data.user;

          // Only update user state if it actually changed
          setUser(prevUser => {
            if (prevUser?.id !== currentUser?.id) {
              return currentUser;
            }
            return prevUser;
          });
        } else {
          router.push('/login');
        }
      } finally {
        isAuthenticating.current = false;
      }
    };

    initAuth();
  }, [router]);

  // Memoized fetch function to prevent unnecessary recreations
  const fetchVideo = useCallback(async () => {
    if (!user || !videoId || isFetchingVideo.current || videoLoaded) return;

    isFetchingVideo.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/videos/status/${videoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Video not found');
        }
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }

      const data = await response.json();

      // Check if video is completed and has a URL
      if (data.status !== 'completed' || !data.file_path) {
        router.push(`/video/${videoId}`);
        return;
      }

      // Adapt the response to match the Video interface
      setVideo({
        id: data.video_id,
        videoId: data.video_id,
        prompt: null, // Not available in status endpoint
        videoUrl: data.file_path,
        duration: data.duration,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      });
      setVideoLoaded(true);
    } catch (err) {
      console.error('Fetch video error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load video');
    } finally {
      setLoading(false);
      isFetchingVideo.current = false;
    }
  }, [user, videoId, router, videoLoaded]);

  // Fetch video only when user changes and video not loaded
  useEffect(() => {
    if (user && videoId && !videoLoaded && !isFetchingVideo.current) {
      fetchVideo();
    }
  }, [user, videoId, fetchVideo, videoLoaded]);

  const handleDownload = async () => {
    if (!video?.videoUrl) return;

    try {
      const response = await fetch(video.videoUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${videoId}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleShare = () => {
    const currentPageUrl = window.location.href;
    navigator.clipboard.writeText(currentPageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user && !loading) {
    return null; // Will redirect to login, no need to show loading
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-red-600 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Video Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested video could not be found'}</p>
          <Link
            href="/my-videos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <i className="ri-arrow-left-line"></i>
            Back to My Videos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link href="/my-videos" className="hover:text-gray-700 transition-colors">My Videos</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900 font-medium">Watch Video</span>
          </nav>
        </div>

        {/* Video Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black mb-2">
            {video.prompt ?
              (video.prompt.length > 100 ?
                `${video.prompt.substring(0, 100)}...` :
                video.prompt
              ) :
              `Video ${video.videoId.substring(0, 8)}...`
            }
          </h1>
          <p className="text-gray-600">AI-generated educational video</p>
        </div>

        {/* Video Player Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-t-2xl overflow-hidden">
              <video
                controls
                className="w-full h-full"
                poster={undefined}
              >
                <source src={video.videoUrl!} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Video Controls & Info */}
          <div className="p-6">
            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all font-medium"
              >
                <i className="ri-download-line text-lg"></i>
                Download Video
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-primary hover:text-primary transition-all font-medium"
              >
                <i className={copied ? "ri-check-line text-lg" : "ri-share-line text-lg"}></i>
                {copied ? 'Copied the share link!' : 'Share Video'}
              </button>
            </div>

            {/* Video Metadata */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <i className="ri-information-line text-primary"></i>
                Video Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <i className="ri-file-video-line text-gray-500"></i>
                  <span className="text-gray-600">Format: MP4</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="ri-hd-line text-gray-500"></i>
                  <span className="text-gray-600">Quality: HD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold hover:from-primary/90 hover:to-secondary/90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <i className="ri-add-line text-xl"></i>
            Create New Video
          </Link>
        </div>
      </div>
    </div>
  );
}
