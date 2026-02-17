export interface ApiResponse<T> {
  success: boolean
  errors: string[]
  result: T
  totalRows: number
}