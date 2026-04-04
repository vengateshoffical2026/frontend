import { useQuery } from '@tanstack/react-query'
import { getPublicNews } from '../controllers/news'

export const useGetPublicNews = () => {
  return useQuery({
    queryKey: ['publicNews'],
    queryFn: getPublicNews,
  })
}
