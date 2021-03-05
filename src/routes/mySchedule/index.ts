import { Router } from 'express';
import authMiddleware from '../../controllers/authMiddleware';
import scheduleController from '../../controllers/schedule';

const scheduleRoutes = Router();

scheduleRoutes.get('/my', authMiddleware, scheduleController.getMySchedule);

export default scheduleRoutes;
