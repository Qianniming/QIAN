'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { HiGlobeAlt, HiChevronDown } from 'react-icons/hi'
import { locales, languageLabels, getLocaleFromPathname, removeLocaleFromPathname, addLocaleToPathname, type Locale } from '@/lib/i18n'

const LanguageSwitcher: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = getLocaleFromPathname(pathname)
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (locale: Locale) => {
    const pathWithoutLocale = removeLocaleFromPathname(pathname)
    const newPath = addLocaleToPathname(pathWithoutLocale, locale)
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
        aria-label="Change language"
      >
        <HiGlobeAlt className="w-4 h-4" />
        <span className="hidden sm:inline">{languageLabels[currentLocale]}</span>
        <HiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20"
            >
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLanguageChange(locale)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                    currentLocale === locale
                      ? 'text-blue-600 bg-blue-50 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {languageLabels[locale]}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSwitcher