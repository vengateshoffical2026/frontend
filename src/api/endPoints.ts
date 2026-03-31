const BaSE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'


export const API_ENDPOINTS = {
  AUTH : {
  SIGNUP: `${BaSE_URL}/auth/signup`,
  LOGIN: `${BaSE_URL}/auth/login`,
  },
  SUBSCRIPTION_PAYMENT :{
    CREATE_ORDER: `${BaSE_URL}/subscription-payment/order`,
    VERIFY_PAYMENT: `${BaSE_URL}/subscription-payment/verify`,
  },
DONATION_PAYMENT :{
  CREATE_ORDER: `${BaSE_URL}/donation-payment/order`,
  VERIFY_PAYMENT: `${BaSE_URL}/donation-payment/verify`,
},
JOURNAL:{
GET_ALL_SECTIONS: `${BaSE_URL}/sasanam-section`,
GET_BOOKS_BY_SECTION_ID: `${BaSE_URL}/sasanam-books`,
ADD_BOOK: `${BaSE_URL}/sasanam-book-details`,
}
}
