import type { $Fetch, FetchOptions, FetchResponse } from "ofetch";
import ClientService from "~/infra/clientService";
import type { ApiResponse } from "~/infra/response/apiResponse";
import type { LoginResponse } from "../loginResponse";

export interface IUser {
  id: number;
  name: string;
  email: string;
  passwordHash: number;
  role: UserRole;
  profilePictureUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  Student = 1,
  Admin = 2,
  Teacher = 3,
}

export default class UserService extends ClientService<any> {
  constructor() {
    super("User", "api/User");
  }

  Login = async (
    email: string,
    password: string,
    config: FetchOptions = {},
  ): Promise<LoginResponse> => {
    return (await this.fetchInstance(`${this.address}/Login`, {
      method: "POST",
      body: { email, password },
      ...config,
    })) as LoginResponse;
  };

  GetUsers = async (
    config: FetchOptions = {},
  ): Promise<ApiResponse<IUser[]>> => {
    let urlParams = `/GetAllUsers`;

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: "GET",
      ...config,
    })) as ApiResponse<IUser[]>;
  };
}
