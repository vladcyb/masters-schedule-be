import { Router } from 'express';
import authMiddleware from '../../controllers/authMiddleware';
import specializationController from '../../controllers/specialization';

const specializationRoutes = Router();

specializationRoutes.post('/create', authMiddleware, specializationController.create);
specializationRoutes.get('/', specializationController.get);

export default specializationRoutes;
