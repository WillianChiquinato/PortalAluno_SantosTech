import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'
import type { ICurrentPhaseModule } from './module'

export interface ICurrentPhaseUser {
  id: number
  name: string
  module: ICurrentPhaseModule
}

export default class PhaseService extends ClientService<any> {
  constructor() {
    super('Phase', 'api/Phase')
  }

  GetCurrentPhaseUser = async (
    userId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<ICurrentPhaseUser>> => {
    let urlParams = `/GetCurrentPhaseUser/?userId=${userId}`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<ICurrentPhaseUser>
  }
}
