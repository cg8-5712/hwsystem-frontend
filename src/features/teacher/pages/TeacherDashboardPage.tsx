import { useTranslation } from 'react-i18next'
import { useCurrentUser, useRoleText } from '@/stores/useUserStore'
import {
  UserGroupIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline'

export function TeacherDashboardPage() {
  const { t } = useTranslation()
  const user = useCurrentUser()
  const roleText = useRoleText()

  const stats = [
    { name: '管理班级', value: '3', icon: UserGroupIcon, color: 'text-blue-600' },
    { name: '已布置作业', value: '15', icon: DocumentTextIcon, color: 'text-green-600' },
    { name: '待批改', value: '28', icon: ClipboardDocumentListIcon, color: 'text-orange-600' },
    { name: '学生总数', value: '89', icon: AcademicCapIcon, color: 'text-purple-600' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* 欢迎区域 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('header.dashboard')}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          欢迎回来，{user?.profile?.profile_name || user?.username}（{roleText}）
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 内容区域占位 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          待批改作业
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          暂无待批改作业
        </p>
      </div>
    </div>
  )
}
