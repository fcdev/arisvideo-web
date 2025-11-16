'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  createdAt: string;
}

interface UserDropdownProps {
  user: User;
  onSignOut: () => void;
}

export default function UserDropdown({ user, onSignOut }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Get user initials for avatar
  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-gray-100 transition-all"
      >
        {/* Avatar */}
        <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
          {getInitials(user.email)}
        </div>

        {/* Email preview (hidden on mobile) */}
        <span className="hidden md:block text-gray-700 text-sm font-medium max-w-[150px] truncate">
          {user.email}
        </span>

        {/* Dropdown arrow */}
        <i className={`ri-arrow-down-s-line text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {getInitials(user.email)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                <p className="text-xs text-gray-500">Account Settings</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/my-videos"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <i className="ri-video-line text-lg text-gray-400"></i>
              <span className="text-sm font-medium">My Videos</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <i className="ri-settings-3-line text-lg text-gray-400"></i>
              <span className="text-sm font-medium">Settings</span>
              <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Soon</span>
            </Link>

            <Link
              href="/help"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <i className="ri-question-line text-lg text-gray-400"></i>
              <span className="text-sm font-medium">Help & Support</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* Sign Out */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
            >
              <i className="ri-logout-box-line text-lg"></i>
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
