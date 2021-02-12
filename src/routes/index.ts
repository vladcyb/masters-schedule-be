import { Router } from 'express';
import registrationRoutes from './registration';

const routes = Router();

routes.use('/register', registrationRoutes);

export default routes;
