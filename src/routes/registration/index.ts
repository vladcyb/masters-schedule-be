import { Router } from 'express';
import RegistrationController from '../../controllers/registration';

const registrationRoutes = Router();

registrationRoutes.post('/', RegistrationController.register);

export default registrationRoutes;
