import axios from 'axios';
// @todo should these be in a shared types location?
import { ApiResponse } from '../../server/types';
import { Book } from '../../server/lib/goodreads/repository';

export function booksService()
{
    const fetch = async (q: string, page: number): Promise<Book[]> => {
        try {
            const response = await axios.get<ApiResponse<Book[]>>(`/api/books`, {
                params: { q, page }
            });
            if (!response.data.data) {
                throw new Error('No data');
            }
            return response.data.data;
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
        const status = e.response?.status;
        const message = e.response?.data?.messages?.map((m: any) => m.text).join('; ');
        throw new Error(`Error (HTTP ${status}): ${message || e.message}`);
    } else if (e instanceof Error) {
        throw e;
    } else {
        throw new Error(`Unknown error: ${e}`);
    }
}