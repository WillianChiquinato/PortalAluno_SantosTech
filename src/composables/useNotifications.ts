import { useNuxtApp, useState } from '#app'
import { computed } from 'vue'
import type { INotificationItem } from '~/infra/interfaces/services/notification'
import { useToastService } from './useToast'

const NOTIFICATION_SESSION_STORAGE_KEY = 'portal:notifications:seen'

function notificationsState() {
  return useState<INotificationItem[]>('notifications-items', () => [])
}

function unreadCountState() {
  return useState<number>('notifications-unread-count', () => 0)
}

function loadingState() {
  return useState<boolean>('notifications-loading', () => false)
}

function initializedState() {
  return useState<boolean>('notifications-initialized', () => false)
}

function getSessionSeenIds() {
  if (!import.meta.client) {
    return new Set<number>()
  }

  const raw = window.sessionStorage.getItem(NOTIFICATION_SESSION_STORAGE_KEY)
  if (!raw) {
    return new Set<number>()
  }

  try {
    const parsed = JSON.parse(raw) as number[]
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set<number>()
  }
}

function persistSessionSeenIds(ids: Set<number>) {
  if (!import.meta.client) {
    return
  }

  window.sessionStorage.setItem(
    NOTIFICATION_SESSION_STORAGE_KEY,
    JSON.stringify(Array.from(ids.values())),
  )
}

export function useNotifications() {
  const { $httpClient } = useNuxtApp()
  const toast = useToastService()
  const notifications = notificationsState()
  const unreadCount = unreadCountState()
  const isLoading = loadingState()
  const isInitialized = initializedState()

  async function loadNotifications(options: { toastNew?: boolean } = {}) {
    const response = await $httpClient.notification.GetInbox()
    const items = response.result ?? []
    notifications.value = items

    if (options.toastNew) {
      const seenIds = getSessionSeenIds()
      const unseenItems = items.filter((item) => !seenIds.has(item.id) && !item.isRead)

      unseenItems.slice(0, 3).forEach((item) => {
        toast.info('Nova notificação', item.title)
      })

      items.forEach((item) => {
        seenIds.add(item.id)
      })
      persistSessionSeenIds(seenIds)
    }

    return items
  }

  async function loadUnreadCount() {
    const response = await $httpClient.notification.GetUnreadCount()
    unreadCount.value = response.result?.count ?? 0
    return unreadCount.value
  }

  async function refreshNotifications(options: { toastNew?: boolean } = {}) {
    try {
      isLoading.value = true
      await Promise.all([
        loadNotifications(options),
        loadUnreadCount(),
      ])
      isInitialized.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function markAsRead(notificationId: number) {
    await $httpClient.notification.MarkAsRead(notificationId)

    notifications.value = notifications.value.map((notification) =>
      notification.id === notificationId
        ? {
            ...notification,
            isRead: true,
            readAt: notification.readAt ?? new Date().toISOString(),
          }
        : notification,
    )

    unreadCount.value = Math.max(
      0,
      notifications.value.filter((notification) => !notification.isRead).length,
    )
  }

  async function markAllAsRead() {
    await $httpClient.notification.MarkAllAsRead()
    const readAt = new Date().toISOString()

    notifications.value = notifications.value.map((notification) => ({
      ...notification,
      isRead: true,
      readAt: notification.readAt ?? readAt,
    }))

    unreadCount.value = 0
  }

  const hasUnread = computed(() => unreadCount.value > 0)

  return {
    notifications,
    unreadCount,
    hasUnread,
    isLoading,
    isInitialized,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
  }
}
