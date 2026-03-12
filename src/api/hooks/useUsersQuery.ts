import { useQuery } from '@tanstack/react-query'

import { getUserById, getUsers } from '../controllers/userController'

export const userQueryKeys = {
  all: ['users'] as const,
  byId: (id: number) => [...userQueryKeys.all, id] as const,
}

export const useUsersQuery = () => {
  return useQuery({
    queryKey: userQueryKeys.all,
    queryFn: getUsers,
  })
}

export const useUserByIdQuery = (id: number) => {
  return useQuery({
    queryKey: userQueryKeys.byId(id),
    queryFn: () => getUserById(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}
