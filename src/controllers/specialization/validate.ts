import { Request, Response } from 'express';
import { sendError } from '../../shared/methods';

export const validateCreateSpecialization = (req: Request, res: Response): boolean => {
  const {
    title,
  } = req.body;
  const { file: icon } = req;
  if (!title) {
    res.json(sendError('Enter `title`'));
    return false;
  }
  if (typeof title !== 'string') {
    res.json(sendError('`title` must be of type string'));
    return false;
  }
  if (!icon) {
    res.json(sendError('Upload icon!'));
    return false;
  }
  return true;
};

export const validateUpdateSpecialization = (req: Request, res: Response): boolean => {
  const {
    id, title, icon,
  } = req.body;
  if (typeof id === 'undefined') {
    res.json(sendError('Enter `id`!'));
    return false;
  }
  if (typeof id !== 'number') {
    res.json(sendError('`id` must be of type number!'));
    return false;
  }
  if (typeof title === 'undefined' && typeof icon === 'undefined') {
    res.json(sendError('Enter `title` and/or `icon`'));
    return false;
  }
  if (typeof title !== 'undefined' && typeof title !== 'string') {
    res.json(sendError('`title` must be of type string'));
    return false;
  }
  if (typeof icon !== 'undefined' && typeof icon !== 'string') {
    res.json(sendError('`icon` must be of type string'));
    return false;
  }
  return true;
};
