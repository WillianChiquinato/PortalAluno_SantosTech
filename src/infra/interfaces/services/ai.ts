import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'
import type { Exercise } from './class'

export interface IAiMotivacionalMessage {
  message: string
}

export interface IAIExerciseRepeat {
  exerciseId: number
  userId: number
  phaseId?: number
}

export interface IAIExerciseRepeatResponse {
  phaseId: number
  userId: number
  createExercise: Exercise
}

export default class AiService extends ClientService<any> {
  constructor() {
    super('AI', 'api/AI')
  }

  GetMotivationalMessage = async (config: FetchOptions = {}): Promise<IAiMotivacionalMessage> => {
    let urlParams = `/GenerateMotivationalMessage`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as IAiMotivacionalMessage
  }

  GenerateExerciseRepeat = async (
    exerciseId: number,
    userId: number,
    phaseId?: number,
    config: FetchOptions = {},
  ): Promise<IAIExerciseRepeatResponse> => {
    let urlParams = `/GenerateExerciseRepeat?exerciseId=${exerciseId}&userId=${userId}`
    if (phaseId) {
      urlParams += `&phaseId=${phaseId}`
    }

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as IAIExerciseRepeatResponse
  }
}
