import { API_ENDPOINTS } from "../endPoints"
import apiClient from "../interceptors/axiosInstance"

export const createDonationOrderAPI = async (payload: any) => {
  const response = await apiClient.post(API_ENDPOINTS.DONATION_PAYMENT.CREATE_ORDER, payload)
  return response.data
}

export const verifyDonationPaymentAPI = async (payload: any) => {
  const response = await apiClient.post(API_ENDPOINTS.DONATION_PAYMENT.VERIFY_PAYMENT, payload);
  return response.data; 
}