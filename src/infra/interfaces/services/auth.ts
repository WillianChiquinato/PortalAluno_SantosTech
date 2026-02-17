import type { $Fetch, FetchOptions, FetchResponse } from "ofetch";
import ClientService from "~/infra/clientService";
import type { ApiResponse } from "~/infra/response/apiResponse";

export interface IAuth {
  id: number;
  userName: string;
  name: string;
  email: string;
  phoneDDD: string;
  primaryPhone: string;
}

export default class AuthService extends ClientService<any> {
  constructor() {
    super("Auth", "api/Auth");
  }

  Logged = async (config: FetchOptions = {}): Promise<ApiResponse<IAuth>> => {
    return await this.fetchInstance(`${this.address}/logged`, {
      method: "GET",
      ...config,
    }) as ApiResponse<IAuth>;
  }
}