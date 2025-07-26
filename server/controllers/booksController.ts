import { Request, Response } from 'express';
import { Repository, Book } from '../lib/goodreads/repository';
import { Client } from '../lib/goodreads/client';
import { ApiResponse } from '../types';

// --- Dependency Instantiation ---
// In a larger project, you would typically use a dependency injection container
// to manage these instances and their configurations (e.g., API keys).
// For demonstration, we'll instantiate them directly here.

// Get the API key from environment variables.
// IMPORTANT: Replace 'YOUR_GOODREADS_API_KEY' with your actual key for production.
const GOODREADS_KEY = process.env.GOODREADS_KEY || 'YOUR_GOODREADS_API_KEY';

// 1. Instantiate the Goodreads API Client (the "dumb client")
const goodreadsClient = new Client({ apiKey: GOODREADS_KEY });

// 2. Instantiate the Book Repository, injecting the client dependency
const bookRepository = new Repository(goodreadsClient);

// --- Controller Functions ---

/**
 * Handles requests to search for books.
 * Expects 'q' (query text) and 'page' (page number) as query parameters.
 * Returns a JSON array of Book objects.
 *
 * Example Usage: GET /api/books/search?q=fantasy&page=1
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const searchBooks = async (req: Request, res: Response<ApiResponse<Book[]>>) => {
    // Extract query parameters
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided

    // Basic input validation
    // move validation to middleware
    if (!query) {
        return res.status(400).json({ messages: [ { text: 'Search query (q) is required.' } ] } );
    }
    if (isNaN(page) || page < 1) {
        return res.status(400).json({ messages: [ { text: 'Page must be a positive number.' } ] });
    }

    try {
        // Call the repository to perform the search and get parsed Book objects
        const { pagination, result } = await bookRepository.search(query, page);
        const response = {
            pagination,
            data: result,
        };
        
        res.status(200).json(response); // Send back the results as JSON
    } catch (error: any) {
        // Log the error for server-side debugging
        console.error('Error in searchBooks controller:', error.message);
        // Send a 500 Internal Server Error response to the client
        res.status(500).json({ messages: [ { text: error.message || 'Internal server error fetching books.' }]});
    }
};

/**
 * Handles requests to get details for a single book by ID.
 * Expects 'id' as a URL parameter.
 * Returns a JSON object of the requested Book.
 *
 * Example Usage: GET /api/books/:id (e.g., /api/books/12345)
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getBook = async (req: Request, res: Response) => {
    // Extract the book ID from URL parameters
    const bookId = req.params.id as string;

    // Basic input validation
    if (!bookId) {
        return res.status(400).json({ message: 'Book ID is required.' });
    }

    try {
        // Call the repository to get details for the individual book
        const book: Book = await bookRepository.getById(bookId);
        res.status(200).json(book); // Send back the book details as JSON
    } catch (error: any) {
        // Log the error for server-side debugging
        console.error('Error in getBookById controller:', error.message);

        // Handle specific error messages (e.g., not found) and map to appropriate HTTP status codes
        if (error.message.includes('not found')) {
             res.status(404).json({ message: error.message }); // 404 Not Found
        } else {
             res.status(500).json({ message: error.message || 'Internal server error fetching book details.' });
        }
    }
};
