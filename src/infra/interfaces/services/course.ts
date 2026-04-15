import type { FetchOptions } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface ICoursePaid {
  id: number
  name: string
  description: string
  isPaid: boolean
  price: number
  duration: number
  levelDifficulty: string
  paidFocus: string | null
  createdAt: string
  updatedAt: string
}

export interface ICourseAvailable {
  id: number
  name: string
  description: string
  isPaid: boolean
  price: number
  duration: number
  levelDifficulty: string
  paidFocus: string | null
  createdAt: string
  updatedAt: string
}

export default class CourseService extends ClientService<any> {
  constructor() {
    super('Course', 'api/Course')
  }

  GetFullCoursesPaid = async (options?: FetchOptions): Promise<ApiResponse<ICoursePaid[]>> => {
    return (await this.fetchInstance(`${this.address}/GetFullCoursesPaid`, {
      method: 'GET',
      ...options,
    })) as ApiResponse<ICoursePaid[]>
  }

  GetCoursesAvailables = async (
    options?: FetchOptions,
  ): Promise<ApiResponse<ICourseAvailable[]>> => {
    return (await this.fetchInstance(`${this.address}/GetCoursesAvailables`, {
      method: 'GET',
      ...options,
    })) as ApiResponse<ICourseAvailable[]>
  }
}
