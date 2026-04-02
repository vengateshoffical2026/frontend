import { useMutation, useQuery } from '@tanstack/react-query'
import { addBook, getAllBooks, getAllSections, getBooksBySectionId } from '../controllers/journal'

export const useGetAllSections = () => {
  return useQuery({
    queryKey: ['getAllSections'],
    queryFn: getAllSections,
  })
}

export const useGetBooksBySectionId = (sectionId: string) => {
  return useQuery({
    queryKey: ['getBooksBySectionId', sectionId],
    queryFn: () => getBooksBySectionId(sectionId),
    enabled: !!sectionId,
  })
}

export const useGetAllBooks = () => {
  return useQuery({
    queryKey: ['getAllBooks'],
    queryFn: getAllBooks,
  })
}

export const useAddBook = () => {
  return useMutation({
    mutationKey: ['addBook'],
    mutationFn: (data: FormData) => addBook(data),
  })
}
