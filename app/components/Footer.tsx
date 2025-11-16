'use client';

import Link from 'next/link';
import { Pacifico } from 'next/font/google';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <Link href="/" className={`text-3xl text-black mb-6 block ${pacifico.className}`}>
              ArisVideo
            </Link>
            <p className="text-gray-600 mb-6">
              Creating engaging educational videos for effective visual learning.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-primary hover:bg-primary/5 transition-all shadow-sm hover:shadow-md"
                aria-label="Twitter"
              >
                <i className="ri-twitter-x-line text-lg"></i>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-primary hover:bg-primary/5 transition-all shadow-sm hover:shadow-md"
                aria-label="Facebook"
              >
                <i className="ri-facebook-fill text-lg"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-primary hover:bg-primary/5 transition-all shadow-sm hover:shadow-md"
                aria-label="Instagram"
              >
                <i className="ri-instagram-line text-lg"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-primary hover:bg-primary/5 transition-all shadow-sm hover:shadow-md"
                aria-label="LinkedIn"
              >
                <i className="ri-linkedin-fill text-lg"></i>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-black">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-600 hover:text-primary transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-black">Resources</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-600 hover:text-primary transition-colors">
                  Teaching Guides
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 hover:text-primary transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-gray-600 hover:text-primary transition-colors">
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-black">Legal</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {currentYear} ArisVideo. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <i className="ri-shield-check-line text-primary"></i>
                Secure & Private
              </span>
              <span className="flex items-center gap-2">
                <i className="ri-global-line text-primary"></i>
                Available Worldwide
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
