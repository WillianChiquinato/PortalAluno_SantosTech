import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export enum GoalType {
  CourseCompletion = 1,
  PhaseCompletion = 2,
  TaskQuantity = 3,
  TimeSpent = 4,
  Custom = 5,
}

export interface IBadge {
  id: number
  name: string
  description: string
  iconURL: string
}

export interface IGoalRewardsData {
  goalRewardId?: number
  goalId: number
  goalName: string
  goalDescription: string
  goalType: GoalType
  goalImageUrl: string
  badges: IBadge[]
  points: number
}

export interface IActivatedGoalUser {
  id: number
  userId: number
  goalRewardId: number
  goalName: string
  goalDescription: string
  goalType: GoalType
  rewardType: number
  courseId: number
  progress: number
  isCompleted: boolean
  completedAt: string | null
  rewardClaimed: boolean
  rewardClaimedAt: string | null
}

export default class BadgeService extends ClientService<any> {
  constructor() {
    super('Badge', 'api/Badge')
  }

  GetBadges = async (config: FetchOptions = {}): Promise<ApiResponse<IBadge[]>> => {
    let urlParams = `/GetAllBadges`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IBadge[]>
  }

  GetGoalsWithBadgesByCourseId = async (
    courseId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IGoalRewardsData[]>> => {
    let urlParams = `/GetGoalsWithBadgesByCourseId?courseId=${courseId}`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IGoalRewardsData[]>
  }

  GetActivatedGoalsByUserId = async (
    config: FetchOptions = {},
  ): Promise<ApiResponse<IActivatedGoalUser[]>> => {
    let urlParams = `/GetActivatedGoalsByUserId`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IActivatedGoalUser[]>
  }

  UpdateActivatedGoalId = async (
    goalRewardId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<boolean>> => {
    let urlParams = `/UpdateActivatedGoalId?goalRewardId=${goalRewardId}`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'POST',
      ...config,
    })) as ApiResponse<boolean>
  }

  GoalRewardOperation = async (
    goalRewardId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<boolean>> => {
    let urlParams = `/GoalRewardOperation?goalRewardId=${goalRewardId}`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'PUT',
      ...config,
    })) as ApiResponse<boolean>
  }
}
