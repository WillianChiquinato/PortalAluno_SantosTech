import type { FetchOptions } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { Exercise } from './class'

export interface IAiMotivacionalMessage {
  message: string
}

export interface IAIExerciseRepeat {
  exerciseId: number
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
    return (await this.fetchInstance(`${this.address}/GenerateMotivationalMessage`, {
      method: 'GET',
      ...config,
    })) as IAiMotivacionalMessage
  }

  GenerateExerciseRepeat = async (
    exerciseId: number,
    phaseId?: number,
    config: FetchOptions = {},
  ): Promise<IAIExerciseRepeatResponse> => {
    let urlParams = `/GenerateExerciseRepeat?exerciseId=${exerciseId}`
    if (phaseId) {
      urlParams += `&phaseId=${phaseId}`
    }

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as IAIExerciseRepeatResponse
  }
}
