import { useMutation } from '@tanstack/react-query'
import { createOrderAPI, verifyPaymentAPI } from '../controllers/payment'

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (payload: any) =>  createOrderAPI(payload),
    })
  }


export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: (payload: any) =>  verifyPaymentAPI(payload),
    })
  }