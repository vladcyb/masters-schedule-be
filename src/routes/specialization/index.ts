import { Router } from 'express';
import specializationController from '../../controllers/specialization';

const specializationRoutes = Router();

specializationRoutes.post('/create', specializationController.create);

export default specializationRoutes;
