'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  HiShieldCheck, 
  HiBeaker, 
  HiClipboardCheck,
  HiCog,
  HiAcademicCap,
  HiStar,
  HiCheckCircle,
  HiLightningBolt,
  HiEye,
  HiTrendingUp,
  HiRefresh
} from 'react-icons/hi'

interface QualityProcess {
  icon: React.ElementType
  title: string
  description: string
  details: string[]
}

interface Certification {
  name: string
  description: string
  logo: string
  validUntil: string
  scope: string
}

interface TestingStandard {
  standard: string
  title: string
  description: string
  testMethods: string[]
}

interface SafetyFeature {
  icon: React.ElementType
  title: string
  description: string
  benefits: string[]
}

const qualityProcesses: QualityProcess[] = [
  {
    icon: HiBeaker,
    title: 'Material Testing',
    description: 'Rigorous testing of raw materials to ensure optimal performance and durability.',
    details: [
      'Chemical composition analysis',
      'Mechanical property testing',
      'Environmental resistance testing',
      'UV stability assessment'
    ]
  },
  {
    icon: HiCog,
    title: 'Production Control',
    description: 'Continuous monitoring and control throughout the manufacturing process.',
    details: [
      'Real-time process monitoring',
      'Statistical process control',
      'Automated quality checks',
      'Batch tracking and traceability'
    ]
  },
  {
    icon: HiEye,
    title: 'Inspection & Testing',
    description: 'Comprehensive inspection and testing at every stage of production.',
    details: [
      'Incoming material inspection',
      'In-process quality checks',
      'Final product testing',
      'Random sampling audits'
    ]
  },
  {
    icon: HiRefresh,
    title: 'Continuous Improvement',
    description: 'Ongoing analysis and improvement of quality systems and processes.',
    details: [
      'Customer feedback analysis',
      'Process optimization',
      'Technology upgrades',
      'Staff training programs'
    ]
  }
]

const certifications: Certification[] = [
  {
    name: 'ISO 9001:2015',
    description: 'Quality Management System certification ensuring consistent quality and customer satisfaction.',
    logo: '/images/certifications/iso-9001.png',
    validUntil: '2026',
    scope: 'Design, development, and manufacturing of protective cases'
  },
  {
    name: 'ISO 14001:2015',
    description: 'Environmental Management System certification demonstrating our commitment to sustainability.',
    logo: '/images/certifications/iso-14001.png',
    validUntil: '2025',
    scope: 'Environmental management in manufacturing operations'
  },
  {
    name: 'ROHS Compliance',
    description: 'Restriction of Hazardous Substances compliance ensuring product safety and environmental protection.',
    logo: '/images/certifications/rohs.png',
    validUntil: 'Ongoing',
    scope: 'All plastic materials and components'
  },
  {
    name: 'CE Marking',
    description: 'European Conformity marking indicating compliance with EU safety, health, and environmental requirements.',
    logo: '/images/certifications/ce.png',
    validUntil: 'Ongoing',
    scope: 'Products sold in European Economic Area'
  }
]

const testingStandards: TestingStandard[] = [
  {
    standard: 'IP67/IP68',
    title: 'Ingress Protection Rating',
    description: 'Waterproof and dustproof testing to ensure complete protection against environmental elements.',
    testMethods: [
      'Dust chamber testing (8 hours)',
      'Water immersion testing (30 minutes at 1m depth)',
      'Pressure testing for IP68 rated products',
      'Temperature cycling during exposure'
    ]
  },
  {
    standard: 'MIL-STD-810G',
    title: 'Military Standard Testing',
    description: 'Comprehensive environmental testing to military specifications for extreme conditions.',
    testMethods: [
      'Temperature shock testing (-40°C to +60°C)',
      'Vibration and shock resistance',
      'Altitude and pressure testing',
      'Humidity and salt spray testing'
    ]
  },
  {
    standard: 'STANAG 4280',
    title: 'NATO Standardization Agreement',
    description: 'NATO standard for reusable containers ensuring military-grade protection.',
    testMethods: [
      'Drop testing from various heights',
      'Compression and stacking tests',
      'Environmental exposure testing',
      'Functional testing after stress'
    ]
  },
  {
    standard: 'ATA 300',
    title: 'Air Transport Association',
    description: 'Airline transport standards for shipping cases and containers.',
    testMethods: [
      'Vibration testing (airline transport simulation)',
      'Drop and impact testing',
      'Pressure differential testing',
      'Temperature and humidity cycling'
    ]
  }
]

