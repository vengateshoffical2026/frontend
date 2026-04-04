import { useMutation, useQuery } from '@tanstack/react-query'
import { addBook, getAllBooks, getAllBulkBooks, getAllSections, getBooksBySectionId, getDownloadStatus } from '../controllers/journal'

export const useGetAllSections = () => {
  return useQuery({
    queryKey: ['getAllSections'],
    queryFn: getAllSections,
    gcTime:0,
    staleTime: 0,
  })
}

export const useGetBooksBySectionId = (sectionId: string) => {
  return useQuery({
    queryKey: ['getBooksBySectionId', sectionId],
    queryFn: () => getBooksBySectionId(sectionId),
    enabled: !!sectionId,
    gcTime:0,
    staleTime: 0,
  })
}

export const useGetAllBooks = () => {
  return useQuery({
    queryKey: ['getAllBooks'],
    queryFn: getAllBooks,
  })
}

export const useDownloadStatus = () => {
  const token = localStorage.getItem('token')
  return useQuery({
    queryKey: ['downloadStatus'],
    queryFn: getDownloadStatus,
    enabled: !!token,
  })
}

export const useAddBook = () => {
  return useMutation({
    mutationKey: ['addBook'],
    mutationFn: (data: FormData) => addBook(data),
  })
}

export const useGetAllBulkBooks = (page:number,limit:number) => {
  return useQuery({
    queryKey: ['getAllBulkBooks'],
    queryFn: () => getAllBulkBooks(page,limit),
  })
}