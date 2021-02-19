import { Router } from 'express';
import locationController from '../../controllers/location';

const locationRoutes = Router();

locationRoutes.post('/create', locationController.create);
locationRoutes.get('/', locationController.get);

export default locationRoutes;
