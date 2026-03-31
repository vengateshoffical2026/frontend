import { API_ENDPOINTS } from "../endPoints"
import apiClient from "../interceptors/axiosInstance"

export const getAllSections = async () => {
    const response:any = await apiClient.get(API_ENDPOINTS.JOURNAL.GET_ALL_SECTIONS);
    return response?.data?.data?.sections;
}

export const getBooksBySectionId = async (sectionId: string) => {
    const response:any = await apiClient.get(`${API_ENDPOINTS.JOURNAL.GET_BOOKS_BY_SECTION_ID}/${sectionId}`);
    return response?.data?.data?.data;
}

export const addBook = async (data: string) => {
    const response:any = await apiClient.post(API_ENDPOINTS.JOURNAL.ADD_BOOK, data);
    return response?.data;
}