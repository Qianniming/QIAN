import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StructuredData from '@/components/seo/StructuredData'
import ErrorBoundary from '@/components/common/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'WELL-LI Cases - Professional Protective Cases Manufacturer',
    template: '%s | WELL-LI Cases'
  },
  description: 'WELL-LI Plastic Products Co., Ltd. - Leading manufacturer of high-quality protective cases, safety cases, and custom solutions for global clients.',
  keywords: 'protective cases, safety cases, plastic cases, tool cases, custom cases, manufacturer, WELL-LI',
  authors: [{ name: 'WELL-LI Cases' }],
  creator: 'WELL-LI Plastic Products Co., Ltd.',
  publisher: 'WELL-LI Cases',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'WELL-LI Cases - Professional Protective Cases Manufacturer',
    description: 'Leading manufacturer of high-quality protective cases, safety cases, and custom solutions for global clients.',
    siteName: 'WELL-LI Cases',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WELL-LI Cases - Professional Protective Cases',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WELL-LI Cases - Professional Protective Cases Manufacturer',
    description: 'Leading manufacturer of high-quality protective cases, safety cases, and custom solutions for global clients.',
    images: ['/images/og-image.jpg'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <StructuredData type="organization" data={{}} />
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}