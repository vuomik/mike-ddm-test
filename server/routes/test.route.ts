import { RequestHandler, Router } from 'express';
import {
  testEndpoint,
} from '../controllers/testController';

const router = Router();

router.get('/', testEndpoint as RequestHandler);

export default router;
