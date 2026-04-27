import type { FetchOptions } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface IPointRanking {
  userId: number
  totalPoints: number
  name: string
  profilePictureUrl?: string | null
}

export interface IPointCategoryRanking {
  category: string
  rankings: IRankingCategory[]
}

export interface IRankingCategory {
  userId: number
  name: string
  profilePictureUrl?: string | null
  percentAvailable: number
  totalAnswers: number
  status?: string | null
}

export interface IAddPointsForUser {
  exerciseId: number
}

export interface IPointAwardResult {
  alreadyAwarded: boolean
  pointsAwarded: number
  message: string
}

export interface IRankingEvent {
  eventName: string
  eventType: string
  durationMinutes: number
  startTime: string
  endTime: string
  eventRankingAwards: IRankingEventAward[]
}

export interface IRankingEventAward {
  awardName: string
  awardPositionRanking: number
  awardDescription: string
  awardPictureUrl?: string | null
}

export default class PointService extends ClientService<any> {
  constructor() {
    super('Point', 'api/Point')
  }

  GetRankingPoints = async (config: FetchOptions = {}): Promise<ApiResponse<IPointRanking[]>> => {
    return (await this.fetchInstance(`${this.address}/GetRankingPoints`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IPointRanking[]>
  }

  GetAvailableRankingPerCategory = async (
    config: FetchOptions = {},
  ): Promise<ApiResponse<IPointCategoryRanking[]>> => {
    return (await this.fetchInstance(`${this.address}/GetAvailableRankingPerCategory`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IPointCategoryRanking[]>
  }

  AddPointsForUser = async (
    payload: IAddPointsForUser,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IPointAwardResult>> => {
    return (await this.fetchInstance(`${this.address}/AddPointsForUser`, {
      method: 'POST',
      body: payload,
      ...config,
    })) as ApiResponse<IPointAwardResult>
  }

  GetRankingEvent = async (eventType: number, config: FetchOptions = {}): Promise<ApiResponse<IRankingEvent[]>> => {
    return (await this.fetchInstance(`${this.address}/GetRankingEvent?eventType=${eventType}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IRankingEvent[]>
  }
}
