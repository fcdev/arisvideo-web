'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface VideoStatus {
  video_id: string;
  video_url: string | null;
  build_status: string;
  terminal_output?: string[];
  is_complete: boolean;
  error?: string;
  steps?: Array<{
    step: number;
    build_status: string;
    created_at: string;
  }>;
  current_step?: number;
  total_steps?: number;
}

export default function VideoProgressPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [status, setStatus] = useState<VideoStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Get the video ID from params
    params.then((p) => setVideoId(p.id));
  }, [params]);

  useEffect(() => {
    if (!videoId) return;

    // Start polling for status
    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/videos/status/${videoId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }

        const data = await response.json();

        // Adapt the new status format to the old interface
        const adaptedStatus: VideoStatus = {
          video_id: data.video_id,
          video_url: data.file_path,
          build_status: data.message || data.status,
          is_complete: data.status === 'completed',
          error: data.error,
          current_step: data.step,
          total_steps: 4, // Estimate based on generation process
        };

        setStatus(adaptedStatus);

        // If complete, redirect to video page
        if (data.status === 'completed' && data.file_path) {
          if (pollingInterval.current) clearInterval(pollingInterval.current);

          // Redirect to completion page
          router.push(`/video/${videoId}/complete`);
        }

        // If error, stop polling
        if (data.status === 'failed' || data.error) {
          if (pollingInterval.current) clearInterval(pollingInterval.current);
          setError(data.error || 'Video generation failed');
        }
      } catch (err) {
        console.error('Error polling status:', err);
        setError('Unable to fetch video generation status');
      }
    };

    // Initial poll
    pollStatus();
    
    // Set up polling interval (every 2 seconds)
    pollingInterval.current = setInterval(pollStatus, 2000);
    
    // Cleanup
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [videoId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <div className="w-10 h-10 border-3 border-white/50 border-t-white rounded-full animate-spin"></div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Your video is on the way</h1>
            <p className="text-blue-100 text-lg">Hang tight while AI crafts something great...</p>
          </div>
          
          {/* Status Section */}
          <div className="p-8">
            {/* Current Status Message */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <span className="text-blue-800 font-semibold text-lg">
                  {status?.build_status || 'Booting up...'}
                </span>
              </div>
            </div>
            
            {/* Step Progress - Show all steps from status table */}
            {status?.steps && status.steps.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-3 justify-center">
                  <i className="ri-list-check-line text-blue-600"></i>
                  Generation status
                </h3>
                <div className="space-y-4">
                  {status.steps.map((step, index) => {
                    const isCurrentStep = step.step === status.current_step;
                    const isCompleted = step.step < (status.current_step || 0);
                    const isPending = step.step > (status.current_step || 0);
                    
                    return (
                      <div 
                        key={index}
                        className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                          isCurrentStep 
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 shadow-md' 
                            : isCompleted 
                            ? 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200' 
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {/* Step Number/Icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 flex-shrink-0 ${
                          isCurrentStep 
                            ? 'bg-blue-500 text-white scale-110 shadow-lg' 
                            : isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {isCompleted ? '✓' : step.step}
                        </div>
                        
                        {/* Step Content */}
                        <div className="flex-1 min-w-0">
                          <div className={`text-lg ${
                            isCurrentStep 
                              ? 'text-blue-800 font-semibold' 
                              : isCompleted 
                              ? 'text-green-700' 
                              : 'text-gray-600'
                          }`}>
                            {step.build_status}
                          </div>
                          {step.created_at && (
                            <div className="text-xs text-gray-400 mt-2">
                              {new Date(step.created_at).toLocaleString('zh-CN')}
                            </div>
                          )}
                        </div>
                        
                        {/* Current Step Indicator */}
                        {isCurrentStep && (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm text-blue-600 font-medium">In progress</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            

            
            {/* Terminal Output (Optional) */}
            {status?.terminal_output && status.terminal_output.length > 0 && (
              <div className="mb-6">
                <details className="group">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2">
                    <i className="ri-terminal-box-line"></i>
                    View detailed logs
                    <i className="ri-arrow-down-s-line group-open:rotate-180 transition-transform"></i>
                  </summary>
                  <div className="mt-4 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-48 overflow-y-auto">
                    {status.terminal_output.slice(-10).map((line, index) => (
                      <div key={index} className="whitespace-pre-wrap">{line}</div>
                    ))}
                  </div>
                </details>
              </div>
            )}
            
            {/* Error State */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-error-warning-line text-red-600 text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-red-800 font-bold mb-1">Generation failed</h3>
                    <p className="text-red-700">{error}</p>
                    <button 
                      onClick={() => router.push('/')}
                      className="mt-4 text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                    >
                      <i className="ri-arrow-left-line"></i>
                      Go back home and try again
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tips Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i className="ri-lightbulb-line text-yellow-500"></i>
                Did you know?
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• AI picks the animation style that best fits your prompt</p>
                <p>• Every render includes professional narration when enabled</p>
                <p>• No two videos are the same—each is generated from scratch</p>
                <p>• You can watch every generation step update in real time</p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Video ID: {videoId || 'Loading...'}</span>
              <span className="flex items-center gap-2">
                <i className="ri-shield-check-line text-green-500"></i>
                Secure generation in progress
              </span>
            </div>
          </div>
        </div>
        
        {/* Help Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          This page refreshes automatically—no manual action needed
        </p>
      </div>
    </div>
  );
}
