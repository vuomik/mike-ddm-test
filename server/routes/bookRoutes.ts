import { Router } from 'express'
import { searchBooks } from '@server/controllers/booksController'
import { authenticate } from '@server/middleware/authentication'
import { authorize } from '@server/middleware/authorization'

const router = Router()

router.get('/', authenticate, authorize, searchBooks)

export default router
