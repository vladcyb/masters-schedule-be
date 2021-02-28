import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import specializationController from '../../controllers/specialization';
import authMiddleware from '../../controllers/authMiddleware';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'img');
  },
  filename: (req, file, callback) => {
    const split = file.originalname.split('.');
    const extension = split[split.length - 1];
    callback(null, `${uuidv4()}.${extension}`);
  },
});

const iconUploadMiddleware = multer({ dest: 'img', storage }).single('icon');

const specializationRoutes = Router();

specializationRoutes.post('/', [
  authMiddleware,
  iconUploadMiddleware,
], specializationController.create);
specializationRoutes.put('/', authMiddleware, specializationController.update);
specializationRoutes.get('/', specializationController.get);

export default specializationRoutes;
