import fs from 'fs';
import ejwt from 'express-jwt';
import { Router } from 'express';
import registrationRoutes from './registration';
import loginRoutes from './login';
import orderRoutes from './order';

const secret = fs.readFileSync(`${__dirname}/../private/secret`);

const routes = Router();

routes.use('/register', registrationRoutes);
routes.use('/login', loginRoutes);
routes.use('/order', ejwt({ secret, algorithms: ['HS256'] }), orderRoutes);

export default routes;
