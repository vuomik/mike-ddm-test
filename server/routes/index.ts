import { Router } from 'express';
import BookRoutes from './bookRoutes';

const router: Router = Router();

router.use('/books', BookRoutes);

export default router;
