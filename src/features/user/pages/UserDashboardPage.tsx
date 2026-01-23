import { useTranslation } from 'react-i18next'
import { useCurrentUser, useRoleText } from '@/stores/useUserStore'
import {
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  BellIcon,
} from '@heroicons/react/24/outline'

export function UserDashboardPage() {
  const { t } = useTranslation()
  const user = useCurrentUser()
  const roleText = useRoleText()

  const stats = [
    { name: '待完成作业', value: '3', icon: BookOpenIcon, color: 'text-blue-600' },
    { name: '已提交作业', value: '12', icon: ClipboardDocumentCheckIcon, color: 'text-green-600' },
    { name: '平均成绩', value: '85', icon: ChartBarIcon, color: 'text-purple-600' },
    { name: '未读通知', value: '2', icon: BellIcon, color: 'text-orange-600' },
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
          最近作业
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          暂无作业数据
        </p>
      </div>
    </div>
  )
}
