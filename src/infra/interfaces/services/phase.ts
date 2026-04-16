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

  GetCurrentModuleUser = async (
    enrollmentId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<ICurrentModuleUser>> => {
    return (await this.fetchInstance(
      `${this.address}/GetCurrentModuleUser?enrollmentId=${enrollmentId}`,
      {
        method: 'GET',
        ...config,
      },
    )) as ApiResponse<ICurrentModuleUser>
  }
}
