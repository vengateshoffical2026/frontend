import { useMutation, useQuery } from "@tanstack/react-query"
import { addBook, getAllSections, getBooksBySectionId } from "../controllers/journal"


export const useGetAllSections = () => {
    return useQuery({
        queryKey: ["getAllSections"],
        queryFn: async () => {
            return await getAllSections();
        }
    })
}

export const useGetBooksBySectionId = (sectionId: string) => {
    return useQuery({
        queryKey: ["getBooksBySectionId", sectionId],
        queryFn: async () => {
            return await getBooksBySectionId(sectionId);
        },
        enabled:!!sectionId,
    })
}

export const useAddBook = () => {
    return useMutation({
        mutationKey: ["addBook"],
        mutationFn: async (data: string) => {
            return await addBook(data);
        }
    })
}