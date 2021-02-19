import { Router } from 'express';
import authMiddleware from '../../controllers/authMiddleware';
import locationController from '../../controllers/location';

const locationRoutes = Router();

locationRoutes.post('/create', authMiddleware, locationController.create);
locationRoutes.get('/', locationController.get);

export default locationRoutes;
