import { Router } from 'express';
import clientController from '../../controllers/client';

const clientRoutes = Router();

clientRoutes.get('/order', clientController.getOrders);

export default clientRoutes;
