import { Router } from 'express'
import { searchBooks } from '@server/controllers/booksController'

const router = Router()

router.get('/', searchBooks)

export default router
