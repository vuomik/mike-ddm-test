import { ref } from "vue";
import { booksService } from '../services/books';
import { Book } from "../../server/lib/goodreads/repository";

export function useBooks() {
    const books = ref<Book[]>([]);
    const book = ref<Book>();

    const { fetch, fetchOne } = booksService();

    const isLoading = ref(false);

    const loadBooks = async (q: string, page: number) => {
        if (isLoading.value) return;
        isLoading.value = true;
        try {
            books.value = await fetch(q, page);
        } catch (e) {
            alert(e); // @todo do better, like a modal
        } finally {
            isLoading.value = false;
        }
    };

    const loadBook = async (id: string) => {
        if (isLoading.value) return;
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
        books,
        book,
        loadBooks,
        loadBook,
    }
}