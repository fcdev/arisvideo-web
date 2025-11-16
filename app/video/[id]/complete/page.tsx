'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pacifico } from 'next/font/google';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

interface VideoData {
  video_id: string;
  video_url: string;
  created_at?: string;
}

export default function VideoCompletePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    // Get the video ID from params
    params.then((p) => setVideoId(p.id));
  }, [params]);

  useEffect(() => {
    if (!videoId) return;
    fetchVideoData();
  }, [videoId]);

  const fetchVideoData = async () => {
    if (!videoId) return;

    try {
      console.log('Fetching video data for:', videoId);

      // Get video status from our API
      const response = await fetch(`/api/videos/status/${videoId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No record found for video ID ${videoId}. Double-check the link or the video may have been removed.`);
        }
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Video status:', data);

      if (data.status === 'completed' && data.file_path) {
        // Video is ready
        setVideoData({
          video_id: data.video_id,
          video_url: data.file_path,
          created_at: data.updated_at,
        });
      } else if (data.status === 'processing') {
        // Still generating, redirect back to progress page
        router.push(`/video/${videoId}`);
      } else if (data.status === 'failed') {
        throw new Error(data.error || 'Video generation failed');
      } else {
        throw new Error('Video is not finished yet');
      }

    } catch (err) {
      console.error('Error fetching video:', err);
      setError(err instanceof Error ? err.message : 'Unable to load video');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoData?.video_url) return;
    
    try {
      const response = await fetch(videoData.video_url);
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

  const handleCopyLink = () => {
    if (!videoData?.video_url) return;
    
    navigator.clipboard.writeText(videoData.video_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!videoData?.video_url || !navigator.share) return;
    
    navigator.share({
      title: 'My AI-generated video',
      text: 'Check out this educational video I built with ArisVideo!',
      url: videoData.video_url
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-red-600 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to load</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load video'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className={`text-2xl text-black ${pacifico.className}`}>ArisVideo</a>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <i className="ri-arrow-left-line"></i>
              Back to home
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <i className="ri-check-line text-white text-4xl"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎉 Video ready!
          </h1>
          <p className="text-xl text-gray-600">
            Your AI-generated education video is all set
          </p>
        </div>

        {/* Video Player Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="p-8">
            {/* Video Player */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-black mb-8">
              <video 
                controls 
                autoPlay
                className="w-full h-auto"
                style={{ maxHeight: '600px' }}
              >
                <source src={videoData.video_url} type="video/mp4" />
                Your browser does not support video playback.
              </video>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all font-bold"
              >
                <i className="ri-download-cloud-line text-xl"></i>
                Download video
              </button>
              
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-blue-500 hover:text-blue-600 transition-all font-bold"
              >
                <i className={copied ? "ri-check-line text-xl" : "ri-link text-xl"}></i>
                {copied ? 'Copied!' : 'Copy link'}
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all font-bold"
              >
                <i className="ri-share-line text-xl"></i>
                Share video
              </button>
            </div>

            {/* Video Info */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-information-line text-blue-600"></i>
                Video info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <i className="ri-file-video-line text-gray-500"></i>
                  <span className="text-gray-600">Format: MP4</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ri-hd-line text-gray-500"></i>
                  <span className="text-gray-600">Quality: HD</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ri-time-line text-gray-500"></i>
                  <span className="text-gray-600">
                    Generated: {videoData.created_at ? new Date(videoData.created_at).toLocaleString('en-US') : 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ri-key-line text-gray-500"></i>
                  <span className="text-gray-600">ID: {videoId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">Ready to make another video?</p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition-all text-lg"
          >
            <i className="ri-add-line mr-2"></i>
            Create another video
          </button>
        </div>

        {/* Tips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-lightbulb-line text-blue-600 text-xl"></i>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Pro tip</h3>
            <p className="text-sm text-gray-600">
              Share the video on social media to show off what AI can create
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-shield-check-line text-green-600 text-xl"></i>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Always available</h3>
            <p className="text-sm text-gray-600">
              Your video stays in the cloud so you can access or download it anytime
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-magic-line text-purple-600 text-xl"></i>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">More coming soon</h3>
            <p className="text-sm text-gray-600">
              Video editing, subtitle tweaks, and more powerful tools are on the way
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
