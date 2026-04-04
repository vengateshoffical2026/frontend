import { useQuery } from '@tanstack/react-query'
import { getLibraryLinks } from '../controllers/library'

export const useGetLibraryLinks = () => {
  return useQuery({
    queryKey: ['libraryLinks'],
    queryFn: getLibraryLinks,
  })
}
