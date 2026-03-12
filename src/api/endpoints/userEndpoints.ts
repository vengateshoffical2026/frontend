export const USER_ENDPOINTS = {
  LIST: '/users',
  DETAIL: (id: number | string) => `/users/${id}`,
} as const
