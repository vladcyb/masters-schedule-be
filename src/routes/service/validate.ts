import { Request, Response } from 'express';
import { sendError } from '../../shared/methods';

export const validateCreateService = (req: Request, res: Response): boolean => {
  const {
    title,
    price,
    duration,
    specializationId,
  } = req.body;
  if (typeof title === 'undefined') {
    res.json(sendError('Enter `title`!'));
    return false;
  }
  if (typeof title !== 'string') {
    res.json(sendError('`title` must be of type string!'));
    return false;
  }
  if (!title.length) {
    res.json(sendError('Enter `title`!'));
    return false;
  }
  if (typeof price === 'undefined') {
    res.json(sendError('Enter `price`!'));
    return false;
  }
  if (typeof price !== 'number') {
    res.json(sendError('`price` must be of type number!'));
    return false;
  }
  if (typeof duration === 'undefined') {
    res.json(sendError('Enter `duration`!'));
    return false;
  }
  if (typeof duration !== 'number') {
    res.json(sendError('`duration` must be of type number!'));
    return false;
  }
  if (typeof specializationId === 'undefined') {
    res.json(sendError('Enter `specializationId`!'));
    return false;
  }
  if (typeof specializationId !== 'number') {
    res.json(sendError('`specializationId` must be of type number!'));
    return false;
  }
  return true;
};
