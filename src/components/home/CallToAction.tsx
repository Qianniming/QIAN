'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { HiPhone, HiMail, HiLocationMarker, HiArrowRight } from 'react-icons/hi'
import { FaQuoteLeft } from 'react-icons/fa'

const testimonials = [
  {
    quote: "WELL-LI Cases provided exactly what we needed for our military operations. The quality and durability are exceptional.",
    author: "John Smith",
    position: "Operations Manager",
    company: "Defense Solutions Inc.",
    rating: 5
  },
  {
    quote: "Outstanding customer service and product quality. Our medical equipment has never been better protected.",
    author: "Dr. Sarah Johnson",
    position: "Chief Medical Officer",
    company: "MedTech Global",
    rating: 5
  },
  {
    quote: "The custom cases exceeded our expectations. Perfect fit, excellent protection, and delivered on time.",
    author: "Michael Chen",
    position: "Equipment Manager",
    company: "Industrial Solutions Ltd.",
    rating: 5
  }
]

const contactInfo = [
  {
    icon: HiPhone,
    title: 'Call Us',
    content: '+86 20 1234 5678',
    description: 'Mon-Fri 9AM-6PM (GMT+8)'
  },
  {
    icon: HiMail,
    title: 'Email Us',
    content: 'info@wellicases.com',
    description: 'Quick response within 24 hours'
  },
  {
    icon: HiLocationMarker,
    title: 'Visit Us',
    content: 'Guangzhou, China',
    description: 'Factory tours available'
  }
]

export default function CallToAction() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          ref={ref}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Trusted by <span className="text-primary-400">Professionals</span> Worldwide
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
            See what our clients say about our protective cases and customer service.
          </p>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-4">
                  <FaQuoteLeft className="h-8 w-8 text-primary-400" />
                </div>
                <p className="text-gray-200 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-white/20 pt-4">
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-sm text-gray-300">{testimonial.position}</div>
                  <div className="text-sm text-primary-400">{testimonial.company}</div>
                  <div className="flex justify-center mt-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main CTA Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - CTA Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Protect Your <span className="text-primary-400">Equipment</span>?
            </h3>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Get a custom quote for your protective case requirements. Our team of experts 
              will work with you to design the perfect solution for your needs.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-400 rounded-full" />
                <span className="text-gray-200">Free consultation and design review</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-400 rounded-full" />
                <span className="text-gray-200">Custom manufacturing capabilities</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-400 rounded-full" />
                <span className="text-gray-200">Worldwide shipping and support</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-400 rounded-full" />
                <span className="text-gray-200">Quality guarantee and warranty</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="group bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 btn-hover"
              >
                <span>Get Custom Quote</span>
                <HiArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/products"
                className="group border-2 border-white/30 hover:border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Browse Catalog</span>
              </Link>
            </div>
          </motion.div>

          {/* Right Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-6"
          >
            <h4 className="text-2xl font-bold mb-6">Get in Touch</h4>
            
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-600 rounded-lg flex-shrink-0">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white mb-1">{info.title}</h5>
                    <p className="text-primary-400 font-medium mb-1">{info.content}</p>
                    <p className="text-sm text-gray-300">{info.description}</p>
                  </div>
                </div>
              )
            })}

            {/* Additional Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h5 className="font-semibold text-white mb-3">Why Choose WELL-LI?</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• 15+ years of manufacturing experience</li>
                <li>• ISO certified quality management</li>
                <li>• 500+ satisfied global clients</li>
                <li>• Custom solutions for any requirement</li>
                <li>• Competitive pricing and fast delivery</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}