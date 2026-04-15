import type { FetchOptions } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface INotificationItem {
  id: number
  title: string
  message: string
  templateName?: string | null
  className?: string | null
  courseName?: string | null
  createdAt: string
  readAt?: string | null
  isRead: boolean
}

export interface INotificationUnreadCount {
  count: number
}

export default class NotificationService extends ClientService<any> {
  constructor() {
    super('Notification', 'api/Notification')
  }

  GetInbox = async (
    config: FetchOptions = {},
  ): Promise<ApiResponse<INotificationItem[]>> => {
    return (await this.fetchInstance(`${this.address}/Inbox`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<INotificationItem[]>
  }

  GetUnreadCount = async (
    config: FetchOptions = {},
  ): Promise<ApiResponse<INotificationUnreadCount>> => {
    return (await this.fetchInstance(`${this.address}/UnreadCount`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<INotificationUnreadCount>
  }

  MarkAsRead = async (
    notificationId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<boolean>> => {
    return (await this.fetchInstance(`${this.address}/MarkAsRead`, {
      method: 'POST',
      body: { notificationId },
      ...config,
    })) as ApiResponse<boolean>
  }

  MarkAllAsRead = async (
    config: FetchOptions = {},
  ): Promise<ApiResponse<number>> => {
    return (await this.fetchInstance(`${this.address}/MarkAllAsRead`, {
      method: 'POST',
      ...config,
    })) as ApiResponse<number>
  }
}
