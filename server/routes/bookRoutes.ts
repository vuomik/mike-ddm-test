import { RequestHandler, Router } from 'express';
import {
  searchBooks, getBook,
} from '../controllers/booksController';

const router = Router();

router.get('/', searchBooks as RequestHandler);
router.get('/:id', getBook as RequestHandler);

export default router;
