import fs from 'fs';
import ejwt from 'express-jwt';
import { Router } from 'express';
import registrationRoutes from './registration';
import loginRoutes from './login';
import orderRoutes from './order';
import locationRoutes from './location';
import specializationRoutes from './specialization';
import serviceRoutes from './service';
import masterRoutes from './master';

const secret = fs.readFileSync(`${__dirname}/../private/secret`);

const routes = Router();

const jwtMiddleware = ejwt({ secret, algorithms: ['HS256'] });

routes.use('/register', registrationRoutes);
routes.use('/login', loginRoutes);
routes.use('/order', jwtMiddleware, orderRoutes);
routes.use('/location', jwtMiddleware, locationRoutes);
routes.use('/specialization', jwtMiddleware, specializationRoutes);
routes.use('/service', jwtMiddleware, serviceRoutes);
routes.use('/master', jwtMiddleware, masterRoutes);

export default routes;
