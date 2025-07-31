/* eslint-disable @typescript-eslint/no-magic-numbers -- The numbers are fine in tests */
import 'reflect-metadata'

import { Repository } from '@server/lib/goodreads/repository'
import type { Client } from '@server/lib/goodreads/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

vi.mock('@server/server/lib/goodreads/client')

const fixture = async (filename: string): Promise<string> =>
  await fs.readFile(path.resolve(__dirname, 'fixtures', filename), 'utf8')

const mockClient = {
  search: vi.fn(),
  getById: vi.fn(),
}

/* eslint-disable-next-line @typescript-eslint/init-declarations -- This is hydrated on the beforeEach call */
let repo: Repository

beforeEach(() => {
  vi.clearAllMocks()
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- It's okay due to the mock */
  repo = new Repository(mockClient as unknown as Client)
})

describe('Repository', () => {
  it('parses search results correctly', async () => {
    const xml = await fixture('search-response.xml')
    mockClient.search.mockResolvedValue(xml)
    const result = await repo.search('test')

    expect(result.result.length).toBe(2)
    expect(result.result[0]).toEqual({
      id: '123',
      title: 'Test Book',
      author: 'Author Name',
    })
  })

  it('parses book details correctly', async () => {
    const xml = await fixture('book-response.xml')
    mockClient.getById.mockResolvedValue(xml)
    const book = await repo.getById('123')

    expect(book).toEqual({
      id: '123',
      title: 'Test Book',
      author: 'Author Name',
      description: 'This is a test description',
      imageUrl: 'http://example.com/image.jpg',
      averageRating: 4.2,
      publicationYear: 2020,
    })
  })

  it('throws on XML that does not correspond to our schema', async () => {
    const xml = await fixture('bad-schema.xml')
    mockClient.search.mockResolvedValue(xml)
    await expect(repo.search('fail')).rejects.toBeInstanceOf(Error)
  })

  it('throws on malformed XML', async () => {
    const xml = await fixture('malformed.xml')
    mockClient.search.mockResolvedValue(xml)
    await expect(repo.search('fail')).rejects.toBeInstanceOf(Error)
  })
})
