import axios, { AxiosInstance } from 'axios';
import { injectable } from 'tsyringe';

export class BookNotFoundError extends Error {
}

export interface ClientConfig {
    apiKey: string;
    baseUrl: string;
    timeout?: number;
}

@injectable()
export class Client {
    private readonly apiKey: string;
    private readonly baseUrl: string;
    private readonly axiosInstance: AxiosInstance;

    constructor(config: ClientConfig) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl;

        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            timeout: config.timeout || 10000,
            headers: {
                'Accept': 'application/xml, text/xml, */*; q=0.01'
            }
        });
    }

    public async search(query: string, page: number = 1): Promise<string> {
        try {
            const url = '/search/index.xml';
            const params = {
                q: query,
                page: page,
                key: this.apiKey,
            };

            const response = await this.axiosInstance.get<string>(url, { params });
            return response.data;

        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            } else {
                throw new Error('Unexpected error searching book list', { cause: e });
            }
        }
    }

    public async getById(bookId: string): Promise<string> {
        try {
            const url = `/book/show/${bookId}.xml`;
            const params = {
                key: this.apiKey,
            };

            const response = await this.axiosInstance.get<string>(url, { params });
            return response.data;

        } catch (e: unknown) {
            if (axios.isAxiosError(e) && e.response?.status === 404) {
                throw new BookNotFoundError();
            } else if (e instanceof Error) {
                throw e;
            } else {
                throw new Error('Unexpected error retrieving book', { cause: e });
            }
        }
    }
}
