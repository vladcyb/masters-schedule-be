import { Router } from 'express';
import AuthController from '../../controllers/auth';

const loginRoutes = Router();

loginRoutes.post('/', AuthController.login);

export default loginRoutes;