const safetyFeatures: SafetyFeature[] = [
  {
    icon: HiShieldCheck,
    title: 'Impact Protection',
    description: 'Advanced shock absorption and impact resistance to protect valuable equipment.',
    benefits: [
      'Multi-layer protection system',
      'Energy-absorbing materials',
      'Reinforced corner design',
      'Tested to military standards'
    ]
  },
  {
    icon: HiLightningBolt,
    title: 'Environmental Sealing',
    description: 'Complete protection against water, dust, and environmental contaminants.',
    benefits: [
      'IP67/IP68 waterproof rating',
      'Dust-tight construction',
      'Pressure relief valve',
      'Chemical resistance'
    ]
  },
  {
    icon: HiAcademicCap,
    title: 'Security Features',
    description: 'Advanced locking mechanisms and security options for valuable equipment.',
    benefits: [
      'PowerClaw latching system',
      'TSA-approved locks available',
      'Tamper-evident seals',
      'Custom security solutions'
    ]
  },
  {
    icon: HiTrendingUp,
    title: 'Temperature Stability',
    description: 'Reliable performance across extreme temperature ranges.',
    benefits: [
      'Operating range: -40°C to +60°C',
      'Thermal shock resistance',
      'UV stabilized materials',
      'Dimensional stability'
    ]
  }
]

export default function QualityPageClient() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [processRef, processInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [certRef, certInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [testingRef, testingInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [safetyRef, safetyInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section ref={heroRef} className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Quality & <span className="text-blue-300">Safety Standards</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Ensuring excellence through rigorous testing, international certifications, 
              and unwavering commitment to quality in every protective case we manufacture.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quality Process Section */}
      <section ref={processRef} className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Quality Process
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              From raw materials to finished products, every step is carefully monitored 
              and controlled to ensure exceptional quality.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {qualityProcesses.map((process, index) => {
              const Icon = process.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={processInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-blue-600 mb-4">
                    <Icon className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{process.title}</h3>
                  <p className="text-gray-600 mb-4">{process.description}</p>
                  <ul className="space-y-2">
                    {process.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start space-x-2">
                        <HiCheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section ref={certRef} className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={certInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              International Certifications
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to quality is validated by internationally recognized 
              certifications and compliance standards.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={certInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 sm:p-8 text-center hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center shadow-md">
                  <HiShieldCheck className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{cert.description}</p>
                <div className="text-xs text-gray-500">
                  <p className="mb-1"><strong>Valid Until:</strong> {cert.validUntil}</p>
                  <p><strong>Scope:</strong> {cert.scope}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testing Standards Section */}
      <section ref={testingRef} className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={testingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Testing Standards
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Our products undergo rigorous testing according to international standards 
              to ensure they meet the most demanding requirements.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {testingStandards.map((standard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={testingInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-lg p-3 mr-4">
                    <HiClipboardCheck className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{standard.standard}</h3>
                    <p className="text-lg text-blue-600 font-semibold">{standard.title}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{standard.description}</p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Test Methods:</h4>
                  <ul className="space-y-1">
                    {standard.testMethods.map((method, methodIndex) => (
                      <li key={methodIndex} className="flex items-start space-x-2">
                        <HiStar className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-1" />
                        <span className="text-sm text-gray-700">{method}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Features Section */}
      <section ref={safetyRef} className="bg-gray-100 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={safetyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Safety Features
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced safety features designed to protect your valuable equipment 
              in the most challenging environments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {safetyFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={safetyInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-green-600 mb-4">
                    <Icon className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start space-x-2">
                        <HiCheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Experience Quality You Can Trust
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              Ready to protect your valuable equipment with our quality-assured protective cases? 
              Contact our quality team for detailed specifications and certifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="bg-white hover:bg-gray-100 text-blue-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors duration-300"
              >
                View Quality Products
              </a>
              <a
                href="/contact"
                className="bg-transparent hover:bg-white/10 text-white border-2 border-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors duration-300"
              >
                Contact Quality Team
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}