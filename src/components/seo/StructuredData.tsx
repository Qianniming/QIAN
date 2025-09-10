import React from 'react'

interface StructuredDataProps {
  type: 'organization' | 'product' | 'breadcrumb'
  data: any
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  let structuredData

  switch (type) {
    case 'organization':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'WELL-LI Plastic Products Co., Ltd.',
        alternateName: 'WELL-LI Cases',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/images/logo.png`,
        description: 'Leading manufacturer of high-quality protective cases, safety cases, and custom solutions for global clients.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '123 Industrial Road',
          addressLocality: 'Guangzhou',
          addressRegion: 'Guangdong',
          postalCode: '510000',
          addressCountry: 'CN'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+86-20-1234-5678',
          contactType: 'customer service',
          availableLanguage: ['English', 'Chinese']
        },
        sameAs: [
          'https://www.linkedin.com/company/well-li-cases',
          'https://www.facebook.com/wellicases'
        ],
        foundingDate: '2010',
        numberOfEmployees: '50-100',
        industry: 'Manufacturing'
      }
      break

    case 'product':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        ...data
      }
      break

    case 'breadcrumb':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      }
      break

    default:
      return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export default StructuredData