import type { FetchOptions } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface IVideoProgress {
  videoId: number
  watchSeconds: number
  isCompleted: boolean
  lastWatched: string
}

export default class ProgressService extends ClientService<any> {
  constructor() {
    super('Progress', 'api/Progress')
  }

  GetProgressUserVideos = async (
    config: FetchOptions = {},
  ): Promise<ApiResponse<IVideoProgress[]>> => {
    return (await this.fetchInstance(`${this.address}/GetProgressUserVideos`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IVideoProgress[]>
  }

  SaveProgressVideo = async (
    progress: IVideoProgress,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IVideoProgress>> => {
    return (await this.fetchInstance(`${this.address}/SaveProgressVideo`, {
      method: 'POST',
      body: JSON.stringify(progress),
      ...config,
    })) as ApiResponse<IVideoProgress>
  }

  GetProgressUserPaidCourses = async (
    options?: FetchOptions,
  ): Promise<ApiResponse<{ courseId: number; progress: number }[]>> => {
    return (await this.fetchInstance(`${this.address}/GetProgressUserPaidCourses`, {
      method: 'GET',
      ...options,
    })) as ApiResponse<{ courseId: number; progress: number }[]>
  }

  EvaluateProgress = async (
    GoalRewardId: number,
    RewardType: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<{ isCompleted: boolean }>> => {
    return (await this.fetchInstance(`${this.address}/EvaluateProgress`, {
      method: 'POST',
      body: JSON.stringify({
        goalRewardId: GoalRewardId,
        rewardType: RewardType,
      }),
      ...config,
    })) as ApiResponse<{ isCompleted: boolean }>
  }
}
