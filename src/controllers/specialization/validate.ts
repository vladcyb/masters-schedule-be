import { Request, Response } from 'express';
import { sendError } from '../../shared/sendError';

export const validateCreateSpecialization = (req: Request, res: Response): boolean => {
  const {
    title,
    icon,
  } = req.body;
  if (!title) {
    res.json(sendError('Enter `title`'));
    return false;
  }
  if (typeof title !== 'string') {
    res.json(sendError('`title` must be of type string'));
    return false;
  }
  if (!icon) {
    res.json(sendError('Enter `icon`!'));
    return false;
  }
  if (typeof icon !== 'string') {
    res.json(sendError('`icon` must be of type string'));
    return false;
  }
  return true;
};
