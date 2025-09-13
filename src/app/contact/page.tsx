import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch',
  description: 'Contact WELL-LI Cases for inquiries about protective cases, custom solutions, quotes, and support. Reach out to our team for professional assistance.',
  keywords: 'contact WELL-LI, protective cases inquiry, custom case quote, customer support, case manufacturer contact',
  openGraph: {
    title: 'Contact WELL-LI Cases - Get in Touch',
    description: 'Contact us for inquiries about protective cases, custom solutions, quotes, and support. Professional assistance available.',
    images: ['/images/contact-us.jpg'],
  },
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactPageClient />
    </Suspense>
  )
}