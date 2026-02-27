import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface IClass {
  id: number
  name: string
}

export type BlipStatus = 'Correto' | 'Errou' | 'Atual' | 'Não iniciado'
export type IslandStatus = 'Concluído' | 'Em Progresso' | 'Não Iniciado' | 'Desconhecido'

export interface Island {
  id: string
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
  ): Promise<ApiResponse<Island[]>> => {
    let urlParams = `/GetIslandsByUserIdAndCurrentModule?userId=${userId}&phaseId=${phaseId}`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<Island[]>
  }
}
