import { ref } from "vue";
import { booksService } from '@/services/books';
import { Book } from "@server/lib/goodreads/repository";
import { Pagination } from "@server/types";

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
        } catch (e) {
            alert(e); // @todo do better, like a modal
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
        } catch (e) {
            alert(e); // @todo do better, like a modal
        } finally {
            isLoading.value = false;
        }
    }

    return {
        isLoading,
        books,
        book,
        loadBooks,
        loadBook,
        pagination,
    }
}