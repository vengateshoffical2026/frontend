import { API_ENDPOINTS } from '../endPoints'
import apiClient from '../interceptors/axiosInstance'

export const getSiteSettings = async () => {
  const response = await apiClient.get(API_ENDPOINTS.SITE_SETTINGS)
  return response.data?.data
}
