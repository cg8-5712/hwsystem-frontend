import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  DevicePhoneMobileIcon,
  BellAlertIcon,
  ChartBarIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BoltIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'
import { useIsAuthenticated, useDashboardPath } from '@/stores/useUserStore'

export function HomePage() {
  const { t } = useTranslation()
  const isAuthenticated = useIsAuthenticated()
  const dashboardPath = useDashboardPath()

  const features = [
    { key: 'responsive', icon: DevicePhoneMobileIcon },
    { key: 'notification', icon: BellAlertIcon },
    { key: 'visualization', icon: ChartBarIcon },
    { key: 'grading', icon: SparklesIcon },
    { key: 'security', icon: ShieldCheckIcon },
    { key: 'performance', icon: BoltIcon },
  ]

  const roles = [
    { key: 'student', icon: AcademicCapIcon, color: 'from-green-500 to-emerald-500' },
    { key: 'monitor', icon: UserGroupIcon, color: 'from-blue-500 to-indigo-500' },
    { key: 'teacher', icon: BookOpenIcon, color: 'from-purple-500 to-pink-500' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6">
              <SparklesIcon className="h-4 w-4" />
              {t('home.hero.badge')}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('home.hero.title')}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
                >
                  {t('home.hero.dashboard')}
                </Link>
              ) : (
                <Link
                  to="/auth/login"
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
                >
                  {t('home.hero.login')}
                </Link>
              )}
              <a
                href="#roles"
                className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                {t('home.hero.learnRoles')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('home.features.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              {t('home.features.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.key}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t(`home.features.items.${feature.key}.name`)}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {t(`home.features.items.${feature.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-24 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('home.roles.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              {t('home.roles.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role) => (
              <div
                key={role.key}
                className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700"
              >
                <div
                  className={`h-14 w-14 rounded-xl bg-gradient-to-r ${role.color} flex items-center justify-center mb-6`}
                >
                  <role.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t(`home.roles.items.${role.key}.name`)}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {t(`home.roles.items.${role.key}.description`)}
                </p>
                <ul className="mt-4 space-y-2">
                  {(t(`home.roles.items.${role.key}.features`, { returnObjects: true }) as string[]).map(
                    (feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        {feature}
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">{t('home.cta.title')}</h2>
          <p className="mt-4 text-lg text-blue-100">{t('home.cta.subtitle')}</p>
          <div className="mt-8">
            {isAuthenticated ? (
              <Link
                to={dashboardPath}
                className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
              >
                {t('home.cta.dashboard')}
              </Link>
            ) : (
              <Link
                to="/auth/login"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
              >
                {t('home.cta.start')}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
