import { Router } from 'express';
import serviceController from '../../controllers/service';
import authMiddleware from '../../controllers/authMiddleware';

const serviceRoutes = Router();

serviceRoutes.post('/', authMiddleware, serviceController.create);
serviceRoutes.get('/', serviceController.getAll);

export default serviceRoutes;
