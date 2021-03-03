import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = {
  dest: 'img',
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'img');
    },
    filename: (req, file, callback) => {
      const split = file.originalname.split('.');
      const extension = split[split.length - 1];
      callback(null, `${uuidv4()}.${extension}`);
    },
  }),
};
