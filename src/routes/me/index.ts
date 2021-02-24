import { Router } from 'express';
import meController from '../../controllers/me';

const meRoutes = Router();

meRoutes.get('/', meController.get);

export default meRoutes;
