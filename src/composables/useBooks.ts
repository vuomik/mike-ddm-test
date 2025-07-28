import { ref } from "vue";
import { booksService } from '@/services/books';
import { Message, Pagination, Book } from "@shared/types";
import { ApiError } from "@/exceptions";

export function useBooks() {
    const books = ref<Book[]>([]);
    const book = ref<Book>();
    const pagination = ref<Pagination>({ perPage: 0, currentPage: 0, totalPages: 0 });

    const { fetch, fetchOne } = booksService();

    const isLoading = ref(false);

    const loadBooks = async (q: string, page: number) => {
        if (isLoading.value || !q.length) { 
            return;
        }
        
        isLoading.value = true;
        try {
            const { data: d, pagination: p } = await fetch(q, page);
            books.value = d ?? [];
            pagination.value = p ?? { perPage: 0, currentPage: 0, totalPages: 0 };
        } finally {
            isLoading.value = false;
        }
    };

    const loadBook = async (id: string) => {
        if (isLoading.value) {
            return;
        }
        isLoading.value = true;
        try {
            book.value = await fetchOne(id);
        } finally {
            isLoading.value = false;
        }
    }

    const getErrorMessages = (e: unknown): Message[] => {
        if (e instanceof ApiError) {
            return e.messages;
        } else if (e instanceof Error) {
            return [{text: e.message}];
        } else {
            return [{text:'Unknown error'}];
        }
    }

    return {
        isLoading,
        books,
        book,
        loadBooks,
        loadBook,
        pagination,
        getErrorMessages,
    }
}