import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'
import type { LoginResponse } from '../loginResponse'
import type { IClass } from './class'
import type { IBadge } from './badge'

export interface IUser {
  id: number
  name: string
  email: string
  passwordHash: number
  role: UserRole
  profilePictureUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface IUpdateUserProfileRequest {
  id: number
  name: string
  email: string
  password: string
  role: UserRole
  bio: string
  profilePictureUrl: string
  coverPictureUrl: string
  updatedAt: Date
}

export interface IUserProfileData {
  id: number
  name: string
  email: string
  passwordHash: number
  role: UserRole
  bio: string
  profilePictureUrl: string
  coverPictureUrl: string
  levelUser: string
  pointsQuantity: number
  class: IClass
  studentBadges: IBadge[]
}

export enum UserRole {
  Student = 1,
  Admin = 2,
  Teacher = 3,
}

export default class UserService extends ClientService<any> {
  constructor() {
    super('User', 'api/User')
  }

  Login = async (
    email: string,
    password: string,
    config: FetchOptions = {},
  ): Promise<LoginResponse> => {
    return (await this.fetchInstance(`${this.address}/Login`, {
      method: 'POST',
      body: { email, password },
      ...config,
    })) as LoginResponse
  }

  GetUsers = async (config: FetchOptions = {}): Promise<ApiResponse<IUser[]>> => {
    let urlParams = `/GetAllUsers`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IUser[]>
  }

  GetProfileData = async (
    userId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IUserProfileData>> => {
    let urlParams = `/GetProfileData?userid=${userId}`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IUserProfileData>
  }

  UpdateProfile = async (
    request: IUpdateUserProfileRequest,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IUpdateUserProfileRequest>> => {
    return (await this.fetchInstance(`${this.address}/UpdateUser`, {
      method: 'PUT',
      body: request,
      ...config,
    })) as ApiResponse<IUpdateUserProfileRequest>
  }
}
