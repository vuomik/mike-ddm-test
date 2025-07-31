import { Router } from 'express'
import { searchBooks, getBook } from '@server/controllers/booksController'
import { authenticate } from '@server/middleware/authentication'
import { authorize } from '@server/middleware/authorization'

const router = Router()

router.get('/', authenticate, authorize, searchBooks)
router.get('/:id', authenticate, authorize, getBook)

export default router
