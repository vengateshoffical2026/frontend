import { useMutation } from '@tanstack/react-query'
import {
  createDonationOrderAPI,
  verifyDonationPaymentAPI,
  type CreateDonationOrderData,
  type VerifyDonationPaymentData,
} from '../controllers/donationPayment'

export const useCreateDonationOrder = () => {
  return useMutation({
    mutationKey: ['createDonationOrder'],
    mutationFn: (payload: CreateDonationOrderData) => createDonationOrderAPI(payload),
  })
}

export const useVerifyDonationPayment = () => {
  return useMutation({
    mutationKey: ['verifyDonationPayment'],
    mutationFn: (payload: VerifyDonationPaymentData) => verifyDonationPaymentAPI(payload),
  })
}
