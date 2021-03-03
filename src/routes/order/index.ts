import { Router } from 'express';
import multer from 'multer';
import orderController from '../../controllers/order';
import { multerConfig } from '../../shared/multerConfig';

const orderRoutes = Router();

const photoUploadMiddleware = multer(multerConfig).single('photo');

orderRoutes.post('/', photoUploadMiddleware, orderController.createOrder);
orderRoutes.post('/updateStatus', orderController.setOrderStatus);

orderRoutes.get('/', orderController.getAll);

export default orderRoutes;
