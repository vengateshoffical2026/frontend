import { API_ENDPOINTS } from '../endPoints'
import apiClient from '../interceptors/axiosInstance'

export interface CreateDonationOrderData {
  amount: number
  currency: string
  receipt: string
  userId?: string
}

export interface VerifyDonationPaymentData {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  userId?: string
  donaterName?: string
}

export const createDonationOrderAPI = async (payload: CreateDonationOrderData) => {
  const response = await apiClient.post(API_ENDPOINTS.DONATION_PAYMENT.CREATE_ORDER, payload)
  return response.data
}

export const verifyDonationPaymentAPI = async (payload: VerifyDonationPaymentData) => {
  const response = await apiClient.post(API_ENDPOINTS.DONATION_PAYMENT.VERIFY_PAYMENT, payload)
  return response.data
}

export interface DonationListItem {
  _id: string
  donaterName: string
  donationAmount: number
  orderId: string
  paymentId: string
  donationDate: string
}

export interface DonationListResponse {
  success: boolean
  data: {
    donations: DonationListItem[]
    total: number
    limit: number
    page: number
  }
}

export const getDonationListAPI = async (page = 1, limit = 20): Promise<DonationListResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.DONATION_LIST, {
    params: { page, limit },
  })
  return response.data
}
