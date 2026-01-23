import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useUserStore } from '@/stores/useUserStore'
import { useDarkMode } from '@/hooks/useDarkMode'
import { NotificationContainer } from '@/components/notification/NotificationContainer'
import '@/app/i18n' // 初始化 i18n

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

function AuthInitializer({ children }: { children: ReactNode }) {
  const initAuth = useUserStore((s) => s.initAuth)
  const initDarkMode = useDarkMode((s) => s.init)

  useEffect(() => {
    initAuth()
    initDarkMode()
  }, [initAuth, initDarkMode])

  return <>{children}</>
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        {children}
        <NotificationContainer />
      </AuthInitializer>
    </QueryClientProvider>
  )
}
