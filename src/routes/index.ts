import { Router } from 'express';
import registrationRoutes from './registration';
import loginRoutes from './login';
import orderRoutes from './order';
import locationRoutes from './location';
import specializationRoutes from './specialization';
import serviceRoutes from './service';
import masterRoutes from './master';
import authMiddleware from '../controllers/authMiddleware';

const routes = Router();

routes.use('/register', registrationRoutes);
routes.use('/login', loginRoutes);
routes.use('/order', authMiddleware, orderRoutes);
routes.use('/location', authMiddleware, locationRoutes);
routes.use('/specialization', authMiddleware, specializationRoutes);
routes.use('/service', authMiddleware, serviceRoutes);
routes.use('/master', authMiddleware, masterRoutes);

export default routes;
