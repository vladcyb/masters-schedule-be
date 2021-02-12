import { Router } from 'express';
import AuthController from '../../controllers/auth';

const registrationRoutes = Router();

registrationRoutes.post('/', AuthController.register);

export default registrationRoutes;
