import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface IClass {
  id: number
  name: string
}

export type BlipStatus = 'Concluído' | 'Atual' | 'Não iniciado'
export type IslandStatus = 'Concluído' | 'Em Progresso' | 'Não Iniciado' | 'Desconhecido'
export type BlipStatusExercise = 'Correto' | 'Errou' | 'Atual' | 'Não iniciado'

export interface Island {
  id: number
  order: number
  title: string
  helper: string
  status: IslandStatus
  lowerState: number
  progress: number
  blips: Blip[]
}

export interface Blip {
  exercise: Exercise
  state: BlipStatus
  origin: number
  phaseId: number
  userExerciseFlowId: number
  userContainerExerciseFlowId?: number
  containerExerciseId?: number
  containerTitle?: string
}

export interface ContainerExerciseFlow {
  exercise: Exercise
  origin: number
  stateExercise: BlipStatusExercise
  userContainerExerciseFlowId: number
}

export interface BlipContainer {
  containerExercise: {
    id: number
    title: string
    containerDateTarget: number | null
    exercises: ContainerExerciseFlow[]
  }
  stateContainer: BlipStatus
  phaseId: number
  isLocked: boolean
  unlockDate: Date | null
  daysRemaining: number | null
}

export interface IslandApi {
  id: number
  order: number
  title: string
  helper: string
  status: IslandStatus
  lowerState: number
  progress: number
  blips: BlipContainer[]
}

export interface Exercise {
  id: number
  title: string
  description: string
  videoUrl: string
  pointsRedeem: number
  termAt: Date
  typeExercise: number
  difficulty: number
  indexOrder: number
  isDailyTask: null
  isFinalExercise: boolean
  isCompletedAnswer: boolean
  exercisePeriod: Date
}

export default class ClassService extends ClientService<any> {
  constructor() {
    super('Class', 'api/Class')
  }

  GetIslandsByUserIdAndCurrentModule = async (
    userId: number,
    phaseId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IslandApi[]>> => {
    let urlParams = `/GetIslandsByUserIdAndCurrentModule?userId=${userId}&phaseId=${phaseId}`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IslandApi[]>
  }
}
