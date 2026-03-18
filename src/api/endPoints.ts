const BaSE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'


export const API_ENDPOINTS = {
  AUTH : {
  SIGNUP: `${BaSE_URL}/auth/signup`,
  LOGIN: `${BaSE_URL}/auth/login`,
  },
  PAYMENT :{
    CREATE_ORDER: `${BaSE_URL}/razorpay/order`,
    VERIFY_PAYMENT: `${BaSE_URL}/razorpay/verify`,
  }
} 
