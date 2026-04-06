import type { FetchOptions } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface IAnswersByUserIdResponse {
  exerciseGroups: IAnswerExerciseGroup[]
  unreadResponsesCount: number
}

export interface IAnswersExercise {
  id: number
  title: string
  description: string
  videoUrl: string | null
  pointsRedeem: number
  termAt: string
  typeExercise: number
  difficulty: number
  indexOrder: number
  isDailyTask: boolean | null
  isFinalExercise: boolean
  isCompletedAnswer: boolean
  exercisePeriod: string
}

export interface IAnswerByUser {
  id: number
  userId: number
  questionId: number
  exercise: IAnswersExercise
  userExerciseFlowId: number | null
  answerText: string | null
  selectedOption: string
  isCorrect: boolean | null
  answeredAt: string
  feedback: string | null
}

export interface IAnswerExerciseGroup {
  exercise: IAnswersExercise
  answers: IAnswerByUser[]
}

export default class AnswersService extends ClientService<any> {
  constructor() {
    super('Answer', 'api/Answer')
  }

  GetAnswersByUserId = async (
    options?: FetchOptions,
  ): Promise<ApiResponse<IAnswersByUserIdResponse>> => {
    return (await this.fetchInstance(`${this.address}/GetAnswersByUserId`, {
      method: 'GET',
      ...options,
    })) as ApiResponse<IAnswersByUserIdResponse>
  }
}
