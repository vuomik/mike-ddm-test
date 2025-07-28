export interface Book {
    id: string;
    title: string;
    author: string;
    description?: string;
    imageUrl?: string;
    averageRating?: number;
    publicationYear?: number;
}

export interface Message {
    code?: string;
    text: string;
}

export interface Pagination {
    perPage: number;
    currentPage: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    messages?: Message[],
    pagination?: Pagination,
    data?: T;
}

export interface PaginatedResult<T> {
    pagination: Pagination;
    result: T[];
}