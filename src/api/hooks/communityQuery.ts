import { useQuery } from '@tanstack/react-query'
import { getResourceCenters } from '../controllers/community'

export const useGetResourceCenters = () => {
  return useQuery({
    queryKey: ['resourceCenters'],
    queryFn: getResourceCenters,
  })
}
