'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Pacifico } from 'next/font/google';
import UserDropdown from './UserDropdown';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['cursive'],
  adjustFontFallback: false,
});

interface User {
  id: string;
  email: string;
  createdAt: string;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/me')
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]); // Re-check on route change

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();

    // If not on home page, navigate there first
    if (pathname !== '/') {
      router.push(`/#${targetId}`);
      return;
    }

    // Smooth scroll to section
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCreateVideo = () => {
    if (pathname === '/') {
      // Scroll to form on home page
      const form = document.querySelector('textarea');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        form.focus();
      }
    } else {
      // Navigate to home page
      router.push('/');
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-[90%]">
      <nav className="flex items-center justify-between px-8 py-6">
        {/* Logo */}
        <Link href="/" className={`text-2xl text-black hover:text-primary transition-colors ${pacifico.className}`}>
          ArisVideo
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className={`text-gray-800 hover:text-primary transition-colors font-medium ${
              isActive('/') ? 'text-primary' : ''
            }`}
          >
            Home
          </Link>
          <Link
            href="/explore"
            className={`text-gray-800 hover:text-primary transition-colors font-medium ${
              isActive('/explore') ? 'text-primary' : ''
            }`}
          >
            Explore
          </Link>
          <Link
            href="/my-videos"
            className={`text-gray-800 hover:text-primary transition-colors font-medium ${
              isActive('/my-videos') ? 'text-primary border-b-2 border-primary' : ''
            }`}
          >
            My Videos
          </Link>
          <a
            href="#how-it-works"
            onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
            className="text-gray-800 hover:text-primary transition-colors font-medium"
          >
            How It Works
          </a>
        </div>

        {/* Right Side: Create Video Button + User Area */}
        <div className="flex items-center gap-4">
          {/* Create Video Button */}
          <button
            onClick={handleCreateVideo}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:from-primary/90 hover:to-secondary/90 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <i className="ri-video-add-line text-lg"></i>
            <span>Create Video</span>
          </button>

          {/* User Area - Desktop Only */}
          <div className="hidden md:block">
            {user ? (
              <UserDropdown user={user} onSignOut={handleSignOut} />
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <button className="px-6 py-2 text-gray-700 hover:text-primary transition-colors font-medium">
                    Log In
                  </button>
                </Link>
                <Link href="/login?mode=signup">
                  <button className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:from-primary/90 hover:to-secondary/90 transition-all shadow-md hover:shadow-lg font-medium">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
          >
            <i className={`text-2xl ${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-8 pb-6">
          <div className="flex flex-col space-y-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors font-medium ${
                isActive('/') ? 'text-primary bg-primary/5' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors font-medium ${
                isActive('/explore') ? 'text-primary bg-primary/5' : ''
              }`}
            >
              Explore
            </Link>
            <Link
              href="/my-videos"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors font-medium ${
                isActive('/my-videos') ? 'text-primary bg-primary/5' : ''
              }`}
            >
              My Videos
            </Link>
            <a
              href="#how-it-works"
              onClick={(e) => {
                handleSmoothScroll(e, 'how-it-works');
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors font-medium"
            >
              How It Works
            </a>

            <button
              onClick={() => {
                handleCreateVideo();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all shadow-md font-medium"
            >
              <i className="ri-video-add-line text-lg"></i>
              <span>Create Video</span>
            </button>

            {user ? (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.email.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-red-200"
                >
                  <i className="ri-logout-box-line text-lg"></i>
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-6 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium border border-gray-200">
                      Log In
                    </button>
                  </Link>
                  <Link href="/login?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all shadow-md font-medium">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
