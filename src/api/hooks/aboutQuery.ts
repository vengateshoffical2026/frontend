import { useQuery } from '@tanstack/react-query'
import { getTeamMembersAPI, getAuthorsAPI } from '../controllers/about'

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => getTeamMembersAPI(),
  })
}

export const useAuthors = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['authors', page, limit],
    queryFn: () => getAuthorsAPI(page, limit),
  })
}
