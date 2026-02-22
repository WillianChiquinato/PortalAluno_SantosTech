import type { $Fetch, FetchOptions, FetchResponse } from "ofetch";
import ClientService from "~/infra/clientService";
import type { ApiResponse } from "~/infra/response/apiResponse";

export interface IPointRanking {
    userId: number;
    totalPoints: number;
}

export interface IRedeemPointsForUser {
    userId: number;
    pointsToRedeem: number;
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

  AddPointsForUser = async (payload: IRedeemPointsForUser, config: FetchOptions = {}): Promise<ApiResponse<void>> => {
    let urlParams = `/AddPointsForUser`;

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'POST',
      body: payload,
      ...config,
    })) as ApiResponse<void>;
  }
}