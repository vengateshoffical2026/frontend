import { useMutation } from '@tanstack/react-query'
import {
  createOrderAPI,
  verifyPaymentAPI,
  type CreateOrderData,
  type VerifyPaymentData,
} from '../controllers/subscriptionPayment'

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (payload: CreateOrderData) => createOrderAPI(payload),
  })
}

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: (payload: VerifyPaymentData) => verifyPaymentAPI(payload),
  })
}
