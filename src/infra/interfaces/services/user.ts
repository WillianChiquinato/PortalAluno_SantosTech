import type { FetchOptions } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'
import type { LoginResponse } from '../loginResponse'
import type { IClass } from './class'
import type { IBadge } from './badge'

export interface IUser {
  id: number
  name: string
  email: string
  role: UserRole
  profilePictureUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface IUpdateUserProfileRequest {
  // [SEC] id and role removed — backend extracts userId from JWT token
  name: string
  email: string
  password?: string
  bio: string
  profilePictureUrl?: string
  coverPictureUrl?: string
  updatedAt?: Date
}

export interface IUserProfileData {
  id: number
  name: string
  email: string
  role: string
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
  Teacher = 2,
  Admin = 3,
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
    return (await this.fetchInstance(`${this.address}/GetAllUsers`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IUser[]>
  }

  GetProfileData = async (
    enrollmentId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IUserProfileData>> => {
    return (await this.fetchInstance(`${this.address}/GetProfileData?enrollmentId=${enrollmentId}`, {
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

  SendEmailVerify = async (
    email: string,
    config: FetchOptions = {},
  ): Promise<ApiResponse<string>> => {
    return (await this.fetchInstance(`${this.address}/SendEmailVerify`, {
      method: 'POST',
      body: { email },
      ...config,
    })) as ApiResponse<string>
  }

  ConfirmEmailVerify = async (
    email: string,
    code: string,
    config: FetchOptions = {},
  ): Promise<ApiResponse<string>> => {
    return (await this.fetchInstance(`${this.address}/ConfirmEmailVerify`, {
      method: 'POST',
      body: { email, code },
      ...config,
    })) as ApiResponse<string>
  }

  SendPasswordRecoveryEmail = async (
    email: string,
    config: FetchOptions = {},
  ): Promise<ApiResponse<string>> => {
    return (await this.fetchInstance(`${this.address}/SendPasswordRecoveryEmail`, {
      method: 'POST',
      body: { email },
      ...config,
    })) as ApiResponse<string>
  }
}
