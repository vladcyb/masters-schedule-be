import { Router } from 'express';
import locationTypeController from '../../controllers/locationType';

const locationTypeRoutes = Router();

locationTypeRoutes.get('/', locationTypeController.getAll);

export default locationTypeRoutes;
