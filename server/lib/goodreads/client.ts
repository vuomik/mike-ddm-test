import { INITIAL_PAGE } from '@server/utils/pages'
import axios, { AxiosInstance } from 'axios'
import { StatusCodes } from 'http-status-codes'
import { injectable } from 'tsyringe'

const DEFAULT_TIMEOUT = 10000

export class BookNotFoundError extends Error {}

export interface ClientConfig {
  apiKey: string
  baseUrl: string
  timeout?: number
}

@injectable()
export class Client {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly axiosInstance: AxiosInstance

  constructor(config: ClientConfig) {
    const { apiKey, baseUrl } = config
    this.apiKey = apiKey
    this.baseUrl = baseUrl

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: config.timeout ?? DEFAULT_TIMEOUT,
      headers: {
        Accept: 'application/xml, text/xml, */*; q=0.01',
      },
    })
  }

  public async search(query: string, page = INITIAL_PAGE): Promise<string> {
    try {
      const url = '/search/index.xml'
      const params = {
        q: query,
        page,
        key: this.apiKey,
      }

      const response = await this.axiosInstance.get<string>(url, { params })
      return response.data
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw e
      } else {
        throw new Error('Unexpected error searching book list', { cause: e })
      }
    }
  }

  public async getById(bookId: string): Promise<string> {
    try {
      const url = `/book/show/${bookId}.xml`
      const params = {
        key: this.apiKey,
      }

      const response = await this.axiosInstance.get<string>(url, { params })
      return response.data
    } catch (e: unknown) {
      if (
        axios.isAxiosError(e) &&
        e.response?.status === StatusCodes.NOT_FOUND
      ) {
        throw new BookNotFoundError()
      } else if (e instanceof Error) {
        throw e
      } else {
        throw new Error('Unexpected error retrieving book', { cause: e })
      }
    }
  }
}
