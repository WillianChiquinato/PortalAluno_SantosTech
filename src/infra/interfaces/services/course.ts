import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface ICoursePaid {
  id: number
  name: string
  description: string
  isPaid: boolean
  price: number
  duration: number // Duration in hours
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
    let urlParams = `/GetFullCoursesPaid`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...options,
    })) as ApiResponse<ICoursePaid[]>
  }

  GetProgressUserPaidCourses = async (
    userId: number,
    options?: FetchOptions,
  ): Promise<ApiResponse<{ courseId: number; progress: number }[]>> => {
    let urlParams = `/GetProgressUserPaidCourses/?userId=${userId}`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...options,
    })) as ApiResponse<{ courseId: number; progress: number }[]>
  }

  GetCoursesAvailables = async (
    options?: FetchOptions,
  ): Promise<ApiResponse<ICourseAvailable[]>> => {
    let urlParams = `/GetCoursesAvailables`

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: 'GET',
      ...options,
    })) as ApiResponse<ICourseAvailable[]>
  }
}
