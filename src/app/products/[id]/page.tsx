'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  HiHeart, 
  HiOutlineHeart, 
  HiShare, 
  HiDownload,
  HiShieldCheck,
  HiCube,
  HiCog,
  HiStar,
  HiChevronLeft,
  HiChevronRight,
  HiZoomIn,
  HiX
} from 'react-icons/hi'
import Link from 'next/link'
import Image from 'next/image'
import ProductInquiryForm from '@/components/products/ProductInquiryForm'

interface Product {
  _id: string
  id: string
  name: string
  category: string
  description: string
  fullDescription?: string
  image: string
  images?: string[]
  specifications: {
    dimensions: string
    weight: string
    material: string
    waterproof: string
    [key: string]: string
  }
  features: string[]
  applications: string[]
  certifications?: string[]
  colors?: { name: string; code: string }[]
  accessories?: string[]
  price?: string
}

// Fetch product data from API
const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`/api/products/${id}`)
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    return data.product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

interface ProductDetailPageProps {
  params: { id: string }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isInquiryFormOpen, setIsInquiryFormOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const [activeTab, setActiveTab] = useState('specifications')
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const productData = await getProductById(params.id)
        if (productData) {
          setProduct(productData)
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError('Failed to load product')
        console.error('Error loading product:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error === 'Product not found' ? 'Product Not Found' : 'Error Loading Product'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error === 'Product not found' 
              ? 'The product you are looking for does not exist or has been removed.' 
              : 'There was an error loading the product details. Please try again later.'}
          </p>
          <Link 
            href="/products" 
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
          >
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  // Get images array - use images if available, otherwise use single image
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image]

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Product link copied to clipboard!')
    }
  }

  const handleInquiry = () => {
    // Navigate to contact page with product information
    const _productInfo = {
      name: product.name,
      model: product.id,
      category: product.category
    }
    const queryParams = new URLSearchParams({
      product: product.name,
      model: product.id,
      subject: `Inquiry about ${product.name}`
    })
    window.location.href = `/contact?${queryParams.toString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden group">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setIsImageModalOpen(true)}
                className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <HiZoomIn className="h-5 w-5" />
              </button>
              
              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <HiChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <HiChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-primary-600 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-primary-600 font-medium mb-2">{product.category}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">{product.price || 'Contact for Quote'}</div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-300"
                >
                  {isFavorite ? (
                    <HiHeart className="h-5 w-5 text-red-500" />
                  ) : (
                    <HiOutlineHeart className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-300"
                >
                  <HiShare className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Available Colors</h3>
                <div className="flex items-center space-x-3">
                  {product.colors.map((color: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                        selectedColor === index
                          ? 'border-gray-900 ring-2 ring-gray-300'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.features.slice(0, 4).map((feature: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <HiShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleInquiry}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <span>Send Inquiry</span>
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2">
                <HiDownload className="h-5 w-5" />
                <span>Download Datasheet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'specifications', label: 'Specifications', icon: HiCube },
                  { id: 'features', label: 'Features', icon: HiShieldCheck },
                  { id: 'applications', label: 'Applications', icon: HiCog },
                  { id: 'certifications', label: 'Certifications', icon: HiStar }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-300 ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-600">{value as string}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'features' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <HiShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'applications' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.applications.map((application: string, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                      <HiCog className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-900">{application}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'certifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(product.certifications || []).map((cert: string, index: number) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <HiStar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <span className="text-sm font-medium text-green-900">{cert}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-all duration-300 z-10"
            >
              <HiX className="h-6 w-6" />
            </button>
            <Image
              src={productImages[selectedImage]}
              alt={product.name}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Product Inquiry Form Modal */}
      {isInquiryFormOpen && (
        <ProductInquiryForm
          product={product}
          isOpen={isInquiryFormOpen}
          onClose={() => setIsInquiryFormOpen(false)}
        />
      )}
    </div>
  )
}