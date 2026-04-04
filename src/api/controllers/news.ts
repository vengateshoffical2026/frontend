import { API_ENDPOINTS } from '../endPoints'
import apiClient from '../interceptors/axiosInstance'

export const getPublicNews = async () => {
  const response = await apiClient.get(API_ENDPOINTS.NEWS)
  return response.data?.data
}
