import { Request, Response } from 'express';
import { Repository as GoodReadsRepository, Book } from '@server/lib/goodreads/repository';
import { BookNotFound } from '@server/lib/goodreads/client';
import { ApiResponse } from '@server/types';
import { container } from 'tsyringe';
import asyncHandler from 'express-async-handler';
import createError from 'http-errors';
import { z } from 'zod';

const searchQuerySchema = z.object({
  q: z.string().min(1),
  page: z.coerce.number().int().min(1).optional().default(1),
});

const bookParamsSchema = z.object({
  id: z.string(),
});

const repository = container.resolve(GoodReadsRepository);

export const searchBooks = asyncHandler(async (req: Request, res: Response<ApiResponse<Book[]>>) => {
    try {
        const { q: query, page } = searchQuerySchema.parse(req.query);
        const { pagination, result } = await repository.search(query, page);
        const response = {
            pagination,
            data: result,
        };
        res.status(200).json(response);
    } catch (e: unknown) {
        if (e instanceof z.ZodError) {
            throw createError.BadRequest('Please check your parameters: "page" must be a positive whole number, and "query" cannot be empty.');
        }
        throw e;
    }
});

export const getBook = asyncHandler(async (req: Request, res: Response<ApiResponse<Book>>) => {
    try {
        const { id: bookId } = bookParamsSchema.parse(req.params);
        const book: Book = await repository.getById(bookId);
        res.status(200).json({ data: book });
    } catch (e: unknown) {
        if (e instanceof z.ZodError) {
            throw createError.BadRequest('Please check your parameters: "id" must be a non-empty string');
        } else if (e instanceof BookNotFound) {
            throw createError.NotFound('I searched everywhere but I just could not find your book!');
        }
        throw e;
    }
});
