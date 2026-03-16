import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface IAiMotivacionalMessage {
  message: string
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
}
