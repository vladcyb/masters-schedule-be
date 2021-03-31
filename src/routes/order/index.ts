import { Router } from 'express';
import multer from 'multer';
import orderController from '../../controllers/order';
import { multerConfig } from '../../shared/multerConfig';

const orderRoutes = Router();

const photoUploadMiddleware = multer(multerConfig).single('photo');

orderRoutes.post('/', photoUploadMiddleware, orderController.createOrder);
orderRoutes.put('/:id/setStatus', orderController.setOrderStatus);
orderRoutes.put('/:id/setStartDate', orderController.setStartDate);
orderRoutes.put('/:id/setServices', orderController.setServices);
orderRoutes.put('/:id/setMaster/:masterId', orderController.setMaster);

/* действия, связанные со статусом заказа */
orderRoutes.put('/:id/deny', orderController.deny);

orderRoutes.get('/', orderController.getAll);

export default orderRoutes;
