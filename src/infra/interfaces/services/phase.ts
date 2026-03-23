import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'
import type { ICurrentPhaseModule } from './module'

export interface ICurrentModuleUser {
  id: number
  name: string
  description: string
  totalPhases: number
}

export default class PhaseService extends ClientService<any> {
  constructor() {
    super('Phase', 'api/Phase')
  }

  GetCurrentModuleUser = async (
    userId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<ICurrentModuleUser>> => {
    let urlParams = `/GetCurrentModuleUser?userId=${userId}`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<ICurrentModuleUser>
  }
}
