import { Metadata } from 'next';
import Link from 'next/link';
import ExploreVideos from '../components/ExploreVideos';

export const metadata: Metadata = {
  title: 'Explore Videos',
  description: 'Discover amazing AI-generated educational videos created by the ArisVideo community. Browse through math, science, and more.',
  openGraph: {
    title: 'Explore Educational Videos | ArisVideo',
    description: 'Discover amazing AI-generated educational videos created by the ArisVideo community.',
  },
};

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <i className="ri-arrow-right-s-line"></i>
          <span className="text-gray-900 font-medium">Explore</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-black">
            Explore Videos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing AI-generated educational videos created by our community.
            From math and science to complex concepts made simple.
          </p>
        </div>

        {/* Explore Videos Component */}
        <ExploreVideos showHeader={false} />

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-12 border border-primary/10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-black">
              Ready to Create Your Own?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Transform your ideas into engaging animated videos with AI.
              It's quick, easy, and free to get started.
            </p>
            <Link href="/">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold hover:from-primary/90 hover:to-secondary/90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                <i className="ri-video-add-line text-xl"></i>
                <span>Create Your Video Now</span>
                <i className="ri-arrow-right-line"></i>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
