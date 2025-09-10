import React from 'react'
import type { Metadata } from 'next'
import QualityPageClient from './QualityPageClient'

export const metadata: Metadata = {
  title: 'Quality & Safety Standards',
  description: 'Discover WELL-LI Cases quality assurance processes, safety standards, certifications, and testing procedures. We ensure every protective case meets the highest industry standards.',
  keywords: 'quality assurance, safety standards, case testing, certifications, ISO standards, quality control, protective case safety',
  openGraph: {
    title: 'Quality & Safety Standards | WELL-LI Cases',
    description: 'Discover our quality assurance processes, safety standards, certifications, and testing procedures for protective cases.',
    images: ['/images/quality-testing.jpg'],
  },
}

export default function QualityPage() {
  return <QualityPageClient />
}