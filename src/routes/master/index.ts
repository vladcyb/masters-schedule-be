import { Router } from 'express';
import masterController from '../../controllers/master';

const masterRoutes = Router();

masterRoutes.put('/schedule', masterController.setSchedule);
masterRoutes.get('/schedule', masterController.getSchedule);
masterRoutes.put('/:id/setSpecializations', masterController.setSpecializations);
masterRoutes.get('/', masterController.getAll);

export default masterRoutes;
