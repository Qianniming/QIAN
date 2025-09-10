import React from 'react'
import type { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'

export const metadata: Metadata = {
  title: 'About Us - Company Story & Values',
  description: 'Learn about WELL-LI Cases - our company story, core values, leadership team, and commitment to manufacturing excellence in protective cases since our founding.',
  keywords: 'about WELL-LI, company story, protective cases manufacturer, company values, leadership team, manufacturing excellence',
  openGraph: {
    title: 'About WELL-LI Cases - Company Story & Values',
    description: 'Learn about our company story, core values, leadership team, and commitment to manufacturing excellence in protective cases.',
    images: ['/images/about-company.jpg'],
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}