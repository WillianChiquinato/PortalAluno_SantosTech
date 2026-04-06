import type { FetchOptions } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface IPointRanking {
  userId: number
  totalPoints: number
  name: string
  profilePictureUrl?: string | null
}

export interface IAddPointsForUser {
  exerciseId: number
}

export interface IPointAwardResult {
  alreadyAwarded: boolean
  pointsAwarded: number
  message: string
}

export default class PointService extends ClientService<any> {
  constructor() {
    super('Point', 'api/Point')
  }

  GetRanking = async (config: FetchOptions = {}): Promise<ApiResponse<IPointRanking[]>> => {
    return (await this.fetchInstance(`${this.address}/GetRanking`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IPointRanking[]>
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
}
