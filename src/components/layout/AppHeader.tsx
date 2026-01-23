import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  LanguageIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useDarkMode } from '@/hooks/useDarkMode'
import {
  useUserStore,
  useIsAuthenticated,
  useDashboardPath,
  useRoleText,
  useUserAvatar,
  useUserAvatarColor,
} from '@/stores/useUserStore'

export function AppHeader() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAuthenticated = useIsAuthenticated()
  const currentUser = useUserStore((s) => s.currentUser)
  const logout = useUserStore((s) => s.logout)
  const dashboardPath = useDashboardPath()
  const roleText = useRoleText()
  const avatar = useUserAvatar()
  const avatarColor = useUserAvatarColor()

  const { theme, setTheme, isDark } = useDarkMode()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(newLang)
  }

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">HW</span>
              </div>
              <span className="hidden sm:block font-semibold text-gray-900 dark:text-white">
                {t('app.name')}
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={t('header.language')}
            >
              <LanguageIcon className="h-5 w-5" />
            </button>

            {/* Theme Menu */}
            <Menu as="div" className="relative">
              <MenuButton className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {isDark ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none">
                <div className="p-1">
                  <MenuItem>
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md ${
                        theme === 'light'
                          ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <SunIcon className="h-4 w-4" />
                      {t('header.theme.light')}
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md ${
                        theme === 'dark'
                          ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <MoonIcon className="h-4 w-4" />
                      {t('header.theme.dark')}
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => setTheme('system')}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md ${
                        theme === 'system'
                          ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <ComputerDesktopIcon className="h-4 w-4" />
                      {t('header.theme.system')}
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>

            {/* Auth */}
            {isAuthenticated ? (
              <Menu as="div" className="relative">
                <MenuButton
                  className={`flex items-center justify-center h-9 w-9 rounded-full text-white font-medium ${avatarColor}`}
                >
                  {avatar}
                </MenuButton>
                <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none">
                  <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentUser?.profile?.profile_name || currentUser?.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{roleText}</p>
                  </div>
                  <div className="p-1">
                    <MenuItem>
                      <Link
                        to={dashboardPath}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Squares2X2Icon className="h-4 w-4" />
                        {t('header.dashboard')}
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        {t('header.logout')}
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            ) : (
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <UserCircleIcon className="h-4 w-4" />
                {t('header.login')}
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
