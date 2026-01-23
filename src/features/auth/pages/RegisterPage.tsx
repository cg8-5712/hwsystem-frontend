import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function RegisterPage() {
  const { t } = useTranslation()

  return (
    <div className="w-full max-w-md px-6">
      <div className="text-center mb-8">
        <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-4">
          <span className="text-white font-bold text-lg">HW</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('auth.register.title')}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {t('auth.register.subtitle')}
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex gap-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              {t('auth.register.notAvailable')}
            </h3>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
              {t('auth.register.notAvailableMessage')}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {t('auth.register.hasAccount')}{' '}
        <Link
          to="/auth/login"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          {t('auth.register.loginLink')}
        </Link>
      </p>
    </div>
  )
}
