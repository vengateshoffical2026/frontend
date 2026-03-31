import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createDonationOrderAPI,
  verifyDonationPaymentAPI,
  getDonationListAPI,
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

export const useDonationList = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['donationList', page, limit],
    queryFn: () => getDonationListAPI(page, limit),
  })
}
