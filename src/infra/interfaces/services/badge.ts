import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface IBadge {
  id: number
  name: string
  description: string
  iconURL: string
}

export default class BadgeService extends ClientService<any> {
  constructor() {
    super('Badge', 'api/Badge')
  }

  GetBadges = async (config: FetchOptions = {}): Promise<ApiResponse<IBadge[]>> => {
    let urlParams = `/GetAllBadges`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IBadge[]>
  }
}
