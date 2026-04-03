import { useQuery } from '@tanstack/react-query'
import { getAllBlogPosts, getBlogPostBySlug } from '../controllers/blog'

export const useGetAllBlogPosts = (page = 1, limit = 12, category?: string) => {
  return useQuery({
    queryKey: ['blogPosts', page, limit, category],
    queryFn: () => getAllBlogPosts(page, limit, category),
  })
}

export const useGetBlogPostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => getBlogPostBySlug(slug),
    enabled: !!slug,
  })
}
