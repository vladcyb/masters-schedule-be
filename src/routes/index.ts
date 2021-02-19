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

/* authorized routes */
routes.use('/order', authMiddleware, orderRoutes);
routes.use('/specialization', authMiddleware, specializationRoutes);
routes.use('/service', authMiddleware, serviceRoutes);
routes.use('/master', authMiddleware, masterRoutes);
routes.post('/location/*', authMiddleware);

/* public routes */
routes.use('/register', registrationRoutes);
routes.use('/login', loginRoutes);
routes.use('/location', locationRoutes);

export default routes;
