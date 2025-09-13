'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  HiOfficeBuilding, 
  HiUsers, 
  HiGlobeAlt, 
  HiAcademicCap,
  HiShieldCheck,
  HiLightBulb,
  HiHeart,
  HiTrendingUp,
  HiStar,
  HiCheckCircle
} from 'react-icons/hi'

interface TeamMember {
  name: string
  position: string
  image: string
  description: string
}

interface Milestone {
  year: string
  title: string
  description: string
}

interface Value {
  icon: React.ElementType
  title: string
  description: string
}

interface Achievement {
  number: string
  label: string
  description: string
}

const teamMembers: TeamMember[] = [
  {
    name: 'Li Wei',
    position: 'CEO & Founder',
    image: '/images/hero/hero-1.svg',
    description: 'With over 20 years of experience in manufacturing, Li Wei founded WELL-LI to revolutionize protective case solutions.'
  },
  {
    name: 'Zhang Ming',
    position: 'Chief Technology Officer',
    image: '/images/hero/hero-2.svg',
    description: 'Leading our R&D team with expertise in materials science and innovative design solutions.'
  },
  {
    name: 'Wang Hua',
    position: 'Quality Director',
    image: '/images/hero/hero-3.svg',
    description: 'Ensuring every product meets the highest international standards with rigorous quality control processes.'
  },
  {
    name: 'Chen Lu',
    position: 'International Sales Manager',
    image: '/images/products/industrial-case-1.svg',
    description: 'Building global partnerships and delivering exceptional customer service worldwide.'
  }
]

const milestones: Milestone[] = [
  {
    year: '2003',
    title: 'Company Founded',
    description: 'WELL-LI Plastic Products Co., Ltd. was established in Guangzhou with a vision to create superior protective solutions.'
  },
  {
    year: '2008',
    title: 'International Expansion',
    description: 'Began exporting to North America and Europe, establishing our global presence.'
  },
  {
    year: '2012',
    title: 'ISO Certification',
    description: 'Achieved ISO 9001:2015 certification, demonstrating our commitment to quality management.'
  },
  {
    year: '2015',
    title: 'Advanced Manufacturing',
    description: 'Invested in state-of-the-art injection molding equipment and automated production lines.'
  },
  {
    year: '2018',
    title: 'R&D Center',
    description: 'Established dedicated research and development center for innovative product design.'
  },
  {
    year: '2020',
    title: 'Sustainability Initiative',
    description: 'Launched eco-friendly manufacturing processes and sustainable material research.'
  },
  {
    year: '2023',
    title: 'Global Recognition',
    description: 'Recognized as a leading manufacturer with customers in over 50 countries worldwide.'
  }
]

const values: Value[] = [
  {
    icon: HiShieldCheck,
    title: 'Quality First',
    description: 'We never compromise on quality. Every product undergoes rigorous testing to ensure it meets the highest standards.'
  },
  {
    icon: HiLightBulb,
    title: 'Innovation',
    description: 'Continuous innovation drives us forward. We invest heavily in R&D to develop cutting-edge solutions.'
  },
  {
    icon: HiHeart,
    title: 'Customer Focus',
    description: 'Our customers are at the heart of everything we do. We listen, understand, and deliver solutions that exceed expectations.'
  },
  {
    icon: HiTrendingUp,
    title: 'Continuous Improvement',
    description: 'We constantly strive to improve our processes, products, and services to deliver better value.'
  }
]

const achievements: Achievement[] = [
  {
    number: '20+',
    label: 'Years Experience',
    description: 'Two decades of expertise in protective case manufacturing'
  },
  {
    number: '50+',
    label: 'Countries Served',
    description: 'Global reach with customers across all continents'
  },
  {
    number: '1M+',
    label: 'Cases Produced',
    description: 'Over one million protective cases manufactured'
  },
  {
    number: '99.8%',
    label: 'Quality Rate',
    description: 'Exceptional quality control with minimal defect rates'
  }
]

export default function AboutPageClient() {
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [storyRef, storyInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [valuesRef, valuesInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [teamRef, teamInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [timelineRef, timelineInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [achievementsRef, achievementsInView] = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <div className="min-h-screen bg-white pt-16 lg:pt-20">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              About <span className="text-accent-400">WELL-LI</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Leading manufacturer of professional protective cases, dedicated to safeguarding your valuable equipment with innovative solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 text-center">
              <div className="min-w-[80px]">
                <div className="text-2xl sm:text-3xl font-bold text-accent-400">2003</div>
                <div className="text-xs sm:text-sm uppercase tracking-wide">Founded</div>
              </div>
              <div className="min-w-[80px]">
                <div className="text-2xl sm:text-3xl font-bold text-accent-400">50+</div>
                <div className="text-xs sm:text-sm uppercase tracking-wide">Countries</div>
              </div>
              <div className="min-w-[80px]">
                <div className="text-2xl sm:text-3xl font-bold text-accent-400">1M+</div>
                <div className="text-xs sm:text-sm uppercase tracking-wide">Cases Produced</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section ref={storyRef} className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Our Story
              </h2>
              <div className="space-y-4 sm:space-y-6 text-gray-600 leading-relaxed text-sm sm:text-base">
                <p>
                  Founded in 2003 in Guangzhou, China, WELL-LI Plastic Products Co., Ltd. began with a simple yet powerful vision: to create the world's most reliable protective cases for valuable equipment.
                </p>
                <p>
                  What started as a small manufacturing operation has grown into a globally recognized brand, serving customers in over 50 countries. Our journey has been marked by continuous innovation, unwavering commitment to quality, and a deep understanding of our customers' needs.
                </p>
                <p>
                  Today, we stand as a testament to the power of dedication and excellence. Every case we produce carries with it two decades of expertise, innovation, and the promise of uncompromising protection.
                </p>
              </div>
              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-center space-x-3">
                  <HiOfficeBuilding className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">Manufacturing Excellence</div>
                    <div className="text-xs sm:text-sm text-gray-600">State-of-the-art facilities</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <HiGlobeAlt className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">Global Reach</div>
                    <div className="text-xs sm:text-sm text-gray-600">Worldwide distribution</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src="/images/hero/hero-1.jpg"
                  alt="WELL-LI Manufacturing Facility"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-primary-600">ISO 9001:2015</div>
                <div className="text-sm text-gray-600">Certified Quality</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section ref={valuesRef} className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              The principles that guide everything we do and shape our company culture.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 text-primary-600 rounded-full mb-4 sm:mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{value.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section ref={teamRef} className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Meet the experienced professionals who drive our company's vision and success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3 sm:mb-4 text-sm sm:text-base">{member.position}</p>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section ref={timelineRef} className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={timelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones that have shaped our company's growth and success over the years.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary-200 h-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <div className="text-2xl font-bold text-primary-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section ref={achievementsRef} className="py-20 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={achievementsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Achievements
            </h2>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto">
              Numbers that reflect our commitment to excellence and customer satisfaction.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, y: 30 }}
                animate={achievementsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-accent-400 mb-2">
                  {achievement.number}
                </div>
                <div className="text-xl font-semibold mb-2">{achievement.label}</div>
                <div className="text-primary-200 text-sm">{achievement.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Protect Your Equipment?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust WELL-LI for their protective case needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                View Our Products
              </a>
              <a
                href="/contact"
                className="bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}