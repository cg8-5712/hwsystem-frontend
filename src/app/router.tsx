import { createBrowserRouter, redirect } from 'react-router'
import { useUserStore } from '@/stores/useUserStore'

// 布局组件
import { DefaultLayout } from '@/components/layout/DefaultLayout'
import { AppLayout } from '@/components/layout/AppLayout'

// 公共页面
import { HomePage } from '@/features/public/pages/HomePage'
import { AboutPage } from '@/features/public/pages/AboutPage'
import { ContactPage } from '@/features/public/pages/ContactPage'
import { PrivacyPage } from '@/features/public/pages/PrivacyPage'
import { TermsPage } from '@/features/public/pages/TermsPage'
import { NotFoundPage } from '@/features/public/pages/NotFoundPage'

// 认证页面
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'

// 学生页面
import { UserIndexPage } from '@/features/user/pages/UserIndexPage'
import { UserDashboardPage } from '@/features/user/pages/UserDashboardPage'
import { HomeworkPage } from '@/features/user/pages/HomeworkPage'

// 教师页面
import { TeacherIndexPage } from '@/features/teacher/pages/TeacherIndexPage'
import { TeacherDashboardPage } from '@/features/teacher/pages/TeacherDashboardPage'

// 管理员页面
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage'

// 路由守卫 Loader
const requireAuth = async () => {
  const { initAuth, isInitialized } = useUserStore.getState()

  // 等待初始化完成
  if (!isInitialized) {
    await initAuth()
  }

  // 检查认证状态
  const user = useUserStore.getState().currentUser
  if (!user) {
    throw redirect('/auth/login')
  }

  return { user }
}

const requireRole = (roles: string[]) => async () => {
  const { user } = await requireAuth()

  if (!roles.includes(user.role)) {
    // 重定向到对应的 Dashboard
    const dashboardMap: Record<string, string> = {
      admin: '/admin/dashboard',
      teacher: '/teacher/dashboard',
      user: '/user/dashboard',
    }
    throw redirect(dashboardMap[user.role] || '/')
  }

  return { user }
}

const requireGuest = async () => {
  const { isInitialized, initAuth } = useUserStore.getState()

  if (!isInitialized) {
    await initAuth()
  }

  const user = useUserStore.getState().currentUser
  if (user) {
    const dashboardMap: Record<string, string> = {
      admin: '/admin/dashboard',
      teacher: '/teacher/dashboard',
      user: '/user/dashboard',
    }
    throw redirect(dashboardMap[user.role] || '/')
  }

  return null
}

export const router = createBrowserRouter([
  // 公共页面 (DefaultLayout)
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
    ],
  },

  // 认证页面 (需要未登录)
  {
    path: '/auth',
    element: <AppLayout />,
    loader: requireGuest,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },

  // 学生页面
  {
    path: '/user',
    element: <DefaultLayout />,
    loader: requireRole(['user']),
    children: [
      { index: true, element: <UserIndexPage /> },
      { path: 'dashboard', element: <UserDashboardPage /> },
      { path: 'homework/:id', element: <HomeworkPage /> },
    ],
  },

  // 教师页面
  {
    path: '/teacher',
    element: <DefaultLayout />,
    loader: requireRole(['teacher']),
    children: [
      { index: true, element: <TeacherIndexPage /> },
      { path: 'dashboard', element: <TeacherDashboardPage /> },
    ],
  },

  // 管理员页面
  {
    path: '/admin',
    element: <DefaultLayout />,
    loader: requireRole(['admin']),
    children: [
      { path: 'dashboard', element: <AdminDashboardPage /> },
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
