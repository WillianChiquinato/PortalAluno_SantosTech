import type { $Fetch, FetchOptions, FetchResponse } from "ofetch";
import ClientService from "~/infra/clientService";
import type { ApiResponse } from "~/infra/response/apiResponse";

export interface IPointRanking {
    userId: number;
    totalPoints: number;
}

export default class PointService extends ClientService<any> {
  constructor() {
    super("Point", "api/Point");
  }

  GetRanking = async (config: FetchOptions = {}): Promise<ApiResponse<IPointRanking[]>> => {
    let urlParams = `/GetRanking`;

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IPointRanking[]>;
  }
}