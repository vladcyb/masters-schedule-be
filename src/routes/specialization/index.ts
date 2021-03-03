import multer from 'multer';
import { Router } from 'express';
import specializationController from '../../controllers/specialization';
import authMiddleware from '../../controllers/authMiddleware';
import { multerConfig } from '../../shared/multerConfig';

const iconUploadMiddleware = multer(multerConfig).single('icon');

const specializationRoutes = Router();

specializationRoutes.post('/', [
  authMiddleware,
  iconUploadMiddleware,
], specializationController.create);
specializationRoutes.put('/', authMiddleware, specializationController.update);
specializationRoutes.get('/', specializationController.get);

export default specializationRoutes;
