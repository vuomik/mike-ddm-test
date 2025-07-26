import { Router } from 'express';
import {
  searchBooks, getBook,
} from '../controllers/booksController';
import { authenticate } from '../middleware/authentication';
import { authorize } from '../middleware/authorization';

const router = Router();

router.get('/', authenticate, authorize, searchBooks);
router.get('/:id', authenticate, authorize, getBook);

export default router;
