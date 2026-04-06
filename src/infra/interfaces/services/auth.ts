import type { FetchOptions } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface IAuth {
  id: number
  name: string
  email: string
  role: number
  profilePictureUrl: string
}

export interface IOAuthProvider {
  id: 'google' | 'github'
  label: string
  enabled: boolean
}

export interface IAuthConfigUser {
  receiveEmailNotifications: boolean
  darkModeEnabled: boolean
  reportFrequency: boolean
  acessibilityMode: boolean
  preferredLanguage: string
}

export interface IAuthConfigUserUpdateRequest {
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

  Session = async (config: FetchOptions = {}): Promise<ApiResponse<IAuth>> => {
    return (await this.fetchInstance(`${this.address}/session`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IAuth>
  }

  GetProviders = async (
    config: FetchOptions = {},
  ): Promise<ApiResponse<IOAuthProvider[]>> => {
    return (await this.fetchInstance(`${this.address}/providers`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IOAuthProvider[]>
  }

  GetConfigsByUserId = async (
    config: FetchOptions = {},
  ): Promise<ApiResponse<IAuthConfigUser>> => {
    return (await this.fetchInstance(`${this.address}/GetConfigs`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IAuthConfigUser>
  }

  CreateNewConfig = async (
    config: FetchOptions = {},
  ): Promise<ApiResponse<IAuthConfigUserUpdateRequest>> => {
    return (await this.fetchInstance(`${this.address}/CreateNewConfig`, {
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

  Logout = async (config: FetchOptions = {}): Promise<ApiResponse<string>> => {
    return (await this.fetchInstance(`${this.address}/Logout`, {
      method: 'POST',
      ...config,
    })) as ApiResponse<string>
  }
}
