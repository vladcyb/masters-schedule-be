import { Router } from 'express';
import orderController from '../../controllers/order';

const orderRoutes = Router();

orderRoutes.post('/create', orderController.createOrder);
orderRoutes.post('/abort', orderController.abortOrder);

export default orderRoutes;
