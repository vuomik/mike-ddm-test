import { parseStringPromise } from 'xml2js'
import { Client } from '@server/lib/goodreads/client'
import { calculatePagination, INITIAL_PAGE } from '@server/utils/pages'
import { PaginatedResult, Book } from '@shared/types'
import { inject, injectable } from 'tsyringe'
import { z } from 'zod'

export class NoSearchResultsError extends Error {}

const bookSchema = z.object({
  id: z.object({
    _: z.string(),
  }),
  title: z.string(),
  author: z.object({
    name: z.string(),
  }),
  description: z.string().optional(),
})

const workSchema = z.object({
  best_book: bookSchema.optional(),
})

const goodreadsSearchResponseSchema = z.object({
  GoodreadsResponse: z.object({
    search: z.object({
      results: z.object({
        work: z.union([workSchema, z.array(workSchema)]).optional(),
      }),
      'results-start': z.coerce.number().int().min(INITIAL_PAGE),
      'total-results': z.coerce.number().int(),
    }),
  }),
})

const goodreadsBookResponseSchema = z.object({
  GoodreadsResponse: z.object({
    book: z.object({
      id: z.string(),
      title: z.string(),
      authors: z.object({
        author: z.union([
          z.object({ name: z.string() }),
          z.array(z.object({ name: z.string() })),
        ]),
      }),
      description: z.string().optional(),
      image_url: z.string().optional(),
      average_rating: z.coerce.number(),
      publication_year: z.coerce.number(),
    }),
  }),
})

const parseXml = async <T>(
  xmlString: string,
  schema: z.ZodType<T>
): Promise<T> => {
  const result: unknown = await parseStringPromise(xmlString, {
    explicitArray: false,
    mergeAttrs: true,
  })
  try {
    return schema.parse(result)
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      throw new Error(e.message, { cause: e })
    } else {
      throw e
    }
  }
}

@injectable()
export class Repository {
  constructor(@inject(Client) private readonly client: Client) {}

  public async search(
    query: string,
    page = INITIAL_PAGE
  ): Promise<PaginatedResult<Book>> {
    const xmlResponse = await this.client.search(query, page)
    const parsedXml = await parseXml<
      z.infer<typeof goodreadsSearchResponseSchema>
    >(xmlResponse, goodreadsSearchResponseSchema)
    const {
      GoodreadsResponse: {
        search: {
          results: searchResults,
          'results-start': resultsStart,
          'total-results': totalResults,
        },
      },
    } = parsedXml
    const pagination = calculatePagination(resultsStart, totalResults)
    const books: Book[] = []

    if (searchResults.work == null) {
      return { pagination, result: books }
    }

    const works = Array.isArray(searchResults.work)
      ? searchResults.work
      : [searchResults.work]

    works.forEach((work: z.infer<typeof workSchema>) => {
      if (work.best_book == null) {
        return
      }
      books.push({
        id: work.best_book.id._,
        title: work.best_book.title,
        author: work.best_book.author.name,
      })
    })

    return { pagination, result: books }
  }

  public async getById(bookId: string): Promise<Book> {
    const xmlResponse = await this.client.getById(bookId)
    const parsedXml = await parseXml<
      z.infer<typeof goodreadsBookResponseSchema>
    >(xmlResponse, goodreadsBookResponseSchema)
    const {
      GoodreadsResponse: {
        book: {
          id,
          title,
          authors,
          description,
          image_url: imageUrl,
          average_rating: averageRating,
          publication_year: publicationYear,
        },
      },
    } = parsedXml

    const authorList = Array.isArray(authors.author)
      ? authors.author.map((a) => a.name).join(', ')
      : authors.author.name

    const book: Book = {
      id,
      title,
      author: authorList,
      description:
        description != null ? description.replace(/<[^>]*>/g, '') : '',
      imageUrl,
      averageRating,
      publicationYear,
    }
    return book
  }
}
