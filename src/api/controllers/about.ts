import { API_ENDPOINTS } from '../endPoints'
import apiClient from '../interceptors/axiosInstance'

export interface TeamMember {
  _id: string
  name: string
  role: string
  photo: string
  bio: string
  order: number
}

export interface Author {
  _id: string
  name: string
  photo: string
  bookName: string
  order: number
}

export interface AuthorsResponse {
  success: boolean
  data: {
    authors: Author[]
    total: number
    limit: number
    page: number
  }
}

export const getTeamMembersAPI = async (): Promise<{ success: boolean; data: TeamMember[] }> => {
  const response = await apiClient.get(API_ENDPOINTS.ABOUT.TEAM)
  return response.data
}

export const getAuthorsAPI = async (page = 1, limit = 20): Promise<AuthorsResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.ABOUT.AUTHORS, {
    params: { page, limit },
  })
  return response.data
}
