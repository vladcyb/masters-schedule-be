import { Router } from 'express';
import serviceController from '../../controllers/service';

const serviceRoutes = Router();

serviceRoutes.post('/', serviceController.create);

export default serviceRoutes;
