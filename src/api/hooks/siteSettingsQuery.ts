import { useQuery } from '@tanstack/react-query'
import { getSiteSettings } from '../controllers/siteSettings'

export const useGetSiteSettings = () => {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: getSiteSettings,
    refetchInterval: 60000, // refresh every 60s to catch go-live
  })
}
