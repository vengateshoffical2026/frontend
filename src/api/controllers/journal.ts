import { API_ENDPOINTS } from '../endPoints'
import apiClient from '../interceptors/axiosInstance'

export const getAllSections = async () => {
  const response = await apiClient.get(API_ENDPOINTS.JOURNAL.GET_ALL_SECTIONS)
  return response.data?.data?.sections
}

export const getBooksBySectionId = async (sectionId: string) => {
  const response = await apiClient.get(`${API_ENDPOINTS.JOURNAL.GET_BOOKS_BY_SECTION_ID}/${sectionId}`)
  return response.data?.data?.data
}

export const getAllBooks = async () => {
  const response = await apiClient.get(API_ENDPOINTS.JOURNAL.GET_ALL_BOOKS)
  return response.data?.data?.data
}

export const downloadBook = async (bookId: string) => {
  const response = await apiClient.get(`${API_ENDPOINTS.JOURNAL.DOWNLOAD_BOOK}/${bookId}/download`, {
    responseType: 'blob',
  })
  return response
}

export const addBook = async (data: FormData) => {
  const response = await apiClient.post(API_ENDPOINTS.JOURNAL.ADD_BOOK, data)
  return response.data
}
