import { parseStringPromise } from 'xml2js'
import { Client } from '@server/lib/goodreads/client'
import { calculatePagination } from '@server/utils/pages'
import { PaginatedResult, Book } from '@shared/types'
import { inject, injectable } from 'tsyringe'

export class NoSearchResultsError extends Error {}

@injectable()
export class Repository {
  constructor(@inject(Client) private readonly client: Client) {
    this.client = client
  }

  private async parseXml(xmlString: string): Promise<any> {
    try {
      return await parseStringPromise(xmlString, {
        explicitArray: false,
        mergeAttrs: true,
      })
    } catch (e: unknown) {
      console.error('Error parsing XML:', e instanceof Error ? e.message : e)
      throw new Error('Failed to parse XML response.')
    }
  }

  public async search(query: string, page = 1): Promise<PaginatedResult<Book>> {
    const xmlResponse = await this.client.search(query, page)
    const parsedXml = await this.parseXml(xmlResponse)
    const searchResults = parsedXml.GoodreadsResponse.search.results
    const pagination = calculatePagination(
      parseInt(parsedXml.GoodreadsResponse.search['results-start'], 10),
      parseInt(parsedXml.GoodreadsResponse.search['results-end'], 10),
      parseInt(parsedXml.GoodreadsResponse.search['total-results'], 10)
    )
    const books: Book[] = []

    if (!searchResults?.work) {
      return { pagination, result: books }
    }

    const works = Array.isArray(searchResults.work)
      ? searchResults.work
      : [searchResults.work]

    works.forEach((work: any) => {
      if (work.best_book) {
        books.push({
          id: work.best_book.id._,
          title: work.best_book.title,
          author: work.best_book.author.name,
        })
      }
    })

    return { pagination, result: books }
  }

  public async getById(bookId: string): Promise<Book> {
    const xmlResponse = await this.client.getById(bookId)
    const parsedXml = await this.parseXml(xmlResponse)
    const bookData = parsedXml.GoodreadsResponse.book

    const book: Book = {
      id: bookData.id,
      title: bookData.title,
      author: bookData.authors.author.name,
      description: bookData.description
        ? bookData.description.replace(/<[^>]*>/g, '')
        : '',
      imageUrl: bookData.image_url,
      averageRating: parseFloat(bookData.average_rating),
      publicationYear: parseInt(bookData.publication_year),
    }
    return book
  }
}
