import { API_ENDPOINTS } from '../endPoints'
import apiClient from '../interceptors/axiosInstance'

export const getArchiveItems = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ARCHIVE)
  return response.data?.data
}
