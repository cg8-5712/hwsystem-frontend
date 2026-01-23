import { Outlet } from 'react-router'
import { AppHeader } from './AppHeader'
import { AppFooter } from './AppFooter'

export function DefaultLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}
