import { useQuery } from '@tanstack/react-query'
import { getArchiveItems } from '../controllers/archive'

export const useGetArchiveItems = () => {
  return useQuery({
    queryKey: ['archiveItems'],
    queryFn: getArchiveItems,
  })
}
