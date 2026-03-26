import { useQuery } from "@tanstack/react-query"
import { getAllSections, getBooksBySectionId } from "../controllers/journal"


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