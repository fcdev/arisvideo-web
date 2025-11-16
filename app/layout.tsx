import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Use system fonts as a fallback to avoid Google Fonts connectivity issues
const systemFonts = {
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif'
  ].join(', '),
  mono: [
    'SF Mono',
    'Monaco',
    'Inconsolata',
    'Roboto Mono',
    'Source Code Pro',
    'Menlo',
    'Consolas',
    'monospace'
  ].join(', ')
};

export const metadata: Metadata = {
  title: {
    default: "ArisVideo - AI-Powered Educational Video Generator",
    template: "%s | ArisVideo"
  },
  description: "Transform any educational content into engaging animated videos with AI. Perfect for teachers, students, and content creators. Generate clear, concise video explanations in minutes.",
  keywords: ["educational videos", "AI video generator", "animated explanations", "learning videos", "teaching tools", "Manim", "video education", "visual learning"],
  authors: [{ name: "ArisVideo Team" }],
  creator: "ArisVideo",
  publisher: "ArisVideo",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "ArisVideo",
    title: "ArisVideo - AI-Powered Educational Video Generator",
    description: "Transform any educational content into engaging animated videos with AI. Perfect for teachers, students, and content creators.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArisVideo - Explain Everything Visually"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ArisVideo - AI-Powered Educational Video Generator",
    description: "Transform any educational content into engaging animated videos with AI.",
    images: ["/og-image.png"],
    creator: "@arisvideo"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css" />
      </head>
      <body
        className="antialiased bg-white"
        style={{
          fontFamily: systemFonts.sans,
          '--font-geist-sans': systemFonts.sans,
          '--font-geist-mono': systemFonts.mono
        } as React.CSSProperties}
      >
        <div className="flex flex-col min-h-screen bg-white">
          <header className="sticky top-0 z-50 bg-white shadow-sm">
            <Header />
          </header>
          <main className="flex-grow bg-white">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
