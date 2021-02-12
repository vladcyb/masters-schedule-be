import { Router } from 'express';
import orderController from '../../controllers/order';

const orderRoutes = Router();

orderRoutes.post('/create', orderController.createOrder);

export default orderRoutes;
