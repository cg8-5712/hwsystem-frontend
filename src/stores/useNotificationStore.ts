import { create } from 'zustand'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration: number
  closable: boolean
}

interface NotificationState {
  notifications: Notification[]
  add: (notification: Omit<Notification, 'id'>) => string
  remove: (id: string) => void
  clear: () => void
  success: (title: string, message?: string) => string
  error: (title: string, message?: string) => string
  warning: (title: string, message?: string) => string
  info: (title: string, message?: string) => string
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  add: (notification) => {
    const id = crypto.randomUUID()
    const newNotification: Notification = { ...notification, id }

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))

    if (notification.duration > 0) {
      setTimeout(() => get().remove(id), notification.duration)
    }

    return id
  },

  remove: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clear: () => set({ notifications: [] }),

  success: (title, message) =>
    get().add({ type: 'success', title, message, duration: 5000, closable: true }),

  error: (title, message) =>
    get().add({ type: 'error', title, message, duration: 0, closable: true }),

  warning: (title, message) =>
    get().add({ type: 'warning', title, message, duration: 8000, closable: true }),

  info: (title, message) =>
    get().add({ type: 'info', title, message, duration: 5000, closable: true }),
}))
