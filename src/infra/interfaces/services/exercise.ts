import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface IExercise {
  id: number
  phaseId: number
  title: string
  description: string
  videoUrl: string
  pointsRedeem: number
  termAt: string
  typeExercise: number
  difficulty: number
  indexOrder: number
  isDailyTask: boolean
  isFinalExercise: boolean
  createdAt: string
  updatedAt: string
}

export interface IDailyExercise {
  id: number
  title: string
  description: string
  videoUrl: string | null
  pointsRedeem: number
  termAt: string
  typeExercise: number
  difficulty: number
  indexOrder: number
  isDailyTask: boolean
  isFinalExercise: boolean
  isCompletedAnswer: boolean
}

export interface IDailyTaskGroup {
  id: number
  name: string
  phaseId: number
  exercises: IDailyExercise[]
}

export interface IQuizQuestionOption {
  id: number
  questionId: number
  question: string
  correctAnswer: boolean
}

export interface ISubmitExerciseAnswer {
  exerciseId: number
  userId: number
  questionId: number
  phaseId?: number
  userExerciseFlowId?: number
  userContainerExerciseFlowId?: number
  submissionData: IAnswer
}

export interface IAnswer {
  selectedOption: number
  isCorrect: boolean
  pointsEarned: number
  answerText?: string
  submittedAt: Date
}

export interface ExerciseCardTask {
  id: number
  title: string
  due: string
  points: string
  status: string
  description: string
  termAt: string
  isCompletedAnswer: boolean
  source: ExerciseQuestionSource
}

export interface DailyTaskGroupView {
  id: string
  name: string
  title: string
  due: string
  points: string
  status: string
  description: string
  termAt: string
  disabled: boolean
  exercises: ExerciseCardTask[]
}

export interface ExerciseVerifyAnswerResponse {
  existingAnswers: boolean
}

export default class ExerciseService extends ClientService<any> {
  constructor() {
    super('Exercise', 'api/Exercise')
  }

  GetDailyTasksForPhase = async (
    phaseId: number,
    userId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IDailyTaskGroup[]>> => {
    let urlParams = `/GetDailyTasksForPhase?phaseId=${phaseId}&userId=${userId}`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IDailyTaskGroup[]>
  }

  GetQuizQuestionsForExercise = async (
    exerciseId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IQuizQuestionOption[]>> => {
    let urlParams = `/GetQuestionsOptionsForExercise?exerciseId=${exerciseId}`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IQuizQuestionOption[]>
  }

  SubmitExerciseAnswers = async (
    payload: ISubmitExerciseAnswer[],
    config: FetchOptions = {},
  ): Promise<ApiResponse<void>> => {
    let urlParams = `/SubmitExerciseAnswers`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'POST',
      body: payload,
      ...config,
    })) as ApiResponse<void>
  }

  VerifyExistingAnswers = async (
    exerciseId: number,
    userId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<ExerciseVerifyAnswerResponse>> => {
    let urlParams = `/VerifyExistingAnswers?exerciseId=${exerciseId}&userId=${userId}`
    
    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<ExerciseVerifyAnswerResponse>
  }
}
