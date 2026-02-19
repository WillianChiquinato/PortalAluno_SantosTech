import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface IMaterial {
  id: number
  classId: number
  title: string
  description: string
  fileUrl: string
  fileType: string | number
  visibility: number
  uploadedAt: string
}

export default class MaterialService extends ClientService<any> {
  constructor() {
    super('Material', 'api/Material')
  }

  GetAllMaterials = async (config: FetchOptions = {}): Promise<ApiResponse<IMaterial[]>> => {
    let urlParams = `/GetAllMaterials`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IMaterial[]>
  }
}
