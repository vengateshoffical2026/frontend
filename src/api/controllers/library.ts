import { API_ENDPOINTS } from '../endPoints'
import apiClient from '../interceptors/axiosInstance'

export const getLibraryLinks = async () => {
  const response = await apiClient.get(API_ENDPOINTS.LIBRARY)
  return response.data?.data
}
