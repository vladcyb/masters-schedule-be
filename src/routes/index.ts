import { Router } from 'express';
import registrationRoutes from './registration';
import loginRoutes from './login';

const routes = Router();

routes.use('/register', registrationRoutes);
routes.use('/login', loginRoutes);

export default routes;
