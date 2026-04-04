export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    PROFILE: '/auth/me',
  },
  CONTACT: '/contact',
  SUBSCRIPTION_PAYMENT: {
    CREATE_ORDER: '/subscription-payment/order',
    VERIFY_PAYMENT: '/subscription-payment/verify',
  },
  DONATION_PAYMENT: {
    CREATE_ORDER: '/donation-payment/order',
    VERIFY_PAYMENT: '/donation-payment/verify',
  },
  DONATION_LIST: '/donation-list',
  ABOUT: {
    TEAM: '/about/team',
    AUTHORS: '/about/authors',
  },
  BLOG: {
    GET_ALL: '/blog',
    GET_BY_SLUG: '/blog',
  },
  JOURNAL: {
    GET_ALL_SECTIONS: '/sasanam-section',
    GET_BOOKS_BY_SECTION_ID: '/sasanam-books',
    GET_ALL_BOOKS: '/sasanam-books',
    DOWNLOAD_BOOK: '/sasanam-books',
    DOWNLOAD_STATUS: '/sasanam-books/download-status/me',
    ADD_BOOK: '/sasanam-book-details',
    GET_ALL_BULK_BOOKS: (page: number, limit: number) => `/sasanam-bulkbooks?${page ? `page=${page}` : 'page=1'}${limit ? `&limit=${limit}` : 'limit=10'}`,
  },
  LIBRARY: '/library',
  ARCHIVE: '/archive',
  COMMUNITY: '/community',
  NEWS: '/news',
  SITE_SETTINGS: '/site-settings',
}
