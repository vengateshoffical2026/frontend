import { API_ENDPOINTS } from '../endPoints'
import apiClient from '../interceptors/axiosInstance'

export const getResourceCenters = async () => {
  const response = await apiClient.get(API_ENDPOINTS.COMMUNITY)
  return response.data?.data
}
