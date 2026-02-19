import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface IVideo {
  id: number
  title: string
  description: string
  url: string
  thumbnailUrl: string
  durationSeconds: number
  visibility: number
  createdAt: string
}

export interface IVideoProgress {
  videoId: number
  userId?: number
  watchSeconds: number
  isCompleted: boolean
  lastWatched: string
}

export default class VideoService extends ClientService<any> {
  constructor() {
    super('Video', 'api/Video')
  }

  GetAllVideos = async (config: FetchOptions = {}): Promise<ApiResponse<IVideo[]>> => {
    let urlParams = `/GetAllVideos`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IVideo[]>
  }

  GetProgressUserVideos = async (
    userId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IVideoProgress[]>> => {
    let urlParams = `/GetProgressUserVideos?userId=${userId}`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IVideoProgress[]>
  }

  SaveProgressVideo = async (
    progress: IVideoProgress,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IVideoProgress>> => {
    let urlParams = `/SaveProgressVideo`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'POST',
      body: JSON.stringify(progress),
      ...config,
    })) as ApiResponse<IVideoProgress>
  }
}
