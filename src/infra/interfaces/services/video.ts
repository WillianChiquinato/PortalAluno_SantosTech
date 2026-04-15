import type { FetchOptions } from 'ofetch'
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

export default class VideoService extends ClientService<any> {
  constructor() {
    super('Video', 'api/Video')
  }

  GetAllVideos = async (config: FetchOptions = {}): Promise<ApiResponse<IVideo[]>> => {
    return (await this.fetchInstance(`${this.address}/GetAllVideos`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IVideo[]>
  }
}
