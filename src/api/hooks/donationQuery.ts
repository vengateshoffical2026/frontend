import { useMutation } from "@tanstack/react-query"
import { createDonationOrderAPI, verifyDonationPaymentAPI } from "../controllers/donationPayment"

export const useVerifyDonationPayment = () => {
    return useMutation({
        mutationKey: ['verifyDonationPayment'],
        mutationFn: async (payload: any) => {
            const response = await verifyDonationPaymentAPI(payload)
            return response
        }
    })
}

export const useCreateDonationOrder = () => {
    return useMutation({
        mutationKey: ['createDonationOrder'],
        mutationFn: async (payload: any) => {
            const response = await createDonationOrderAPI(payload)
            return response
        }
    })
}