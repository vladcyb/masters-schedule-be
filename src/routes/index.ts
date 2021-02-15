import fs from 'fs';
import ejwt from 'express-jwt';
import { Router } from 'express';
import registrationRoutes from './registration';
import loginRoutes from './login';
import orderRoutes from './order';
import locationRoutes from './location';

const secret = fs.readFileSync(`${__dirname}/../private/secret`);

const routes = Router();

routes.use('/register', registrationRoutes);
routes.use('/login', loginRoutes);
routes.use('/order', ejwt({ secret, algorithms: ['HS256'] }), orderRoutes);
routes.use('/location', ejwt({ secret, algorithms: ['HS256'] }), locationRoutes);

export default routes;
