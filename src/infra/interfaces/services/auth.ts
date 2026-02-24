import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface IAuth {
  id: number
  userName: string
  name: string
  email: string
  phoneDDD: string
  primaryPhone: string
}

export interface IAuthConfigUser {
  receiveEmailNotifications: boolean
  darkModeEnabled: boolean
  reportFrequency: boolean
  acessibilityMode: boolean
  preferredLanguage: string
}

export interface IAuthConfigUserUpdateRequest {
  userId: number
  receiveEmailNotifications: boolean
  darkModeEnabled: boolean
  reportFrequency: boolean
  acessibilityMode: boolean
  preferredLanguage: string
}

export default class AuthService extends ClientService<any> {
  constructor() {
    super('Auth', 'api/Auth')
  }

  Logged = async (config: FetchOptions = {}): Promise<ApiResponse<IAuth>> => {
    return (await this.fetchInstance(`${this.address}/logged`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IAuth>
  }

  GetConfigsByUserId = async (
    userId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IAuthConfigUser>> => {
    return (await this.fetchInstance(`${this.address}/GetConfigs?userId=${userId}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IAuthConfigUser>
  }

  CreateNewConfig = async (
    userId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IAuthConfigUserUpdateRequest>> => {
    return (await this.fetchInstance(`${this.address}/CreateNewConfig?userId=${userId}`, {
      method: 'POST',
      ...config,
    })) as ApiResponse<IAuthConfigUserUpdateRequest>
  }

  UpdateConfigurations = async (
    payload: IAuthConfigUserUpdateRequest,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IAuthConfigUserUpdateRequest>> => {
    return (await this.fetchInstance(`${this.address}/UpdateConfigs`, {
      method: 'PUT',
      body: payload,
      ...config,
    })) as ApiResponse<IAuthConfigUserUpdateRequest>
  }
}
