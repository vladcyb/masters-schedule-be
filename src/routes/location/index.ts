import { Router } from 'express';
import authMiddleware from '../../controllers/authMiddleware';
import locationController from '../../controllers/location';

const locationRoutes = Router();

locationRoutes.post('/', authMiddleware, locationController.create);
locationRoutes.get('/', locationController.get);
locationRoutes.delete('/:id', authMiddleware, locationController.deleteLocation);

export default locationRoutes;
