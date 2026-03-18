import { API_ENDPOINTS } from '../endPoints'
import apiClient from '../interceptors/axiosInstance'

export interface SignupData {
  fullName: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export const signupAPI = async (payload: SignupData) => {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, payload)
  return response.data
}

export const loginAPI = async (payload: LoginData) => {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload)
  return response.data
}