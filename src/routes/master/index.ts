import { Router } from 'express';
import masterController from '../../controllers/master';

const masterRoutes = Router();

masterRoutes.post('/schedule', masterController.setSchedule);

export default masterRoutes;
