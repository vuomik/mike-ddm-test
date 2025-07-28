import axios from 'axios';
import { ApiResponse, Book } from '@shared/types';
import { ApiError } from '@/exceptions';

export function booksService()
{
    const fetch = async (q: string, page: number): Promise<ApiResponse<Book[]>> => {
        try {
            const response = await axios.get<ApiResponse<Book[]>>(`/api/books`, {
                params: { q, page }
            });
            if (!response.data.data) {
                throw new Error('No data');
            }
            return response.data;
        } catch (e) {
            throw handleError(e);
        }
    }

    const fetchOne = async (id: string): Promise<Book> => {
        try {
            const response = await axios.get<ApiResponse<Book>>(`/api/books/${id}`);
            if (!response.data.data) {
                throw new Error('No data');
            }
            return response.data.data;
        } catch (e) {
            throw handleError(e);
        }
    }

    return {
        fetch,
        fetchOne,
    }
}

const handleError = (e: unknown) => {
    if (axios.isAxiosError(e)) {
        throw new ApiError(e.response?.data?.messages ?? []);
    } else if (e instanceof Error) {
        throw new ApiError([{text: e.message}]);
    } else {
        throw e;
    }
}