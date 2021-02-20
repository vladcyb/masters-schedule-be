import { Router } from 'express';
import AuthController from '../../controllers/auth';

const logoutRoutes = Router();
logoutRoutes.post('/', AuthController.logout);

export default logoutRoutes;
