import { parseStringPromise } from 'xml2js';
import { Client } from './client';
import { calculatePagination } from '../../utils/pages';
import { PaginatedResult } from '../../types';
import { inject, injectable } from 'tsyringe';

export interface Book {
    id: string;
    title: string;
    author: string;
    description?: string;
    imageUrl?: string;
    averageRating?: number;
    publicationYear?: number;
}

@injectable()
export class Repository {
    constructor(@inject(Client) private readonly client: Client) {
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

    public async search(query: string, page: number = 1): Promise<PaginatedResult<Book>> {
        const xmlResponse = await this.client.search(query, page);
        const parsedXml = await this.parseXml(xmlResponse);
        const searchResults = parsedXml.GoodreadsResponse.search.results;
        const pagination = calculatePagination(
            parseInt(parsedXml.GoodreadsResponse.search['results-start'], 10),
            parseInt(parsedXml.GoodreadsResponse.search['results-end'], 10),
            parseInt(parsedXml.GoodreadsResponse.search['total-results'], 10)
        );
        const books: Book[] = [];

        if (!searchResults || !searchResults.work) {
            throw new Error('No search results found in Goodreads response.');
        }

        // @todo typeguard?
        const works = Array.isArray(searchResults.work) ? searchResults.work : [searchResults.work];

        works.forEach((work: any) => {
            if (work.best_book) {
                books.push({
                    id: work.best_book.id._,
                    title: work.best_book.title,
                    author: work.best_book.author.name,
                });
            }
        });

        return { pagination, result: books };
    }

    public async getById(bookId: string): Promise<Book> {
        const xmlResponse = await this.client.getById(bookId);
        const parsedXml = await this.parseXml(xmlResponse);
        const bookData = parsedXml.GoodreadsResponse.book;

        const book: Book = {
            id: bookData.id,
            title: bookData.title,
            author: bookData.authors.author.name,
            description: bookData.description ? bookData.description.replace(/<[^>]*>/g, '') : '',
            imageUrl: bookData.image_url,
            averageRating: parseFloat(bookData.average_rating),
            publicationYear: parseInt(bookData.publication_year),
        };
        return book;
    }
}
