import { Request, Response } from 'express';
import { sendError } from '../../shared/sendError';

export const validateCreateLocation = (req: Request, res: Response): boolean => {
  const {
    parentId,
    title,
    coordinates,
    typeId,
  } = req.body;
  if (!title) {
    res.json(sendError('Enter `title`!'));
    return false;
  }
  if (typeof title !== 'string') {
    res.json(sendError('`title` must be of type string!'));
    return false;
  }
  if (!coordinates) {
    res.json(sendError('Enter `coordinates`!'));
    return false;
  }
  if (typeof coordinates !== 'string') {
    res.json(sendError('`coordinates` must be of type string!'));
    return false;
  }
  if (!typeId) {
    res.json(sendError('Enter `typeId`'));
    return false;
  }
  if (typeof typeId !== 'number') {
    res.json(sendError('`typeId` must be of type number'));
    return false;
  }
  if (typeof parentId !== 'undefined' && typeof parentId !== 'number') {
    res.json(sendError('`parentId` must be of type number'));
    return false;
  }
  return true;
};
