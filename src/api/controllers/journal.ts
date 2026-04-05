import { API_ENDPOINTS } from '../endPoints'
import apiClient from '../interceptors/axiosInstance'

export const getAllSections = async () => {
  const response = await apiClient.get(API_ENDPOINTS.JOURNAL.GET_ALL_SECTIONS)
  return response.data?.data?.sections
}

export const getBooksBySectionId = async (sectionId: string) => {
  const response = await apiClient.get(`${API_ENDPOINTS.JOURNAL.GET_BOOKS_BY_SECTION_ID}/${sectionId}`)
  return response.data?.data
}

export const getAllBooks = async () => {
  const response = await apiClient.get(API_ENDPOINTS.JOURNAL.GET_ALL_BOOKS)
  return response.data?.data?.books
}

export const downloadBook = async (bookId: string) => {
  const response = await apiClient.get(`${API_ENDPOINTS.JOURNAL.DOWNLOAD_BOOK}/${bookId}/download`, {
    responseType: 'blob',
  })
  return response
}

export const getDownloadStatus = async () => {
  const response = await apiClient.get(API_ENDPOINTS.JOURNAL.DOWNLOAD_STATUS)
  return response.data?.data
}

export const addBook = async (data: FormData) => {
  const response = await apiClient.post(API_ENDPOINTS.JOURNAL.ADD_BOOK, data)
  return response.data
}

export const getAllBulkBooks = async (page: number, limit: number) => {
  const response = await apiClient.get(`${API_ENDPOINTS.JOURNAL.GET_ALL_BULK_BOOKS(page, limit)}`)
  return response.data?.data;
}

export const downloadBulkBook = async (id: string) => {
  const response = await apiClient.get(`${API_ENDPOINTS.JOURNAL.DOWNLOAD_BULK_BOOK(id)}`, {
    responseType: 'blob',
  })
  return response
}