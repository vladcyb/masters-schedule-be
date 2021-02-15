import fs from 'fs';
import ejwt from 'express-jwt';
import { Router } from 'express';
import registrationRoutes from './registration';
import loginRoutes from './login';
import orderRoutes from './order';
import locationRoutes from './location';
import specializationRoutes from './specialization';
import serviceRoutes from './service';

const secret = fs.readFileSync(`${__dirname}/../private/secret`);

const routes = Router();

routes.use('/register', registrationRoutes);
routes.use('/login', loginRoutes);
routes.use('/order', ejwt({ secret, algorithms: ['HS256'] }), orderRoutes);
routes.use('/location', ejwt({ secret, algorithms: ['HS256'] }), locationRoutes);
routes.use('/specialization', ejwt({ secret, algorithms: ['HS256'] }), specializationRoutes);
routes.use('/service', ejwt({ secret, algorithms: ['HS256'] }), serviceRoutes);

export default routes;
