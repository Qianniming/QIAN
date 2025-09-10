// Internationalization configuration
export const defaultLocale = 'en'
export const locales = ['en', 'zh'] as const
export type Locale = typeof locales[number]

// Language labels
export const languageLabels: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
}

// Get locale from pathname
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/')
  const locale = segments[1] as Locale
  return locales.includes(locale) ? locale : defaultLocale
}

// Remove locale from pathname
export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/')
  if (locales.includes(segments[1] as Locale)) {
    return '/' + segments.slice(2).join('/')
  }
  return pathname
}

// Add locale to pathname
export function addLocaleToPathname(pathname: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return pathname
  }
  return `/${locale}${pathname}`
}

// Check if locale is supported
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}