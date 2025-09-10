import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const ProductsPageClient = dynamic(() => import('./ProductsPageClient'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
})

export const metadata: Metadata = {
  title: 'Protective Cases Products',
  description: 'Browse our comprehensive range of protective cases including waterproof cases, tool cases, equipment cases, and custom solutions. Find the perfect case for your needs.',
  keywords: 'protective cases products, waterproof cases, tool cases, equipment cases, safety cases, custom cases, case catalog',
  openGraph: {
    title: 'Protective Cases Products | WELL-LI Cases',
    description: 'Browse our comprehensive range of protective cases including waterproof cases, tool cases, equipment cases, and custom solutions.',
    images: ['/images/products-overview.jpg'],
  },
}

export default function ProductsPage() {
  return <ProductsPageClient />
}