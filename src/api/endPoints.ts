export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
  },
  SUBSCRIPTION_PAYMENT: {
    CREATE_ORDER: '/subscription-payment/order',
    VERIFY_PAYMENT: '/subscription-payment/verify',
  },
  DONATION_PAYMENT: {
    CREATE_ORDER: '/donation-payment/order',
    VERIFY_PAYMENT: '/donation-payment/verify',
  },
  DONATION_LIST: '/donation-list',
  JOURNAL: {
    GET_ALL_SECTIONS: '/sasanam-section',
    GET_BOOKS_BY_SECTION_ID: '/sasanam-books',
    ADD_BOOK: '/sasanam-book-details',
  },
}
