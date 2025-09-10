'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { HiShieldCheck, HiCog, HiGlobe } from 'react-icons/hi'
import { FaWater, FaTools, FaAward } from 'react-icons/fa'

const values = [
  {
    icon: HiShieldCheck,
    title: 'Strong & Durable',
    description: 'Built with high-grade materials to withstand extreme conditions and protect your valuable equipment.',
    features: ['Impact Resistant', 'Long-lasting', 'Military Grade']
  },
  {
    icon: FaWater,
    title: 'Waterproof & Dustproof',
    description: 'IP67 rated protection ensures your equipment stays safe from water, dust, and environmental hazards.',
    features: ['IP67 Rating', 'Sealed Design', 'All-Weather Protection']
  },
  {
    icon: HiCog,
    title: 'Custom Solutions',
    description: 'Tailored manufacturing to meet your specific requirements with flexible design and production capabilities.',
    features: ['Custom Sizing', 'Foam Inserts', 'Branding Options']
  },
  {
    icon: FaTools,
    title: 'Professional Grade',
    description: 'Trusted by professionals worldwide for mission-critical applications and demanding environments.',
    features: ['Industry Standard', 'Quality Tested', 'Professional Use']
  },
  {
    icon: HiGlobe,
    title: 'Global Reach',
    description: 'Serving clients worldwide with reliable shipping and comprehensive customer support.',
    features: ['Worldwide Shipping', '24/7 Support', 'Local Partners']
  },
  {
    icon: FaAward,
    title: 'Quality Certified',
    description: 'ISO certified manufacturing processes ensure consistent quality and reliability in every product.',
    features: ['ISO Certified', 'Quality Control', 'Tested Standards']
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
}

export default function BrandValues() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          ref={ref}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-primary-600">WELL-LI Cases</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We combine advanced manufacturing techniques with premium materials to deliver 
            protective cases that exceed industry standards and customer expectations.
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-lg mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {value.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {value.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Protect Your Equipment?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Get a custom quote for your protective case requirements today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Get Quote
              </motion.a>
              <motion.a
                href="/products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                View Products
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}