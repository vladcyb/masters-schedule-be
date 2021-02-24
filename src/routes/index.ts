import { Router } from 'express';
import authMiddleware from '../controllers/authMiddleware';
import registrationRoutes from './registration';
import loginRoutes from './login';
import orderRoutes from './order';
import locationRoutes from './location';
import specializationRoutes from './specialization';
import serviceRoutes from './service';
import masterRoutes from './master';
import meRoutes from './me';
import logoutRoutes from './logout';
import locationTypeRoutes from './locationType';

const routes = Router();

routes.use('/order', authMiddleware, orderRoutes);
routes.use('/service', authMiddleware, serviceRoutes);
routes.use('/master', authMiddleware, masterRoutes);
routes.use('/me', authMiddleware, meRoutes);

routes.use('/logout', logoutRoutes);
routes.use('/register', registrationRoutes);
routes.use('/login', loginRoutes);
routes.use('/location', locationRoutes);
routes.use('/locationType', locationTypeRoutes);
routes.use('/specialization', specializationRoutes);

export default routes;
