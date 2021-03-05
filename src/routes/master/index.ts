import { Router } from 'express';
import masterController from '../../controllers/master';

const masterRoutes = Router();

masterRoutes.post('/schedule', masterController.setSchedule);
masterRoutes.get('/schedule', masterController.getSchedule);

export default masterRoutes;
