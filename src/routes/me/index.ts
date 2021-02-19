import { Router } from 'express';
import authMiddleware from '../../controllers/authMiddleware';
import meController from '../../controllers/me';

const meRoutes = Router();

meRoutes.get('/', authMiddleware, meController.get);

export default meRoutes;
