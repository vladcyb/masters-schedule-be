import { Router } from 'express';
import orderController from '../../controllers/order';

const orderRoutes = Router();

orderRoutes.post('/', orderController.createOrder);
orderRoutes.post('/updateStatus', orderController.setOrderStatus);

orderRoutes.get('/', orderController.getAll);

export default orderRoutes;
