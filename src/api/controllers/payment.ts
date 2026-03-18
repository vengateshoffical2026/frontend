import { API_ENDPOINTS } from '../endPoints'
import apiClient from '../interceptors/axiosInstance'

export interface CreateOrderData {
  amount: number
  currency: string
  receipt: string
}

export const createOrderAPI = async (payload: CreateOrderData) => {
  const response = await apiClient.post(API_ENDPOINTS.PAYMENT.CREATE_ORDER, payload)
  return response.data
}

export const verifyPaymentAPI = async (payload: any) => {
  const response = await apiClient.post(API_ENDPOINTS.PAYMENT.VERIFY_PAYMENT, payload);
  return response.data; 
}