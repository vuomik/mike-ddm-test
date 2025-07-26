import { parseStringPromise } from 'xml2js';
import { Client } from './client';

export interface Book {
    id: string;
    title: string;
    author: string;
    description?: string;
    imageUrl?: string;
    averageRating?: number;
    publicationYear?: number;
}

export class Repository {
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    private async parseXml(xmlString: string): Promise<any> {
        try {
            // explicitArray: false ensures single elements are not wrapped in arrays
            // mergeAttrs: true merges XML attributes into the element object
            return await parseStringPromise(xmlString, { explicitArray: false, mergeAttrs: true });
        } catch (error: any) {
            console.error('Error parsing XML:', error.message);
            throw new Error('Failed to parse XML response.');
        }
    }

    public async search(query: string, page: number = 1): Promise<Book[]> {
        try {
            // Fetch raw XML from the client
            const xmlResponse = await this.client.search(query, page);
            // Parse the XML into a JavaScript object
            const parsedXml = await this.parseXml(xmlResponse);

            // console.log('Parsed Goodreads Search XML:', JSON.stringify(parsedXml, null, 2)); // For debugging

            const searchResults = parsedXml.GoodreadsResponse.search.results;
            const books: Book[] = [];

            if (searchResults && searchResults.work) {
                // Ensure 'work' is always an array, even if there's only one result
                const works = Array.isArray(searchResults.work) ? searchResults.work : [searchResults.work];

                works.forEach((work: any) => {
                    if (work.best_book) {
                        books.push({
                            id: work.best_book.id,
                            title: work.best_book.title,
                            author: work.best_book.author.name,
                            // Add more properties from 'work.best_book' or 'work' if available
                            // publicationYear: parseInt(work.original_publication_year),
                        });
                    }
                });
            }
            return books;

        } catch (error: any) {
            console.error('Error in Repository.search:', error.message);
            throw new Error(`Failed to search books: ${error.message}`);
        }
    }

    public async getById(bookId: string): Promise<Book> {
        try {
            // Fetch raw XML from the client
            const xmlResponse = await this.client.getById(bookId);
            // Parse the XML into a JavaScript object
            const parsedXml = await this.parseXml(xmlResponse);

            // console.log('Parsed Goodreads Book Details XML:', JSON.stringify(parsedXml, null, 2)); // For debugging

            const bookData = parsedXml.GoodreadsResponse.book;
            if (!bookData) {
                throw new Error(`Book with ID ${bookId} not found in Goodreads response.`);
            }

            // Extract details from the parsed XML structure and map to our Book interface
            const book: Book = {
                id: bookData.id,
                title: bookData.title,
                author: bookData.authors.author.name, // Assuming a single author for simplicity
                description: bookData.description ? bookData.description.replace(/<[^>]*>/g, '') : '', // Remove HTML tags
                imageUrl: bookData.image_url,
                averageRating: parseFloat(bookData.average_rating),
                publicationYear: parseInt(bookData.publication_year),
            };
            return book;

        } catch (error: any) {
            console.error(`Error in Repository.getById for ID ${bookId}:`, error.message);
            if (error.message.includes('not found')) { // Check for specific error message from client
                throw new Error(`Book with ID ${bookId} not found.`);
            }
            throw new Error(`Failed to fetch book details: ${error.message}`);
        }
    }
}
