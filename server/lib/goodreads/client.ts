import axios, { AxiosInstance } from 'axios'; // Make sure to 'npm install axios'

interface ClientConfig { // Renamed from GoodreadsApiConfig to be more generic
    apiKey: string;
    baseUrl?: string; // Optional, defaults to Goodreads base URL
}

export class Client { // Renamed from GoodreadsApiClient to Client
    private readonly apiKey: string;
    private readonly baseUrl: string;
    private readonly axiosInstance: AxiosInstance;

    constructor(config: ClientConfig) { // Updated type to ClientConfig
        if (!config.apiKey || config.apiKey === 'YOUR_GOODREADS_API_KEY') {
            console.warn('Goodreads API Key is missing or default. Please set process.env.GOODREADS_API_KEY or pass it in config.');
            // In a real production app, you might throw an error here:
            // throw new Error('Goodreads API Key is required.');
        }
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || 'https://www.goodreads.com'; // Use provided baseUrl or default

        console.log(this);

        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            timeout: 10000, // 10 seconds timeout
            headers: {
                'Accept': 'application/xml, text/xml, */*; q=0.01' // Request XML explicitly
            }
        });

        // Optional: Add Axios interceptors for logging requests and responses
        this.axiosInstance.interceptors.request.use(request => {
            console.log(`[Client] Requesting: ${request.url} with params:`, request.params); // Updated log
            return request;
        });

        this.axiosInstance.interceptors.response.use(response => {
            console.log(`[Client] Received response for: ${response.config.url}`); // Updated log
            return response;
        }, error => {
            // Log the error here, but re-throw for the caller to handle
            console.error(`[Client] Request failed for: ${error.config.url}`, error.message); // Updated log
            if (error.response) {
                console.error('API Response Status:', error.response.status);
                console.error('API Response Data:', error.response.data);
            }
            return Promise.reject(error); // Re-throw the original Axios error
        });
    }

    /**
     * Sends a search request to the Goodreads API and returns the raw XML response string.
     *
     * @param {string} query - The search text for books (e.g., title, author).
     * @param {number} [page=1] - The page number for pagination.
     * @returns {Promise<string>} A promise that resolves to the raw XML string response.
     * @throws {Error} If the API call fails.
     */
    public async search(query: string, page: number = 1): Promise<string> {
        try {
            const url = '/search/index.xml'; // Relative URL to base
            const params = {
                q: query,
                page: page,
                key: this.apiKey,
            };

            const response = await this.axiosInstance.get(url, { params });
            return response.data;

        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            } else {
                throw new Error('Unknown error');
            }
        }
    }

    /**
     * Sends a request to the Goodreads API for detailed information about a single book
     * and returns the raw XML response string.
     *
     * @param {string} bookId - The unique identifier of the book on Goodreads.
     * @returns {Promise<string>} A promise that resolves to the raw XML string response.
     * @throws {Error} If the API call fails or the book is not found.
     */
    public async getById(bookId: string): Promise<string> {
        try {
            const url = `/book/show/${bookId}.xml`; // Relative URL to base
            const params = {
                key: this.apiKey,
            };

            const response = await this.axiosInstance.get(url, { params });
            return response.data; // Return the raw XML string

        } catch (error: any) {
            // Check for 404 specifically, otherwise re-throw a generic error
            if (error.response && error.response.status === 404) {
                throw new Error(`Book with ID ${bookId} not found on Goodreads.`);
            }
            throw new Error(`Failed to fetch book details from Goodreads API: ${error.message}`);
        }
    }
}
