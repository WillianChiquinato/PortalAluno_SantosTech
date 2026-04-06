import type { FetchOptions } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

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

  GetCurrentModulePhaseUser = async (
    config: FetchOptions = {},
  ): Promise<ApiResponse<ICurrentModuleUser>> => {
    return (await this.fetchInstance(`${this.address}/GetCurrentModuleUser`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<ICurrentModuleUser>
  }
}
