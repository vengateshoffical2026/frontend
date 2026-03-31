import { API_ENDPOINTS } from '../endPoints'
import apiClient from '../interceptors/axiosInstance'

export interface CreateOrderData {
  amount: number
  currency: string
  receipt: string
}

export interface VerifyPaymentData {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export const createOrderAPI = async (payload: CreateOrderData) => {
  const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTION_PAYMENT.CREATE_ORDER, payload)
  return response.data
}

export const verifyPaymentAPI = async (payload: VerifyPaymentData) => {
  const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTION_PAYMENT.VERIFY_PAYMENT, payload)
  return response.data
}
