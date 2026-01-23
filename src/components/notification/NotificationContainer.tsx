import { useNotificationStore } from '@/stores/useNotificationStore'
import { NotificationItem } from './NotificationItem'

export function NotificationContainer() {
  const notifications = useNotificationStore((s) => s.notifications)

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  )
}
