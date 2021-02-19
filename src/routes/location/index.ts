import { Router } from 'express';
import locationController from '../../controllers/location';
import authMiddleware from '../../controllers/authMiddleware';

const locationRoutes = Router();
const privateLocationRoutes = Router();

/* authorized routes */
privateLocationRoutes.post('/create', locationController.create);
locationRoutes.use('/create', authMiddleware, privateLocationRoutes);

/* public routes */
locationRoutes.get('/', locationController.get);

export default locationRoutes;
