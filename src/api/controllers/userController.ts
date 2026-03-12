import { USER_ENDPOINTS } from '../endpoints/userEndpoints'
import apiClient from '../interceptors/axiosInstance'

export interface ApiUser {
  id: number
  name: string
  username: string
  email: string
}

export const getUsers = async () => {
  const response = await apiClient.get<ApiUser[]>(USER_ENDPOINTS.LIST)
  return response.data
}

export const getUserById = async (id: number) => {
  const response = await apiClient.get<ApiUser>(USER_ENDPOINTS.DETAIL(id))
  return response.data
}
