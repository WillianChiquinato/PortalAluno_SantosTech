import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface ICurrentPhaseModule {
    id: number;
    name: string;
    description: string;
}

export default class ModuleService extends ClientService<any> {
  constructor() {
    super('Module', 'api/Module')
  }
}
