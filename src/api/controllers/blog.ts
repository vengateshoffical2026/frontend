import { API_ENDPOINTS } from '../endPoints'
import apiClient from '../interceptors/axiosInstance'

export const getAllBlogPosts = async (page = 1, limit = 12, category?: string) => {
  const params: Record<string, string | number> = { page, limit }
  if (category && category !== 'all') params.category = category
  const response = await apiClient.get(API_ENDPOINTS.BLOG.GET_ALL, { params })
  return response.data?.data
}

export const getBlogPostBySlug = async (slug: string) => {
  const response = await apiClient.get(`${API_ENDPOINTS.BLOG.GET_BY_SLUG}/${slug}`)
  return response.data?.data
}
